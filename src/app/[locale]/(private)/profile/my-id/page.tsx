'use client'

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Copy, 
    Check, 
    QrCode, 
    User,
    ArrowLeft 
} from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

export default function MyIDPage() {
    const t = useTranslations('MyID');
    const router = useRouter();
    const supabase = createClient();
    const [uid, setUid] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUid(user.id);
            }
            setLoading(false);
        };
        fetchUser();
    }, [supabase]);

    const handleCopy = () => {
        if (uid) {
            navigator.clipboard.writeText(uid);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-zinc-950 p-6 transition-colors duration-300">
                <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-lime-400 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 font-sans p-6 pb-12">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <button 
                    onClick={() => router.back()}
                    className="w-12 h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 active:scale-90 transition-all shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white">
                    {t('title')}
                </h1>
                <div className="w-12 h-12" /> {/* Spacer */}
            </header>

            <main className="flex-1 flex flex-col items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-sm"
                >
                    <div className="relative group overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-br from-lime-400 to-lime-600 rounded-[40px] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                        
                        <div className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-8 flex flex-col items-center shadow-2xl">
                            
                            {/* User Avatar Representation */}
                            <div className="w-20 h-20 bg-lime-400 rounded-[24px] flex items-center justify-center mb-6 shadow-xl shadow-lime-400/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <User size={40} className="text-zinc-950" />
                            </div>

                            <p className="text-[10px] font-black uppercase text-lime-500 tracking-[0.2em] mb-2">
                                {t('idCard')}
                            </p>
                            
                            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-3 italic tracking-tighter uppercase">
                                {t('passTitle')}
                            </h2>
                            
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mb-8 px-4 leading-relaxed font-medium">
                                {t('description')}
                            </p>

                            {/* QR Code Container */}
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white p-6 rounded-[28px] shadow-sm mb-8 border border-zinc-100/50 dark:border-zinc-800/50"
                            >
                                {uid && (
                                    <QRCodeSVG 
                                        value={uid} 
                                        size={180}
                                        level="H"
                                        includeMargin={false}
                                        fgColor="#000000"
                                    />
                                )}
                            </motion.div>

                            <div className="flex items-center gap-2 mb-8 bg-zinc-100 dark:bg-zinc-800/50 px-4 py-2 rounded-full">
                                <QrCode size={14} className="text-lime-500" />
                                <span className="text-[9px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-widest">
                                    {t('qrcodePrompt')}
                                </span>
                            </div>

                            {/* ID String Display */}
                            <div className="w-full space-y-2">
                                <p className="text-[9px] font-black uppercase text-zinc-400 dark:text-zinc-600 tracking-widest ml-1">
                                    {t('memberUid')}
                                </p>
                                <div className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700/50 rounded-[20px] p-4 flex items-center justify-between gap-3 group/id">
                                    <span className="text-[12px] font-mono text-zinc-500 dark:text-zinc-400 truncate tracking-tight">
                                        {uid}
                                    </span>
                                    <button 
                                        onClick={handleCopy}
                                        className="shrink-0 p-2.5 bg-white dark:bg-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-lime-400 hover:text-zinc-950 transition-all shadow-sm active:scale-90"
                                    >
                                        <AnimatePresence mode="wait">
                                            {copied ? (
                                                <motion.div
                                                    key="check"
                                                    initial={{ scale: 0, rotate: -20 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    exit={{ scale: 0 }}
                                                >
                                                    <Check size={18} strokeWidth={3} />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="copy"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                >
                                                    <Copy size={18} strokeWidth={2.5} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Notification Toast */}
            <AnimatePresence>
                {copied && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-12 left-6 right-6 flex justify-center z-50 pointer-events-none"
                    >
                        <div className="px-6 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-[24px] text-xs font-black uppercase tracking-widest shadow-2xl flex items-center gap-3 border border-white/10 dark:border-zinc-200">
                            <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                            {t('copySuccess')}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
