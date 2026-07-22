'use client';

import { use, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SessionClient from '@/components/session/SessionClient';
import { SessionService } from '@/services/sessionService';
import { useSession } from '@/hooks/useSession';
import { useRouter } from '@/i18n/routing';
import { Session } from '@/config/types';
import { stopTopLoader } from '@/utils/topLoader';
import { useNavigationLoading } from '@/context/NavigationLoadingContext';

import { SessionSkeleton } from '@/components/ui/Skeleton';

export default function SessionPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { activeUser, loading: sessionLoading } = useSession();
    const { showLoading } = useNavigationLoading();

    const [sessionData, setSessionData] = useState<Session | null>(null);
    const [fetchingSession, setFetchingSession] = useState(true);

    useEffect(() => {
        if (!sessionLoading && !activeUser) {
            showLoading('returningToHome', 'returningToHomeSubtext', 'home');
            router.push('/home');
        }
    }, [sessionLoading, activeUser, router, showLoading]);

    useEffect(() => {
        let isMounted = true;
        setFetchingSession(true);

        SessionService.getSessionById(id).then(fetched => {
            if (!isMounted) return;
            if (!fetched) {
                showLoading('returningToHome', 'returningToHomeSubtext', 'home');
                router.push('/home');
            } else {
                setSessionData(fetched);
            }
        }).catch(() => {
            if (isMounted) {
                showLoading('returningToHome', 'returningToHomeSubtext', 'home');
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

    const isLoading = (sessionLoading || fetchingSession) && !sessionData;

    if (!activeUser && !isLoading) return null;

    const isReadOnly = sessionData?.current?.step === 'completion';

    return (
        <AnimatePresence mode="wait">
            {isLoading || !sessionData ? (
                <motion.div
                    key="session-skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="h-full w-full"
                >
                    <SessionSkeleton />
                </motion.div>
            ) : (
                <motion.div
                    key="session-content"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full w-full"
                >
                    <SessionClient initialSession={sessionData} isReadOnly={isReadOnly} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}