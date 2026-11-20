'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/routing';
import { toast } from '@/utils/toast';

function isProtectedRoute(path: string): boolean {
    if (!path) return false;
    return (
        path.includes('/session/') ||
        path.endsWith('/new') ||
        path.endsWith('/edit')
    );
}

/**
 * Registrador resiliente do Service Worker Nativo GymAux.
 * - Nunca interrompe um treino ativo (/session/) ou formulário em edição (/new, /edit) com reload forçado!
 * - Quando um novo deploy é detectado em rota segura, atualiza suavemente.
 * - Quando detectado durante treino/edição, mostra aviso clicável e agenda atualização ao sair da rota.
 */
export function RegisterSW() {
    const pathname = usePathname();
    const pathnameRef = useRef(pathname);
    const pendingReloadRef = useRef(false);
    const refreshingRef = useRef(false);

    useEffect(() => {
        pathnameRef.current = pathname;

        // Se havia uma atualização aguardando o usuário sair do treino/formulário, aplica agora em rota segura
        if (pendingReloadRef.current && !isProtectedRoute(pathname) && !refreshingRef.current) {
            refreshingRef.current = true;
            pendingReloadRef.current = false;
            window.location.reload();
        }
    }, [pathname]);

    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        let isMounted = true;
        let intervalId: ReturnType<typeof setInterval> | null = null;
        let visibilityHandler: (() => void) | null = null;

        const handleNewVersionReady = () => {
            if (refreshingRef.current) return;

            if (isProtectedRoute(pathnameRef.current)) {
                if (!pendingReloadRef.current) {
                    pendingReloadRef.current = true;
                    toast.info('Nova versão do GymAux disponível! Toque para atualizar.', {
                        id: 'gymaux-sw-update',
                        autoClose: 8000,
                        onClick: () => {
                            if (!refreshingRef.current) {
                                refreshingRef.current = true;
                                window.location.reload();
                            }
                        },
                    });
                }
                return;
            }

            refreshingRef.current = true;
            console.log('[PWA] Nova versão ativada. Atualizando aplicação...');
            window.location.reload();
        };

        const handleControllerChange = () => {
            handleNewVersionReady();
        };

        const handleSWMessage = (event: MessageEvent) => {
            if (event.data?.type === 'NEW_BUILD_DETECTED') {
                handleNewVersionReady();
            }
        };

        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
        navigator.serviceWorker.addEventListener('message', handleSWMessage);

        const register = async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                    updateViaCache: 'none',
                });

                if (!isMounted) return;

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                        }
                    });
                });

                const checkForUpdates = () => {
                    if (navigator.onLine) {
                        registration.update().catch(() => { });
                    }
                };

                visibilityHandler = () => {
                    if (document.visibilityState === 'visible') {
                        checkForUpdates();
                    }
                };

                document.addEventListener('visibilitychange', visibilityHandler);
                intervalId = setInterval(checkForUpdates, 30 * 60 * 1000); // 30 min
            } catch (error) {
                console.error('[PWA] Falha ao registrar Service Worker:', error);
            }
        };

        register();

        return () => {
            isMounted = false;
            navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
            navigator.serviceWorker.removeEventListener('message', handleSWMessage);
            if (visibilityHandler) {
                document.removeEventListener('visibilitychange', visibilityHandler);
            }
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    return null;
}
