'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';

const MAIN_ROUTES = [
    '/home',
    '/workouts',
    '/exercises',
    '/schedules',
    '/history',
    '/profile/my-id',
    '/profile/edit',
];

/**
 * Pré-carrega ativamente todas as páginas e bundles do usuário em segundo plano.
 * Garante que a transição entre telas e o recarregamento offline funcionem de forma instantânea.
 */
export function RoutePrewarmer() {
    const pathname = usePathname();
    const router = useRouter();
    const hasWarmedRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !navigator.onLine || hasWarmedRef.current) {
            return;
        }

        // Não pré-aquece em telas públicas de autenticação
        const isAuthPage =
            pathname.includes('/login') ||
            pathname.includes('/register') ||
            pathname.includes('/admin') ||
            pathname === '/';

        if (isAuthPage) {
            return;
        }

        hasWarmedRef.current = true;

        const prewarm = async () => {
            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            const locale = pathSegments[0] || 'pt';

            console.log('[PWA] Pré-carregando páginas do usuário para uso 100% offline...');

            for (const route of MAIN_ROUTES) {
                try {
                    // 1. Next.js router prefetch (baixa os chunks JS do cliente)
                    router.prefetch(route);

                    const targetUrl = `/${locale}${route}`;

                    // 2. Pré-carrega o documento HTML da página no Service Worker
                    fetch(targetUrl, {
                        headers: { 'Accept': 'text/html' },
                        priority: 'low'
                    }).catch(() => {});

                    // 3. Pré-carrega o payload RSC (React Server Component)
                    fetch(`${targetUrl}?_rsc=1`, {
                        headers: { 'RSC': '1', 'Accept': 'text/x-component' },
                        priority: 'low'
                    }).catch(() => {});
                } catch {
                    // Ignora falhas individuais
                }
            }
        };

        // Inicia o pré-carregamento 500ms após o carregamento da Home
        const timer = setTimeout(prewarm, 500);

        return () => clearTimeout(timer);
    }, [pathname, router]);

    return null;
}
