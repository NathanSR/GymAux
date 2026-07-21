'use client';

import React, { useEffect, useState } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function OfflineIndicator() {
    const t = useTranslations('OfflineSync');
    const { isOnline } = useNetworkStatus();
    const [wasOffline, setWasOffline] = useState(false);
    const [showReconnected, setShowReconnected] = useState(false);

    useEffect(() => {
        if (!isOnline) {
            setWasOffline(true);
            setShowReconnected(false);
        } else if (wasOffline) {
            setShowReconnected(true);
            const timer = setTimeout(() => {
                setShowReconnected(false);
                setWasOffline(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOnline, wasOffline]);

    if (isOnline && !showReconnected) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {!isOnline ? (
                <div className="bg-amber-500/90 backdrop-blur-md text-zinc-950 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 border border-amber-400/30">
                    <WifiOff size={14} className="animate-pulse" />
                    <span>{t('offlineNotice') || 'Modo Offline — Seus treinos estão salvos localmente'}</span>
                </div>
            ) : showReconnected ? (
                <div className="bg-lime-400/90 backdrop-blur-md text-zinc-950 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 border border-lime-300/30">
                    <CheckCircle2 size={14} />
                    <span>{t('synced') || 'Conexão reestabelecida — Dados sincronizados'}</span>
                </div>
            ) : null}
        </div>
    );
}
