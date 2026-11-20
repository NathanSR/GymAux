'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSession } from '@/hooks/useSession';

const SHELL_ID = '__gymaux_shell__';
const STUDENT_SHELL_ID = '__gymaux_student__';

/**
 * Shells estáticos essenciais de navegação.
 */
const CORE_STATIC_ROUTES = [
    '/home',
    '/workouts',
    '/exercises',
    '/schedules',
    '/history',
    '/workouts/new',
    '/schedules/new',
    '/exercises/new',
    '/profile/edit',
    '/profile/my-id',
    '/trainer',
];

/**
 * Templates de shells dinâmicos do usuário (apenas 1 shell genérico por tipo de rota).
 * O Service Worker reescreve __gymaux_shell__ para o ID real em modo offline,
 * permitindo editar/visualizar/treinar qualquer item (inclusive recém-criados offline)
 * sem nunca cair na tela de "Você está offline".
 */
const USER_DYNAMIC_SHELL_ROUTES = [
    `/workouts/${SHELL_ID}/edit`,
    `/schedules/${SHELL_ID}/edit`,
    `/exercises/${SHELL_ID}`,
    `/exercises/${SHELL_ID}/edit`,
    `/session/${SHELL_ID}`,
];

/**
 * Templates de shells dinâmicos do modo Treinador.
 * Pré-aquecidos automaticamente quando o usuário é treinador/admin ou acessa /trainer.
 */
const TRAINER_DYNAMIC_SHELL_ROUTES = [
    `/trainer/${STUDENT_SHELL_ID}`,
    `/trainer/${STUDENT_SHELL_ID}/workouts`,
    `/trainer/${STUDENT_SHELL_ID}/workouts/new`,
    `/trainer/${STUDENT_SHELL_ID}/workouts/${SHELL_ID}/edit`,
    `/trainer/${STUDENT_SHELL_ID}/schedule`,
    `/trainer/${STUDENT_SHELL_ID}/schedule/new`,
    `/trainer/${STUDENT_SHELL_ID}/schedule/${SHELL_ID}/edit`,
    `/trainer/${STUDENT_SHELL_ID}/history`,
    `/trainer/${STUDENT_SHELL_ID}/session`,
];

const CORE_PREWARM_KEY = 'gymaux_shell_prewarmed_v2';
const TRAINER_PREWARM_KEY = 'gymaux_trainer_shell_prewarmed_v2';

/**
 * Aguarda o Service Worker assumir o controle da página antes de disparar os fetches,
 * garantindo que todas as respostas realmente passem pelo SW e populem HTML_CACHE,
 * RSC_CACHE e STATIC_CACHE.
 */
async function waitForServiceWorkerControl(timeoutMs = 4000): Promise<boolean> {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
        return false;
    }

    if (navigator.serviceWorker.controller) {
        return true;
    }

    try {
        await Promise.race([
            navigator.serviceWorker.ready,
            new Promise((resolve) => setTimeout(resolve, timeoutMs)),
        ]);

        if (navigator.serviceWorker.controller) {
            return true;
        }

        return await new Promise<boolean>((resolve) => {
            const timer = setTimeout(() => {
                navigator.serviceWorker.removeEventListener('controllerchange', onChange);
                resolve(Boolean(navigator.serviceWorker.controller));
            }, timeoutMs);

            const onChange = () => {
                clearTimeout(timer);
                navigator.serviceWorker.removeEventListener('controllerchange', onChange);
                resolve(true);
            };

            navigator.serviceWorker.addEventListener('controllerchange', onChange);
        });
    } catch {
        return false;
    }
}

async function warmRouteBatch(
    routes: string[],
    locale: string,
    isCancelled: () => boolean,
    router?: ReturnType<typeof useRouter>,
    includeRouterPrefetch = false
) {
    if (includeRouterPrefetch && router) {
        for (const route of routes) {
            if (isCancelled() || !navigator.onLine) return;
            try {
                router.prefetch(route);
            } catch {
                // Ignore prefetch errors
            }
        }
    }

    // Popula HTML_CACHE (+ chunks estáticos via SW) e RSC_CACHE (?__sw_rsc=nav) com concorrência controlada
    const CONCURRENCY = 2;
    for (let i = 0; i < routes.length; i += CONCURRENCY) {
        if (isCancelled() || !navigator.onLine) return;
        const batch = routes.slice(i, i + CONCURRENCY);

        await Promise.allSettled(
            batch.map(async (route) => {
                const fullUrl = `/${locale}${route}`;
                try {
                    await fetch(fullUrl, {
                        headers: { Accept: 'text/html' },
                        credentials: 'same-origin',
                        priority: 'low',
                    } as RequestInit);
                } catch {
                    // Ignora falhas transitórias
                }

                if (isCancelled() || !navigator.onLine) return;

                try {
                    await fetch(fullUrl, {
                        headers: { RSC: '1' },
                        credentials: 'same-origin',
                        priority: 'low',
                    } as RequestInit);
                } catch {
                    // Ignora falhas transitórias
                }
            })
        );
    }
}

