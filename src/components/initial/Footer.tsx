'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { Dumbbell, Sparkles, Sun, Moon, Languages, Check, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
    const t = useTranslations('Marketing');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const { toggleTheme, resolvedTheme } = useTheme();

    const [isLangOpen, setIsLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    const handleLanguageChange = (newLocale: string) => {
        router.push(pathname, { locale: newLocale });
        setIsLangOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const languageOptions = [
        { id: 'pt', label: 'Português' },
        { id: 'en', label: 'English' },
        { id: 'es', label: 'Español' }
    ];

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1 }}
            className="bg-[#050505] dark:bg-black/80 backdrop-blur-xl border-t border-white/5 pt-20 pb-10 px-6 relative z-10"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 mb-20 relative z-20">
                <div className="md:col-span-4 space-y-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                            <Dumbbell className="w-5 h-5 text-black" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold tracking-tighter uppercase italic text-zinc-100">GymAux</span>
                    </div>
                    <p className="text-zinc-500 font-medium leading-relaxed max-w-sm">
                        {t('Footer.description')}
                    </p>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <h4 className="text-[10px] font-black tracking-widest uppercase text-zinc-500 italic">{t('Footer.platform.title')}</h4>
                    <ul className="space-y-4 font-bold text-sm text-zinc-400">
                        <li><Link href="#features" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.platform.features')}</Link></li>
                        <li><Link href="#pricing" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.platform.pricing')}</Link></li>
                        <li><Link href="#" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.platform.trainerDashboard')}</Link></li>
                        <li><Link href="#" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.platform.webApp')}</Link></li>
                    </ul>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <h4 className="text-[10px] font-black tracking-widest uppercase text-zinc-500 italic">{t('Footer.company.title')}</h4>
                    <ul className="space-y-4 font-bold text-sm text-zinc-400">
                        <li><Link href="#" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.company.about')}</Link></li>
                        <li><Link href="#" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.company.support')}</Link></li>
                        <li><Link href="#" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.company.privacy')}</Link></li>
                        <li><Link href="#" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.company.terms')}</Link></li>
                    </ul>
                </div>

                <div className="md:col-span-4 flex flex-col items-start md:items-end gap-6 text-left md:text-right">
                    <div className="text-[10px] font-black tracking-widest uppercase text-zinc-500 italic pb-2 border-b border-white/5 w-full">SOCIALS</div>
                    <div className="flex gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:border-brand/40 transition-colors flex items-center justify-center text-zinc-500 hover:text-brand cursor-pointer shadow-lg"
                            >
                                <Sparkles className="w-5 h-5" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5 relative z-30">
                <span className="text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase text-center md:text-left mt-4 md:mt-0">
                    © 2026 GYMAUX - {t('Footer.rights')}
                </span>

                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    {/* Selectors Block */}
                    <div className="flex items-center justify-center gap-3">
                        {/* Theme Toggler */}
                        <button
                            onClick={toggleTheme}
                            title={resolvedTheme === 'dark' ? t('Footer.themeLight') : t('Footer.themeDark')}
                            className="flex items-center justify-center p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-brand/40 hover:bg-white/10 transition-colors text-zinc-400 hover:text-brand shadow-[0_0_15px_rgba(255,255,255,0.02)] active:scale-95"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {resolvedTheme === 'dark' ? (
                                    <motion.div
                                        key="dark"
                                        initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Moon className="w-4 h-4" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="light"
                                        initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Sun className="w-4 h-4" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>

                        {/* Language Selector */}
                        <div className="relative" ref={langRef}>
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                title={t('Footer.language')}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-brand/40 hover:bg-white/10 transition-colors text-zinc-400 hover:text-brand font-bold uppercase tracking-widest text-[10px] shadow-[0_0_15px_rgba(255,255,255,0.02)] active:scale-95"
                            >
                                <Languages className="w-4 h-4" />
                                {locale}
                                <ChevronUp className={`w-3 h-3 transition-transform ${isLangOpen ? '' : 'rotate-180'}`} />
                            </button>
                            
                            <AnimatePresence>
                                {isLangOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute bottom-full right-0 mb-3 w-40 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-[100]"
                                    >
                                        {languageOptions.map((lang) => (
                                            <button
                                                key={lang.id}
                                                onClick={() => handleLanguageChange(lang.id)}
                                                className={`px-4 py-3 text-xs font-bold text-left transition-all flex items-center justify-between ${
                                                    locale === lang.id 
                                                        ? 'bg-brand/10 text-brand border-l-2 border-brand' 
                                                        : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300 border-l-2 border-transparent'
                                                }`}
                                            >
                                                {lang.label}
                                                {locale === lang.id && <Check className="w-3 h-3" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-2 text-zinc-600 font-bold text-[10px] tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                        SERVER STATUS: OPERATIONAL
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}
