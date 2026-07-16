'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Sparkles } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
    "Sem atalhos, apenas constância.",
    "Sua única competição é quem você foi ontem.",
    "Cada repetição aproxima você do seu objetivo.",
    "Foco no processo, o resultado é consequência.",
    "Disciplina é fazer o que precisa ser feito.",
    "Treine a sua mente e o seu corpo acompanhará.",
    "O melhor treino é aquele que você faz."
];

export function AppSplashScreen({ onFinish }: { onFinish?: () => void }) {
    const [quote, setQuote] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Pick random motivational quote
        const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
        setQuote(randomQuote);

        // Hide splash screen after 1.8s
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onFinish) onFinish();
        }, 1800);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                    className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-between p-8 text-white select-none overflow-hidden"
                >
                    {/* Background Neon Glows */}
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="w-full flex justify-end">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-lime-400" /> Offline Native Engine
                        </span>
                    </div>

                    {/* Central Brand & Animation */}
                    <div className="flex flex-col items-center justify-center text-center my-auto">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="relative mb-6"
                        >
                            <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center shadow-2xl relative z-10">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                >
                                    <Dumbbell className="w-12 h-12 text-lime-400 stroke-[2.2]" />
                                </motion.div>
                            </div>
                            <div className="absolute -inset-3 bg-gradient-to-tr from-lime-500/20 to-emerald-500/20 rounded-[32px] blur-xl -z-10" />
                        </motion.div>

                        <motion.h1
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="text-3xl font-extrabold tracking-tight text-white mb-2"
                        >
                            Gym<span className="text-lime-400">Aux</span>
                        </motion.h1>

                        {/* Motivational Quote */}
                        <motion.p
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.35, duration: 0.4 }}
                            className="text-zinc-400 text-xs sm:text-sm font-medium italic max-w-xs px-4"
                        >
                            "{quote}"
                        </motion.p>
                    </div>

                    {/* Progress Bar & Footer */}
                    <div className="w-full max-w-xs flex flex-col items-center gap-3">
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-800/50">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.6, ease: "easeInOut" }}
                                className="h-full bg-gradient-to-r from-lime-500 to-emerald-400 shadow-[0_0_12px_rgba(163,230,53,0.5)]"
                            />
                        </div>

                        <span className="text-[11px] text-zinc-500 font-mono tracking-wider">
                            MEU TREINO DIÁRIO
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
