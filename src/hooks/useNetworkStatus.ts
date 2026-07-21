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
        const checkConnectivity = async () => {
            try {
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                if (!supabaseUrl) {
                    if (isMounted) setIsOnline(true);
                    return;
                }
                const res = await fetch(`${supabaseUrl}/rest/v1/`, {
                    method: 'HEAD',
                    signal: AbortSignal.timeout(3000)
                });
                if (isMounted) {
                    setIsOnline(res.ok || res.status === 401 || res.status === 404);
                }
            } catch {
                if (isMounted) setIsOnline(false);
            }
        };

        checkConnectivity();
        const interval = setInterval(checkConnectivity, 15000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [browserOnline]);

    return { isOnline, browserOnline };
}
