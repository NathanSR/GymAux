'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles, Zap, TrendingUp, Cloud, Download } from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.3 },
    transition: { duration: 0.6, ease: "easeOut" }
};

const stagger = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: false, amount: 0.2 },
    transition: { staggerChildren: 0.2 }
};

export default function WhySection() {
    const t = useTranslations('Marketing');

    return (
        <section id="features" className="max-w-7xl mx-auto py-32 flex flex-col items-center gap-20 px-6">
            <div className="text-center flex flex-col items-center gap-4">
                <motion.span {...fadeInUp} className="text-brand font-black tracking-widest text-xs uppercase italic">{t('WhyGymAux.title')}</motion.span>
                <motion.h2 {...fadeInUp} className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-zinc-100">{t('WhyGymAux.subtitle')}</motion.h2>
            </div>

            <motion.div
                variants={stagger}
                initial="initial"
                whileInView="whileInView"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
            >
                {[
                    {
                        key: 'boostSeo',
                        icon: <Sparkles className="w-6 h-6" />,
                        title: t('WhyGymAux.features.boostSeo.title'),
                        description: t('WhyGymAux.features.boostSeo.description')
                    },
                    {
                        key: 'treadPredictor',
                        icon: <Zap className="w-6 h-6" />,
                        title: t('WhyGymAux.features.treadPredictor.title'),
                        description: t('WhyGymAux.features.treadPredictor.description')
                    },
                    {
                        key: 'dataDriven',
                        icon: <TrendingUp className="w-6 h-6" />,
                        title: t('WhyGymAux.features.dataDriven.title'),
                        description: t('WhyGymAux.features.dataDriven.description')
                    }
                ].map((feat) => (
                    <motion.div
                        key={feat.key}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.05, y: -10 }}
                        className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-brand/40 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="mb-6 w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                            {feat.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-4 uppercase italic tracking-tight group-hover:text-brand transition-colors text-zinc-100">{feat.title}</h3>
                        <p className="text-zinc-400 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">{feat.description}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full mt-10">
                <motion.div
                    {...fadeInUp}
                    className="md:col-span-8 p-8 bg-zinc-900 border border-white/10 rounded-3xl relative overflow-hidden group min-h-[400px]"
                >
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand/10 to-transparent pointer-events-none" />
                    <div className="flex flex-col h-full justify-between items-start relative z-10">
                        <div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand/20 border border-brand/30 text-brand text-[10px] font-black uppercase mb-6 tracking-wider">
                                {t('Bento.trainerManagement.badge')}
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black italic uppercase leading-none mb-4 text-zinc-100">{t('Bento.trainerManagement.title')}</h3>
                            <p className="text-zinc-400 max-w-md font-medium">{t('Bento.trainerManagement.description')}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-8">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800" />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-zinc-300">+100 {t('Stats.users')}</span>
                        </div>
                    </div>

                    <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-brand/10 blur-[80px] rounded-full group-hover:bg-brand/20 transition-colors" />
                </motion.div>

                <motion.div
                    {...fadeInUp}
                    className="md:col-span-4 grid grid-rows-2 gap-6"
                >
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="p-8 bg-white/5 border border-white/10 rounded-3xl group hover:border-brand/30 transition-all flex flex-col justify-between items-start"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-brand">
                            <Cloud className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg uppercase italic tracking-tight text-zinc-100">{t('Bento.cloudSync.title')}</h4>
                            <p className="text-zinc-400 text-sm mt-1">{t('Bento.cloudSync.description')}</p>
                        </div>
                    </motion.div>
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="p-8 bg-white/5 border border-white/10 rounded-3xl group hover:border-brand/30 transition-all flex flex-col justify-between items-start"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-brand">
                            <Download className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg uppercase italic tracking-tight text-zinc-100">{t('Bento.pwaReady.title')}</h4>
                            <p className="text-zinc-400 text-sm mt-1">{t('Bento.pwaReady.description')}</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
