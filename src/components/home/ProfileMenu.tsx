'use client'

import React, { useState } from 'react';
import {
    Sun,
    Moon,
    Languages,
    Settings,
    LogOut,
    X,
    ChevronLeft,
    Check
} from "lucide-react";
import { useRouter, usePathname } from '@/i18n/routing';
import { useTheme } from '@/context/ThemeContext';
import { useTranslations, useLocale } from 'next-intl';

interface ProfileMenuProps {
    showProfileMenu: boolean;
    setShowProfileMenu: (show: boolean) => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
    showProfileMenu,
    setShowProfileMenu,
}) => {
    const t = useTranslations('ProfileMenu');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    // Estado para controlar se mostra as opções de idioma
    const [view, setView] = useState<'main' | 'language'>('main');

    const handleLanguageChange = (newLocale: string) => {
        // next-intl router.push cuida da substituição do locale na URL
        router.push(pathname, { locale: newLocale });
        setShowProfileMenu(false);
        setView('main');
    };

    const handleProfileEdit = () => {
        router.push('/profile/edit');
        setShowProfileMenu(false);
    }

    const handleLogOut = () => {
        setShowProfileMenu(false);
        router.push('/');
    };

    if (!showProfileMenu) return null;

    return (
        <>
            <div className="fixed inset-0 z-10" onClick={() => { setShowProfileMenu(false); setView('main'); }} />

            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] shadow-2xl z-20 p-2 animate-in fade-in zoom-in-95 duration-200">

                {/* Header dinâmico baseado na visão */}
                <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {view === 'language' && (
                            <button onClick={() => setView('main')} className="text-zinc-400 hover:text-zinc-600">
                                <ChevronLeft size={16} />
                            </button>
                        )}
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest italic">
                            {view === 'main' ? t('title') : t('selectLanguage')}
                        </p>
                    </div>
                    <button onClick={() => setShowProfileMenu(false)} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400">
                        <X size={14} />
                    </button>
                </div>

                <div className="space-y-1">
                    {view === 'main' ? (
                        <>
                            {/* Alternar Tema */}
                            {/* <button
                                onClick={toggleTheme}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-700 dark:text-zinc-200"
                            >
                                {theme === 'dark' ? (
                                    <Sun size={18} className="text-amber-500" />
                                ) : (
                                    <Moon size={18} className="text-indigo-500" />
                                )}
                                <span className="flex-1 text-left">
                                    {theme === 'dark' ? t('themeLight') : t('themeDark')}
                                </span>
                            </button> */}

                            {/* Abrir Seleção de Idioma */}
                            <button
                                onClick={() => setView('language')}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-700 dark:text-zinc-200"
                            >
                                <Languages size={18} className="text-blue-500" />
                                <span className="flex-1 text-left">{t('language')}</span>
                                <span className="text-[10px] font-black bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 uppercase">
                                    {locale}
                                </span>
                            </button>

                            <button onClick={handleProfileEdit} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-700 dark:text-zinc-200">
                                <Settings size={18} className="text-zinc-500" />
                                <span className="flex-1 text-left">{t('editProfile')}</span>
                            </button>

                            <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-1" />

                            <button onClick={handleLogOut} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                                <LogOut size={18} />
                                <span className="flex-1 text-left">{t('logout')}</span>
                            </button>
                        </>
                    ) : (
                        /* Visão de Seleção de Idioma */
                        <div className="animate-in slide-in-from-right-2 duration-200">
                            {[
                                { id: 'pt', label: 'Português' },
                                { id: 'en', label: 'English' },
                                { id: 'es', label: 'Español' }
                            ].map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => handleLanguageChange(lang.id)}
                                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-700 dark:text-zinc-200"
                                >
                                    {lang.label}
                                    {locale === lang.id && <Check size={16} className="text-lime-500" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfileMenu;