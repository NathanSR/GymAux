'use client';

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';

interface RestTimerProps {
    seconds: number;
    onFinish: () => void;
}

export const RestTimer = ({ seconds, onFinish }: RestTimerProps) => {
    const t = useTranslations('RestTimer');
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        if (timeLeft <= 0) {
            onFinish();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onFinish]);

    // Cálculo do progresso (círculo)
    const radius = 130;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (timeLeft / seconds) * circumference;

    return (
        <div className="inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-xl p-8 animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center mb-12">
                {/* SVG do Timer */}
                <svg className="w-72 h-72 -rotate-90">
                    {/* Círculo de Fundo */}
                    <circle
                        cx="144"
                        cy="144"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-zinc-900"
                    />
                    {/* Círculo de Progresso Ativo */}
                    <circle
                        cx="144"
                        cy="144"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset: offset }}
                        className="text-lime-400 transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                        // Adiciona um leve brilho ao progresso
                        filter="drop-shadow(0 0 8px rgba(163, 230, 31, 0.3))"
                    />
                </svg>

                {/* Texto Centralizado */}
                <div className="absolute flex flex-col items-center">
                    <span className="text-7xl font-black text-white tabular-nums tracking-tighter">
                        {timeLeft}
                    </span>
                    <span className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">
                        {t('seconds')}
                    </span>
                </div>
            </div>

            <h3 className="text-2xl font-black text-white uppercase mb-8 tracking-tighter italic">
                {t('restTime')}
            </h3>

            <button
                onClick={onFinish}
                className="w-full max-w-xs py-5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-[28px] font-black uppercase text-xs tracking-[0.2em] active:scale-95 transition-all hover:text-white hover:border-zinc-700"
            >
                {t('skipRest')}
            </button>
        </div>
    );
};