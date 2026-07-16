'use client';

import { useEffect, useRef } from 'react';
import { SyncManager } from '@/services/syncManager';
import { toast } from 'react-toastify';
import { InstallPromptBanner } from '@/components/pwa/InstallPromptBanner';

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
    const toastIdRef = useRef<string | number | null>(null);

    useEffect(() => {
        // Trigger initial sync attempt if online on load
        if (typeof window !== 'undefined' && navigator.onLine) {
            SyncManager.processQueue().catch(() => {});
        }

        // Handle browser online event
        const handleOnline = async () => {
            console.log('[OfflineSyncProvider] Back online, processing sync queue...');

            // Dismiss offline toast if still showing
            if (toastIdRef.current) {
                toast.dismiss(toastIdRef.current);
                toastIdRef.current = null;
            }

            try {
                const pendingBefore = await SyncManager.getPendingCount();

                if (pendingBefore > 0) {
                    const syncingToastId = toast.loading(
                        `Sincronizando ${pendingBefore} alteração(ões)...`,
                        {
                            style: { background: '#27272a', color: '#fff', borderRadius: '16px', fontSize: '14px' }
                        }
                    );

                    await SyncManager.processQueue();

                    const pendingAfter = await SyncManager.getPendingCount();

                    if (pendingAfter === 0) {
                        toast.update(syncingToastId, {
                            render: 'Tudo sincronizado! ✓',
                            type: 'success',
                            isLoading: false,
                            autoClose: 2500,
                            style: { background: '#27272a', color: '#4ade80', borderRadius: '16px', fontSize: '14px' }
                        });
                    } else {
                        toast.update(syncingToastId, {
                            render: `${pendingAfter} item(ns) pendente(s). Tentando novamente em breve.`,
                            type: 'warning',
                            isLoading: false,
                            autoClose: 4000,
                            style: { background: '#27272a', color: '#fbbf24', borderRadius: '16px', fontSize: '14px' }
                        });
                    }
                } else {
                    toast.success('Você está online novamente!', {
                        autoClose: 2000,
                        style: { background: '#27272a', color: '#4ade80', borderRadius: '16px', fontSize: '14px' }
                    });
                }
            } catch (err) {
                console.error('[OfflineSyncProvider] Sync failed on reconnect:', err);
            }
        };

        const handleOffline = () => {
            console.log('[OfflineSyncProvider] You are currently offline. Changes will be saved locally.');
            toastIdRef.current = toast.info('Você está offline. Alterações salvas localmente.', {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: { background: '#27272a', color: '#fff', borderRadius: '16px', fontSize: '14px' }
            });
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && navigator.onLine) {
                console.log('[OfflineSyncProvider] App visible, processing sync queue...');
                SyncManager.processQueue().catch(() => {});
            }
        };

        // Periodic sync — catches any stuck items every 30s while online
        const periodicSync = setInterval(() => {
            if (navigator.onLine) {
                SyncManager.processQueue().catch(() => {});
            }
        }, 30_000);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(periodicSync);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <>
            {children}
            <InstallPromptBanner />
        </>
    );
}
