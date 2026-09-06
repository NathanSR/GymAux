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

    // 4. Identificação de rotas exclusivas de autenticação (usuário logado deve ser redirecionado para /home)
    const pathname = request.nextUrl.pathname;
    const locales = routing.locales.join('|');
    const authOnlyPages = ['/login', '/register'];
    const isAuthOnlyPage = authOnlyPages.some((page) => {
        const regex = new RegExp(`^(/(${locales}))?${page}/?$`, 'i');
        return regex.test(pathname);
    });

    if (isAuthOnlyPage) {
        let user = null;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            user = session?.user || null;
        } catch {
            user = null;
        }

        if (user) {
            const locale = pathname.split('/')[1] || routing.defaultLocale;
            const homeUrl = new URL(`/${locale}/home`, request.url);
            return NextResponse.redirect(homeUrl);
        }
        return response;
    }

    // 4.1 Identificação rápida das demais rotas públicas gerais
    const publicPages = ['/', '/update-password', '/admin/login', '/privacy', '/terms', '/cookies'];
    const isPublicPage = publicPages.some((page) => {
        const path = page === '/' ? '/?' : `${page}/?`;
        const regex = new RegExp(`^(/(${locales}))?${path}$`, 'i');
        return regex.test(pathname);
    });

    // Se for rota pública e não for área administrativa restrita, libera a resposta imediatamente sem bloquear
    if (isPublicPage && !pathname.includes('/admin/')) {
        return response;
    }

    // 5. Verificação de sessão ultra-rápida (0ms local-first nos cookies)
    // getSession() decodifica e valida o JWT localmente sem fazer requisições HTTP externas ao Supabase.
    // Se o token de acesso estiver expirado em rota privada, tenta refresh via getUser() com timeout estrito de 1.5s.
    let user = null;
    try {
        const { data: { session } } = await supabase.auth.getSession();
        user = session?.user || null;

        if (!user && !isPublicPage) {
            const timeoutPromise = new Promise<{ data: { user: null } }>((resolve) =>
                setTimeout(() => resolve({ data: { user: null } }), 1500)
            );
            const getUserPromise = supabase.auth.getUser();
            const { data } = await Promise.race([getUserPromise, timeoutPromise]);
            user = data?.user || null;
        }
    } catch {
        user = null;
    }

    // 6. Redirecionamento se não estiver autenticado em rota privada
    if (!user && !isPublicPage) {
        const locale = pathname.split('/')[1] || routing.defaultLocale;
        const isAdminRoute = pathname.includes('/admin');
        const loginPath = isAdminRoute ? `/${locale}/admin/login` : `/${locale}/login`;
        const loginUrl = new URL(loginPath, request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 7. Se autenticado, garante que apenas admins acessam rotas do painel admin (com timeout estrito de 2s)
    if (user && pathname.includes('/admin') && !pathname.includes('/admin/login')) {
        try {
            const adminCheckPromise = supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();

            const timeoutPromise = new Promise<{ data: any }>((_, reject) =>
                setTimeout(() => reject(new Error('Admin check timeout')), 2000)
            );

            const { data: profile } = await Promise.race([adminCheckPromise, timeoutPromise]);

            if (!profile || profile.role !== 'admin') {
                const locale = pathname.split('/')[1] || routing.defaultLocale;
                const homeUrl = new URL(`/${locale}/home`, request.url);
                return NextResponse.redirect(homeUrl);
            }
        } catch {
            // Em caso de falha ou timeout na checagem de admin, redireciona com segurança para a home
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