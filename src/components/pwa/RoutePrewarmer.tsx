'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';

const USER_ROUTES = [
    '/home',
    '/workouts',
    '/workouts/new',
    '/exercises',
    '/exercises/new',
    '/exercises/1',
    '/schedules',
    '/schedules/new',
    '/history',
    '/profile/my-id',
    '/profile/edit',
];

/**
 * Pré-carrega de forma abrangente todas as páginas privadas do usuário,
 * seus documentos HTML, payloads RSC e todos os sub-chunks JS (ex: gráficos, QR code, editores).
 */
export function RoutePrewarmer() {
    const pathname = usePathname();
    const router = useRouter();
    const hasWarmedRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !navigator.onLine || hasWarmedRef.current) {
            return;
        }

        // Não pré-aquece em telas públicas de login/registro/admin
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

            console.log('[PWA] Pré-carregando todo o App e sub-chunks JS para uso 100% offline...');

            for (const route of USER_ROUTES) {
                try {
                    // 1. Next.js router prefetch
                    router.prefetch(route);

                    const targetUrl = `/${locale}${route}`;

                    // 2. Baixa o documento HTML e extrai todos os chunks JS/CSS referenciados
                    const htmlRes = await fetch(targetUrl, {
                        headers: { 'Accept': 'text/html' },
                        priority: 'low'
                    });

                    if (htmlRes.ok) {
                        const htmlText = await htmlRes.text();
                        // Encontra todos os chunks estáticos referenciados no HTML (scripts e styles)
                        const assetMatches = htmlText.match(/\/(_next\/static\/[a-zA-Z0-9_\-\.\/]+\.(?:js|css))/g) || [];
                        const uniqueAssets = Array.from(new Set(assetMatches));

                        for (const assetUrl of uniqueAssets) {
                            fetch(assetUrl, { priority: 'low' }).catch(() => {});
                        }
                    }

                    // 3. Pré-carrega o payload RSC (React Server Component)
                    fetch(`${targetUrl}?_rsc=1`, {
                        headers: { 'RSC': '1', 'Accept': 'text/x-component' },
                        priority: 'low'
                    }).catch(() => {});
                } catch {
                    // Ignora falhas transitórias
                }
            }
            console.log('[PWA] Todas as páginas do usuário e chunks JS foram cacheados!');
        };

        // Dispara o pré-aquecimento 400ms após a montagem da Home
        const timer = setTimeout(prewarm, 400);

        return () => clearTimeout(timer);
    }, [pathname, router]);

    return null;
}
