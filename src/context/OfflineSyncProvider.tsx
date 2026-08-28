'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { SyncManager } from '@/services/syncManager';
import { toast } from 'react-toastify';
import { InstallPromptBanner } from '@/components/pwa/InstallPromptBanner';
import { RoutePrewarmer } from '@/components/pwa/RoutePrewarmer';
import { RegisterSW } from '@/components/pwa/RegisterSW';
import { OfflineIndicator } from '@/components/ui/OfflineIndicator';
import { SyncStatusModal } from '@/components/sync/SyncStatusModal';
import { useTranslations } from 'next-intl';

interface OfflineSyncContextType {
    isSyncModalOpen: boolean;
    openSyncModal: () => void;
    closeSyncModal: () => void;
    pendingCount: number;
    syncNow: () => Promise<void>;
}

const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

export function useOfflineSync() {
    const context = useContext(OfflineSyncContext);
    if (!context) {
        throw new Error('useOfflineSync must be used within an OfflineSyncProvider');
    }
    return context;
}

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
    const t = useTranslations('OfflineSync');
    const toastIdRef = useRef<string | number | null>(null);
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    const updatePendingCount = useCallback(async () => {
        try {
            const count = await SyncManager.getPendingCount();
            setPendingCount(count);
            return count;
        } catch {
            return 0;
        }
    }, []);

    const openSyncModal = useCallback(() => {
        setIsSyncModalOpen(true);
    }, []);

    const closeSyncModal = useCallback(() => {
        setIsSyncModalOpen(false);
    }, []);

    const syncNow = useCallback(async () => {
        await SyncManager.processQueue();
        await updatePendingCount();
    }, [updatePendingCount]);

    useEffect(() => {
        // Initial pending count & initial sync attempt
        updatePendingCount();
        if (typeof window !== 'undefined' && navigator.onLine) {
            SyncManager.processQueue().then(updatePendingCount).catch(() => {});
        }

        let onlineTimeout: NodeJS.Timeout | null = null;

        // Handle browser online event with slight debounce
        const handleOnline = () => {
            console.log('[OfflineSyncProvider] Back online event received...');

            if (toastIdRef.current) {
                toast.dismiss(toastIdRef.current);
                toastIdRef.current = null;
            }

            if (onlineTimeout) clearTimeout(onlineTimeout);
            onlineTimeout = setTimeout(async () => {
                try {
                    const pendingBefore = await updatePendingCount();

                    if (pendingBefore > 0) {
                        const syncingToastId = toast.loading(
                            t('syncing', { count: pendingBefore }),
                            {
                                style: { background: '#27272a', color: '#fff', borderRadius: '16px', fontSize: '14px' }
                            }
                        );

                        // Await actual completion of the queue
                        await SyncManager.processQueue();

                        const pendingAfter = await updatePendingCount();

                        if (pendingAfter === 0) {
                            toast.update(syncingToastId, {
                                render: t('synced'),
                                type: 'success',
                                isLoading: false,
                                autoClose: 2500,
                                style: { background: '#27272a', color: '#4ade80', borderRadius: '16px', fontSize: '14px' }
                            });
                        } else {
                            toast.update(syncingToastId, {
                                render: (
                                    <div
                                        onClick={() => setIsSyncModalOpen(true)}
                                        className="cursor-pointer hover:underline"
                                    >
                                        {t('pending', { count: pendingAfter })}
                                    </div>
                                ),
                                type: 'warning',
                                isLoading: false,
                                autoClose: 5000,
                                style: { background: '#27272a', color: '#fbbf24', borderRadius: '16px', fontSize: '14px', cursor: 'pointer' },
                                onClick: () => setIsSyncModalOpen(true)
                            });
                        }
                    } else {
                        toast.success(t('backOnline'), {
                            autoClose: 2000,
                            style: { background: '#27272a', color: '#4ade80', borderRadius: '16px', fontSize: '14px' }
                        });
                    }
                } catch (err) {
                    console.error('[OfflineSyncProvider] Sync failed on reconnect:', err);
                }
            }, 350);
        };

        const handleOffline = () => {
            console.log('[OfflineSyncProvider] You are currently offline. Changes will be saved locally.');
            updatePendingCount();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && navigator.onLine) {
                SyncManager.processQueue().then(updatePendingCount).catch(() => {});
            }
        };

        // Periodic sync and count refresher (every 15s)
        const periodicSync = setInterval(() => {
            if (navigator.onLine) {
                SyncManager.processQueue().then(updatePendingCount).catch(() => {});
            } else {
                updatePendingCount();
            }
        }, 15_000);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (onlineTimeout) clearTimeout(onlineTimeout);
            clearInterval(periodicSync);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [t, updatePendingCount]);

    return (
        <OfflineSyncContext.Provider
            value={{
                isSyncModalOpen,
                openSyncModal,
                closeSyncModal,
                pendingCount,
                syncNow,
            }}
        >
            <RegisterSW />
            <OfflineIndicator />
            <RoutePrewarmer />
            {children}
            <InstallPromptBanner />
            <SyncStatusModal isOpen={isSyncModalOpen} onClose={closeSyncModal} />
        </OfflineSyncContext.Provider>
    );
}
