'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
    const t = useTranslations('Marketing');

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: false, amount: 0.3 },
        transition: { duration: 0.6 }
    };

    return (
        <section id="faq" className="max-w-4xl mx-auto py-32 mb-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <span className="text-brand font-black tracking-widest text-xs uppercase italic">{t('FAQ.title')}</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter mt-4 text-zinc-100">FREQUENTLY ASKED</h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map((num) => (
                    <motion.div
                        key={num}
                        {...fadeInUp}
                        whileHover={{ scale: 1.02 }}
                        className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all"
                    >
                        <div className="flex items-center justify-between w-full text-left">
                            <h4 className="text-lg font-bold italic uppercase tracking-tight text-white group-hover:text-brand transition-colors">
                                {t(`FAQ.q${num}.q`)}
                            </h4>
                            <ChevronDown className="w-5 h-5 text-zinc-500 group-hover:text-brand transition-all transform group-hover:rotate-180" />
                        </div>
                        <div className="mt-4 overflow-hidden">
                            <p className="text-zinc-400 leading-relaxed font-medium">
                                {t(`FAQ.q${num}.a`)}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
