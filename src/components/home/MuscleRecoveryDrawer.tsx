'use client';

import React, { useState, useMemo } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { MuscleRecoverySummary, MuscleRecoveryItem } from '@/utils/muscleRecovery';
import { CATEGORY_METADATA } from '@/config/constants';
import { useTranslations } from 'next-intl';
import { Activity, BatteryCharging, CheckCircle2, AlertCircle, Dumbbell, Sparkles, Clock, Flame } from 'lucide-react';
import { cn } from '@/utils/cn';
import { LocalizedExerciseName } from '@/components/ui/LocalizedExerciseName';

interface MuscleRecoveryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    summary: MuscleRecoverySummary | null;
}

type FilterType = 'all' | 'needsRest' | 'recovered';

export function MuscleRecoveryDrawer({
    isOpen,
    onClose,
    summary,
}: MuscleRecoveryDrawerProps) {
    const t = useTranslations('MuscleRecovery');
    const tc = useTranslations('Categories');
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

    const filteredMuscles = useMemo(() => {
        if (!summary) return [];
        switch (selectedFilter) {
            case 'needsRest':
                return summary.muscles.filter(m => m.percentage < 90);
            case 'recovered':
                return summary.muscles.filter(m => m.percentage >= 90);
            case 'all':
            default:
                return summary.muscles;
        }
    }, [summary, selectedFilter]);

    if (!summary) return null;

    const needsRestTotal = summary.recoveringCount + summary.fatiguedCount;

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            side="bottom"
            showHandle={true}
            enableDrag={true}
            maxHeight="90dvh"
            bodyClassName="p-3 sm:p-6 overflow-x-hidden"
            title={
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-lime-400/20 text-lime-600 dark:text-lime-400 flex items-center justify-center font-black shrink-0">
                        <Activity size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <span className="text-sm sm:text-base font-black uppercase tracking-tight text-zinc-900 dark:text-white truncate">
                        {t('drawerTitle')}
                    </span>
                </div>
            }
            subtitle={
                <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                    {t('drawerSubtitle')}
                </p>
            }
        >
            <div className="space-y-4 sm:space-y-6 pb-8 overflow-x-hidden max-w-full">
                {/* Score Geral & Banner de Prontidão */}
                <div className="relative overflow-hidden p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center justify-between gap-3 sm:gap-4">
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                    {t('readiness')}
                                </span>
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide",
                                    summary.overallPercentage >= 85
                                        ? "bg-lime-500/20 text-lime-600 dark:text-lime-400"
                                        : summary.overallPercentage >= 65
                                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                                            : "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                                )}>
                                    {summary.overallPercentage >= 85
                                        ? t('readyToTrain')
                                        : summary.overallPercentage >= 65
                                            ? t('partiallyRecovered')
                                            : t('needsRest')}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                                    {summary.overallPercentage}%
                                </span>
                                <span className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate">
                                    {t('recoveredCount', { count: summary.recoveredCount })}
                                    {needsRestTotal > 0 && ` · ${t('needsRestCount', { count: needsRestTotal })}`}
                                </span>
                            </div>
                        </div>

                        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-lime-600 dark:text-lime-400 shrink-0 shadow-inner">
                            <BatteryCharging className="w-5 h-5 sm:w-7 sm:h-7" />
                        </div>
                    </div>

                    {/* Barra de progresso do score global */}
                    <div className="mt-3.5 sm:mt-4 w-full h-1.5 sm:h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-700 ease-out",
                                summary.overallPercentage >= 85
                                    ? "bg-gradient-to-r from-lime-500 to-emerald-400"
                                    : summary.overallPercentage >= 65
                                        ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                        : "bg-gradient-to-r from-rose-500 to-red-400"
                            )}
                            style={{ width: `${summary.overallPercentage}%` }}
                        />
                    </div>

                    {/* Dica / Recomendação Inteligente */}
                    <div className="mt-3.5 pt-3 sm:mt-4 sm:pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex items-start gap-2">
                        <Sparkles size={14} className="text-lime-500 shrink-0 mt-0.5 sm:w-4 sm:h-4" />
                        <div className="text-[10px] sm:text-[11px] leading-relaxed min-w-0 flex-1">
                            <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                {t('suggestionTitle')}:{' '}
                            </span>
                            {summary.readyToTrain.length > 0 ? (
                                <span className="text-zinc-600 dark:text-zinc-400">
                                    {t('suggestionReadyDesc')}{' '}
                                    <strong className="text-zinc-900 dark:text-white font-black">
                                        {summary.readyToTrain.slice(0, 4).map(m => tc(m)).join(', ')}
                                    </strong>.
                                </span>
                            ) : (
                                <span className="text-zinc-600 dark:text-zinc-400">
                                    {t('allMusclesReady')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filtros em Abas (Grid Responsivo que não quebra no 320px) */}
                <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                    <button
                        type="button"
                        onClick={() => setSelectedFilter('all')}
                        className={cn(
                            "py-1.5 sm:py-2 px-1 sm:px-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all text-center truncate",
                            selectedFilter === 'all'
                                ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-xs font-black"
                                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                        )}
                    >
                        {t('filterAll')} ({summary.muscles.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedFilter('needsRest')}
                        className={cn(
                            "py-1.5 sm:py-2 px-1 sm:px-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all text-center truncate",
                            selectedFilter === 'needsRest'
                                ? "bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-xs font-black"
                                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                        )}
                    >
                        {t('filterNeedsRest')} ({needsRestTotal})
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedFilter('recovered')}
                        className={cn(
                            "py-1.5 sm:py-2 px-1 sm:px-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all text-center truncate",
                            selectedFilter === 'recovered'
                                ? "bg-white dark:bg-zinc-800 text-lime-600 dark:text-lime-400 shadow-xs font-black"
                                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                        )}
                    >
                        {t('filterRecovered')} ({summary.recoveredCount})
                    </button>
                </div>

                {/* Lista de Cards por Grupo Muscular */}
                <div className="space-y-3">
                    {filteredMuscles.map(item => (
                        <MuscleCard key={item.category} item={item} />
                    ))}
                </div>
            </div>
        </Drawer>
    );
}

