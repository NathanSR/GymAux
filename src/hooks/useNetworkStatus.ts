'use client';

import { useState, useEffect } from 'react';
import { useOnlineStatus } from './useOnlineStatus';

/**
 * Hook de status de rede que valida conectividade real via ping leve.
 */
export function useNetworkStatus() {
    const browserOnline = useOnlineStatus();
    const [isOnline, setIsOnline] = useState<boolean>(browserOnline);

    useEffect(() => {
        if (!browserOnline) {
            setIsOnline(false);
            return;
        }

        let isMounted = true;
        let consecutiveFailures = 0;

        const checkConnectivity = async () => {
            if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
                return;
            }
            try {
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                if (!supabaseUrl) {
                    if (isMounted) setIsOnline(true);
                    return;
                }
                const res = await fetch(`${supabaseUrl}/rest/v1/`, {
                    method: 'HEAD',
                    signal: AbortSignal.timeout(7000)
                });
                if (isMounted) {
                    const isReachable = res.ok || res.status === 401 || res.status === 404;
                    if (isReachable) {
                        consecutiveFailures = 0;
                        setIsOnline(true);
                    } else {
                        consecutiveFailures++;
                        if (consecutiveFailures >= 2) setIsOnline(false);
                    }
                }
            } catch {
                consecutiveFailures++;
                // Apenas marca como offline se falhar consecutivamente ou se o navegador já estiver offline
                if (isMounted && (consecutiveFailures >= 2 || !navigator.onLine)) {
                    setIsOnline(false);
                }
            }
        };

        checkConnectivity();
        const interval = setInterval(checkConnectivity, 30000);
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') checkConnectivity();
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            isMounted = false;
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [browserOnline]);

    return { isOnline, browserOnline };
}
