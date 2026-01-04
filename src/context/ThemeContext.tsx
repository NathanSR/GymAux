'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'default'

interface ThemeContextType {
    theme: Theme;
    setTheme: (lang: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('default');

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme deve ser usado dentro de ThemeProvider");
    return context;
};