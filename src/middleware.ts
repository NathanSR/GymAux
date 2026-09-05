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

    // 4. Verificação de sessão ultra-rápida e resiliente
    // Em navegações internas de SPA (RSC), valida a sessão local dos cookies em 0ms sem bloquear na rede.
    // Em cargas iniciais de documento (F5 / entrada direta), faz o refresh completo com getUser().
    let user = null;
    const isRsc = request.headers.get('RSC') === '1' || request.nextUrl.searchParams.has('_rsc');

    if (isRsc) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            user = session?.user || null;
        } catch {
            user = null;
        }
    } else {
        try {
            const { data } = await supabase.auth.getUser();
            user = data?.user || null;
        } catch {
            // Operação de rede com Supabase falhou (offline): tenta obter a sessão do token nos cookies
            try {
                const { data: { session } } = await supabase.auth.getSession();
                user = session?.user || null;
            } catch {
                user = null;
            }
        }
    }

    // 5. Lógica de Proteção de Rotas
    const pathname = request.nextUrl.pathname;

    // Páginas que não requerem autenticação
    const publicPages = ['/', '/login', '/register', '/update-password', '/admin/login', '/privacy', '/terms', '/cookies'];

    const isPublicPage = publicPages.some((page) => {
        const locales = routing.locales.join('|');
        const path = page === '/' ? '/?' : `${page}/?`;
        const regex = new RegExp(`^(/(${locales}))?${path}$`, 'i');
        return regex.test(pathname);
    });

    // 6. Redirecionamento se não estiver autenticado em rota privada
    if (!user && !isPublicPage) {
        const locale = pathname.split('/')[1] || routing.defaultLocale;
        const isAdminRoute = pathname.includes('/admin');
        const loginPath = isAdminRoute ? `/${locale}/admin/login` : `/${locale}/login`;
        const loginUrl = new URL(loginPath, request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 7. Se autenticado, garante que apenas admins acessam rotas do painel admin
    if (user && pathname.includes('/admin') && !pathname.includes('/admin/login')) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

        if (!profile || profile.role !== 'admin') {
            const locale = pathname.split('/')[1] || routing.defaultLocale;
            const homeUrl = new URL(`/${locale}/home`, request.url);
            return NextResponse.redirect(homeUrl);
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|auth|_next/static|_next/image|sounds|manifest\\.json|favicon\\.ico|sw\\.js|offline\\.html|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|webmanifest)$).*)',
    ],
};