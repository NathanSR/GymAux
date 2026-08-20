'use client';

import React, { forwardRef, useState } from 'react';
import { Dumbbell, Trophy, Clock, Activity, Scale, Zap, CheckCircle2, Layers, Flame } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { formatDuration } from '@/utils/dateUtil';
import { useExerciseLocalization } from '@/hooks/useExerciseLocalization';

export interface ShareExerciseItem {
    id?: number;
    exerciseId?: number;
    name: string;
    imageUrl?: string | null;
    setsCount: number;
    bestWeight?: number;
    bestReps?: number;
    hasDropset?: boolean;
    technique?: string;
    groupType?: string;
}

export interface ShareExerciseGroup {
    groupType: string;
    exercises: ShareExerciseItem[];
}

export interface WorkoutShareData {
    workoutName: string;
    date: string | Date;
    duration?: number; // em segundos ou ms
    weight?: number; // em kg
    totalVolume?: number; // volume total em kg
    exercises: ShareExerciseItem[];
    groups?: ShareExerciseGroup[];
}

interface WorkoutShareCardProps {
    data: WorkoutShareData;
}

// Subcomponente de Thumbnail do Exercício com Fallback Seguro
function ExerciseThumbnail({ src, alt }: { src?: string | null; alt: string }) {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return (
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-center shrink-0 shadow-inner">
                <Dumbbell className="w-3.5 h-3.5 text-zinc-500" strokeWidth={2} />
            </div>
        );
    }

    return (
        <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-zinc-700/60 shadow-sm flex items-center justify-center">
            <img
                src={src}
                alt={alt}
                crossOrigin="anonymous"
                onError={() => setHasError(true)}
                className="w-full h-full object-cover"
            />
        </div>
    );
}

type VisibleItem =
    | {
          type: 'complex_group';
          groupType: string;
          exercises: ShareExerciseItem[];
      }
    | {
          type: 'straight_exercise';
          exercise: ShareExerciseItem;
      };

