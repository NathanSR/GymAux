'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, BarChart3, Sliders, Cookie, X } from 'lucide-react';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Modal } from '@/components/ui/Modal';

export const CookieModal: React.FC = () => {
    const { consent, isModalOpen, closeModal, saveCustomConsent, acceptAll } = useCookieConsent();
    const t = useTranslations('CookieModal');

    const [analytics, setAnalytics] = useState(consent.categories.analytics);
    const [functional, setFunctional] = useState(consent.categories.functional);

    // Sincronizar estado local quando o modal é aberto ou o consentimento muda
    useEffect(() => {
        setAnalytics(consent.categories.analytics);
        setFunctional(consent.categories.functional);
    }, [consent, isModalOpen]);

    const handleSave = () => {
        saveCustomConsent({ analytics, functional });
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title=""
            maxWidth="max-w-2xl"
            zIndex="z-[1000]"
            className="bg-[#0c0c0e] text-white p-6 md:p-8 rounded-3xl overflow-hidden"
        >
            {/* Efeitos Visuais de Fundo */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative overflow-hidden flex flex-col max-h-[75vh] md:max-h-[70vh]">

                {/* Modal Header Customizado - FIXO NO TOPO */}
                <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10 shrink-0 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                            <Cookie className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                {t('title')}
                            </h2>
                            <p className="text-xs text-zinc-400">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Botão de Fechar */}
                    <button
                        type="button"
                        onClick={closeModal}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                        aria-label="Fechar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Conteúdo com SCROLL INTERNO (Explicação LGPD + Categorias de Cookies) */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-4 pr-1 relative z-10">
                    {/* Explicação LGPD */}
                    <div className="pb-4 border-b border-white/10 text-xs text-zinc-400 leading-relaxed space-y-2">
                        <p>
                            {t('lgpdDescription')}{' '}
                            <Link href="/privacy" className="text-brand hover:underline font-semibold" onClick={closeModal}>
                                {t('privacyPolicyLink')}
                            </Link>.
                        </p>
                    </div>

                    {/* Categorias de Cookies */}
                    <div className="space-y-4">
                        {/* 1. Essenciais */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-emerald-400" />
                                    <h3 className="text-sm font-bold text-white">{t('essentialTitle')}</h3>
                                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        {t('alwaysActive')}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {t('essentialDesc')}
                                </p>
                            </div>
                            <div className="opacity-50 shrink-0">
                                <div className="w-12 h-6 bg-emerald-500/20 border border-emerald-500/40 rounded-full relative p-1 flex items-center justify-end">
                                    <div className="w-4 h-4 rounded-full bg-emerald-400" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Analíticos */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4 hover:border-white/20 transition-colors">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-brand" />
                                    <h3 className="text-sm font-bold text-white">{t('analyticsTitle')}</h3>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {t('analyticsDesc')}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAnalytics(!analytics)}
                                className={`w-12 h-6 rounded-full transition-colors relative p-1 flex items-center shrink-0 border cursor-pointer ${analytics ? 'bg-brand/20 border-brand/50 justify-end' : 'bg-zinc-800 border-zinc-700 justify-start'
                                    }`}
                            >
                                <motion.div
                                    layout
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    className={`w-4 h-4 rounded-full ${analytics ? 'bg-brand shadow-[0_0_10px_rgba(204,255,0,0.8)]' : 'bg-zinc-500'}`}
                                />
                            </button>
                        </div>

                        {/* 3. Funcionais */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4 hover:border-white/20 transition-colors">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Sliders className="w-4 h-4 text-cyan-400" />
                                    <h3 className="text-sm font-bold text-white">{t('functionalTitle')}</h3>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {t('functionalDesc')}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFunctional(!functional)}
                                className={`w-12 h-6 rounded-full transition-colors relative p-1 flex items-center shrink-0 border cursor-pointer ${functional ? 'bg-cyan-500/20 border-cyan-500/50 justify-end' : 'bg-zinc-800 border-zinc-700 justify-start'
                                    }`}
                            >
                                <motion.div
                                    layout
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    className={`w-4 h-4 rounded-full ${functional ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-zinc-500'}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal Footer / Ações - FIXO NO RODAPÉ */}
                <div className="pt-5 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0 relative z-10">
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {t('lgpdProtected')}
                    </span>

                    <div className="flex items-center w-full sm:w-auto">
                        <button
                            onClick={handleSave}
                            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
                        >
                            {t('savePreferencesBtn')}
                        </button>
                        <button
                            onClick={acceptAll}
                            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-brand text-black font-extrabold text-xs hover:bg-brand/90 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] uppercase tracking-wider active:scale-95 cursor-pointer"
                        >
                            {t('acceptAllBtn')}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
