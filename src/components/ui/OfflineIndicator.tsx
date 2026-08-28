'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineIndicator() {
    const t = useTranslations('OfflineSync');
    const { isOnline } = useNetworkStatus();
    const [wasOffline, setWasOffline] = useState(false);
    const [showReconnected, setShowReconnected] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isOnline) {
            setWasOffline(true);
            setShowReconnected(false);
            setIsExpanded(true);

            // Auto-recolhe após 4 segundos para não cobrir títulos
            if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
            collapseTimerRef.current = setTimeout(() => {
                setIsExpanded(false);
            }, 4000);
        } else if (wasOffline) {
            setShowReconnected(true);
            setIsExpanded(true);
            if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);

            const timer = setTimeout(() => {
                setShowReconnected(false);
                setWasOffline(false);
            }, 3000);
            return () => clearTimeout(timer);
        }

        return () => {
            if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
        };
    }, [isOnline, wasOffline]);

    const handleToggleExpand = () => {
        if (isOnline) return;
        setIsExpanded(prev => {
            const next = !prev;
            if (next) {
                if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
                collapseTimerRef.current = setTimeout(() => {
                    setIsExpanded(false);
                }, 5000);
            }
            return next;
        });
    };

    if (isOnline && !showReconnected) return null;

    return (
        <div className="fixed top-2 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4">
            <AnimatePresence mode="wait">
                {!isOnline ? (
                    <motion.button
                        key="offline-badge"
                        layout
                        initial={{ y: -40, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -40, opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        onClick={handleToggleExpand}
                        type="button"
                        className="pointer-events-auto bg-amber-500/95 backdrop-blur-md text-zinc-950 px-3.5 py-1.5 rounded-full text-xs font-black shadow-xl shadow-amber-500/20 flex items-center gap-2 border border-amber-400/50 cursor-pointer active:scale-95 transition-all select-none"
                    >
                        <WifiOff size={15} className="animate-pulse flex-shrink-0" />
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.span
                                    key="offline-text"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="whitespace-nowrap overflow-hidden"
                                >
                                    {t('offlineNotice') || 'Modo Offline — Seus treinos estão salvos localmente'}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                ) : showReconnected ? (
                    <motion.div
                        key="online-badge"
                        initial={{ y: -40, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -40, opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="pointer-events-auto bg-lime-400/95 backdrop-blur-md text-zinc-950 px-4 py-1.5 rounded-full text-xs font-black shadow-xl shadow-lime-500/20 flex items-center gap-2 border border-lime-300/50"
                    >
                        <CheckCircle2 size={15} className="flex-shrink-0" />
                        <span className="whitespace-nowrap">
                            {t('synced') || 'Conexão reestabelecida — Dados sincronizados'}
                        </span>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
