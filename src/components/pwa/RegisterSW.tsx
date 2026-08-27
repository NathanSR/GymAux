'use client';

import { useEffect } from 'react';

/**
 * Registrador resiliente do Service Worker Nativo GymAux.
 * Gerencia ciclo de vida, escuta novas versões e atualiza o app automaticamente.
 */
export function RegisterSW() {
    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        let refreshing = false;

        // Quando o novo Service Worker assumir o controle, recarrega suavemente se necessário
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                console.log('[PWA] Nova versão ativada. Atualizando aplicação...');
                window.location.reload();
            }
        });

        const register = async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                });

                console.log('[PWA] Service Worker nativo registrado com sucesso:', registration.scope);

                // Escuta novas versões sendo instaladas em segundo plano
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[PWA] Nova versão do GymAux disponível em segundo plano.');
                            // Notifica o novo worker para assumir imediatamente
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                        }
                    });
                });

                // Checagem periódica de atualização (ao voltar para a aba ou a cada 60min)
                const checkForUpdates = () => {
                    if (navigator.onLine) {
                        registration.update().catch(() => {});
                    }
                };

                const handleVisibilityChange = () => {
                    if (document.visibilityState === 'visible') {
                        checkForUpdates();
                    }
                };

                document.addEventListener('visibilitychange', handleVisibilityChange);
                const interval = setInterval(checkForUpdates, 60 * 60 * 1000); // 1 hora

                return () => {
                    document.removeEventListener('visibilitychange', handleVisibilityChange);
                    clearInterval(interval);
                };
            } catch (error) {
                console.error('[PWA] Falha ao registrar Service Worker nativo:', error);
            }
        };

        register();
    }, []);

    return null;
}
