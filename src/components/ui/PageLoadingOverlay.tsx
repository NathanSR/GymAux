'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Home, CheckCircle2, Sparkles, ArrowLeftRight } from 'lucide-react';

export type LoadingIconType = 'dumbbell' | 'home' | 'session' | 'check' | 'sparkles';

interface PageLoadingOverlayProps {
    isOpen: boolean;
    title: string;
    subtext?: string;
    iconType?: LoadingIconType;
}

export function PageLoadingOverlay({
    isOpen,
    title,
    subtext,
    iconType = 'dumbbell'
}: PageLoadingOverlayProps) {
    const renderIcon = () => {
        switch (iconType) {
            case 'home':
                return <Home className="w-9 h-9 text-lime-500 dark:text-lime-400 stroke-[2.2]" />;
            case 'check':
                return <CheckCircle2 className="w-9 h-9 text-lime-500 dark:text-lime-400 stroke-[2.2]" />;
            case 'sparkles':
                return <Sparkles className="w-9 h-9 text-lime-500 dark:text-lime-400 stroke-[2.2]" />;
            case 'session':
                return <ArrowLeftRight className="w-9 h-9 text-lime-500 dark:text-lime-400 stroke-[2.2]" />;
            case 'dumbbell':
            default:
                return <Dumbbell className="w-9 h-9 text-lime-500 dark:text-lime-400 stroke-[2.2]" />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
                    className="fixed inset-0 z-[9990] flex flex-col items-center justify-center p-6 bg-white/80 dark:bg-zinc-950/85 backdrop-blur-2xl pointer-events-auto select-none touch-none transition-colors duration-300 overflow-hidden font-sans"
                >
                    {/* Background Neon Glows */}
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-500/15 dark:bg-lime-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />

                    {/* Central Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-sm bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[36px] p-8 shadow-2xl shadow-lime-500/10 backdrop-blur-3xl flex flex-col items-center text-center space-y-6"
                    >
                        {/* Glowing Icon Container */}
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.06, 1] }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                className="w-20 h-20 rounded-[28px] bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center shadow-md relative z-10"
                            >
                                <motion.div
                                    animate={iconType === 'dumbbell' ? { rotate: [0, -12, 12, 0] } : { scale: [0.95, 1.05, 0.95] }}
                                    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                                >
                                    {renderIcon()}
                                </motion.div>
                            </motion.div>

                            {/* Aura Glow Behind Icon */}
                            <div className="absolute -inset-2 bg-gradient-to-tr from-lime-500/30 to-emerald-500/30 rounded-[32px] blur-lg -z-0 animate-pulse" />
                        </div>

                        {/* Text Content */}
                        <div className="space-y-2">
                            <motion.h3
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                className="text-xl sm:text-2xl font-black italic uppercase tracking-tight text-zinc-900 dark:text-white"
                            >
                                {title}
                            </motion.h3>

                            {subtext && (
                                <motion.p
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.18, duration: 0.3 }}
                                    className="text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400 max-w-[260px] mx-auto leading-relaxed"
                                >
                                    {subtext}
                                </motion.p>
                            )}
                        </div>

                        {/* Progress Indicator */}
                        <div className="w-full space-y-3 pt-2">
                            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-full overflow-hidden relative border border-zinc-200/40 dark:border-zinc-800/40">
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                                    className="h-full w-2/3 bg-gradient-to-r from-lime-500 via-lime-400 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(163,230,53,0.6)]"
                                />
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500" />
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-lime-600 dark:text-lime-400">
                                    GymAux Engine
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
