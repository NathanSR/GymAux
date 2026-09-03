'use client';

import React, { useState } from 'react';
import { useMuscleRecovery } from '@/hooks/useMuscleRecovery';
import { MuscleRecoveryDrawer } from './MuscleRecoveryDrawer';
import { CATEGORY_METADATA } from '@/config/constants';
import { useTranslations } from 'next-intl';
import { Activity, ChevronRight, Dumbbell, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Skeleton } from '@/components/ui/Skeleton';

interface MuscleRecoveryWidgetProps {
    userId?: string;
}

export function MuscleRecoveryWidget({ userId }: MuscleRecoveryWidgetProps) {
    const { summary, isLoading } = useMuscleRecovery(userId);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const t = useTranslations('MuscleRecovery');
    const tc = useTranslations('Categories');

    if (isLoading && !summary) {
        return (
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                    <Skeleton className="h-4 w-36 rounded-md" />
                </div>
                <div className="p-4 rounded-3xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                    <div className="flex gap-2.5 overflow-hidden">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Skeleton key={i} className="w-16 h-20 rounded-2xl shrink-0" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!summary) return null;

    const needsRestTotal = summary.recoveringCount + summary.fatiguedCount;
    const isFullReady = summary.overallPercentage >= 95 && needsRestTotal === 0;

    return (
        <>
            <section className="mb-6">
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                    <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                        {t('title')}
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={() => setIsDrawerOpen(true)}
                    className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 flex items-center gap-1 transition-colors group/btn py-1 px-2 -mr-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 cursor-pointer"
                >
                    <span>{t('viewDetails')}</span>
                    <ChevronRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
            </div>

            <div className="p-4 rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-800/80 shadow-xs">
                {/* Header interno com Leitura Rápida */}
                <div
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex items-center justify-between gap-3 mb-3 cursor-pointer group"
                >
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className={cn(
                            "w-7 h-7 rounded-xl flex items-center justify-center font-black shrink-0 transition-transform group-hover:scale-105",
                            isFullReady
                                ? "bg-lime-400 text-zinc-950 shadow-sm shadow-lime-500/20"
                                : summary.overallPercentage >= 70
                                    ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                                    : "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                        )}>
                            {isFullReady ? <Sparkles size={14} /> : <Activity size={14} />}
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                                    {isFullReady ? t('allMusclesReady') : t('readyToTrain')}
                                </span>
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                                    isFullReady
                                        ? "bg-lime-500/20 text-lime-600 dark:text-lime-400"
                                        : summary.overallPercentage >= 70
                                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                            : "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                                )}>
                                    {summary.overallPercentage}%
                                </span>
                            </div>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium truncate">
                                {needsRestTotal > 0
                                    ? `${t('needsRestCount', { count: needsRestTotal })} · ${t('recoveredCount', { count: summary.recoveredCount })}`
                                    : t('readyToTrain')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista Horizontal de Músculos com Imagem e Percentual Sobreposto */}
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {summary.muscles.map((muscle) => {
                        const meta = CATEGORY_METADATA[muscle.category];
                        const is100 = muscle.percentage >= 90;
                        const isMid = muscle.percentage >= 65 && muscle.percentage < 90;
                        const isFatigued = muscle.percentage < 65;

                        return (
                            <button
                                key={muscle.category}
                                type="button"
                                onClick={() => setIsDrawerOpen(true)}
                                className={cn(
                                    "group/item relative flex flex-col justify-between rounded-2xl border transition-all active:scale-95 shrink-0 cursor-pointer w-[76px] h-[76px] min-w-[76px] min-h-[76px] max-w-[76px] max-h-[76px] aspect-square overflow-hidden p-0 m-0 shadow-xs",
                                    isFatigued
                                        ? "bg-rose-500/15 dark:bg-rose-950/40 border-rose-500/60 hover:border-rose-400 shadow-rose-950/30"
                                        : isMid
                                            ? "bg-amber-500/15 dark:bg-amber-950/40 border-amber-500/60 hover:border-amber-400 shadow-amber-950/30"
                                            : "bg-lime-500/15 dark:bg-lime-950/30 border-lime-500/40 hover:border-lime-400 shadow-lime-950/20"
                                )}
                            >
                                {/* Imagem que Preenche 100% do Aspect Square (Zero Padding e Zero Margem) */}
                                {meta?.imagePath ? (
                                    <>
                                        <img
                                            src={meta.imagePath}
                                            alt={tc(muscle.category)}
                                            width={76}
                                            height={76}
                                            className="absolute inset-0 w-full h-full max-w-full max-h-full object-cover block p-0 m-0 group-hover/item:scale-105 transition-transform"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const icon = e.currentTarget.nextElementSibling;
                                                if (icon) icon.classList.remove('hidden');
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center text-zinc-400 hidden">
                                            <Dumbbell size={24} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                                        <Dumbbell size={24} />
                                    </div>
                                )}

                                {/* Percentual Sobreposto no Topo Direito */}
                                <div className="relative z-10 flex justify-end p-1">
                                    <span
                                        className={cn(
                                            "px-1.5 py-0.5 rounded-[5px] text-[9px] font-black tracking-tighter leading-none shadow-md backdrop-blur-xs",
                                            is100
                                                ? "bg-lime-400 text-zinc-950 font-black"
                                                : isMid
                                                    ? "bg-amber-400 text-zinc-950 font-black"
                                                    : "bg-rose-500 text-white font-black animate-pulse"
                                        )}
                                    >
                                        {muscle.percentage}%
                                    </span>
                                </div>

                                {/* Nome do Músculo na Base (Texto com Truncamento estrito sem quebra) */}
                                <div className="relative z-10 w-full pt-3 pb-1 px-1 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex items-center justify-center">
                                    <span className="text-[9px] font-black tracking-tight text-white uppercase truncate text-center w-full block whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                                        {tc(muscle.category)}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>

        {/* Drawer Detalhado (Reutiliza o Drawer nativo da aplicação) */}
        <MuscleRecoveryDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            summary={summary}
        />
        </>
    );
}
