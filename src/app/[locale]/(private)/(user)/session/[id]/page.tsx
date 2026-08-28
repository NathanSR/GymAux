'use client';

import { use, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SessionClient from '@/components/session/SessionClient';
import { SessionService } from '@/services/sessionService';
import { useRouter, usePathname } from '@/i18n/routing';
import { Session } from '@/config/types';
import { stopTopLoader } from '@/utils/topLoader';
import { useNavigationLoading } from '@/context/NavigationLoadingContext';
import { SessionSkeleton } from '@/components/ui/Skeleton';

export default function SessionPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
    const resolvedParams = use(params);
    const pathname = usePathname();
    const router = useRouter();
    const { showLoading } = useNavigationLoading();

    const rawId = (resolvedParams?.id && resolvedParams.id !== 'template' && resolvedParams.id !== 'shell')
        ? resolvedParams.id
        : (pathname.split('/session/')[1]?.split('/')[0]?.split('?')[0] || resolvedParams?.id);

    const [mounted, setMounted] = useState(false);
    const [sessionData, setSessionData] = useState<Session | null>(null);
    const [fetchingSession, setFetchingSession] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let isMounted = true;
        if (!rawId || rawId === 'template' || rawId === 'shell') {
            return;
        }

        setFetchingSession(true);

        SessionService.getSessionById(rawId)
            .then((fetched) => {
                if (!isMounted) return;
                if (!fetched) {
                    showLoading('returningToHome', 'returningToHomeSubtext', 'home');
                    router.replace('/home');
                } else {
                    setSessionData(fetched);
                }
            })
            .catch((err) => {
                console.error('[SessionPage] Error fetching session:', err);
                if (isMounted) {
                    showLoading('returningToHome', 'returningToHomeSubtext', 'home');
                    router.replace('/home');
                }
            })
            .finally(() => {
                if (isMounted) {
                    setFetchingSession(false);
                    stopTopLoader();
                }
            });

        return () => {
            isMounted = false;
        };
    }, [rawId, router, showLoading]);

    const isReady = mounted && !fetchingSession && !!sessionData;
    const isReadOnly = sessionData?.current?.step === 'completion';

    return (
        <AnimatePresence mode="wait">
            {!isReady ? (
                <motion.div
                    key="session-skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
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
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full w-full"
                >
                    <SessionClient initialSession={sessionData} isReadOnly={isReadOnly} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}