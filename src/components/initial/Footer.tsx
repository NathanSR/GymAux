'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Dumbbell, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    const t = useTranslations('Marketing');

    return (
        <motion.footer 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1 }}
            className="bg-black/80 backdrop-blur-xl border-t border-white/5 pt-20 pb-10 px-6"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
                <div className="md:col-span-4 space-y-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                            <Dumbbell className="w-5 h-5 text-black" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold tracking-tighter uppercase italic text-zinc-100">GymAux</span>
                    </div>
                    <p className="text-zinc-500 font-medium leading-relaxed max-w-sm">
                        {t('Footer.description')}
                    </p>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <h4 className="text-[10px] font-black tracking-widest uppercase text-zinc-500 italic">{t('Footer.platform.title')}</h4>
                    <ul className="space-y-4 font-bold text-sm text-zinc-400">
                        <li><Link href="#features" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.platform.features')}</Link></li>
                        <li><Link href="#pricing" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.platform.pricing')}</Link></li>
                        <li><Link href="#" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.platform.trainerDashboard')}</Link></li>
                        <li><Link href="#" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.platform.webApp')}</Link></li>
                    </ul>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <h4 className="text-[10px] font-black tracking-widest uppercase text-zinc-500 italic">{t('Footer.company.title')}</h4>
                    <ul className="space-y-4 font-bold text-sm text-zinc-400">
                        <li><Link href="#" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.company.about')}</Link></li>
                        <li><Link href="#" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.company.support')}</Link></li>
                        <li><Link href="#" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.company.privacy')}</Link></li>
                        <li><Link href="#" className="hover:text-brand transition-colors uppercase italic tracking-tight">{t('Footer.company.terms')}</Link></li>
                    </ul>
                </div>

                <div className="md:col-span-4 flex flex-col items-end gap-6">
                    <div className="text-[10px] font-black tracking-widest uppercase text-zinc-500 italic pb-2 border-b border-white/5 w-full text-right">SOCIALS</div>
                    <div className="flex gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <motion.div 
                                key={i} 
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:border-brand/40 transition-colors flex items-center justify-center text-zinc-500 hover:text-brand cursor-pointer"
                            >
                                <Sparkles className="w-5 h-5" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5">
                <span className="text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase">
                    © 2024 GYMAUX - {t('Footer.rights')}
                </span>
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 text-zinc-600 font-bold text-[10px] tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                        SERVER STATUS: OPERATIONAL
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}
