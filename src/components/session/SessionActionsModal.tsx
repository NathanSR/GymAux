'use client';

import React from 'react';
import { Plus, SkipForward, FastForward, CheckCircle, RefreshCw, Timer, Clock, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Drawer } from '@/components/ui/Drawer';

interface SessionActionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSkipSet: () => void;
    onSkipExercise: () => void;
    onAddSet: () => void;
    onForceFinishWorkout: () => void;
    isGroupAlternating: boolean;
    onSubstituteExercise: () => void;
    onOpenStandaloneTimer?: () => void;
    currentRestDuration?: number;
    onUpdateRestDuration?: (seconds: number) => void;
}

export function SessionActionsModal({
    isOpen,
    onClose,
    onSkipSet,
    onSkipExercise,
    onAddSet,
    onForceFinishWorkout,
    isGroupAlternating,
    onSubstituteExercise,
    onOpenStandaloneTimer,
    currentRestDuration = 60,
    onUpdateRestDuration
}: SessionActionsModalProps) {
    const t = useTranslations('Session');

    const quickRestPresets = [30, 45, 60, 90, 120, 180];

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-md mx-auto"
            title={<h3 className="text-base font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white">{t('actionsModalTitle')}</h3>}
            subtitle={<p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{t('actionsModalSubtitle')}</p>}
            bodyClassName="p-6 space-y-3"
        >
            {/* Quick Rest Time Adjuster */}
            {onUpdateRestDuration && (
                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-lime-600 dark:text-lime-400" />
                            <span className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                {t('adjustRestTime')}
                            </span>
                        </div>
                        <span className="text-xs font-black tabular-nums px-2 py-0.5 rounded-lg bg-lime-400/20 text-lime-600 dark:text-lime-400 border border-lime-400/30">
                            {currentRestDuration}s
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                            type="button"
                            onClick={() => onUpdateRestDuration(Math.max(5, currentRestDuration - 15))}
                            className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white active:scale-95 transition-all text-xs font-bold"
                            title="-15s"
                        >
                            <Minus size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => onUpdateRestDuration(currentRestDuration + 15)}
                            className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white active:scale-95 transition-all text-xs font-bold"
                            title="+15s"
                        >
                            <Plus size={14} />
                        </button>

                        <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700 mx-1" />

                        {quickRestPresets.map((secs) => {
                            const isCurrent = currentRestDuration === secs;
                            return (
                                <button
                                    key={secs}
                                    type="button"
                                    onClick={() => onUpdateRestDuration(secs)}
                                    className={`px-2.5 py-1.5 rounded-xl text-xs font-black tracking-wider transition-all active:scale-95 ${
                                        isCurrent
                                            ? 'bg-lime-400 text-zinc-950 shadow-sm'
                                            : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                                    }`}
                                >
                                    {secs}s
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Standalone Timer & Stopwatch */}
            {onOpenStandaloneTimer && (
                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        onOpenStandaloneTimer();
                    }}
                    className="w-full py-4 px-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-lime-600 dark:text-lime-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-xs cursor-pointer"
                >
                    <Timer size={18} className="text-lime-600 dark:text-lime-400 flex-shrink-0" />
                    <div className="flex flex-col items-start leading-none">
                        <span className="font-black text-left">{t('customTimer')}</span>
                        <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 mt-0.5 text-left normal-case">
                            {t('customTimerDesc')}
                        </span>
                    </div>
                </button>
            )}

            {/* 1. Add Set */}
            <button
                type="button"
                onClick={() => {
                    onAddSet();
                    onClose();
                }}
                className="w-full py-4 px-4 bg-lime-400 hover:bg-lime-500 text-zinc-950 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-lime-400/10"
            >
                <Plus size={16} strokeWidth={3} className="flex-shrink-0" />
                <div className="flex flex-col items-start leading-none">
                    <span className="font-black text-left">{t('addExtraSet')}</span>
                    <span className="text-[9px] font-bold text-zinc-850 opacity-60 mt-0.5 text-left normal-case">
                        {t('addExtraSetDesc')}
                    </span>
                </div>
            </button>

            {/* Substituir Exercício */}
            <button
                type="button"
                onClick={() => {
                    onSubstituteExercise();
                    onClose();
                }}
                className="w-full py-4 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800/30 text-lime-600 dark:text-lime-400 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
            >
                <RefreshCw size={16} className="text-lime-600 dark:text-lime-400 flex-shrink-0" />
                <div className="flex flex-col items-start leading-none">
                    <span className="font-black text-left">{t('substituteExercise')}</span>
                    <span className="text-[9px] font-bold text-zinc-500 mt-0.5 text-left normal-case">
                        {t('substituteExerciseDesc')}
                    </span>
                </div>
            </button>

            <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800/60 my-2" />

            {/* 2. Skip Set */}
            <button
                type="button"
                onClick={() => {
                    onSkipSet();
                    onClose();
                }}
                className="w-full py-4 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-800/30 text-zinc-700 dark:text-zinc-200 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
            >
                <SkipForward size={16} className="text-zinc-400 flex-shrink-0" />
                <div className="flex flex-col items-start leading-none">
                    <span className="font-black text-left">{t('skipSet')}</span>
                    <span className="text-[9px] font-bold text-zinc-500 mt-0.5 text-left normal-case">
                        {t('skipSetDesc')}
                    </span>
                </div>
            </button>

            {/* 3. Skip Exercise / Skip Group */}
            <button
                type="button"
                onClick={() => {
                    onSkipExercise();
                    onClose();
                }}
                className="w-full py-4 px-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
            >
                <FastForward size={16} className="flex-shrink-0" />
                <div className="flex flex-col items-start leading-none">
                    <span className="font-black text-left">
                        {isGroupAlternating ? t('skipGroup') : t('skipExercise')}
                    </span>
                    <span className="text-[9px] font-bold text-rose-500/80 dark:text-rose-400/60 mt-0.5 text-left normal-case">
                        {t('skipExerciseDesc')}
                    </span>
                </div>
            </button>

            <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800/60 my-2" />

            {/* 4. Finish Workout Now */}
            <button
                type="button"
                onClick={() => {
                    onForceFinishWorkout();
                    onClose();
                }}
                className="w-full py-4 px-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-rose-500 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
            >
                <CheckCircle size={16} className="text-zinc-500 flex-shrink-0" />
                <div className="flex flex-col items-start leading-none">
                    <span className="font-black text-left">{t('finishNow')}</span>
                    <span className="text-[9px] font-bold text-zinc-500 mt-0.5 text-left normal-case">
                        {t('finishNowDesc')}
                    </span>
                </div>
            </button>
        </Drawer>
    );
}
