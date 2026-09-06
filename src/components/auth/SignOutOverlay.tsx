'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, CloudUpload, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type SignOutStep = 'syncing' | 'clearing' | 'signing_out' | 'redirecting';

interface SignOutOverlayProps {
    isOpen: boolean;
    step: SignOutStep;
    pendingCount?: number;
}

export const SignOutOverlay: React.FC<SignOutOverlayProps> = ({
    isOpen,
    step,
    pendingCount = 0
}) => {
    const t = useTranslations('ProfileMenu');

    if (!isOpen) return null;

    const getStepDetails = () => {
        switch (step) {
            case 'syncing':
                return {
                    icon: <CloudUpload className="w-5 h-5 text-lime-400 animate-pulse" />,
                    text: t('signoutSyncing'),
                    badge: pendingCount > 0 ? `${pendingCount} item(s)` : null,
                    progress: 25
                };
            case 'clearing':
                return {
                    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
                    text: t('signoutClearing'),
                    badge: null,
                    progress: 60
                };
            case 'signing_out':
                return {
                    icon: <LogOut className="w-5 h-5 text-zinc-300" />,
                    text: t('signoutDisconnecting'),
                    badge: null,
                    progress: 85
                };
            case 'redirecting':
                return {
                    icon: <ArrowRight className="w-5 h-5 text-lime-400 animate-bounce" />,
                    text: t('signoutRedirecting'),
                    badge: null,
                    progress: 100
                };
        }
    };

    const currentStepDetails = getStepDetails();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[99999] bg-zinc-950/85 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-white select-none pointer-events-auto cursor-wait"
                role="dialog"
                aria-modal="true"
                aria-labelledby="signout-overlay-title"
            >
                {/* Background Ambient Glows */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Central Card */}
                <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-sm bg-zinc-900/90 border border-zinc-800/80 rounded-3xl p-7 shadow-2xl shadow-black/80 flex flex-col items-center text-center overflow-hidden"
                >
                    {/* Top Glow Accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-80" />

                    {/* Animated Icon Circle */}
                    <div className="relative mb-5">
                        <div className="w-20 h-20 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center shadow-inner relative z-10">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            >
                                <LogOut className="w-9 h-9 text-lime-400" />
                            </motion.div>
                        </div>
                        {/* Outer Pulse */}
                        <div className="absolute -inset-1 rounded-2xl bg-lime-400/20 blur-md animate-pulse" />
                    </div>

                    {/* Title & Subtitle */}
                    <h2
                        id="signout-overlay-title"
                        className="text-xl font-bold text-zinc-100 tracking-tight mb-1 flex items-center justify-center gap-2"
                    >
                        {t('signingOutTitle')}
                    </h2>
                    <p className="text-xs text-zinc-400 font-medium mb-6 max-w-[260px]">
                        {t('signingOutSubtitle')}
                    </p>

                    {/* Step Status Card */}
                    <div className="w-full bg-zinc-950/60 border border-zinc-800/60 rounded-2xl p-4 mb-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/40 flex items-center justify-center shrink-0">
                            {currentStepDetails.icon}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-xs font-semibold text-zinc-200 truncate">
                                {currentStepDetails.text}
                            </p>
                            {currentStepDetails.badge && (
                                <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-lime-400/10 text-lime-400 border border-lime-400/20">
                                    {currentStepDetails.badge}
                                </span>
                            )}
                        </div>
                        <Loader2 className="w-4 h-4 text-lime-400 animate-spin shrink-0" />
                    </div>

                    {/* Fluid Progress Bar */}
                    <div className="w-full bg-zinc-800/50 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-lime-500 to-emerald-400 rounded-full"
                            initial={{ width: '10%' }}
                            animate={{ width: `${currentStepDetails.progress}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                    </div>

                    {/* Security Micro Badge */}
                    <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                        <Sparkles className="w-3 h-3 text-lime-400" />
                        <span>GymAux Data Protection</span>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
