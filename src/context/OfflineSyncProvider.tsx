'use client';

import { useEffect } from 'react';
import { SyncManager } from '@/services/syncManager';
import { toast } from 'react-toastify';

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Trigger initial sync attempt if online on load
        if (typeof window !== 'undefined' && navigator.onLine) {
            SyncManager.processQueue();
        }

        // Handle browser online event
        const handleOnline = () => {
            console.log('[OfflineSyncProvider] Back online, processing sync queue...');
            
            // Re-check queue and sync
            SyncManager.processQueue().then(() => {
                // Optionally check if queue is empty now to show toast, 
                // but syncManager handles the updates quietly.
            });
        };

        const handleOffline = () => {
            console.log('[OfflineSyncProvider] You are currently offline. Changes will be saved locally.');
            toast.info('Você está offline. Alterações salvas localmente.', {
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: { background: '#27272a', color: '#fff', borderRadius: '16px', fontSize: '14px' }
            });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return <>{children}</>;
}