/**
 * Pré-aquece os shells estáticos e templates dinâmicos do app de forma leve (em idle)
 * para acesso e edição 100% offline, mesmo em itens nunca visitados online.
 */
export function RoutePrewarmer() {
    const pathname = usePathname();
    const router = useRouter();
    const { activeUser } = useSession();

    const coreRunningRef = useRef(false);
    const trainerRunningRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !navigator.onLine) {
            return;
        }

        const isPublicOrAdmin =
            pathname.includes('/login') ||
            pathname.includes('/register') ||
            pathname.includes('/admin') ||
            pathname === '/';

        if (isPublicOrAdmin) {
            return;
        }

        const needsCore = sessionStorage.getItem(CORE_PREWARM_KEY) !== '1';
        const isTrainerContext =
            pathname.includes('/trainer') ||
            activeUser?.role === 'trainer' ||
            activeUser?.role === 'admin';
        const needsTrainer = isTrainerContext && sessionStorage.getItem(TRAINER_PREWARM_KEY) !== '1';

        if (!needsCore && !needsTrainer) {
            return;
        }

        let cancelled = false;
        const isCancelled = () => cancelled;

        const runPrewarm = async () => {
            if (cancelled || !navigator.onLine) return;

            const swControlled = await waitForServiceWorkerControl(4000);
            if (cancelled || !navigator.onLine || !swControlled) return;

            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            const locale = ['pt', 'en', 'es'].includes(pathSegments[0]) ? pathSegments[0] : 'pt';

            if (needsCore && !coreRunningRef.current) {
                coreRunningRef.current = true;
                try {
                    // 1. Aquece estáticos principais + prefetch nativo do router
                    await warmRouteBatch(CORE_STATIC_ROUTES, locale, isCancelled, router, true);
                    // 2. Aquece templates dinâmicos (workouts/edit, schedules/edit, exercises/id, session/id)
                    await warmRouteBatch(USER_DYNAMIC_SHELL_ROUTES, locale, isCancelled, undefined, false);

                    if (!cancelled && navigator.onLine && navigator.serviceWorker.controller) {
                        try {
                            sessionStorage.setItem(CORE_PREWARM_KEY, '1');
                        } catch {
                            // Ignore storage error
                        }
                    }
                } finally {
                    coreRunningRef.current = false;
                }
            }

            if (needsTrainer && !trainerRunningRef.current && !cancelled && navigator.onLine) {
                trainerRunningRef.current = true;
                try {
                    await warmRouteBatch(TRAINER_DYNAMIC_SHELL_ROUTES, locale, isCancelled, undefined, false);

                    if (!cancelled && navigator.onLine && navigator.serviceWorker.controller) {
                        try {
                            sessionStorage.setItem(TRAINER_PREWARM_KEY, '1');
                        } catch {
                            // Ignore storage error
                        }
                    }
                } finally {
                    trainerRunningRef.current = false;
                }
            }
        };

        const scheduleIdle = () => {
            if ('requestIdleCallback' in window) {
                const id = (window as any).requestIdleCallback(() => runPrewarm(), { timeout: 2500 });
                return () => (window as any).cancelIdleCallback(id);
            }
            const timer = setTimeout(runPrewarm, 1200);
            return () => clearTimeout(timer);
        };

        const cancel = scheduleIdle();

        // Se o app abrir offline e ficar online depois, dispara o aquecimento automaticamente
        const handleOnline = () => {
            if (!cancelled) {
                runPrewarm();
            }
        };
        window.addEventListener('online', handleOnline);

        return () => {
            cancelled = true;
            cancel();
            window.removeEventListener('online', handleOnline);
        };
    }, [pathname, router, activeUser?.role]);

    return null;
}
