'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { Dumbbell, ArrowRight } from 'lucide-react';

export default function CTASection() {
    const t = useTranslations('Marketing');

    return (
        <section className="max-w-7xl mx-auto py-20 px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1, type: "spring", bounce: 0.3 }}
                className="relative rounded-[4rem] bg-brand p-12 md:p-24 overflow-hidden flex flex-col items-center text-center gap-10 group"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.4),transparent)] opacity-40" />

                {/* Interactive floating logos behind text */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <motion.div
                            key={i}
                            className="absolute text-black"
                            animate={{
                                y: [Math.random() * 100, Math.random() * -100],
                                x: [Math.random() * 100, Math.random() * -100],
                                rotate: [0, 360]
                            }}
                            transition={{ duration: 10 + i, repeat: Infinity, ease: "linear" }}
                            style={{
                                top: `${Math.random() * 80}%`,
                                left: `${Math.random() * 80}%`
                            }}
                        >
                            <Dumbbell className="w-24 h-24" />
                        </motion.div>
                    ))}
                </div>

                <div className="relative z-10 space-y-4">
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8] text-black"
                    >
                        {t('CTA.title')}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-black/60 text-xl md:text-2xl font-bold italic uppercase tracking-tighter"
                    >
                        {t('CTA.subtitle')}
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Link
                        href="/auth/register"
                        className="relative z-10 px-16 py-6 bg-black text-brand font-black italic uppercase tracking-widest text-base rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 group/btn inline-flex"
                    >
                        {t('CTA.button')}
                        <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
