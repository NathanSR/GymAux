'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Menu, X } from 'lucide-react';

export default function Navbar() {
    const t = useTranslations('Marketing');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '#features', label: t('Navbar.features') },
        { href: '#pricing', label: t('Navbar.pricing') },
        { href: '#faq', label: t('Navbar.faq') },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-center">
            <motion.nav 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-7xl w-full flex items-center justify-between px-6 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold tracking-tighter uppercase italic text-zinc-100">GymAux</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-zinc-400 hover:text-brand transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:text-brand transition-colors transition-all duration-300 text-zinc-100">
                        {t('Navbar.login')}
                    </Link>
                    <Link
                        href="/register"
                        className="px-5 py-2 rounded-xl bg-brand font-bold text-xs text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_-10px_#ccff00] uppercase"
                    >
                        {t('Navbar.getStarted')}
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-zinc-400 hover:text-brand transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
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
                                href="/auth/login"
                                className="w-full py-4 text-center font-bold text-zinc-400 border border-white/10 rounded-xl"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('Navbar.login')}
                            </Link>
                            <Link
                                href="/auth/register"
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
