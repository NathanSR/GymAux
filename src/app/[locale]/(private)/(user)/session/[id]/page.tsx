'use client';

import { use, useEffect, useState } from 'react';
import SessionClient from '@/components/session/SessionClient';
import { SessionService } from '@/services/sessionService';
import { useSession } from '@/hooks/useSession';
import { useRouter } from '@/i18n/routing';
import { Session } from '@/config/types';

export default function SessionPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { activeUser, loading: sessionLoading } = useSession();

    const [sessionData, setSessionData] = useState<Session | null>(null);
    const [fetchingSession, setFetchingSession] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setFetchingSession(true);

        SessionService.getSessionById(id).then(fetched => {
            if (!isMounted) return;
            if (!fetched) {
                router.push('/home');
            } else {
                setSessionData(fetched);
            }
        }).catch(() => {
            if (isMounted) router.push('/home');
        }).finally(() => {
            if (isMounted) setFetchingSession(false);
        });

        return () => {
            isMounted = false;
        };
    }, [id, router]);

    if ((sessionLoading || fetchingSession) && !sessionData) {
        return (
            <div className="min-h-screen bg-zinc-950 p-6 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!activeUser || !sessionData) return null;

    const isReadOnly = sessionData.current?.step === 'completion';

    return (
        <SessionClient initialSession={sessionData} isReadOnly={isReadOnly} />
    );
}