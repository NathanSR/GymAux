'use client';

import React from 'react';
import { usePathname } from '@/i18n/routing';
import { MenuTab } from '@/components/ui/MenuTab';

const MAIN_TAB_ROUTES = new Set([
    '/',
    '/home',
    '/workouts',
    '/exercises',
    '/schedules',
    '/history'
]);

export function UserNavShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const cleanPath = pathname?.split('?')[0]?.split('#')[0] || '';
    const showMenuTab = MAIN_TAB_ROUTES.has(cleanPath);

    return (
        <div className={`flex flex-col min-h-dvh ${showMenuTab ? 'pb-20' : ''}`}>
            <main className="flex-1 w-full">{children}</main>
            {showMenuTab && <MenuTab />}
        </div>
    );
}

export default UserNavShell;
