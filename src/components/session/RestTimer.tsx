'use client';

import { useEffect, useState, useRef } from "react";
import { useTranslations } from 'next-intl';

interface RestTimerProps {
    seconds: number;
    onFinish: () => void;
}

export const RestTimer = ({ seconds, onFinish }: RestTimerProps) => {
    const t = useTranslations('RestTimer');
    const [timeLeft, setTimeLeft] = useState(seconds);

    // Ref para o áudio para não recarregar em cada render
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Inicializa o áudio apenas no cliente
        audioRef.current = new Audio('/sounds/3-2-1-ja.mp3');

        // Pré-carregamento para evitar atrasos (importante em mobile)
        audioRef.current.load();
    }, []);

    useEffect(() => {
        // Toca o som exatamente quando atingir 3 segundos
        if (timeLeft === 3 && audioRef.current) {
            audioRef.current.play().catch(e => console.log("Erro ao tocar áudio:", e));
        }

        if (timeLeft <= 0) {
            onFinish();
            return;
        }

        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onFinish]);

    // Cálculo do progresso
    const radius = 130;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (timeLeft / seconds) * circumference;

    // Determina se estamos no "pico" da concentração (últimos 3 seg)
    const isEnding = timeLeft <= 3 && timeLeft > 0;

    return (
        <div className="flex flex-col items-center justify-center p-8 animate-in fade-in duration-700">
            <div className="relative flex items-center justify-center mb-12">

                {/* Efeito de Ondas de Choque (apenas nos últimos 3 segundos) */}
                {isEnding && (
                    <div className="absolute inset-0 rounded-full border-4 border-lime-400/30 animate-ping" />
                )}

                {/* SVG do Timer */}
                <svg className="w-72 h-72 -rotate-90">
                    <circle
                        cx="144"
                        cy="144"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-zinc-900"
                    />
                    <circle
                        cx="144"
                        cy="144"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={circumference}
                        style={{
                            strokeDashoffset: offset,
                            // Acelera a transição visual para parecer mais fluido
                            transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease'
                        }}
                        className={`${isEnding ? 'text-white' : 'text-lime-400'} transition-all`}
                        strokeLinecap="round"
                        filter={isEnding ? "drop-shadow(0 0 15px rgba(255, 255, 255, 0.5))" : "drop-shadow(0 0 8px rgba(163, 230, 31, 0.3))"}
                    />
                </svg>

                {/* Texto Centralizado com Animação de Escala a cada segundo */}
                <div key={timeLeft} className="absolute flex flex-col items-center animate-in zoom-in-90 duration-300">
                    <span className={`text-8xl font-black tabular-nums tracking-tighter transition-colors ${isEnding ? 'text-lime-400 scale-110' : 'text-white'}`}>
                        {timeLeft}
                    </span>
                    <span className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">
                        {t('seconds')}
                    </span>
                </div>
            </div>

            <div className="text-center space-y-2 mb-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                    {t('restTime')}
                </h3>
                {isEnding && (
                    <p className="text-lime-400 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">
                        Prepare-se!
                    </p>
                )}
            </div>

            <button
                onClick={onFinish}
                className="group w-full max-w-xs py-5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-[28px] font-black uppercase text-xs tracking-[0.2em] active:scale-95 transition-all hover:bg-zinc-800 hover:text-white"
            >
                <span className="group-hover:opacity-0 transition-opacity duration-300">
                    {t('skipRest')}
                </span>
                <span className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Pronto para a próxima?
                </span>
            </button>
        </div>
    );
};