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

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('/sounds/3-2-1-ja.mp3');
        audioRef.current.load();
    }, []);

    useEffect(() => {
        if (timeLeft === 3 && audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio error:", e));
        }

        if (timeLeft <= 0) {
            onFinish();
            return;
        }

        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onFinish]);

    const radius = 130;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (timeLeft / seconds) * circumference;
    const isEnding = timeLeft <= 3 && timeLeft > 0;

    return (
        <div className="overflow-x-hidden flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-700">
            <div className="relative flex items-center justify-center mb-8 sm:mb-12 w-full max-w-[288px]">
                {isEnding && (
                    <div className="absolute inset-0 rounded-full border-4 border-lime-400/30 animate-ping" />
                )}

                <svg className="w-full aspect-square -rotate-90" viewBox="0 0 288 288">
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
                            transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease'
                        }}
                        className={`${isEnding ? 'text-white' : 'text-lime-400'} transition-all`}
                        strokeLinecap="round"
                        filter={isEnding ? "drop-shadow(0 0 15px rgba(255, 255, 255, 0.5))" : "drop-shadow(0 0 8px rgba(163, 230, 31, 0.3))"}
                    />
                </svg>

                <div key={timeLeft} className="absolute flex flex-col items-center animate-in zoom-in-90 duration-300">
                    <span className={`text-7xl sm:text-8xl font-black tabular-nums tracking-tighter transition-colors ${isEnding ? 'text-lime-400 scale-110' : 'text-white'}`}>
                        {timeLeft}
                    </span>
                    <span className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs mt-1">
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
                        {t('getReady')}
                    </p>
                )}
            </div>

            <button
                onClick={onFinish}
                className="group w-full max-w-xs py-5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-[28px] font-black uppercase text-xs tracking-[0.2em] active:scale-95 transition-all hover:bg-zinc-800 hover:text-white relative"
            >
                <span className="group-hover:opacity-0 transition-opacity duration-300">
                    {t('skipRest')}
                </span>
                <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {t('readyNext')}
                </span>
            </button>
        </div>
    );
};