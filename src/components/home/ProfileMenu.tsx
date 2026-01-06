'use client'

import React from 'react';
import {
    Sun,
    Moon,
    Languages,
    Settings,
    LogOut,
    X
} from "lucide-react";
import { useRouter } from '@/i18n/routing';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/context/LanguageContext';

interface ProfileMenuProps {
    showProfileMenu: boolean;
    setShowProfileMenu: (show: boolean) => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
    showProfileMenu,
    setShowProfileMenu,
}) => {

    const router = useRouter();
    const { theme } = useTheme();
    const { language } = useLanguage();

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
            {/* Backdrop para fechar o menu ao clicar fora */}
            <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfileMenu(false)}
            />

            {/* Menu Dropdown */}
            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] shadow-2xl z-20 p-2 animate-in fade-in zoom-in-95 duration-200">
                {/* Cabeçalho do Menu */}
                <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-1 flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest italic">
                        Configurações
                    </p>
                    <button
                        onClick={() => setShowProfileMenu(false)}
                        className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden text-zinc-400"
                    >
                        <X size={14} />
                    </button>
                </div>

                <div className="space-y-1">
                    {/* Alternar Tema */}
                    <button
                        onClick={() => {
                            setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-700 dark:text-zinc-200"
                    >
                        {theme === 'dark' ? (
                            <Sun size={18} className="text-amber-500" />
                        ) : (
                            <Moon size={18} className="text-indigo-500" />
                        )}
                        <span className="flex-1 text-left">
                            {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                        </span>
                    </button>

                    {/* Idioma (Placeholder) */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-700 dark:text-zinc-200">
                        <Languages size={18} className="text-blue-500" />
                        <span className="flex-1 text-left">Idioma</span>
                        <span className="text-[10px] font-black bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">
                            {language.toUpperCase()}
                        </span>
                    </button>

                    {/* Editar Perfil */}
                    <button
                        onClick={handleProfileEdit}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-700 dark:text-zinc-200"
                    >
                        <Settings size={18} className="text-zinc-500" />
                        <span className="flex-1 text-left">Editar Perfil</span>
                    </button>

                    <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-1" />

                    {/* Logout */}
                    <button
                        onClick={handleLogOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="flex-1 text-left">Sair da Conta</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProfileMenu;