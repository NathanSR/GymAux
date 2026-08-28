import React from 'react';
import { UserNavShell } from '@/components/navigation/UserNavShell';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <UserNavShell>{children}</UserNavShell>;
}
