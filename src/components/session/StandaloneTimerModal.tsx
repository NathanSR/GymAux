'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Timer as TimerIcon, Play, Pause, RotateCcw, Flag, Plus, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Drawer } from '@/components/ui/Drawer';

interface StandaloneTimerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function StandaloneTimerModal({ isOpen, onClose }: StandaloneTimerModalProps) {
    const t = useTranslations('Session');
    const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');

    // Stopwatch state
    const [swRunning, setSwRunning] = useState(false);
    const [swTime, setSwTime] = useState(0); // in ms
    const [swLaps, setSwLaps] = useState<number[]>([]);
    const swIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Timer state
    const [timerTarget, setTimerTarget] = useState(60); // seconds
    const [timerLeft, setTimerLeft] = useState(60);
    const [timerRunning, setTimerRunning] = useState(false);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('/sounds/3-2-1-ja.mp3');
        audioRef.current.load();
    }, []);

    // Stopwatch ticker
    useEffect(() => {
        if (swRunning) {
            const startTime = Date.now() - swTime;
            swIntervalRef.current = setInterval(() => {
                setSwTime(Date.now() - startTime);
            }, 10);
        } else if (swIntervalRef.current) {
            clearInterval(swIntervalRef.current);
        }
        return () => {
            if (swIntervalRef.current) clearInterval(swIntervalRef.current);
        };
    }, [swRunning]);

    // Timer ticker
    useEffect(() => {
        if (timerRunning) {
            timerIntervalRef.current = setInterval(() => {
                setTimerLeft((prev) => {
                    if (prev === 4 && audioRef.current) {
                        audioRef.current.play().catch(() => {});
                    }
                    if (prev <= 1) {
                        setTimerRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, [timerRunning]);

    // Stopwatch controls
    const toggleSw = () => setSwRunning(!swRunning);
    const resetSw = () => {
        setSwRunning(false);
        setSwTime(0);
        setSwLaps([]);
    };
    const addLap = () => {
        if (swTime > 0) {
            setSwLaps((prev) => [swTime, ...prev]);
        }
    };

    // Timer controls
    const toggleTimer = () => {
        if (timerLeft <= 0) {
            setTimerLeft(timerTarget);
        }
        setTimerRunning(!timerRunning);
    };
    const resetTimer = () => {
        setTimerRunning(false);
        setTimerLeft(timerTarget);
    };
    const selectTimerPreset = (secs: number) => {
        setTimerRunning(false);
        setTimerTarget(secs);
        setTimerLeft(secs);
    };
    const adjustTimerTarget = (deltaSecs: number) => {
        const next = Math.max(5, timerLeft + deltaSecs);
        setTimerRunning(false);
        setTimerTarget(next);
        setTimerLeft(next);
    };

    // Formatter
    const formatSw = (ms: number) => {
        const totalSecs = Math.floor(ms / 1000);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        const hundredths = Math.floor((ms % 1000) / 10);
        return {
            main: `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
            sub: `.${String(hundredths).padStart(2, '0')}`
        };
    };

    const formatTimer = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const timerPresets = [15, 30, 45, 60, 90, 120, 180, 300];

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-md mx-auto"
            title={
                <div className="flex items-center gap-2">
                    <TimerIcon className="w-5 h-5 text-lime-500" />
                    <h3 className="text-base font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white">
                        {t('customTimer')}
                    </h3>
                </div>
            }
            subtitle={<p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{t('customTimerDesc')}</p>}
            bodyClassName="p-5 space-y-5"
        >
            {/* Tab Switcher */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <button
                    type="button"
                    onClick={() => setMode('stopwatch')}
                    className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                        mode === 'stopwatch'
                            ? 'bg-white dark:bg-zinc-800 text-lime-600 dark:text-lime-400 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                >
                    {t('stopwatch')}
                </button>
                <button
                    type="button"
                    onClick={() => setMode('timer')}
                    className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                        mode === 'timer'
                            ? 'bg-white dark:bg-zinc-800 text-lime-600 dark:text-lime-400 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                >
                    {t('timer')}
                </button>
            </div>

            {mode === 'stopwatch' ? (
                /* Stopwatch View */
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-baseline justify-center font-black tracking-tighter tabular-nums my-4">
                        <span className="text-6xl sm:text-7xl text-zinc-900 dark:text-white">
                            {formatSw(swTime).main}
                        </span>
                        <span className="text-3xl text-lime-500 font-bold ml-1">
                            {formatSw(swTime).sub}
                        </span>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-3 w-full max-w-xs">
                        <button
                            type="button"
                            onClick={resetSw}
                            disabled={swTime === 0}
                            className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 disabled:opacity-30 hover:text-rose-500 active:scale-95 transition-all"
                            title={t('reset')}
                        >
                            <RotateCcw size={20} />
                        </button>

                        <button
                            type="button"
                            onClick={toggleSw}
                            className={`flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest transition-all active:scale-95 shadow-lg ${
                                swRunning
                                    ? 'bg-amber-400 text-zinc-950 hover:bg-amber-500 shadow-amber-400/10'
                                    : 'bg-lime-400 text-zinc-950 hover:bg-lime-500 shadow-lime-400/10'
                            }`}
                        >
                            {swRunning ? (
                                <>
                                    <Pause size={18} className="fill-current" />
                                    {t('pause')}
                                </>
                            ) : (
                                <>
                                    <Play size={18} className="fill-current" />
                                    {t('start')}
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={addLap}
                            disabled={!swRunning}
                            className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 disabled:opacity-30 hover:text-lime-500 active:scale-95 transition-all"
                            title={t('lap')}
                        >
                            <Flag size={20} />
                        </button>
                    </div>

                    {/* Laps List */}
                    {swLaps.length > 0 && (
                        <div className="w-full space-y-2 max-h-40 overflow-y-auto pr-1">
                            <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                                {t('laps')}
                            </h4>
                            <div className="space-y-1.5">
                                {swLaps.map((lap, index) => {
                                    const formatted = formatSw(lap);
                                    return (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center px-3 py-2 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono"
                                        >
                                            <span className="text-zinc-500 font-bold">#{swLaps.length - index}</span>
                                            <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                                {formatted.main}
                                                <span className="text-lime-500">{formatted.sub}</span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Timer View */
                <div className="flex flex-col items-center gap-6">
                    {/* Timer Display */}
                    <div className="relative flex flex-col items-center justify-center my-2">
                        <span className={`text-6xl sm:text-7xl font-black tracking-tighter tabular-nums transition-colors ${
                            timerLeft <= 3 && timerLeft > 0 ? 'text-lime-400 animate-pulse' : 'text-zinc-900 dark:text-white'
                        }`}>
                            {formatTimer(timerLeft)}
                        </span>
                    </div>

                    {/* Stepper Buttons (-15s / +15s) */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => adjustTimerTarget(-15)}
                            className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
                        >
                            <Minus size={12} /> 15s
                        </button>
                        <button
                            type="button"
                            onClick={() => adjustTimerTarget(15)}
                            className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
                        >
                            <Plus size={12} /> 15s
                        </button>
                    </div>

                    {/* Preset Chips */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 w-full max-w-xs">
                        {timerPresets.map((secs) => {
                            const isSelected = timerTarget === secs;
                            const label = secs >= 60 ? `${secs / 60}m` : `${secs}s`;
                            return (
                                <button
                                    key={secs}
                                    type="button"
                                    onClick={() => selectTimerPreset(secs)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 ${
                                        isSelected
                                            ? 'bg-lime-400 text-zinc-950 font-black shadow-sm'
                                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-3 w-full max-w-xs">
                        <button
                            type="button"
                            onClick={resetTimer}
                            className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-rose-500 active:scale-95 transition-all"
                            title={t('reset')}
                        >
                            <RotateCcw size={20} />
                        </button>

                        <button
                            type="button"
                            onClick={toggleTimer}
                            className={`flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest transition-all active:scale-95 shadow-lg ${
                                timerRunning
                                    ? 'bg-amber-400 text-zinc-950 hover:bg-amber-500 shadow-amber-400/10'
                                    : 'bg-lime-400 text-zinc-950 hover:bg-lime-500 shadow-lime-400/10'
                            }`}
                        >
                            {timerRunning ? (
                                <>
                                    <Pause size={18} className="fill-current" />
                                    {t('pause')}
                                </>
                            ) : (
                                <>
                                    <Play size={18} className="fill-current" />
                                    {t('start')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </Drawer>
    );
}
