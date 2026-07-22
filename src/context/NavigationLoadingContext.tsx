'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { startTopLoader, stopTopLoader } from '@/utils/topLoader';
import { PageLoadingOverlay, LoadingIconType } from '@/components/ui/PageLoadingOverlay';

interface CustomTextParams {
    message?: string;
    subtext?: string;
}

interface NavigationLoadingContextType {
    isLoading: boolean;
    showLoading: (
        messageKey: string,
        subtextKey?: string,
        icon?: LoadingIconType,
        customParams?: CustomTextParams
    ) => void;
    hideLoading: () => void;
    navigateWithLoading: (
        url: string,
        messageKey: string,
        subtextKey?: string,
        options?: {
            replace?: boolean;
            icon?: LoadingIconType;
            customParams?: CustomTextParams;
        }
    ) => void;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType | undefined>(undefined);

export function NavigationLoadingProvider({ children }: { children: React.ReactNode }) {
    const t = useTranslations('NavigationLoading');
    const pathname = usePathname();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [subtext, setSubtext] = useState('');
    const [iconType, setIconType] = useState<LoadingIconType>('dumbbell');

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const currentPathRef = useRef<string>(pathname);

    const hideLoading = useCallback(() => {
        setIsLoading(false);
        stopTopLoader();

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const showLoading = useCallback(
        (
            messageKey: string,
            subtextKey?: string,
            icon: LoadingIconType = 'dumbbell',
            customParams?: CustomTextParams
        ) => {
            // Resolve message text using i18n fallbacking to key or custom text
            let resolvedTitle = customParams?.message || '';
            if (!resolvedTitle) {
                try {
                    resolvedTitle = t.has(messageKey as any) ? t(messageKey as any) : messageKey;
                } catch {
                    resolvedTitle = messageKey;
                }
            }

            let resolvedSubtext = customParams?.subtext || '';
            if (!resolvedSubtext && subtextKey) {
                try {
                    resolvedSubtext = t.has(subtextKey as any) ? t(subtextKey as any) : subtextKey;
                } catch {
                    resolvedSubtext = subtextKey;
                }
            }

            setTitle(resolvedTitle);
            setSubtext(resolvedSubtext);
            setIconType(icon);
            setIsLoading(true);

            startTopLoader();

            // Safety timeout to prevent soft-locks
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                hideLoading();
            }, 8000);
        },
        [t, hideLoading]
    );

    const navigateWithLoading = useCallback(
        (
            url: string,
            messageKey: string,
            subtextKey?: string,
            options?: {
                replace?: boolean;
                icon?: LoadingIconType;
                customParams?: CustomTextParams;
            }
        ) => {
            showLoading(messageKey, subtextKey, options?.icon || 'dumbbell', options?.customParams);

            if (options?.replace) {
                router.replace(url);
            } else {
                router.push(url);
            }
        },
        [showLoading, router]
    );

    // Auto-hide when pathname changes
    useEffect(() => {
        if (currentPathRef.current !== pathname) {
            currentPathRef.current = pathname;
            hideLoading();
        }
    }, [pathname, hideLoading]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <NavigationLoadingContext.Provider
            value={{
                isLoading,
                showLoading,
                hideLoading,
                navigateWithLoading
            }}
        >
            {children}
            <PageLoadingOverlay
                isOpen={isLoading}
                title={title}
                subtext={subtext}
                iconType={iconType}
            />
        </NavigationLoadingContext.Provider>
    );
}

export function useNavigationLoading() {
    const context = useContext(NavigationLoadingContext);
    if (!context) {
        throw new Error('useNavigationLoading must be used within a NavigationLoadingProvider');
    }
    return context;
}
