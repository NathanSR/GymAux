'use client';

import React from 'react';
import { WifiOff, RotateCcw, Dumbbell } from 'lucide-react';
import Link from 'next/link';

export default function OfflineFallbackPage() {
    const handleRetry = () => {
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl relative z-10">
                    <WifiOff className="w-10 h-10 text-lime-400 animate-pulse" />
                </div>
                <div className="absolute -inset-2 bg-lime-500/10 rounded-3xl blur-xl -z-10" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight mb-2">Você está sem conexão</h1>
            <p className="text-zinc-400 text-sm max-w-sm mb-8 leading-relaxed">
                Esta página ainda não foi salva no seu dispositivo, mas todos os seus treinos e históricos salvos continuam totalmente acessíveis!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
                <button
                    onClick={handleRetry}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-800 text-sm font-medium transition-colors cursor-pointer"
                >
                    <RotateCcw className="w-4 h-4" />
                    Tentar Novamente
                </button>

                <Link
                    href="/"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-lime-400 text-zinc-950 hover:bg-lime-300 text-sm font-semibold transition-colors shadow-lg shadow-lime-400/20"
                >
                    <Dumbbell className="w-4 h-4" />
                    Ir para Meus Treinos
                </Link>
            </div>
        </div>
    );
}
