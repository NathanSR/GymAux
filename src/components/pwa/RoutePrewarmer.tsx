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
];

export function RoutePrewarmer() {
    const pathname = usePathname();
    const router = useRouter();
    const hasWarmedRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !navigator.onLine || hasWarmedRef.current) {
            return;
        }

        // Don't pre-warm on unauthenticated/public pages
        const isAuthPage =
            pathname.includes('/login') ||
            pathname.includes('/register') ||
            pathname.includes('/admin') ||
            pathname === '/';

        if (isAuthPage) {
            return;
        }

        hasWarmedRef.current = true;

        const prewarm = () => {
            for (const route of MAIN_ROUTES) {
                try {
                    router.prefetch(route);
                } catch {
                    // Ignore prefetch failures
                }
            }
        };

        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(prewarm, { timeout: 3000 });
        } else {
            setTimeout(prewarm, 1500);
        }
    }, [pathname, router]);

    return null;
}
