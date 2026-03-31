'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Dumbbell, Users, BarChart3, WifiOff, Globe, Gauge } from 'lucide-react';

const fadeInUp: any = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.2 },
    transition: { duration: 0.6, ease: "easeOut" }
};

const stagger: any = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: false, amount: 0.1 },
    transition: { staggerChildren: 0.1 }
};

export default function FeaturesGridSection() {
    const t = useTranslations('Marketing.Features');

    const features = [
        {
            icon: <Dumbbell className="w-6 h-6" />,
            title: t('items.workout.title'),
            description: t('items.workout.description'),
            color: "brand"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: t('items.trainer.title'),
            description: t('items.trainer.description'),
            color: "brand"
        },
        {
            icon: <Gauge className="w-6 h-6" />,
            title: t('items.realtime.title'),
            description: t('items.realtime.description'),
            color: "brand"
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: t('items.tracking.title'),
            description: t('items.tracking.description'),
            color: "brand"
        },
        {
            icon: <WifiOff className="w-6 h-6" />,
            title: t('items.offline.title'),
            description: t('items.offline.description'),
            color: "brand"
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: t('items.multilingual.title'),
            description: t('items.multilingual.description'),
            color: "brand"
        }
    ];

    return (
        <section id="features" className="max-w-7xl mx-auto py-32 px-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="text-center mb-20 space-y-4">
                <motion.span {...fadeInUp} className="text-brand font-black tracking-widest text-xs uppercase italic drop-shadow-sm">
                    {t('title')}
                </motion.span>
                <motion.h2 {...fadeInUp} className="text-4xl md:text-6xl font-black italic uppercase tracking-tight text-white leading-tight">
                    {t('subtitle')}
                </motion.h2>
            </div>

            <motion.div
                variants={stagger}
                initial="initial"
                whileInView="whileInView"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        variants={fadeInUp}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="group p-8 rounded-[2.5rem] bg-zinc-900/50 backdrop-blur-xl border border-white/5 hover:border-brand/30 transition-all duration-500 flex flex-col items-start gap-6"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-black transition-all duration-500 shadow-lg shadow-brand/5">
                            {feature.icon}
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-black italic uppercase tracking-tight text-white group-hover:text-brand transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-400 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                                {feature.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Decorative background lines */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 opacity-20">
                <div className="absolute top-[20%] left-[-10%] w-[120%] h-px bg-gradient-to-r from-transparent via-brand to-transparent rotate-12" />
                <div className="absolute bottom-[20%] left-[-10%] w-[120%] h-px bg-gradient-to-r from-transparent via-brand to-transparent -rotate-12" />
            </div>
        </section>
    );
}
