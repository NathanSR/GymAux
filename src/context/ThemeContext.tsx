'use client';

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}

export const useTheme = () => {
    const { theme, setTheme, resolvedTheme } = useNextTheme();

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    }

    const isDark = resolvedTheme === 'dark';

    return { 
        theme: (theme as 'dark' | 'light' | 'system') || 'system', 
        setTheme, 
        toggleTheme, 
        resolvedTheme: (resolvedTheme as 'dark' | 'light') || 'light',
        isDark
    };
};