import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { createServerClient } from '@supabase/ssr';

export default async function middleware(request: NextRequest) {
    // 1. Processamos o i18n primeiro para obter a resposta base
    const handleI18nRouting = createMiddleware(routing);
    let response = handleI18nRouting(request);

    // 2. Se o next-intl já decidiu por um redirecionamento (ex: de / para /pt), 
    // retornamos imediatamente para que a próxima execução do middleware lide com a nova rota.
    if (response.status === 307 || response.status === 308) {
        return response;
    }

    // 3. Criamos o client do Supabase (SSR)
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

    // 4. Verificamos a sessão do usuário
    const { data: { user } } = await supabase.auth.getUser();

    // 5. Lógica de Proteção de Rotas
    const pathname = request.nextUrl.pathname;

    // Páginas que não requerem autenticação
    const publicPages = ['/', '/login', '/register'];

    const isPublicPage = publicPages.some((page) => {
        const locales = routing.locales.join('|');
        // Regex flexível para aceitar:
        // - Rota pura: /login
        // - Rota com locale: /pt/login
        // - Rota com/sem trailing slash: /login/
        const path = page === '/' ? '/?' : `${page}/?`;
        const regex = new RegExp(`^(/(${locales}))?${path}$`, 'i');
        return regex.test(pathname);
    });

    // 6. Redirecionamento se não estiver autenticado em rota privada
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