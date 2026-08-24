'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const MAIN_ROUTES = [
    '/home',
    '/workouts',
    '/exercises',
    '/schedules',
    '/history',
    '/profile/my-id',
];

export function RoutePrewarmer() {
    const pathname = usePathname();
    const hasWarmedRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !navigator.onLine || hasWarmedRef.current) {
            return;
        }

        // Detect current locale from URL (e.g. /pt or /en)
        const pathSegments = pathname.split('/').filter(Boolean);
        const locale = pathSegments[0] || 'pt';

        // Don't pre-warm on unauthenticated/public pages
        const isAuthPage = pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/admin');
        if (isAuthPage) {
            return;
        }

        hasWarmedRef.current = true;

        // Schedule pre-warming during idle time so it doesn't impact initial page performance
        const prewarm = async () => {
            for (const route of MAIN_ROUTES) {
                const targetUrl = `/${locale}${route}`;
                try {
                    // 1. Warm up RSC (React Server Component payload for SPA transitions)
                    await fetch(targetUrl, {
                        headers: {
                            'RSC': '1',
                        },
                        priority: 'low',
                    }).catch(() => {});

                    // 2. Warm up Full HTML Document (for direct page refreshes/reloads)
                    await fetch(targetUrl, {
                        priority: 'low',
                    }).catch(() => {});
                } catch {
                    // Ignore transient network errors
                }
            }
        };

        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(prewarm, { timeout: 3000 });
        } else {
            setTimeout(prewarm, 1500);
        }
    }, [pathname]);

    return null;
}
