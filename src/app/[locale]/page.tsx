'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    TrendingUp,
    HardDrive,
    Cloud,
    Download,
    Users,
    Check,
    Plus,
    ChevronRight,
    Menu,
    X,
    ArrowRight,
    Lock,
    Zap,
    Dumbbell,
    Play,
    Timer,
    Calendar,
    ChevronDown,
} from 'lucide-react';
import PWAInstallButton from '@/components/PWAInstallButton';

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const stagger = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.1 }
};

export default function HomePage() {
    const t = useTranslations('Marketing');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '#features', label: t('Navbar.features') },
        { href: '#pricing', label: t('Navbar.pricing') },
        { href: '#faq', label: t('Navbar.faq') },
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-zinc-100 selection:bg-brand selection:text-black overflow-x-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/5 blur-[120px] rounded-full" />
            </div>

            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-center">
                <nav className="max-w-7xl w-full flex items-center justify-between px-6 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                            <Dumbbell className="w-5 h-5 text-black" strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold tracking-tighter uppercase italic">GymAux</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-zinc-400 hover:text-brand transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/auth/login" className="text-sm font-medium hover:text-brand transition-colors transition-all duration-300">
                            {t('Navbar.login')}
                        </Link>
                        <Link
                            href="/auth/register"
                            className="px-5 py-2 rounded-xl bg-brand font-bold text-xs text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_-10px_#ccff00]"
                        >
                            {t('Navbar.getStarted').toUpperCase()}
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-zinc-400 hover:text-brand transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </nav>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="absolute top-20 left-6 right-6 p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col gap-6 md:hidden overflow-hidden"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-lg font-medium text-zinc-400 border-b border-white/5 pb-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-4 pt-2">
                                <Link
                                    href="/auth/login"
                                    className="w-full py-4 text-center font-bold text-zinc-400 border border-white/10 rounded-xl"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {t('Navbar.login')}
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="w-full py-4 text-center font-bold bg-brand text-black rounded-xl shadow-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {t('Navbar.getStarted').toUpperCase()}
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="relative z-10 pt-32 px-6">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8 mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold tracking-[0.2em] uppercase"
                    >
                        {t('Stats.uptime')} - 99.9%
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black tracking-tighter max-w-4xl italic uppercase leading-[0.9]"
                    >
                        {t('Hero.title').split(' ').map((word, i) => (
                            <span key={i} className={word.toLowerCase().includes('controle') || word.toLowerCase().includes('control') ? 'text-brand' : ''}>
                                {word}{' '}
                            </span>
                        ))}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed"
                    >
                        {t('Hero.subtitle')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <Link
                            href="/auth/register"
                            className="bg-brand text-black px-10 py-5 rounded-2xl font-black text-sm tracking-wide shadow-[0_0_30px_-10px_#ccff00] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        >
                            {t('Hero.getStarted').toUpperCase()}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#"
                            className="px-10 py-5 rounded-2xl border border-white/10 font-bold text-sm tracking-wide hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            {t('Hero.freeDemo').toUpperCase()}
                        </Link>
                    </motion.div>

                    {/* Dashboard Preview / Floating elements */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
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
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                <span className="text-black font-black italic uppercase tracking-wider">{t('WhyGymAux.title')}</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Why Section */}
                <section id="features" className="max-w-7xl mx-auto py-32 flex flex-col items-center gap-20">
                    <div className="text-center flex flex-col items-center gap-4">
                        <motion.span {...fadeInUp} className="text-brand font-black tracking-widest text-xs uppercase italic">{t('WhyGymAux.title')}</motion.span>
                        <motion.h2 {...fadeInUp} className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">{t('WhyGymAux.subtitle')}</motion.h2>
                    </div>

                    <motion.div 
                        variants={stagger}
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
                                className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-brand/40 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                <div className="mb-6 w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                                    {feat.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4 uppercase italic tracking-tight group-hover:text-brand transition-colors">{feat.title}</h3>
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
                                    <h3 className="text-3xl md:text-4xl font-black italic uppercase leading-none mb-4">{t('Bento.trainerManagement.title')}</h3>
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
                            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl group hover:border-brand/30 transition-all flex flex-col justify-between items-start">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-brand">
                                    <Cloud className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg uppercase italic tracking-tight">{t('Bento.cloudSync.title')}</h4>
                                    <p className="text-zinc-400 text-sm mt-1">{t('Bento.cloudSync.description')}</p>
                                </div>
                            </div>
                            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl group hover:border-brand/30 transition-all flex flex-col justify-between items-start">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-brand">
                                    <Download className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg uppercase italic tracking-tight">{t('Bento.pwaReady.title')}</h4>
                                    <p className="text-zinc-400 text-sm mt-1">{t('Bento.pwaReady.description')}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Session Control Highlight */}
                <section className="max-w-7xl mx-auto py-32">
                    <div className="bg-brand rounded-[3rem] p-8 md:p-20 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 blur-[100px] rounded-full group-hover:translate-x-10 group-hover:-translate-y-10 transition-transform duration-1000" />
                        
                        <div className="flex-1 flex flex-col items-start gap-8 relative z-10 text-black">
                            <span className="font-black italic uppercase tracking-[0.3em] text-[10px] opacity-70">
                                {t('SessionControl.title')}
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85]">
                                {t('SessionControl.subtitle')}
                            </h2>
                            <p className="text-black/70 text-lg md:text-xl font-medium max-w-md leading-relaxed">
                                {t('Bento.pwaReady.description')}
                            </p>
                            <Link
                                href="/auth/register"
                                className="px-8 py-4 bg-black text-brand rounded-2xl font-black italic uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
                            >
                                {t('Hero.getStarted').toUpperCase()}
                            </Link>
                        </div>

                        {/* Interactive Widget Mockup */}
                        <motion.div 
                            initial={{ x: 100, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
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
                    </div>
                </section>

                {/* Stats Section */}
                <section className="max-w-7xl mx-auto py-20 flex justify-center">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-32 w-full max-w-5xl">
                        {[
                            { label: t('Stats.users'), value: '15.4K+' },
                            { label: t('Stats.gyms'), value: '250+' },
                            { label: t('Stats.uptime'), value: '99.9%' },
                            { label: 'Cloud Storage', value: 'Unlimited' }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center md:items-start">
                                <span className="text-3xl md:text-5xl font-black italic text-white mb-2">{stat.value}</span>
                                <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="max-w-7xl mx-auto py-32 flex flex-col items-center gap-16">
                    <div className="text-center flex flex-col items-center gap-4">
                        <motion.span {...fadeInUp} className="text-brand font-black tracking-widest text-xs uppercase italic">{t('Pricing.title')}</motion.span>
                        <motion.h2 {...fadeInUp} className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">{t('Pricing.subtitle')}</motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                        {/* Free Plan */}
                        <motion.div
                            {...fadeInUp}
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
                            <Link href="/auth/register" className="w-full py-5 border border-white/10 rounded-2xl mt-10 font-black italic uppercase text-xs tracking-widest hover:bg-white/5 transition-all text-center">
                                {t('Pricing.cta')}
                            </Link>
                        </motion.div>

                        {/* Pro Plan */}
                        <motion.div
                            {...fadeInUp}
                            className="bg-zinc-100 border-2 border-brand rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between relative shadow-[0_0_50px_rgba(204,255,0,0.2)] md:scale-110 active:scale-105 transition-all"
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
                            <Link href="/auth/register" className="w-full py-5 bg-black text-brand rounded-2xl mt-10 font-black italic uppercase text-xs tracking-widest shadow-lg hover:scale-[1.02] transition-transform text-center">
                                {t('Pricing.cta')}
                            </Link>
                        </motion.div>

                        {/* Trainer Plan */}
                        <motion.div
                            {...fadeInUp}
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
                            <Link href="/auth/register" className="w-full py-5 border border-white/10 rounded-2xl mt-10 font-black italic uppercase text-xs tracking-widest hover:bg-white/5 transition-all text-center">
                                {t('Pricing.cta')}
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="max-w-4xl mx-auto py-32 mb-20">
                    <div className="text-center mb-16">
                        <span className="text-brand font-black tracking-widest text-xs uppercase italic">{t('FAQ.title')}</span>
                        <h2 className="text-5xl font-black italic uppercase tracking-tighter mt-4">FREQUENTLY ASKED</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map((num) => (
                            <motion.div
                                key={num}
                                {...fadeInUp}
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

                {/* CTA Section */}
                <section className="max-w-7xl mx-auto py-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative rounded-[4rem] bg-brand p-12 md:p-24 overflow-hidden flex flex-col items-center text-center gap-10 group"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.4),transparent)] opacity-40" />
                        
                        {/* Interactive floating logos behind text */}
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <motion.div
                                    key={i}
                                    className="absolute"
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
                            <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8] text-black">
                                {t('CTA.title')}
                            </h2>
                            <p className="text-black/60 text-xl md:text-2xl font-bold italic uppercase tracking-tighter">
                                {t('CTA.subtitle')}
                            </p>
                        </div>

                        <Link
                            href="/auth/register"
                            className="relative z-10 px-16 py-6 bg-black text-brand font-black italic uppercase tracking-widest text-base rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 group/btn"
                        >
                            {t('CTA.button')}
                            <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-black/80 backdrop-blur-xl border-t border-white/5 pt-20 pb-10 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
                    <div className="md:col-span-4 space-y-8">
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                                <Dumbbell className="w-5 h-5 text-black" strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-bold tracking-tighter uppercase italic">GymAux</span>
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
                                <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 hover:border-brand/40 transition-colors flex items-center justify-center text-zinc-500 hover:text-brand cursor-pointer">
                                    <Sparkles className="w-5 h-5" />
                                </div>
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
            </footer>

            {/* Floating PWA Button - Moved to bottom right */}
            <div className="fixed bottom-8 right-8 z-[100]">
                 <PWAInstallButton />
            </div>
        </div>
    );
}