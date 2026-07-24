'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CookieCategories {
    essential: boolean; // Sempre true (Sessão, Segurança, PWA, Tema, Idioma)
    analytics: boolean; // Métricas de desempenho e telemetria anônima
    functional: boolean; // Preferências avançadas de UX
}

export type ConsentStatus = 'undecided' | 'accepted_all' | 'rejected_optional' | 'custom';

export interface CookieConsentState {
    status: ConsentStatus;
    categories: CookieCategories;
    updatedAt: string | null;
    version: string;
}

interface CookieConsentContextType {
    consent: CookieConsentState;
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    acceptAll: () => void;
    rejectOptional: () => void;
    saveCustomConsent: (categories: Partial<CookieCategories>) => void;
}

const STORAGE_KEY = 'gymaux_cookie_consent_v1';
const COOKIE_NAME = 'gymaux_cookie_consent';
const CURRENT_VERSION = '1.0';

const DEFAULT_STATE: CookieConsentState = {
    status: 'undecided',
    categories: {
        essential: true,
        analytics: false,
        functional: false,
    },
    updatedAt: null,
    version: CURRENT_VERSION,
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [consent, setConsent] = useState<CookieConsentState>(DEFAULT_STATE);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Carregar consentimento salvo no localStorage/cookie ao montar
    useEffect(() => {
        setIsMounted(true);
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed: CookieConsentState = JSON.parse(saved);
                if (parsed && parsed.version === CURRENT_VERSION) {
                    setConsent({
                        ...parsed,
                        categories: {
                            ...parsed.categories,
                            essential: true, // Garante que essencial é sempre true
                        },
                    });
                }
            }
        } catch (e) {
            console.error('Erro ao ler consentimento de cookies:', e);
        }
    }, []);

    const persistConsent = useCallback((newState: CookieConsentState) => {
        setConsent(newState);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
            // Definir cookie com validade de 1 ano
            const maxAge = 365 * 24 * 60 * 60;
            document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(newState))}; path=/; max-age=${maxAge}; SameSite=Lax`;
        } catch (e) {
            console.error('Erro ao salvar consentimento de cookies:', e);
        }
    }, []);

    const acceptAll = useCallback(() => {
        const newState: CookieConsentState = {
            status: 'accepted_all',
            categories: {
                essential: true,
                analytics: true,
                functional: true,
            },
            updatedAt: new Date().toISOString(),
            version: CURRENT_VERSION,
        };
        persistConsent(newState);
        setIsModalOpen(false);
    }, [persistConsent]);

    const rejectOptional = useCallback(() => {
        const newState: CookieConsentState = {
            status: 'rejected_optional',
            categories: {
                essential: true,
                analytics: false,
                functional: false,
            },
            updatedAt: new Date().toISOString(),
            version: CURRENT_VERSION,
        };
        persistConsent(newState);
        setIsModalOpen(false);
    }, [persistConsent]);

    const saveCustomConsent = useCallback((customCategories: Partial<CookieCategories>) => {
        const newState: CookieConsentState = {
            status: 'custom',
            categories: {
                essential: true,
                analytics: Boolean(customCategories.analytics),
                functional: Boolean(customCategories.functional),
            },
            updatedAt: new Date().toISOString(),
            version: CURRENT_VERSION,
        };
        persistConsent(newState);
        setIsModalOpen(false);
    }, [persistConsent]);

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    // Evita renderização discrepante no SSR até estar montado no cliente
    return (
        <CookieConsentContext.Provider
            value={{
                consent,
                isModalOpen,
                openModal,
                closeModal,
                acceptAll,
                rejectOptional,
                saveCustomConsent,
            }}
        >
            {children}
        </CookieConsentContext.Provider>
    );
};

export const useCookieConsent = () => {
    const context = useContext(CookieConsentContext);
    if (!context) {
        throw new Error('useCookieConsent deve ser usado dentro de um CookieConsentProvider');
    }
    return context;
};
