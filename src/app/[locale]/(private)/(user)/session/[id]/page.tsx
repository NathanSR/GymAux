'use client';

import { use, useEffect, useState } from 'react';
import SessionClient from '@/components/session/SessionClient';
import { SessionService } from '@/services/sessionService';
import { useSession } from '@/hooks/useSession';
import { useRouter } from '@/i18n/routing';
import { Session } from '@/config/types';
import { startTopLoader, stopTopLoader } from '@/utils/topLoader';

import { SessionSkeleton } from '@/components/ui/Skeleton';

export default function SessionPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { activeUser, loading: sessionLoading } = useSession();

    const [sessionData, setSessionData] = useState<Session | null>(null);
    const [fetchingSession, setFetchingSession] = useState(true);

    useEffect(() => {
        if (!sessionLoading && !activeUser) {
            startTopLoader();
            router.push('/home');
        }
    }, [sessionLoading, activeUser, router]);

    useEffect(() => {
        let isMounted = true;
        setFetchingSession(true);

        SessionService.getSessionById(id).then(fetched => {
            if (!isMounted) return;
            if (!fetched) {
                startTopLoader();
                router.push('/home');
            } else {
                setSessionData(fetched);
            }
        }).catch(() => {
            if (isMounted) {
                startTopLoader();
                router.push('/home');
            }
        }).finally(() => {
            if (isMounted) {
                setFetchingSession(false);
                stopTopLoader();
            }
        });

        return () => {
            isMounted = false;
        };
    }, [id, router]);

    if ((sessionLoading || fetchingSession) && !sessionData) {
        return <SessionSkeleton />;
    }

    if (!activeUser || !sessionData) return null;

    const isReadOnly = sessionData.current?.step === 'completion';

    return (
        <SessionClient initialSession={sessionData} isReadOnly={isReadOnly} />
    );
}