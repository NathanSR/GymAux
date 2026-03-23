'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { Dumbbell, Plus } from 'lucide-react';

export default function SessionControlSection() {
    const t = useTranslations('Marketing');

    return (
        <section className="max-w-7xl mx-auto py-32 px-6 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 100 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-brand rounded-[3rem] p-8 md:p-20 flex flex-col lg:flex-row items-center gap-16 relative group"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 blur-[100px] rounded-full group-hover:translate-x-10 group-hover:-translate-y-10 transition-transform duration-1000" />

                <div className="flex-1 flex flex-col items-start gap-8 relative z-10 text-black">
                    <motion.span
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-black italic uppercase tracking-[0.3em] text-[10px] opacity-70"
                    >
                        {t('SessionControl.title')}
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85]"
                    >
                        {t('SessionControl.subtitle')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-black/70 text-lg md:text-xl font-medium max-w-md leading-relaxed"
                    >
                        {t('Bento.pwaReady.description')}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-black text-brand rounded-2xl font-black italic uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl inline-block"
                        >
                            {t('Hero.getStarted').toUpperCase()}
                        </Link>
                    </motion.div>
                </div>

                {/* Interactive Widget Mockup */}
                <motion.div
                    initial={{ x: 150, opacity: 0, rotate: 5 }}
                    whileInView={{ x: 0, opacity: 1, rotate: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 1.2, delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 w-full max-w-md relative z-10"
                >
                    <div className="bg-black/95 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.4)] flex flex-col gap-8 group/card">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center">
                                    <Dumbbell className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black uppercase italic tracking-tight">{t('SessionControl.card.title')}</h4>
                                    <div className="text-[10px] font-bold text-brand tracking-widest uppercase">{t('Bento.trainerManagement.badge')}</div>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500">
                                <Plus className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('SessionControl.card.weight')}</label>
                                <div className="h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-3xl font-black text-white italic transition-all group-hover/card:border-brand/40">140</div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t('SessionControl.card.reps')}</label>
                                <div className="h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-3xl font-black text-white italic transition-all group-hover/card:border-brand/40">5</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 py-4 bg-brand text-black font-black italic uppercase text-xs rounded-xl tracking-widest shadow-[0_10px_30px_-5px_#ccff0088]">{t('SessionControl.card.checkIn')}</button>
                            <button className="px-6 py-4 bg-white/5 border border-white/10 text-white font-black italic uppercase text-xs rounded-xl tracking-widest hover:bg-white/10 transition-all">{t('SessionControl.card.checkOut')}</button>
                        </div>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute -z-10 -bottom-6 -left-6 w-full h-full border-2 border-black/10 rounded-3xl" />
                </motion.div>
            </motion.div>
        </section>
    );
}
