'use client';

import { useEffect, useState, useRef } from "react";
import { useTranslations } from 'next-intl';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { RpeDial } from './RpeDial';
import { RPE_EMOJIS } from './SessionConstants';

interface RestTimerProps {
    seconds: number;
    restEndsAt?: number | null;
    onFinish: () => void;
    onAdjustTime?: (additionalSeconds: number) => void;
    currentRpe?: number;
    onUpdateRpe?: (rpe: number) => void;
}

export const RestTimer = ({
    seconds,
    restEndsAt,
    onFinish,
    onAdjustTime,
    currentRpe = 7,
    onUpdateRpe
}: RestTimerProps) => {
    const t = useTranslations('RestTimer');
    const ts = useTranslations('Session');

    const computeRemaining = (endsAt: number) =>
        Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));

    const endTimeRef = useRef<number>(
        restEndsAt && restEndsAt > Date.now()
            ? restEndsAt
            : Date.now() + Math.max(1, seconds) * 1000
    );

    const [timeLeft, setTimeLeft] = useState<number>(() => computeRemaining(endTimeRef.current));
    const [totalSeconds, setTotalSeconds] = useState<number>(() => Math.max(1, seconds, computeRemaining(endTimeRef.current)));

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hasPlayedAudioRef = useRef(false);
    const hasFinishedRef = useRef(false);

    useEffect(() => {
        audioRef.current = new Audio('/sounds/3-2-1-ja.mp3');
        audioRef.current.load();
    }, []);

    useEffect(() => {
        const tick = () => {
            const remaining = computeRemaining(endTimeRef.current);
            setTimeLeft(remaining);

            if (remaining === 3 && !hasPlayedAudioRef.current && audioRef.current) {
                hasPlayedAudioRef.current = true;
                audioRef.current.play().catch(e => console.log("Audio error:", e));
            }

            if (remaining <= 0 && !hasFinishedRef.current) {
                hasFinishedRef.current = true;
                onFinish();
            }
        };

        tick();
        const timer = setInterval(tick, 500);
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') tick();
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            clearInterval(timer);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [onFinish]);

    const handleAdjust = (delta: number) => {
        const nextRemaining = Math.max(1, computeRemaining(endTimeRef.current) + delta);
        endTimeRef.current = Date.now() + nextRemaining * 1000;
        if (nextRemaining > 3) hasPlayedAudioRef.current = false;
        setTimeLeft(nextRemaining);
        setTotalSeconds(prevTotal => Math.max(nextRemaining, prevTotal + delta));
        if (onAdjustTime) {
            onAdjustTime(delta);
        }
    };

    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (timeLeft / Math.max(1, totalSeconds)) * circumference;
    const isEnding = timeLeft <= 3 && timeLeft > 0;

    return (
        <div className="flex flex-col items-center justify-between h-full py-1 sm:py-3 md:py-4 px-2 select-none overflow-hidden animate-in fade-in duration-500 gap-3 sm:gap-6">
            {/* Top Section: Compact Timer Ring & Quick Adjusters */}
            <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative flex items-center justify-center w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 transition-all duration-300">
                    {isEnding && (
                        <div className="absolute inset-0 rounded-full border-4 border-lime-400/30 animate-ping" />
                    )}

                    <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-zinc-200 dark:text-zinc-800"
                        />
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumference}
                            style={{
                                strokeDashoffset: offset,
                                transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease'
                            }}
                            className={`${isEnding ? 'text-zinc-900 dark:text-white' : 'text-lime-500 dark:text-lime-400'} transition-all`}
                            strokeLinecap="round"
                            filter={isEnding ? "drop-shadow(0 0 10px rgba(163, 230, 71, 0.5))" : "drop-shadow(0 0 6px rgba(163, 230, 31, 0.3))"}
                        />
                    </svg>

                    <div key={timeLeft} className="absolute flex flex-col items-center animate-in zoom-in-90 duration-300">
                        <span className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tabular-nums tracking-tighter transition-colors ${isEnding ? 'text-lime-600 dark:text-lime-400 scale-110' : 'text-zinc-900 dark:text-white'}`}>
                            {timeLeft}
                        </span>
                        <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[9px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">
                            {t('seconds')}
                        </span>
                    </div>
                </div>

                {/* Quick Adjust Buttons */}
                <div className="flex items-center gap-1.5 sm:gap-3 mt-2 sm:mt-4">
                    <button
                        type="button"
                        onClick={() => handleAdjust(-15)}
                        className="px-3 py-1.5 sm:px-4 sm:py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs md:text-sm flex items-center gap-1 sm:gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                        <Minus size={11} className="sm:w-3.5 sm:h-3.5" /> 15s
                    </button>
                    <button
                        type="button"
                        onClick={() => handleAdjust(15)}
                        className="px-3 py-1.5 sm:px-4 sm:py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-lime-500/40 text-lime-600 dark:text-lime-400 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs md:text-sm flex items-center gap-1 sm:gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                        <Plus size={11} className="sm:w-3.5 sm:h-3.5" /> 15s
                    </button>
                    <button
                        type="button"
                        onClick={() => handleAdjust(30)}
                        className="px-3 py-1.5 sm:px-4 sm:py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-lime-500/40 text-lime-600 dark:text-lime-400 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs md:text-sm flex items-center gap-1 sm:gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                        <Plus size={11} className="sm:w-3.5 sm:h-3.5" /> 30s
                    </button>
                </div>
            </div>

            {/* Middle Section: Integrated RPE Dial */}
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl flex-1 flex flex-col justify-center my-1 sm:my-3 md:my-5">
                <RpeDial
                    value={currentRpe}
                    onChange={(val) => onUpdateRpe?.(val)}
                    label={ts('effort')}
                    subLabel={ts(RPE_EMOJIS[currentRpe]?.labelKey)}
                />
            </div>

            {/* Bottom Section: Skip Rest Button */}
            <button
                onClick={onFinish}
                className="group w-full max-w-xs sm:max-w-sm md:max-w-md py-3.5 sm:py-4.5 md:py-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-[22px] sm:rounded-[28px] font-black uppercase text-[10px] sm:text-xs md:text-sm tracking-[0.25em] active:scale-95 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white relative shadow-xs flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
                <span>{t('skipRest')}</span>
                <ArrowRight size={14} className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};