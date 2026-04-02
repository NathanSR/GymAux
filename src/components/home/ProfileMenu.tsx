'use client'

import React, { useState, useEffect } from 'react';
import {
    Sun,
    Moon,
    Languages,
    Settings,
    LogOut,
    X,
    ChevronLeft,
    ChevronRight,
    Check,
    Download,
    QrCode,
    Users,
    User,
    ShieldCheck,
    Globe
} from "lucide-react";
import { useRouter, usePathname, Link } from '@/i18n/routing';
import { useTheme } from '@/context/ThemeContext';
import { useTranslations, useLocale } from 'next-intl';
import { LANGUAGES } from '@/config/constants';
import { User as AppUser } from '@/config/types';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileMenuProps {
    showProfileMenu: boolean;
    setShowProfileMenu: (show: boolean) => void;
    activeUser: AppUser | null;
}

type Language = typeof LANGUAGES[number];

const ProfileMenu: React.FC<ProfileMenuProps> = ({
    showProfileMenu,
    setShowProfileMenu,
    activeUser
}) => {
    const t = useTranslations('ProfileMenu');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();
    const { toggleTheme, resolvedTheme } = useTheme();

    // --- PWA Installation Logic ---
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setIsInstalled(true);
            }
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                setDeferredPrompt(e);
            });
        }
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setDeferredPrompt(null);
        setShowProfileMenu(false);
    };

    // --- View State ---
    const [view, setView] = useState<'main' | 'language'>('main');

    const handleLanguageChange = (newLocale: Language) => {
        router.push(pathname, { locale: newLocale });
        setShowProfileMenu(false);
        setView('main');
    };

    const handleLogOut = async () => {
        await supabase.auth.signOut();
        setShowProfileMenu(false);
        router.push('/');
    };

    const getRoleLabel = (role: string | undefined) => {
        switch (role) {
            case 'admin': return t('admin');
            case 'trainer': return t('trainer');
            default: return t('athlete');
        }
    };

    const getRoleIcon = (role: string | undefined) => {
        switch (role) {
            case 'admin': return <ShieldCheck size={12} className="text-amber-500" />;
            case 'trainer': return <Users size={12} className="text-lime-500" />;
            default: return <User size={12} className="text-zinc-400" />;
        }
    };

    return (
        <AnimatePresence>
            {showProfileMenu && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { setShowProfileMenu(false); setView('main'); }}
                        className="fixed inset-0 z-[100] bg-black/20 dark:bg-black/40 backdrop-blur-[2px]"
                    />

                    {/* Menu Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="absolute right-0 mt-3 w-72 bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[28px] shadow-2xl z-[101] overflow-hidden p-2"
                    >
                        {/* User Header */}
                        <div className="px-4 py-4 mb-2 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-[22px] border border-zinc-100 dark:border-zinc-800/50">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-lime-400 flex items-center justify-center text-zinc-900 font-black text-lg shadow-lg shadow-lime-400/20 ring-2 ring-white dark:ring-zinc-800">
                                    {activeUser?.avatar ? (
                                        <img
                                            src={activeUser.avatar}
                                            alt={activeUser?.name || 'User'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        activeUser?.name?.charAt(0).toUpperCase() || 'U'
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-zinc-900 dark:text-white truncate max-w-[160px]">
                                        {activeUser?.name || t('userProfile')}
                                    </span>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-zinc-800 rounded-full border border-zinc-100 dark:border-zinc-700 shadow-sm">
                                            {getRoleIcon(activeUser?.role)}
                                            <span className="text-[10px] font-black uppercase tracking-tight text-zinc-500 dark:text-zinc-400">
                                                {getRoleLabel(activeUser?.role)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-0.5">
                            <AnimatePresence mode="wait">
                                {view === 'main' ? (
                                    <motion.div
                                        key="main-view"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {/* PWA Install */}
                                        {deferredPrompt && !isInstalled && (
                                            <button
                                                onClick={handleInstallClick}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black bg-lime-400 text-zinc-900 hover:bg-lime-500 rounded-[18px] transition-all mb-2 shadow-lg shadow-lime-400/20 active:scale-[0.98]"
                                            >
                                                <Download size={18} />
                                                <span className="flex-1 text-left">{t('installApp')}</span>
                                                <ChevronRight size={14} className="opacity-50" />
                                            </button>
                                        )}

                                        <SectionTitle label={t('title')} />

                                        <div className="px-2 pb-3 pt-1">
                                            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-[16px] relative">
                                                <button
                                                    onClick={() => resolvedTheme !== 'light' && toggleTheme()}
                                                    className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black transition-colors duration-200 z-10 ${
                                                        resolvedTheme === 'light' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-400'
                                                    }`}
                                                >
                                                    <Sun size={14} className={resolvedTheme === 'light' ? 'text-amber-500' : ''} />
                                                    {t('themeLight')}
                                                    {resolvedTheme === 'light' && (
                                                        <motion.div
                                                            layoutId="activeTheme"
                                                            className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-[12px] shadow-sm -z-10"
                                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                                        />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => resolvedTheme !== 'dark' && toggleTheme()}
                                                    className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black transition-colors duration-200 z-10 ${
                                                        resolvedTheme === 'dark' ? 'text-white' : 'text-zinc-500 hover:text-zinc-400'
                                                    }`}
                                                >
                                                    <Moon size={14} className={resolvedTheme === 'dark' ? 'text-indigo-400' : ''} />
                                                    {t('themeDark')}
                                                    {resolvedTheme === 'dark' && (
                                                        <motion.div
                                                            layoutId="activeTheme"
                                                            className="absolute inset-0 bg-white dark:bg-zinc-700 rounded-[12px] shadow-sm -z-10"
                                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                                        />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <MenuButton
                                            icon={<Globe size={18} className="text-blue-500" />}
                                            label={t('language')}
                                            value={locale.toUpperCase()}
                                            onClick={() => setView('language')}
                                            showChevron
                                        />

                                        <div className="my-2 h-px bg-zinc-100 dark:bg-zinc-800 mx-2" />

                                        <MenuButton
                                            icon={<QrCode size={18} className="text-lime-500" />}
                                            label={t('myId')}
                                            href="/profile/my-id"
                                            onClick={() => setShowProfileMenu(false)}
                                            showChevron
                                        />

                                        <MenuButton
                                            icon={<Settings size={18} className="text-zinc-500" />}
                                            label={t('editProfile')}
                                            href="/profile/edit"
                                            onClick={() => setShowProfileMenu(false)}
                                            showChevron
                                        />

                                        <MenuButton
                                            icon={<Users size={18} className="text-lime-600 dark:text-lime-400" />}
                                            label={t('trainerPanel')}
                                            href="/trainer"
                                            onClick={() => setShowProfileMenu(false)}
                                            variant="premium"
                                            showChevron
                                        />

                                        <div className="my-2 h-px bg-zinc-100 dark:bg-zinc-800 mx-2" />

                                        <button
                                            onClick={handleLogOut}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[18px] transition-all active:scale-[0.98]"
                                        >
                                            <LogOut size={18} />
                                            <span className="flex-1 text-left">{t('logout')}</span>
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="lang-view"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <div className="flex items-center gap-2 px-2 pb-2">
                                            <button
                                                onClick={() => setView('main')}
                                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <span className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">
                                                {t('selectLanguage')}
                                            </span>
                                        </div>

                                        {[
                                            { id: 'pt', label: 'Português', flag: '🇧🇷' },
                                            { id: 'en', label: 'English', flag: '🇺🇸' },
                                            { id: 'es', label: 'Español', flag: '🇪🇸' }
                                        ].map((lang) => (
                                            <button
                                                key={lang.id}
                                                onClick={() => handleLanguageChange(lang.id as Language)}
                                                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-black rounded-[18px] transition-all mb-0.5 active:scale-[0.98] ${locale === lang.id
                                                    ? 'bg-lime-400/10 text-lime-600 dark:text-lime-400'
                                                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{lang.flag}</span>
                                                    <span>{lang.label}</span>
                                                </div>
                                                {locale === lang.id && (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                        <Check size={18} strokeWidth={3} />
                                                    </motion.div>
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

/* --- Internal Components --- */

const SectionTitle = ({ label }: { label: string }) => (
    <div className="px-4 py-2">
        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] italic">
            {label}
        </p>
    </div>
);

interface MenuButtonProps {
    icon: React.ReactNode;
    label: string;
    value?: string;
    onClick?: () => void;
    href?: string;
    showChevron?: boolean;
    variant?: 'default' | 'premium';
}

const MenuButton = ({
    icon,
    label,
    value,
    onClick,
    href,
    showChevron,
    variant = 'default'
}: MenuButtonProps) => {
    const content = (
        <>
            <div className="flex-shrink-0">
                {icon}
            </div>
            <span className="flex-1 text-left">{label}</span>
            {value && (
                <span className="text-[10px] font-black bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded-full text-zinc-600 dark:text-zinc-400">
                    {value}
                </span>
            )}
            {showChevron && (
                <ChevronRight
                    size={14}
                    className={`opacity-20 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${variant === 'premium' ? 'text-white dark:text-black' : ''
                        }`}
                />
            )}
        </>
    );

    const className = `w-full flex items-center gap-3 px-4 py-3 text-sm font-black rounded-[18px] transition-all mb-0.5 group active:scale-[0.98] ${variant === 'premium'
        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-white/5'
        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300'
        }`;

    if (href) {
        return (
            <Link href={href as any} onClick={onClick} className={className}>
                {content}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={className}>
            {content}
        </button>
    );
};

export default ProfileMenu;