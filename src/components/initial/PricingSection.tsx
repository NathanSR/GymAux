'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { Check } from 'lucide-react';

export default function PricingSection() {
    const t = useTranslations('Marketing');

    const fadeInUp = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: false, amount: 0.3 },
        transition: { duration: 0.8, ease: "easeOut" }
    } as any;

    return (
        <section id="pricing" className="max-w-7xl mx-auto py-32 flex flex-col items-center gap-16 px-6">
            <div className="text-center flex flex-col items-center gap-4">
                <motion.span {...fadeInUp} className="text-brand font-black tracking-widest text-xs uppercase italic">{t('Pricing.title')}</motion.span>
                <motion.h2 {...fadeInUp} className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-zinc-100">{t('Pricing.subtitle')}</motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {/* Free Plan */}
                <motion.div
                    {...fadeInUp}
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between group hover:border-white/20 transition-all duration-300"
                >
                    <div>
                        <h3 className="text-xl font-black italic uppercase text-zinc-400 mb-6">{t('Pricing.plans.free.title')}</h3>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-black text-white italic tracking-tighter">R$0</span>
                            <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">/ MÊS</span>
                        </div>
                        <ul className="space-y-4">
                            {(t.raw('Pricing.plans.free.features') as string[]).map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-zinc-400 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link href="/register" className="w-full py-5 border border-white/10 rounded-2xl mt-10 font-black italic uppercase text-xs tracking-widest hover:bg-white/5 transition-all text-center text-zinc-100">
                        {t('Pricing.cta')}
                    </Link>
                </motion.div>

                {/* Pro Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1.1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    whileHover={{ scale: 1.15, y: -10 }}
                    className="bg-zinc-100 border-2 border-brand rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between relative shadow-[0_0_50px_rgba(204,255,0,0.2)] active:scale-105 transition-all z-10"
                >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-brand text-black font-black text-[10px] italic uppercase tracking-[0.2em] rounded-full">
                        {t('Pricing.plans.pro.badge')}
                    </div>
                    <div>
                        <h3 className="text-xl font-black italic uppercase text-black mb-6">{t('Pricing.plans.pro.title')}</h3>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-black text-black italic tracking-tighter">R$49,90</span>
                            <span className="text-black/40 font-bold uppercase text-[10px] tracking-widest">/ MÊS</span>
                        </div>
                        <ul className="space-y-4">
                            {(t.raw('Pricing.plans.pro.features') as string[]).map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-black font-bold">
                                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-brand">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link href="/register" className="w-full py-5 bg-black text-brand rounded-2xl mt-10 font-black italic uppercase text-xs tracking-widest shadow-lg hover:scale-[1.02] transition-transform text-center">
                        {t('Pricing.cta')}
                    </Link>
                </motion.div>

                {/* Trainer Plan */}
                <motion.div
                    {...fadeInUp}
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between group hover:border-white/20 transition-all duration-300"
                >
                    <div>
                        <h3 className="text-xl font-black italic uppercase text-zinc-400 mb-6">{t('Pricing.plans.trainer.title')}</h3>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-black text-white italic tracking-tighter">R$129,90</span>
                            <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">/ MÊS</span>
                        </div>
                        <ul className="space-y-4">
                            {(t.raw('Pricing.plans.trainer.features') as string[]).map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-zinc-400 font-medium">
                                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-zinc-500">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link href="/register" className="w-full py-5 border border-white/10 rounded-2xl mt-10 font-black italic uppercase text-xs tracking-widest hover:bg-white/5 transition-all text-center text-zinc-100">
                        {t('Pricing.cta')}
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
