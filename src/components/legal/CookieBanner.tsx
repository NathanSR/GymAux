'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cookie, Settings, Check, X } from 'lucide-react';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export const CookieBanner: React.FC = () => {
    const { consent, acceptAll, rejectOptional, openModal } = useCookieConsent();
    const t = useTranslations('CookieBanner');

    // Se já decidiu, não exibe o banner flutuante
    if (consent.status !== 'undecided') {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 z-[999] p-4 md:p-6"
            >
                <div className="max-w-6xl mx-auto bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 md:p-6 shadow-[0_-10px_50px_rgba(0,0,0,0.9)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
                    {/* Efeito Glow de Fundo */}
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Texto & Conteúdo */}
                    <div className="flex items-start gap-4 max-w-3xl relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0 mt-0.5">
                            <Cookie className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                                    {t('title')}
                                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        <ShieldCheck className="w-3 h-3" /> LGPD Compliant
                                    </span>
                                </h3>
                            </div>
                            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                                {t('description')}{' '}
                                <Link
                                    href="/privacy"
                                    className="text-brand hover:underline font-semibold"
                                >
                                    {t('privacyLink')}
                                </Link>{' '}
                                {t('and')}{' '}
                                <Link
                                    href="/cookies"
                                    className="text-brand hover:underline font-semibold"
                                >
                                    {t('cookiesLink')}
                                </Link>.
                            </p>
                        </div>
                    </div>

                    {/* Ações / Botões */}
                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0 relative z-10">
                        <button
                            onClick={openModal}
                            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-brand/40 hover:bg-white/10 text-zinc-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <Settings className="w-3.5 h-3.5" />
                            {t('customizeBtn')}
                        </button>

                        <button
                            onClick={rejectOptional}
                            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <X className="w-3.5 h-3.5" />
                            {t('essentialOnlyBtn')}
                        </button>

                        <button
                            onClick={acceptAll}
                            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-brand text-black font-extrabold text-xs hover:bg-brand/90 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_25px_rgba(204,255,0,0.5)] flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wider"
                        >
                            <Check className="w-4 h-4 stroke-[3]" />
                            {t('acceptAllBtn')}
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
