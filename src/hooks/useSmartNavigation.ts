'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';

/**
 * Mapeamento previsível de hierarquia de rotas para fallback seguro.
 */
export function getParentHierarchyRoute(pathname: string): string {
    // Remover o trecho de idioma da rota se presente (ex: /pt/workouts -> /workouts)
    const cleanPath = pathname.replace(/^\/(pt|en|es)(\/|$)/, '/');

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
    if (cleanPath.startsWith('/trainer/')) {
        return cleanPath === '/trainer' ? '/home' : '/trainer';
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

    const resolveFallbackUrl = useCallback(() => {
        if (fallbackUrl) return fallbackUrl;
        return getParentHierarchyRoute(pathname);
    }, [fallbackUrl, pathname]);

    /**
     * Navegação de voltar inteligente baseada em histórico e hierarquia
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

        // Se a rota atual já é o topo (/home ou /), não faz nada para não sair do app
        const cleanPath = pathname.replace(/^\/(pt|en|es)(\/|$)/, '/');
        if (cleanPath === '/home' || cleanPath === '/') {
            return;
        }

        router.refresh();

        if (typeof window !== 'undefined' && window.history.length > 1) {
            // Se o usuário veio de um site externo (ex: Google, redes sociais), usa o fallback hierárquico interno
            if (document.referrer && !document.referrer.includes(window.location.origin)) {
                router.replace(target);
                return;
            }
            router.back();
            return;
        }

        router.push(target);
    }, [isDirty, onConfirmLeave, onBack, resolveFallbackUrl, pathname, router]);

    /**
     * Redirecionamento pós-salvamento ou pós-exclusão para evitar empilhar formulários no histórico
     */
    const navigateAfterAction = useCallback((customTargetUrl?: string) => {
        const target = customTargetUrl || resolveFallbackUrl();
        router.refresh();

        if (typeof window !== 'undefined') {
            const hasHistory = window.history.length > 2;
            const isSameOriginReferrer = document.referrer && document.referrer.includes(window.location.origin);

            // Se o usuário veio da lista para o formulário, voltar desempilha a rota de edição/criação limpidamente
            if (hasHistory && isSameOriginReferrer && document.referrer.includes(target)) {
                router.back();
                return;
            }
        }

        router.replace(target);
    }, [resolveFallbackUrl, router]);

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

            // Se houver algum modal ou drawer aberto no DOM, não disparar navegação de página
            const hasOpenOverlay =
                document.querySelector('[role="dialog"]:not([data-state="closed"])') !== null ||
                document.querySelector('[aria-modal="true"]:not([data-state="closed"])') !== null ||
                document.querySelector('[data-overlay="true"]:not([data-state="closed"])') !== null ||
                document.querySelector('.drawer-content:not([data-state="closed"])') !== null;

            if (hasOpenOverlay) return;

            e.preventDefault();
            goBack();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enableEsc, goBack]);

    return {
        goBack,
        navigateAfterAction,
        resolveFallbackUrl,
    };
}
