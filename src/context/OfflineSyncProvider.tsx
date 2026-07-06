'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getDatabase } from '@/config/rxDatabase';
import { SyncReplicator } from '@/services/rxReplication';
import { createClient } from '../lib/supabase/client';

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
    const toastIdRef = useRef<string | number | null>(null);

    useEffect(() => {
        const supabase = createClient();
        let authListener: any;

        const initSync = async () => {
            try {
                const db = await getDatabase();

                // Escutar mudanças de autenticação no Supabase para iniciar/parar replicação
                const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                    if (session?.user) {
                        await SyncReplicator.start(db);
                    } else {
                        SyncReplicator.stop();
                    }
                });
                authListener = subscription;

                // Tentar iniciar se já estiver logado
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await SyncReplicator.start(db);
                }
            } catch (err) {
                console.error('[OfflineSyncProvider] Failed to initialize RxDB Sync:', err);
            }
        };

        initSync();

        // Notificações visuais de conectividade
        const handleOnline = () => {
            console.log('[OfflineSyncProvider] Back online.');
            if (toastIdRef.current) {
                toast.dismiss(toastIdRef.current);
                toastIdRef.current = null;
            }
            toast.success('Você está online novamente!', {
                autoClose: 2000,
                style: { background: '#27272a', color: '#4ade80', borderRadius: '16px', fontSize: '14px' }
            });
        };

        const handleOffline = () => {
            console.log('[OfflineSyncProvider] Offline. Mudanças serão salvas no banco local.');
            toastIdRef.current = toast.info('Você está offline. Alterações salvas localmente.', {
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
            if (authListener) authListener.unsubscribe();
            SyncReplicator.stop();
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return <>{children}</>;
}
