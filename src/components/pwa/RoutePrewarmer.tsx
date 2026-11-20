'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';

/**
 * Apenas os shells principais de navegação (leve e otimizado para mobile 4G).
 * Rotas dinâmicas ([id]) são cacheadas naturalmente sob demanda pelo SW sem disparar
 * centenas de requisições desnecessárias no boot.
 */
const CORE_SHELL_ROUTES = [
    '/home',
    '/workouts',
    '/exercises',
    '/schedules',
    '/history',
    '/workouts/new',
    '/schedules/new',
    '/exercises/new',
    '/profile/edit',
    '/profile/my-id',
    '/trainer',
];

const PREWARM_SESSION_KEY = 'gymaux_shell_prewarmed';

/**
 * Pré-aquece os shells principais do app de forma gentil (em idle)
 * usando `router.prefetch` nativo do Next.js + cache HTML para acesso instantâneo offline.
 */
export function RoutePrewarmer() {
    const pathname = usePathname();
    const router = useRouter();
    const hasTriggeredRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !navigator.onLine || hasTriggeredRef.current) {
            return;
        }

        const isPublicOrAdmin =
            pathname.includes('/login') ||
            pathname.includes('/register') ||
            pathname.includes('/admin') ||
            pathname === '/';

        if (isPublicOrAdmin) {
            return;
        }

        // Evita repetir prewarm completo na mesma sessão de aba
        if (sessionStorage.getItem(PREWARM_SESSION_KEY) === '1') {
            hasTriggeredRef.current = true;
            return;
        }

        hasTriggeredRef.current = true;

        let cancelled = false;

        const runPrewarm = async () => {
            if (cancelled || !navigator.onLine) return;

            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            const locale = ['pt', 'en', 'es'].includes(pathSegments[0]) ? pathSegments[0] : 'pt';

            // 1. Next.js router prefetch nativo (respeita headers RSC sem poluir RSC_CACHE)
            for (const route of CORE_SHELL_ROUTES) {
                if (cancelled) return;
                try {
                    router.prefetch(route);
                } catch {
                    // Ignore prefetch errors
                }
            }

            // 2. Popula HTML_CACHE com concorrência controlada (2 por vez) para abertura 0ms offline
            const CONCURRENCY = 2;
            for (let i = 0; i < CORE_SHELL_ROUTES.length; i += CONCURRENCY) {
                if (cancelled || !navigator.onLine) return;
                const batch = CORE_SHELL_ROUTES.slice(i, i + CONCURRENCY);
                await Promise.allSettled(
                    batch.map(async (route) => {
                        try {
                            await fetch(`/${locale}${route}`, {
                                headers: { Accept: 'text/html' },
                                credentials: 'same-origin',
                                priority: 'low',
                            } as RequestInit);
                        } catch {
                            // Ignora falhas transitórias
                        }
                    })
                );
            }

            if (!cancelled) {
                try {
                    sessionStorage.setItem(PREWARM_SESSION_KEY, '1');
                } catch {
                    // Ignore storage error
                }
            }
        };

        const scheduleIdle = () => {
            if ('requestIdleCallback' in window) {
                const id = (window as any).requestIdleCallback(() => runPrewarm(), { timeout: 3000 });
                return () => (window as any).cancelIdleCallback(id);
            }
            const timer = setTimeout(runPrewarm, 1500);
            return () => clearTimeout(timer);
        };

        const cancel = scheduleIdle();
        return () => {
            cancelled = true;
            cancel();
        };
    }, [pathname, router]);

    return null;
}
