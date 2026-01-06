'use client';
import React, { createContext, useContext, useState } from 'react';

type Theme = 'dark' | 'light' | 'default'

interface ThemeContextType {
    theme: Theme;
    setTheme: (lang: Theme) => void;
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('default');

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            <div className={theme === 'dark' ? 'dark' : ''}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme deve ser usado dentro de ThemeProvider");
    return context;
};