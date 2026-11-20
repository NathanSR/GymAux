'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';

const SPLASH_SESSION_KEY = 'gymaux_splash_shown';

export function AppSplashScreen({ onFinish }: { onFinish?: () => void }) {
    const t = useTranslations('SplashScreen');
    const pathname = usePathname();
    const [quote, setQuote] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Nunca bloqueia uma sessão de treino ativa nem repete o splash em reloads/navegações
        const isSessionRoute = pathname?.includes('/session/');
        const alreadyShown = sessionStorage.getItem(SPLASH_SESSION_KEY) === '1';

        if (isSessionRoute || alreadyShown) {
            if (onFinish) onFinish();
            return;
        }

        sessionStorage.setItem(SPLASH_SESSION_KEY, '1');

        let quotesArray: string[] = [];
        try {
            const rawQuotes = t.raw('quotes');
            if (Array.isArray(rawQuotes) && rawQuotes.length > 0) {
                quotesArray = rawQuotes;
            }
        } catch {
            quotesArray = [
                'Sem atalhos, apenas constância.',
                'Sua única competição é quem você foi ontem.',
            ];
        }

        const randomQuote = quotesArray[Math.floor(Math.random() * quotesArray.length)];
        setQuote(randomQuote);
        setIsVisible(true);

        // Rápido e fluido (350ms) apenas na primeira abertura da sessão
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onFinish) onFinish();
        }, 350);

        return () => clearTimeout(timer);
    }, [onFinish, t, pathname]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
                    className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-between p-8 text-white select-none overflow-hidden"
                >
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="w-full flex justify-end">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-lime-400" /> {t('engineLabel')}
                        </span>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center my-auto">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center shadow-2xl relative z-10">
                                <Dumbbell className="w-12 h-12 text-lime-400 stroke-[2.2]" />
                            </div>
                            <div className="absolute -inset-3 bg-gradient-to-tr from-lime-500/20 to-emerald-500/20 rounded-[32px] blur-xl -z-10" />
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                            Gym<span className="text-lime-400">Aux</span>
                        </h1>

                        {quote && (
                            <p className="text-zinc-400 text-xs sm:text-sm font-medium italic max-w-xs px-4">
                                &ldquo;{quote}&rdquo;
                            </p>
                        )}
                    </div>

                    <div className="w-full max-w-xs flex flex-col items-center gap-3">
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-800/50">
                            <motion.div
                                initial={{ width: '25%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-lime-500 to-emerald-400 shadow-[0_0_12px_rgba(163,230,53,0.5)]"
                            />
                        </div>

                        <span className="text-[11px] text-zinc-500 font-mono tracking-wider">
                            {t('subtitle')}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
