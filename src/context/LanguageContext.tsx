'use client';
import { LANGUAGES } from '@/config/constants';
import { useLocale } from 'next-intl';
import React, { createContext, useContext, useState } from 'react';

type Language = typeof LANGUAGES[number];

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const locale = useLocale();
    const [language, setLanguage] = useState<Language>(locale as Language);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage deve ser usado dentro de LanguageProvider");
    return context;
};