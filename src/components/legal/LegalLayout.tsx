'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Printer, Cookie, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';
import Footer from '@/components/initial/Footer';

interface Section {
    id: string;
    title: string;
}

interface LegalLayoutProps {
    title: string;
    subtitle: string;
    updatedAt: string;
    badgeText: string;
    tldrTitle?: string;
    tldrSummary?: string[];
    sections: Section[];
    children: React.ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
    title,
    subtitle,
    updatedAt,
    badgeText,
    tldrTitle,
    tldrSummary,
    sections,
    children,
}) => {
    const { openModal } = useCookieConsent();
    const { goBack } = useSmartNavigation({ fallbackUrl: '/' });
    const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200;
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-200 selection:bg-brand selection:text-black flex flex-col justify-between font-sans">
            {/* Header Fixo de Navegação */}
            <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => goBack()}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-brand transition-colors group cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Voltar
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={openModal}
                            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-brand/40 text-xs font-bold text-zinc-300 hover:text-white transition-all"
                        >
                            <Cookie className="w-3.5 h-3.5 text-brand" />
                            Preferências de Cookies
                        </button>

                        <button
                            onClick={handlePrint}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                            title="Imprimir Documento"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
                {/* Hero Topo */}
                <div className="mb-12 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-extrabold uppercase tracking-widest">
                        <Shield className="w-3.5 h-3.5" />
                        {badgeText}
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white italic uppercase">
                            {title}
                        </h1>
                        <p className="text-zinc-400 text-sm md:text-base max-w-3xl leading-relaxed">
                            {subtitle}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 pt-2 border-t border-white/5">
                        <span>Última atualização: <strong className="text-zinc-300">{updatedAt}</strong></span>
                        <span>•</span>
                        <span>Aplicabilidade: <strong className="text-zinc-300">Global / Brasil (LGPD)</strong></span>
                    </div>
                </div>

                {/* Card TL;DR / Resumo Executivo */}
                {tldrSummary && tldrSummary.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-brand/10 via-white/5 to-transparent border border-brand/20 relative overflow-hidden"
                    >
                        <div className="space-y-4 relative z-10">
                            <h2 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-brand" />
                                {tldrTitle || 'Resumo Executivo (TL;DR em Linguagem Simples)'}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-zinc-300">
                                {tldrSummary.map((item, index) => (
                                    <div key={index} className="flex items-start gap-2.5 bg-black/40 p-3 rounded-xl border border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-1.5" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Grid Layout: Sidebar TOC + Conteúdo das Seções */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Sidebar índice no Desktop */}
                    <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4 p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 italic flex items-center gap-2">
                            <FileText className="w-4 h-4 text-brand" /> Índice do Documento
                        </h3>
                        <nav className="space-y-1">
                            {sections.map((section) => {
                                const isActive = activeSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollTo(section.id)}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${isActive
                                                ? 'bg-brand/15 text-brand border border-brand/30'
                                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="truncate">{section.title}</span>
                                        {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="pt-4 border-t border-white/5 text-[11px] text-zinc-500 space-y-2">
                            <p>Dúvidas de privacidade?</p>
                            <a
                                href="mailto:privacidade@gymaux.app"
                                className="text-brand hover:underline font-bold block"
                            >
                                privacidade@gymaux.app
                            </a>
                        </div>
                    </aside>

                    {/* Conteúdo dos Artigos */}
                    <div className="lg:col-span-8 space-y-10">
                        {children}
                    </div>
                </div>
            </main>

            {/* Rodapé Padrão do App */}
            <Footer />
        </div>
    );
};
