'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en' | 'es';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Importe seus JSONs de tradução aqui
const translations: Record<Language, Record<string, string>> = {
    pt: { dashboard_title: "Olá", start_workout: "Iniciar Agora" }, // Adicione seus objetos aqui
    en: { dashboard_title: "Hello", start_workout: "Start Now" },
    es: { dashboard_title: "Hola", start_workout: "Empezar Ahora" }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('pt');

    const t = (key: string) => translations[language][key] || key;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage deve ser usado dentro de LanguageProvider");
    return context;
};