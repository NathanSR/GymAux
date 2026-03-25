import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { createServerClient } from '@supabase/ssr';

export default async function middleware(request: NextRequest) {
    // 1. Processamos o i18n primeiro para obter a resposta base
    const handleI18nRouting = createMiddleware(routing);
    let response = handleI18nRouting(request);

    // 2. Criamos o client do Supabase (SSR)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    response = handleI18nRouting(request);
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // 3. Verificamos a sessão do usuário
    const { data: { user } } = await supabase.auth.getUser();

    // 4. Lógica de Proteção de Rotas
    const pathname = request.nextUrl.pathname;

    // Regex para identificar se a rota (removendo o prefixo de idioma) é pública
    // Isso cobre "/", "/en", "/pt/login", "/register", etc.
    const publicPages = ['/', '/login', '/register'];

    const isPublicPage = publicPages.some((page) => {
        const publicPath = page === '/' ? '' : page;
        const regex = new RegExp(`^(/(${routing.locales.join('|')}))?${publicPath}$`, 'i');
        return regex.test(pathname);
    });

    // 5. Redirecionamento se não estiver autenticado em rota privada
    if (!user && !isPublicPage) {
        const locale = pathname.split('/')[1] || routing.defaultLocale;
        const loginUrl = new URL(`/${locale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|sounds|manifest.json|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|webmanifest)$).*)']
};