function MuscleCard({ item }: { item: MuscleRecoveryItem }) {
    const t = useTranslations('MuscleRecovery');
    const tc = useTranslations('Categories');
    const meta = CATEGORY_METADATA[item.category];

    const is100 = item.percentage >= 90;
    const isMid = item.percentage >= 65 && item.percentage < 90;
    const isFatigued = item.percentage < 65;

    return (
        <div className={cn(
            "p-3 sm:p-4 rounded-2xl sm:rounded-3xl border space-y-2.5 sm:space-y-3 transition-colors overflow-hidden max-w-full",
            isFatigued
                ? "bg-rose-500/[0.08] dark:bg-rose-950/25 border-rose-500/25 dark:border-rose-500/35"
                : isMid
                    ? "bg-amber-500/[0.08] dark:bg-amber-950/25 border-amber-500/25 dark:border-amber-500/35"
                    : "bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800/80"
        )}>
            {/* Linha Principal do Card com Contenção de Overflow */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    {/* Imagem do Grupo Muscular */}
                    <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700/60 p-0 m-0">
                        {meta?.imagePath ? (
                            <>
                                <img
                                    src={meta.imagePath}
                                    alt={tc(item.category)}
                                    className="w-full h-full object-cover p-0 m-0"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        const icon = e.currentTarget.nextElementSibling;
                                        if (icon) icon.classList.remove('hidden');
                                    }}
                                />
                                <Dumbbell size={20} className="text-zinc-400 hidden" />
                            </>
                        ) : (
                            <Dumbbell size={20} className="text-zinc-400" />
                        )}
                    </div>

                    {/* Textos do Músculo com truncamento seguro */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-white truncate">
                                {tc(item.category)}
                            </h4>
                            {item.isLargeMuscle && (
                                <span className="hidden xs:inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
                                    Principal
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-medium truncate mt-0.5">
                            {is100
                                ? t('fullyRecovered')
                                : t('timeRemaining', { hours: item.estimatedHoursRemaining })}
                        </p>
                    </div>
                </div>

                {/* Badge de Porcentagem & Estado: Mantido intacto sem vazar do card */}
                <div className="text-right shrink-0">
                    <div className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black",
                        is100
                            ? "bg-lime-500/15 text-lime-600 dark:text-lime-400 border border-lime-500/30"
                            : isMid
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                                : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                    )}>
                        {is100 ? <CheckCircle2 size={11} /> : isMid ? <Clock size={11} /> : <AlertCircle size={11} />}
                        <span className="tabular-nums">{item.percentage}%</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-tight">
                        {is100 ? t('stateRecovered') : isMid ? t('stateRecovering') : t('stateFatigued')}
                    </p>
                </div>
            </div>

            {/* Barra de Progresso com Cor Condicional */}
            <div className="w-full h-1.5 sm:h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-500",
                        is100
                            ? "bg-gradient-to-r from-lime-500 to-emerald-400"
                            : isMid
                                ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                : "bg-gradient-to-r from-rose-500 to-red-400"
                    )}
                    style={{ width: `${item.percentage}%` }}
                />
            </div>

            {/* Diagnóstico Fisiológico & Histórico (Wrap para telas estreitas) */}
            <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 pt-0.5">
                <div className="flex items-center gap-1 min-w-0">
                    <Clock size={11} className="opacity-70 shrink-0" />
                    <span className="truncate">
                        {item.hoursSinceLastTrained !== null
                            ? t('lastTrained', { hours: item.hoursSinceLastTrained })
                            : t('noRecentTraining')}
                    </span>
                </div>
                {item.totalEffectiveSets > 0 && (
                    <div className="flex items-center gap-1 shrink-0">
                        <Flame size={11} className="text-amber-500 shrink-0" />
                        <span>{t('effectiveVolume', { sets: item.totalEffectiveSets })}</span>
                    </div>
                )}
            </div>

            {/* Exercícios Recentes com Quebra e Truncamento Suave */}
            {item.recentExercises.length > 0 && (
                <div className="mt-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                        {t('triggerExercises')}
                    </span>
                    <div className="flex flex-wrap gap-1">
                        {item.recentExercises.slice(0, 4).map((ex, idx) => (
                            <span
                                key={idx}
                                className={cn(
                                    "px-1.5 py-0.5 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-medium border flex items-center gap-1 max-w-full truncate",
                                    ex.isPrimary
                                        ? "bg-zinc-200/70 dark:bg-zinc-800/90 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                                        : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400"
                                )}
                            >
                                <span className="truncate">
                                    <LocalizedExerciseName
                                        exerciseId={ex.exerciseId}
                                        fallbackName={ex.exerciseName}
                                    />
                                </span>
                                <span className="opacity-75 font-bold shrink-0">({ex.setsCount}x)</span>
                                {!ex.isPrimary && (
                                    <span className="text-[8px] opacity-60 uppercase shrink-0">· Sinergia</span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
