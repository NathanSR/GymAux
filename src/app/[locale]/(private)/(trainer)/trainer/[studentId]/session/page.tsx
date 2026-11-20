'use client';

import { use, useEffect } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import SessionClient from '@/components/session/SessionClient';
import { useDexieActiveSession } from '@/hooks/useDexieData';
import { resolveDynamicRouteId, isShellSentinel } from '@/utils/activeAuthUser';
import { SessionSkeleton } from '@/components/ui/Skeleton';

export default function TrainerStudentSessionPage({
    params
}: {
    params: Promise<{ studentId: string }>;
}) {
    const resolvedParams = use(params);
    const pathname = usePathname();
    const router = useRouter();
    const studentId = resolveDynamicRouteId(/\/trainer\/([^/?#]+)\/session/, pathname, resolvedParams?.studentId);
    const activeSession = useDexieActiveSession(studentId);

    useEffect(() => {
        if (activeSession === null && studentId && !isShellSentinel(studentId)) {
            router.replace(`/trainer/${studentId}`);
        }
    }, [activeSession, studentId, router]);

    if (!activeSession) {
        return <SessionSkeleton />;
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-zinc-950">
            <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-500 p-2 text-[10px] font-black uppercase text-center tracking-[0.3em] z-50 backdrop-blur-md">
                Monitor Mode - Viewing Student Live Session
            </div>
            <div className="flex-1 relative">
                <SessionClient initialSession={activeSession} isReadOnly={true} />
            </div>
        </div>
    );
}
