'use client';

import React from 'react';
import { WifiOff, RotateCcw, Dumbbell, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';

export default function OfflineFallbackPage() {
    const t = useTranslations('OfflineFallback');
    const { goBack } = useSmartNavigation({ fallbackUrl: '/home' });

    const handleRetry = () => {
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    };

    const handleSmartBack = () => {
        goBack('/home');
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl relative z-10">
                    <WifiOff className="w-10 h-10 text-lime-400 animate-pulse" />
                </div>
                <div className="absolute -inset-2 bg-lime-500/10 rounded-3xl blur-xl -z-10" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight mb-2">{t('title')}</h1>
            <p className="text-zinc-400 text-sm max-w-sm mb-8 leading-relaxed">
                {t('description')}
            </p>

            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                {/* Botão de Voltar Inteligente */}
                <button
                    onClick={handleSmartBack}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-lime-400 text-zinc-950 hover:bg-lime-300 active:scale-[0.98] text-sm font-bold transition-all shadow-lg shadow-lime-400/20 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t('goBack')}
                </button>

                <div className="grid grid-cols-2 gap-2.5 w-full">
                    <button
                        onClick={handleRetry}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        {t('retry')}
                    </button>

                    <Link
                        href="/home"
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition-colors"
                    >
                        <Dumbbell className="w-3.5 h-3.5" />
                        {t('goToWorkouts')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
