'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { ArrowRight, Play, TrendingUp, Calendar, Timer } from 'lucide-react';

export default function HeroSection() {
    const t = useTranslations('Marketing');

    return (
        <section className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8 mb-32 pt-32 px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold tracking-[0.2em] uppercase"
            >
                {t('Stats.uptime')} - 99.9%
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-8xl font-black tracking-tighter max-w-4xl italic uppercase leading-[0.9] text-zinc-100"
            >
                {t('Hero.title').split(' ').map((word, i) => (
                    <span key={i} className={word.toLowerCase().includes('controle') || word.toLowerCase().includes('control') ? 'text-brand' : ''}>
                        {word}{' '}
                    </span>
                ))}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed"
            >
                {t('Hero.subtitle')}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto text-zinc-100"
            >
                <Link
                    href="/register"
                    className="bg-brand text-black px-10 py-5 rounded-2xl font-black text-sm tracking-wide shadow-[0_0_30px_-10px_#ccff00] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                    {t('Hero.getStarted').toUpperCase()}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                {/* <Link
                    href="#"
                    className="px-10 py-5 rounded-2xl border border-white/10 font-bold text-sm tracking-wide hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                    <Play className="w-4 h-4 fill-current" />
                    {t('Hero.freeDemo').toUpperCase()}
                </Link> */}
            </motion.div>

            {/* Dashboard Preview / Floating elements */}
            <motion.div
                initial={{ opacity: 0, y: 150, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                className="relative w-full aspect-video md:aspect-[21/9] max-w-6xl mt-12 group rounded-3xl overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-brand/10 group-hover:bg-brand/5 transition-colors duration-700" />
                <div className="w-full h-full bg-zinc-900 border border-white/10 rounded-3xl p-4 md:p-8 flex flex-col gap-6 relative overflow-hidden shadow-2xl">
                    {/* App Grid Mockup */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-white/10" />
                            <div className="w-3 h-3 rounded-full bg-white/10" />
                            <div className="w-3 h-3 rounded-full bg-white/10" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-4 rounded bg-white/5" />
                            <div className="w-8 h-8 rounded-full bg-white/10" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-grow opacity-50">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col gap-2">
                                <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-brand" />
                                </div>
                                <div className="w-full h-3 rounded bg-white/10 mt-2" />
                                <div className="w-2/3 h-3 rounded bg-white/5" />
                            </div>
                        ))}
                        <div className="col-span-2 lg:col-span-3 bg-white/5 rounded-2xl border border-white/5 p-4 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-zinc-500" />
                                    <div className="w-32 h-4 rounded bg-white/10" />
                                </div>
                                <div className="w-20 h-8 rounded-lg bg-white/5" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="w-full h-12 rounded-xl bg-white/5 border border-white/5" />
                                <div className="w-full h-12 rounded-xl bg-white/5 border border-white/5" />
                            </div>
                        </div>
                        <div className="bg-brand rounded-2xl p-4 flex flex-col items-center justify-center text-black font-black">
                            <Timer className="w-8 h-8 mb-2" />
                            <span className="text-xl">45:20</span>
                        </div>
                    </div>

                    {/* Floating "Next Gen" card overlay */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-8 py-4 bg-brand rounded-2xl shadow-[0_0_50px_rgba(204,255,0,0.3)]"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <span className="text-black font-black italic uppercase tracking-wider">{t('WhyGymAux.title')}</span>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
