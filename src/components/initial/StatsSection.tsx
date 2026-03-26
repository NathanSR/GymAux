'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function StatsSection() {
    const t = useTranslations('Marketing');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    } as any;

    return (
        <section className="max-w-7xl mx-auto py-20 flex justify-center">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-32 w-full max-w-5xl"
            >
                {[
                    { label: t('Stats.users'), value: '15.4K+' },
                    { label: t('Stats.gyms'), value: '250+' },
                    { label: t('Stats.uptime'), value: '99.9%' },
                    { label: 'Cloud Storage', value: 'Unlimited' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        whileHover={{ scale: 1.1 }}
                        className="flex flex-col items-center md:items-start"
                    >
                        <span className="text-3xl md:text-5xl font-black italic text-white mb-2">{stat.value}</span>
                        <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">{stat.label}</span>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
