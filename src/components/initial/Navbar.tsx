'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Menu, X } from 'lucide-react';

export default function Navbar() {
    const t = useTranslations('Marketing');
    const [hasAccount, setHasAccount] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { label: t('Navbar.features'), href: '#features' },
        { label: t('Navbar.pricing'), href: '#pricing' },
        { label: t('Navbar.faq'), href: '#faq' },
    ];

    React.useEffect(() => {
        const storedFlag = localStorage.getItem('gymaux_has_account');
        if (storedFlag === 'true') {
            setHasAccount(true);
        }
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-center">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-7xl w-full flex items-center justify-between px-6 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            >
                <Link href="#hero" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center transform transition-transform group-hover:rotate-12">
                        <Dumbbell className="w-6 h-6 text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic text-zinc-100 pb-1">GymAux</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-bold text-zinc-400 hover:text-brand transition-all uppercase tracking-wider relative group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-6">
                    {!hasAccount && (
                        <Link href="/login" className="text-sm font-black hover:text-brand transition-all duration-300 text-zinc-100 uppercase tracking-widest">
                            {t('Navbar.login')}
                        </Link>
                    )}
                    <Link
                        href={hasAccount ? "/login" : "/register"}
                        className="px-8 py-3 rounded-xl bg-brand font-black text-xs text-black transition-all hover:scale-105 active:scale-95 shadow-[0_8px_30px_-12px_#ccff00] uppercase tracking-widest flex items-center gap-2"
                    >
                        {hasAccount ? t('Navbar.login') : t('Navbar.getStarted')}
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-zinc-400 hover:text-brand transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-20 left-6 right-6 p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col gap-6 md:hidden overflow-hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-lg font-medium text-zinc-400 border-b border-white/5 pb-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-4 pt-2">
                            <Link
                                href="/login"
                                className="w-full py-4 text-center font-bold text-zinc-400 border border-white/10 rounded-xl"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('Navbar.login')}
                            </Link>
                            <Link
                                href="/register"
                                className="w-full py-4 text-center font-bold bg-brand text-black rounded-xl shadow-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('Navbar.getStarted').toUpperCase()}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
