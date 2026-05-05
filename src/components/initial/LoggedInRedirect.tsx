'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowRight, User, Sparkles } from 'lucide-react';

/**
 * LoggedInRedirect Component
 * 
 * Shows a premium floating notification on the landing page if the user is already authenticated.
 * This provides a shortcut to the main application, improving UX for returning users.
 */
export default function LoggedInRedirect() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const t = useTranslations('Auth');

    useEffect(() => {
        const supabase = createClient();
        
        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (error) {
                console.error('Error checking auth state:', error);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    if (loading || !user) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] w-[calc(100%-2rem)] max-w-sm"
            >
                <div className="relative group">
                    {/* Animated background glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand to-lime-400 rounded-[2rem] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse" />
                    
                    <div className="relative bg-zinc-950/90 backdrop-blur-xl border border-white/10 p-4 rounded-[1.8rem] shadow-2xl flex items-center justify-between gap-4 overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-brand/5 blur-3xl rounded-full pointer-events-none" />
                        
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="relative">
                                <div className="w-11 h-11 rounded-2xl bg-brand/10 flex items-center justify-center border border-brand/20 group-hover:border-brand/40 transition-colors">
                                    <User className="w-5 h-5 text-brand" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand rounded-full border-2 border-zinc-950 flex items-center justify-center">
                                    <Sparkles className="w-2 h-2 text-black" />
                                </div>
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-bold tracking-tight">
                                    {t('welcomeBack') || 'Bem-vindo de volta!'}
                                </span>
                                <span className="text-zinc-500 text-[10px] uppercase tracking-[0.15em] font-black leading-tight">
                                    {t('continueToApp') || 'Acesse seu dashboard'}
                                </span>
                            </div>
                        </div>
                        
                        <Link
                            href="/home"
                            className="relative z-10 bg-brand text-black px-5 py-3 rounded-2xl font-black text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-brand/20 uppercase group/btn"
                        >
                            Home
                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