export const WorkoutShareCard = forwardRef<HTMLDivElement, WorkoutShareCardProps>(({ data }, ref) => {
    const tShare = useTranslations('Share');
    const tForm = useTranslations('WorkoutForm');
    const locale = useLocale();

    const [logoError, setLogoError] = useState(false);
    const { getLocalizedName, exercisesMap } = useExerciseLocalization();

    // Domínio dinâmico do app
    const getAppDomain = () => {
        const rawUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'gymaux.vercel.app';
        return rawUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
    };

    const rawDate = data?.date ? new Date(data.date) : new Date();
    const validDate = isNaN(rawDate.getTime()) ? new Date() : rawDate;

    const formattedDate = validDate.toLocaleDateString(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).toUpperCase();

    // Duração normalizada (aceita ms ou segundos)
    const getSafeDuration = (rawDuration?: number) => {
        if (!rawDuration || rawDuration <= 0) return '--';
        const ms = rawDuration > 100000 ? rawDuration : rawDuration * 1000;
        return formatDuration(ms);
    };

    // Total de séries calculadas
    const totalSets = (data.exercises || []).reduce((acc, ex) => acc + (ex.setsCount || 0), 0);

    const translateExerciseName = (name: string, exerciseId?: number) => {
        return getLocalizedName(exerciseId, name);
    };

    const getGroupTypeLabel = (type?: string) => {
        if (!type || type === 'straight') return null;
        const key = `groupTypes.${type}`;
        if (tForm.has(key)) return tForm(key);
        return type.replace('_', '-').toUpperCase();
    };

    const getGroupStyle = (type?: string) => {
        switch (type) {
            case 'bi_set':
                return {
                    border: 'border-l-lime-400',
                    badge: 'bg-lime-400/10 text-lime-400 border-lime-400/30'
                };
            case 'tri_set':
                return {
                    border: 'border-l-amber-400',
                    badge: 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                };
            case 'giant_set':
                return {
                    border: 'border-l-purple-400',
                    badge: 'bg-purple-400/10 text-purple-400 border-purple-400/30'
                };
            case 'circuit':
                return {
                    border: 'border-l-cyan-400',
                    badge: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30'
                };
            case 'superset':
                return {
                    border: 'border-l-indigo-400',
                    badge: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/30'
                };
            case 'straight':
            default:
                return {
                    border: 'border-l-zinc-700',
                    badge: 'bg-zinc-800 text-zinc-300 border-zinc-700'
                };
        }
    };

    // Formatação de Volume no idioma ativo (ex: 12.450 em PT, 12,450 em EN)
    const formattedVolume = data.totalVolume
        ? Number(data.totalVolume).toLocaleString(locale)
        : null;

    // Orçamento dinâmico com limite MÁXIMO da proporção 9:16 (768px de altura)
    // O card encolhe naturalmente para treinos curtos (h-auto), eliminando qualquer vazio.
    const totalExercisesCount = data.exercises?.length || 0;
    const MAX_SLOTS = 9.2; // Limite máximo para caber perfeitamente no teto de 768px

    const visibleItems: VisibleItem[] = [];
    let usedSlots = 0;
    let renderedExerciseCount = 0;

    if (data.groups && data.groups.length > 0) {
        for (const group of data.groups) {
            const isComplex = group.groupType && group.groupType !== 'straight';

            if (isComplex) {
                const groupHeaderCost = 0.55;
                const exercisesToInclude: ShareExerciseItem[] = [];

                for (const ex of group.exercises) {
                    const exerciseCost = 0.95;
                    const cost = (exercisesToInclude.length === 0 ? groupHeaderCost : 0) + exerciseCost;
                    const isLastExerciseInWorkout = (renderedExerciseCount + exercisesToInclude.length + 1) === totalExercisesCount;
                    const availableLimit = isLastExerciseInWorkout ? MAX_SLOTS : (MAX_SLOTS - 0.75);

                    if (usedSlots + cost <= availableLimit) {
                        exercisesToInclude.push(ex);
                        usedSlots += cost;
                    } else {
                        break;
                    }
                }

                if (exercisesToInclude.length > 0) {
                    visibleItems.push({
                        type: 'complex_group',
                        groupType: group.groupType,
                        exercises: exercisesToInclude
                    });
                    renderedExerciseCount += exercisesToInclude.length;
                }

                if (exercisesToInclude.length < group.exercises.length) {
                    break;
                }
            } else {
                // Grupo straight: renderiza cada exercício de forma direta e limpa
                for (const ex of group.exercises) {
                    const cost = 0.95;
                    const isLastExerciseInWorkout = (renderedExerciseCount + 1) === totalExercisesCount;
                    const availableLimit = isLastExerciseInWorkout ? MAX_SLOTS : (MAX_SLOTS - 0.75);

                    if (usedSlots + cost <= availableLimit) {
                        visibleItems.push({
                            type: 'straight_exercise',
                            exercise: ex
                        });
                        usedSlots += cost;
                        renderedExerciseCount += 1;
                    } else {
                        break;
                    }
                }

                if (usedSlots >= MAX_SLOTS - 0.75) {
                    break;
                }
            }
        }
    } else if (data.exercises && data.exercises.length > 0) {
        for (const ex of data.exercises) {
            const cost = 0.95;
            const isLastExerciseInWorkout = (renderedExerciseCount + 1) === totalExercisesCount;
            const availableLimit = isLastExerciseInWorkout ? MAX_SLOTS : (MAX_SLOTS - 0.75);

            if (usedSlots + cost <= availableLimit) {
                visibleItems.push({
                    type: 'straight_exercise',
                    exercise: ex
                });
                usedSlots += cost;
                renderedExerciseCount += 1;
            } else {
                break;
            }
        }
    }

    const remainingCount = Math.max(0, totalExercisesCount - renderedExerciseCount);

    return (
        <div
            ref={ref}
            id="gymaux-share-card"
            className="w-[432px] h-auto max-h-[768px] bg-zinc-950 text-white p-5 rounded-[32px] border border-zinc-800/90 shadow-2xl relative overflow-hidden font-sans flex flex-col gap-3.5 select-none"
            style={{
                backgroundImage: 'radial-gradient(circle at 85% 8%, rgba(163, 230, 53, 0.12) 0%, transparent 45%), radial-gradient(circle at 15% 92%, rgba(39, 39, 42, 0.7) 0%, transparent 55%)'
            }}
        >
            {/* Elementos Decorativos de Fundo (Infográfico Tech) */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-zinc-800/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lime-500/[0.02] rounded-full blur-2xl pointer-events-none" />

            {/* SEÇÃO 1: CABEÇALHO DA MARCA & STATUS */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 relative z-10 shrink-0">
                <div className="flex items-center gap-2.5">
                    {!logoError ? (
                        <img
                            src="/logo.png"
                            alt="GymAux"
                            crossOrigin="anonymous"
                            className="w-9 h-9 object-contain rounded-xl shadow-md shadow-lime-400/10"
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-xl bg-lime-400 flex items-center justify-center shadow-lg shadow-lime-400/20 shrink-0">
                            <Dumbbell className="w-5 h-5 text-zinc-950" strokeWidth={2.5} />
                        </div>
                    )}
                    <div>
                        <span className="text-xl font-black italic tracking-tighter uppercase text-white leading-none block">
                            GymAux
                        </span>
                        <span className="text-[8.5px] font-extrabold uppercase tracking-[0.22em] text-lime-400 block mt-0.5">
                            {tShare('dailySupremacy')}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 shadow-sm">
                    <Trophy className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                        {tShare('completed')}
                    </span>
                </div>
            </div>

            {/* SEÇÃO 2: TÍTULO DO TREINO & DATA */}
            <div className="space-y-1 relative z-10 shrink-0">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime-400" />
                    <span>{formattedDate}</span>
                </div>
                <h2 className="text-[22px] font-black italic uppercase tracking-tight text-white leading-tight truncate">
                    {data.workoutName}
                </h2>
            </div>

            {/* SEÇÃO 3: DASHBOARD INFOGRÁFICO DE MÉTRICAS */}
            <div className="grid grid-cols-3 gap-2 relative z-10 shrink-0">
                {/* Duração */}
                <div className="bg-zinc-900/90 border border-zinc-800/80 p-2.5 rounded-xl flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-1 text-lime-400 mb-1">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-400 truncate">
                            {tShare('duration')}
                        </span>
                    </div>
                    <span className="text-sm font-black text-white tracking-tight truncate">
                        {getSafeDuration(data.duration)}
                    </span>
                </div>

                {/* Exercícios & Séries */}
                <div className="bg-zinc-900/90 border border-zinc-800/80 p-2.5 rounded-xl flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-1 text-lime-400 mb-1">
                        <Activity className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-400 truncate">
                            {tShare('exercisesCount')}
                        </span>
                    </div>
                    <span className="text-sm font-black text-white tracking-tight truncate">
                        {totalExercisesCount} <span className="text-[9px] text-zinc-400 font-semibold">({totalSets} {tShare('setsShort')})</span>
                    </span>
                </div>

                {/* Volume Total ou Peso */}
                <div className="bg-zinc-900/90 border border-zinc-800/80 p-2.5 rounded-xl flex flex-col justify-between shadow-sm">
                    <div className="flex items-center gap-1 text-lime-400 mb-1">
                        {formattedVolume ? (
                            <Zap className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                            <Scale className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-400 truncate">
                            {formattedVolume ? tShare('totalVolume') : tShare('weight')}
                        </span>
                    </div>
                    <span className="text-sm font-black text-white tracking-tight truncate">
                        {formattedVolume ? `${formattedVolume} kg` : (data.weight ? `${data.weight} kg` : '--')}
                    </span>
                </div>
            </div>

            {/* SEÇÃO 4: LISTA INFOGRÁFICA DE EXERCÍCIOS */}
            <div className="relative z-10 bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-2xl flex flex-col gap-2 overflow-hidden">
                {/* Header da Lista */}
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 pb-1.5 border-b border-zinc-800/70 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-lime-400" />
                        <span>{tShare('performedExercises')}</span>
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                </div>

                {/* Itens dos Exercícios (Sem quebra de texto, linha única e truncamento com ...) */}
                <div className="flex flex-col gap-1.5 pt-0.5 overflow-hidden">
                    {visibleItems.map((item, idx) => {
                        if (item.type === 'complex_group') {
                            const typeLabel = getGroupTypeLabel(item.groupType);
                            const style = getGroupStyle(item.groupType);

                            return (
                                <div
                                    key={idx}
                                    className={`bg-zinc-950/90 border-l-2 ${style.border} border border-zinc-800/70 p-2 rounded-xl space-y-1.5 shadow-sm`}
                                >
                                    <div className="flex items-center gap-1.5 pb-0.5">
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${style.badge} flex items-center gap-1`}>
                                            <Layers className="w-2.5 h-2.5" />
                                            {typeLabel}
                                        </span>
                                    </div>

                                    {item.exercises.map((ex, eIdx) => {
                                        const localizedName = translateExerciseName(ex.name, ex.exerciseId || ex.id);
                                        const exInfo = (ex.exerciseId || ex.id) ? exercisesMap.get(ex.exerciseId || ex.id!) : undefined;
                                        const imageUrl = ex.imageUrl || exInfo?.imageUrl;

                                        return (
                                            <div key={eIdx} className="flex items-center justify-between gap-2 text-[11px] leading-tight min-w-0">
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <ExerciseThumbnail src={imageUrl} alt={localizedName} />
                                                    <span className="font-bold text-zinc-100 truncate flex-1 min-w-0 tracking-tight" title={localizedName}>
                                                        {localizedName}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {ex.hasDropset && (
                                                        <span className="text-[7.5px] font-black text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded border border-amber-400/25 uppercase tracking-wider whitespace-nowrap">
                                                            {tShare('dropsetBadge')}
                                                        </span>
                                                    )}
                                                    <span className="font-extrabold text-lime-400 text-[10px] bg-lime-400/10 px-1.5 py-0.5 rounded-lg border border-lime-400/20 whitespace-nowrap">
                                                        {ex.setsCount}x {ex.bestWeight ? `${ex.bestWeight}kg` : (ex.bestReps ? `${ex.bestReps} ${tShare('repsShort')}` : '')}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        }

                        // Exercício direto / individual
                        const ex = item.exercise;
                        const localizedName = translateExerciseName(ex.name, ex.exerciseId || ex.id);
                        const exInfo = (ex.exerciseId || ex.id) ? exercisesMap.get(ex.exerciseId || ex.id!) : undefined;
                        const imageUrl = ex.imageUrl || exInfo?.imageUrl;

                        return (
                            <div
                                key={idx}
                                className="bg-zinc-950/90 border border-zinc-800/80 px-2.5 py-1.5 rounded-xl flex items-center justify-between gap-2 text-[11.5px] leading-tight shadow-sm min-w-0"
                            >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <ExerciseThumbnail src={imageUrl} alt={localizedName} />
                                    <span className="font-bold text-zinc-100 truncate flex-1 min-w-0 tracking-tight" title={localizedName}>
                                        {localizedName}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    {ex.hasDropset && (
                                        <span className="text-[7.5px] font-black text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded border border-amber-400/25 uppercase tracking-wider whitespace-nowrap">
                                            {tShare('dropsetBadge')}
                                        </span>
                                    )}
                                    <span className="font-extrabold text-lime-400 text-[10.5px] bg-lime-400/10 px-2 py-0.5 rounded-lg border border-lime-400/20 whitespace-nowrap">
                                        {ex.setsCount}x {ex.bestWeight ? `${ex.bestWeight}kg` : (ex.bestReps ? `${ex.bestReps} ${tShare('repsShort')}` : '')}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Selo Traduzido "+ X Exercícios" para listas grandes que excedam o espaço */}
                {remainingCount > 0 && (
                    <div className="pt-1 shrink-0">
                        <div className="w-full py-1 px-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/70 text-center flex items-center justify-center gap-1.5 text-[9.5px] font-extrabold text-zinc-400 uppercase tracking-widest">
                            <span className="text-lime-400 font-black">+</span>
                            <span>{tShare('moreExercises', { count: remainingCount })}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* SEÇÃO 5: RODAPÉ INFOGRÁFICO / MARCA D'ÁGUA */}
            <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[9.5px] text-zinc-400 font-bold relative z-10 shrink-0">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-lime-400 shadow-sm shadow-lime-400/50" />
                    <span className="uppercase tracking-widest font-black text-zinc-300">{tShare('workoutCompletedSuccess')}</span>
                </div>
                <span className="text-lime-400 font-mono tracking-tight font-black">{getAppDomain()}</span>
            </div>
        </div>
    );
});

WorkoutShareCard.displayName = 'WorkoutShareCard';
