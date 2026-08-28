'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { OverlayStackManager } from './useOverlayStack';

const HISTORY_STORAGE_KEY = 'gymaux_spa_history';

/**
 * Normaliza caminhos de rota removendo parâmetros de busca, hashes, barras finais e prefixos de idioma.
 */
export function normalizePath(path: string): string {
    if (!path) return '';
    const clean = path.split('?')[0].split('#')[0].replace(/^\/(pt|en|es)(\/|$)/, '/');
    return clean.length > 1 && clean.endsWith('/') ? clean.slice(0, -1) : clean;
}

/**
 * Recupera o histórico interno SPA armazenado no sessionStorage.
 */
function getSpaHistory(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = sessionStorage.getItem(HISTORY_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Salva o histórico SPA de forma segura, limitando a pilha aos últimos 50 registros.
 */
function saveSpaHistory(history: string[]) {
    if (typeof window === 'undefined') return;
    try {
        const capped = history.slice(-50);
        sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(capped));
    } catch {
        // Ignora erros de storage (cookies desabilitados / modo anônimo estrito)
    }
}

/**
 * Mapeamento previsível de hierarquia de rotas para fallback seguro.
 */
export function getParentHierarchyRoute(pathname: string): string {
    const cleanPath = normalizePath(pathname);

    if (cleanPath.startsWith('/workouts/') || cleanPath === '/workouts') {
        return cleanPath === '/workouts' ? '/home' : '/workouts';
    }
    if (cleanPath.startsWith('/exercises/') || cleanPath === '/exercises') {
        return cleanPath === '/exercises' ? '/home' : '/exercises';
    }
    if (cleanPath.startsWith('/schedules/') || cleanPath === '/schedules') {
        return cleanPath === '/schedules' ? '/home' : '/schedules';
    }
    if (cleanPath.startsWith('/profile/')) {
        return '/home';
    }
    if (cleanPath.startsWith('/trainer/') || cleanPath === '/trainer') {
        if (cleanPath === '/trainer') return '/home';

        const workoutsMatch = cleanPath.match(/^\/trainer\/([^/]+)\/workouts(\/(new|.+\/edit))?$/);
        if (workoutsMatch) {
            return workoutsMatch[2] ? `/trainer/${workoutsMatch[1]}/workouts` : `/trainer/${workoutsMatch[1]}`;
        }

        const scheduleMatch = cleanPath.match(/^\/trainer\/([^/]+)\/schedule(\/(new|.+\/edit))?$/);
        if (scheduleMatch) {
            return scheduleMatch[2] ? `/trainer/${scheduleMatch[1]}/schedule` : `/trainer/${scheduleMatch[1]}`;
        }

        const historyMatch = cleanPath.match(/^\/trainer\/([^/]+)\/history$/);
        if (historyMatch) {
            return `/trainer/${historyMatch[1]}`;
        }

        const sessionMatch = cleanPath.match(/^\/trainer\/([^/]+)\/session$/);
        if (sessionMatch) {
            return `/trainer/${sessionMatch[1]}`;
        }

        return '/trainer';
    }
    if (cleanPath.startsWith('/admin/')) {
        if (cleanPath.startsWith('/admin/workouts/')) return '/admin/workouts';
        if (cleanPath.startsWith('/admin/exercises/')) return '/admin/exercises';
        return '/admin';
    }

    return '/home';
}

interface UseSmartNavigationOptions {
    onBack?: () => void;
    fallbackUrl?: string;
    enableEsc?: boolean;
    isDirty?: boolean;
    onConfirmLeave?: () => Promise<boolean> | boolean;
}

export function useSmartNavigation(options: UseSmartNavigationOptions = {}) {
    const router = useRouter();
    const pathname = usePathname();

    const { onBack, fallbackUrl, enableEsc = true, isDirty = false, onConfirmLeave } = options;
    const normalizedCurrentPath = normalizePath(pathname);

    /**
     * Efeito de rastreamento do histórico SPA interno
     */
    useEffect(() => {
        if (!normalizedCurrentPath) return;

        const stack = getSpaHistory();
        if (stack.length === 0) {
            saveSpaHistory([normalizedCurrentPath]);
            return;
        }

        const top = stack[stack.length - 1];
        const prev = stack.length >= 2 ? stack[stack.length - 2] : null;

        if (top === normalizedCurrentPath) {
            return;
        }

        if (prev === normalizedCurrentPath) {
            // O usuário navegou de volta para a rota anterior
            stack.pop();
            saveSpaHistory(stack);
        } else {
            // O usuário navegou para uma nova rota.
            // Se a rota já existir no histórico anterior (ex: retorno para rota pai),
            // truncamos a pilha até ela para evitar loops circulares (A -> B -> C -> A)
            const existingIdx = stack.lastIndexOf(normalizedCurrentPath);
            if (existingIdx !== -1) {
                saveSpaHistory(stack.slice(0, existingIdx + 1));
            } else {
                stack.push(normalizedCurrentPath);
                saveSpaHistory(stack);
            }
        }
    }, [normalizedCurrentPath]);

    const resolveFallbackUrl = useCallback(() => {
        if (fallbackUrl) return fallbackUrl;
        return getParentHierarchyRoute(pathname);
    }, [fallbackUrl, pathname]);

    /**
     * Navegação de voltar inteligente baseada no histórico SPA e hierarquia
     */
    const goBack = useCallback(async (customFallback?: string) => {
        if (isDirty && onConfirmLeave) {
            const confirmed = await onConfirmLeave();
            if (!confirmed) return;
        }

        if (onBack) {
            onBack();
            return;
        }

        const target = customFallback || resolveFallbackUrl();
        const normalizedTarget = normalizePath(target);
        const cleanPath = normalizePath(pathname);

        // Se a rota atual já é o topo (/home ou /), não faz nada para não sair do app
        if (cleanPath === '/home' || cleanPath === '' || cleanPath === '/') {
            return;
        }

        if (typeof window !== 'undefined') {
            const stack = getSpaHistory();
            const hasInternalHistory = stack.length >= 2;
            const prevRoute = stack.length >= 2 ? stack[stack.length - 2] : null;

            // 1. Se a rota anterior no histórico é exatamente o target desejado, router.back() volta limpo
            if (prevRoute && prevRoute === normalizedTarget) {
                router.back();
                return;
            }

            // 2. Se a rota alvo existe em uma posição anterior da pilha SPA, salta diretamente até ela
            const targetIdx = stack.lastIndexOf(normalizedTarget);
            if (targetIdx !== -1 && targetIdx < stack.length - 1) {
                const delta = (stack.length - 1) - targetIdx;
                saveSpaHistory(stack.slice(0, targetIdx + 1));
                window.history.go(-delta);
                return;
            }

            // 3. Se o histórico do navegador for válido e a rota anterior NÃO for um formulário (/new, /edit) ou sub-rota
            const isPrevUnwanted = prevRoute && (
                prevRoute === cleanPath ||
                prevRoute.startsWith(cleanPath + '/') ||
                prevRoute.endsWith('/new') ||
                prevRoute.endsWith('/edit')
            );

            if (hasInternalHistory && !isPrevUnwanted && !customFallback) {
                router.back();
                return;
            }
        }

        router.push(target);
    }, [isDirty, onConfirmLeave, onBack, resolveFallbackUrl, pathname, router]);

    /**
     * Volta no histórico desempilhando todas as rotas intermediárias até encontrar uma rota específica (ex: sair de um contexto de aluno e voltar para /trainer).
     * Se a rota alvo estiver no histórico SPA, executa window.history.go(-delta).
     * Se não estiver na pilha, redefine a pilha e utiliza router.replace(targetUrl) para não empilhar histórico duplicado.
     */
    const goBackTo = useCallback(async (targetUrl: string) => {
        if (isDirty && onConfirmLeave) {
            const confirmed = await onConfirmLeave();
            if (!confirmed) return;
        }

        const normalizedTarget = normalizePath(targetUrl);
        const cleanPath = normalizePath(pathname);

        if (cleanPath === normalizedTarget) return;

        if (typeof window !== 'undefined') {
            const stack = getSpaHistory();
            const targetIndex = stack.lastIndexOf(normalizedTarget);

            if (targetIndex !== -1 && targetIndex < stack.length - 1) {
                const delta = (stack.length - 1) - targetIndex;
                saveSpaHistory(stack.slice(0, targetIndex + 1));
                window.history.go(-delta);
                return;
            }

            // Se a rota alvo não estiver na pilha anterior, redefine a pilha e substitui a rota atual
            saveSpaHistory([normalizedTarget]);
        }

        router.replace(targetUrl);
    }, [isDirty, onConfirmLeave, pathname, router]);

    /**
     * Redirecionamento pós-salvamento ou pós-exclusão para evitar empilhar formulários no histórico
     */
    const navigateAfterAction = useCallback((customTargetUrl?: string) => {
        const target = customTargetUrl || resolveFallbackUrl();
        const normalizedTarget = normalizePath(target);
        router.refresh();

        if (typeof window !== 'undefined') {
            const stack = getSpaHistory();
            const prevRoute = stack.length >= 2 ? stack[stack.length - 2] : null;

            // Se o usuário veio da lista para o formulário, voltar desempilha a rota de edição/criação limpidamente
            if (prevRoute && (prevRoute === normalizedTarget || normalizedTarget.startsWith(prevRoute))) {
                router.back();
                return;
            }
        }

        const normalizedCurrent = normalizePath(pathname);
        if (normalizedCurrent === normalizedTarget) {
            router.refresh();
        } else {
            const stack = getSpaHistory();
            if (stack.length > 0) {
                stack[stack.length - 1] = normalizedTarget;
                saveSpaHistory(stack);
            }
            router.replace(target);
        }
    }, [resolveFallbackUrl, router, pathname]);

    /**
     * Handler da tecla ESC inteligente
     */
    useEffect(() => {
        if (!enableEsc) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Escape' || e.defaultPrevented) return;

            const activeElement = document.activeElement as HTMLElement | null;
            if (activeElement) {
                const tagName = activeElement.tagName;
                const isInput = tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || activeElement.isContentEditable;

                if (isInput) {
                    activeElement.blur();
                    e.preventDefault();
                    return;
                }
            }

            if (OverlayStackManager.hasOpenOverlays()) return;

            e.preventDefault();
            goBack();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enableEsc, goBack]);

    return {
        goBack,
        goBackTo,
        navigateAfterAction,
        resolveFallbackUrl,
    };
}


