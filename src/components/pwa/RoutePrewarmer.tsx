'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const MAIN_ROUTES = [
    '/home',
    '/workouts',
    '/workouts/new',
    '/exercises',
    '/schedules',
    '/history',
    '/profile/my-id',
    '/profile/edit',
    '/offline',
];

const STATIC_ASSETS = [
    '/sounds/3-2-1-ja.mp3',
    '/manifest.json',
    '/favicon.ico',
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
            // 1. Prewarm all static audio/media assets
            for (const asset of STATIC_ASSETS) {
                try {
                    await fetch(asset, { priority: 'low' }).catch(() => {});
                } catch {
                    // Ignore
                }
            }

            // 2. Prewarm full HTML documents and RSC payloads for user routes
            for (const route of MAIN_ROUTES) {
                const targetUrl = `/${locale}${route}`;
                try {
                    // Warm up RSC (React Server Component payload for SPA transitions)
                    await fetch(targetUrl, {
                        headers: {
                            'RSC': '1',
                        },
                        priority: 'low',
                    }).catch(() => {});

                    // Warm up Full HTML Document (for direct page refreshes/reloads)
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
