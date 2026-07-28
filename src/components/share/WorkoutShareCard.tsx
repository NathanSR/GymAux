'use client';

import React, { forwardRef, useState } from 'react';
import { Dumbbell, Trophy, Clock, Activity, Scale, Zap, CheckCircle2, Layers } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { formatDuration } from '@/utils/dateUtil';

export interface ShareExerciseItem {
    name: string;
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
    duration?: number; // em segundos
    weight?: number; // em kg
    totalVolume?: number; // volume total em kg
    exercises: ShareExerciseItem[];
    groups?: ShareExerciseGroup[];
}

interface WorkoutShareCardProps {
    data: WorkoutShareData;
}

export const WorkoutShareCard = forwardRef<HTMLDivElement, WorkoutShareCardProps>(({ data }, ref) => {
    const tShare = useTranslations('Share');
    const tEx = useTranslations('Exercises');
    const tForm = useTranslations('WorkoutForm');
    const locale = useLocale();

    const [logoError, setLogoError] = useState(false);

    // Domínio dinâmico do app vindo da variável de ambiente da Vercel ou fallback simples
    const getAppDomain = () => {
        const rawUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'gymaux.vercel.app';
        return rawUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
    };

    const formattedDate = new Date(data.date).toLocaleDateString(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).toUpperCase();

    const totalSets = data.exercises.reduce((acc, ex) => acc + (ex.setsCount || 0), 0);

    const translateExerciseName = (name: string) => {
        if (!name) return '';
        if (tEx.has(name)) return tEx(name);
        return name;
    };

    const getGroupTypeLabel = (type?: string) => {
        if (!type || type === 'straight') return null;
        const key = `groupTypes.${type}`;
        if (tForm.has(key)) return tForm(key);
        return type.replace('_', '-').toUpperCase();
    };

    const hasComplexGroups = data.groups && data.groups.some(g => g.groupType !== 'straight');

    const getGroupStyle = (type?: string) => {
        switch (type) {
            case 'bi_set':
                return {
                    border: 'border-l-lime-400',
                    text: 'text-lime-400'
                };
            case 'tri_set':
                return {
                    border: 'border-l-amber-400',
                    text: 'text-amber-400'
                };
            case 'giant_set':
                return {
                    border: 'border-l-purple-400',
                    text: 'text-purple-400'
                };
            case 'circuit':
                return {
                    border: 'border-l-cyan-400',
                    text: 'text-cyan-400'
                };
            case 'superset':
                return {
                    border: 'border-l-indigo-400',
                    text: 'text-indigo-400'
                };
            case 'straight':
            default:
                return {
                    border: 'border-l-zinc-700',
                    text: 'text-zinc-400'
                };
        }
    };

    return (
        <div
            ref={ref}
            id="gymaux-share-card"
            className="w-[430px] bg-zinc-950 text-white p-5 rounded-[28px] border border-zinc-800/90 shadow-2xl relative overflow-hidden font-sans space-y-4 flex flex-col justify-between"
            style={{
                backgroundImage: 'radial-gradient(circle at 85% 10%, rgba(163, 230, 53, 0.09) 0%, transparent 45%), radial-gradient(circle at 15% 90%, rgba(39, 39, 42, 0.6) 0%, transparent 55%)'
            }}
        >
            {/* Elementos Decorativos de Fundo */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-lime-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

            {/* Cabeçalho de Marca (Logo Image ou Icon Fallback + Tagline) */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5 relative z-10">
                <div className="flex items-center gap-2.5">
                    {!logoError ? (
                        <img
                            src="/logo.png"
                            alt="GymAux Logo"
                            className="w-9 h-9 object-contain rounded-xl"
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-xl bg-lime-400 flex items-center justify-center shadow-md shadow-lime-400/20 shrink-0">
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

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-400/10 border border-lime-400/25 text-lime-400">
                    <Trophy className="w-3 h-3" />
                    <span className="text-[9.5px] font-black uppercase tracking-wider">
                        {tShare('completed')}
                    </span>
                </div>
            </div>

            {/* Título do Treino & Data */}
            <div className="space-y-1 relative z-10">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    {formattedDate}
                </div>
                <h2 className="text-2xl font-black italic uppercase tracking-tight text-white leading-tight break-words">
                    {data.workoutName}
                </h2>
            </div>

            {/* Grid de Estatísticas Principais (Reduzido para Economizar Altura) */}
            <div className="grid grid-cols-3 gap-2 relative z-10">
                <div className="bg-zinc-900/90 border border-zinc-800/80 p-2.5 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-lime-400 mb-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-400">
                            {tShare('duration')}
                        </span>
                    </div>
                    <span className="text-sm font-black text-white tracking-tight">
                        {data.duration ? formatDuration(data.duration) : '--'}
                    </span>
                </div>

                <div className="bg-zinc-900/90 border border-zinc-800/80 p-2.5 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-lime-400 mb-0.5">
                        <Activity className="w-3.5 h-3.5" />
                        <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-400">
                            {tShare('exercisesCount')}
                        </span>
                    </div>
                    <span className="text-sm font-black text-white tracking-tight">
                        {data.exercises.length} <span className="text-[9px] text-zinc-400 font-normal">({totalSets} {tShare('setsShort')})</span>
                    </span>
                </div>

                <div className="bg-zinc-900/90 border border-zinc-800/80 p-2.5 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center gap-1 text-lime-400 mb-0.5">
                        {data.totalVolume ? <Zap className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
                        <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-400">
                            {data.totalVolume ? tShare('totalVolume') : tShare('weight')}
                        </span>
                    </div>
                    <span className="text-sm font-black text-white tracking-tight">
                        {data.totalVolume ? `${data.totalVolume} kg` : (data.weight ? `${data.weight} kg` : '--')}
                    </span>
                </div>
            </div>

            {/* Lista de Exercícios / Grupos Destaque (Design Coeso com border-l-2 para todos os tipos) */}
            {data.exercises.length > 0 && (
                <div className="space-y-1.5 relative z-10 bg-zinc-900/50 border border-zinc-800/70 p-3 rounded-xl">
                    <div className="text-[8.5px] font-black uppercase tracking-[0.2em] text-zinc-400 pb-1 border-b border-zinc-800/50 flex justify-between items-center">
                        <span>{tShare('performedExercises')}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    </div>

                    <div className="space-y-1.5 pt-0.5 max-h-[195px] overflow-hidden">
                        {hasComplexGroups && data.groups ? (
                            // Exibição por Grupos (Straight, Bi-set, Tri-set, Superset, Circuito, etc.)
                            data.groups.slice(0, 4).map((group, gIdx) => {
                                const isComplex = group.groupType !== 'straight';
                                const typeLabel = getGroupTypeLabel(group.groupType);
                                const style = getGroupStyle(group.groupType);

                                return (
                                    <div
                                        key={gIdx}
                                        className={`bg-zinc-950/80 border-l-2 ${style.border} border border-zinc-800/60 p-2 rounded-lg space-y-1`}
                                    >
                                        {isComplex && (
                                            <div className={`flex items-center gap-1.5 text-[8.5px] font-black ${style.text} uppercase tracking-widest pb-0.5`}>
                                                <Layers className={`w-3 h-3 ${style.text}`} />
                                                <span>{typeLabel}</span>
                                            </div>
                                        )}

                                        {group.exercises.map((ex, eIdx) => (
                                            <div key={eIdx} className="flex items-center justify-between text-[11px] leading-tight">
                                                <span className="font-semibold text-zinc-200 truncate max-w-[220px]">
                                                    {translateExerciseName(ex.name)}
                                                </span>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {ex.hasDropset && (
                                                        <span className="text-[8px] font-black text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded border border-amber-400/20 uppercase tracking-wider">
                                                            {tShare('dropsetBadge')}
                                                        </span>
                                                    )}
                                                    <span className="font-extrabold text-lime-400 text-[10px] bg-lime-400/10 px-1.5 py-0.5 rounded border border-lime-400/20">
                                                        {ex.setsCount}x {ex.bestWeight ? `${ex.bestWeight}kg` : (ex.bestReps ? `${ex.bestReps} reps` : '')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })
                        ) : (
                            // Exibição Direta Compacta (Flat com border-l-2 padronizado)
                            data.exercises.slice(0, 5).map((ex, idx) => (
                                <div
                                    key={idx}
                                    className="bg-zinc-950/80 border-l-2 border-l-zinc-700 border border-zinc-800/60 p-2 rounded-lg flex items-center justify-between text-[11px] leading-tight"
                                >
                                    <span className="font-semibold text-zinc-200 truncate max-w-[220px]">
                                        {translateExerciseName(ex.name)}
                                    </span>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        {ex.hasDropset && (
                                            <span className="text-[8px] font-black text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded border border-amber-400/20 uppercase tracking-wider">
                                                {tShare('dropsetBadge')}
                                            </span>
                                        )}
                                        <span className="font-extrabold text-lime-400 text-[10px] bg-lime-400/10 px-1.5 py-0.5 rounded border border-lime-400/20">
                                            {ex.setsCount}x {ex.bestWeight ? `${ex.bestWeight}kg` : (ex.bestReps ? `${ex.bestReps} reps` : '')}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}

                        {data.exercises.length > (hasComplexGroups ? 4 : 5) && (
                            <div className="text-[9.5px] font-extrabold text-zinc-500 uppercase tracking-widest text-center pt-0.5 italic">
                                {tShare('moreExercises', { count: data.exercises.length - (hasComplexGroups ? 4 : 5) })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Rodapé / Marca D'água */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[9.5px] text-zinc-400 font-bold relative z-10">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                    <span className="uppercase tracking-widest">{tShare('workoutCompletedSuccess')}</span>
                </div>
                <span className="text-zinc-400 font-mono tracking-tight font-bold">{getAppDomain()}</span>
            </div>
        </div>
    );
});

WorkoutShareCard.displayName = 'WorkoutShareCard';
