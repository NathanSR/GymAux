'use client';

import React, { forwardRef } from 'react';
import { Dumbbell, Trophy, Clock, Activity, Scale, Zap, CheckCircle2 } from 'lucide-react';
import { formatDuration } from '@/utils/dateUtil';

export interface ShareExerciseItem {
    name: string;
    setsCount: number;
    bestWeight?: number;
    bestReps?: number;
}

export interface WorkoutShareData {
    workoutName: string;
    date: string | Date;
    duration?: number; // em segundos
    weight?: number; // em kg
    totalVolume?: number; // volume total em kg
    exercises: ShareExerciseItem[];
}

interface WorkoutShareCardProps {
    data: WorkoutShareData;
}

export const WorkoutShareCard = forwardRef<HTMLDivElement, WorkoutShareCardProps>(({ data }, ref) => {
    const formattedDate = new Date(data.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).toUpperCase();

    const totalSets = data.exercises.reduce((acc, ex) => acc + (ex.setsCount || 0), 0);

    return (
        <div
            ref={ref}
            id="gymaux-share-card"
            className="w-[460px] bg-zinc-950 text-white p-7 rounded-[32px] border border-zinc-800 shadow-2xl relative overflow-hidden font-sans space-y-6 flex flex-col justify-between"
            style={{
                backgroundImage: 'radial-gradient(circle at 80% 10%, rgba(163, 230, 53, 0.08) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(39, 39, 42, 0.5) 0%, transparent 60%)'
            }}
        >
            {/* Elementos Decorativos de Fundo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

            {/* Cabeçalho de Marca (Logo GymAux + Tagline) */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5 relative z-10">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-lime-400 flex items-center justify-center shadow-lg shadow-lime-400/20">
                        <Dumbbell className="w-6 h-6 text-zinc-950" strokeWidth={2.5} />
                    </div>
                    <div>
                        <span className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none block">
                            GymAux
                        </span>
                        <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-lime-400 block mt-0.5">
                            Superação Diária
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400">
                    <Trophy className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Concluído</span>
                </div>
            </div>

            {/* Título do Treino & Data */}
            <div className="space-y-1.5 relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    {formattedDate}
                </div>
                <h2 className="text-2.5xl font-black italic uppercase tracking-tight text-white leading-tight break-words">
                    {data.workoutName}
                </h2>
            </div>

            {/* Grid de Estatísticas Principais */}
            <div className="grid grid-cols-3 gap-2.5 relative z-10">
                <div className="bg-zinc-900/90 border border-zinc-800/80 p-3.5 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-lime-400 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Tempo</span>
                    </div>
                    <span className="text-base font-black text-white tracking-tight">
                        {data.duration ? formatDuration(data.duration) : '--'}
                    </span>
                </div>

                <div className="bg-zinc-900/90 border border-zinc-800/80 p-3.5 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-lime-400 mb-1">
                        <Activity className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Exercícios</span>
                    </div>
                    <span className="text-base font-black text-white tracking-tight">
                        {data.exercises.length} <span className="text-[10px] text-zinc-400">({totalSets} srs)</span>
                    </span>
                </div>

                <div className="bg-zinc-900/90 border border-zinc-800/80 p-3.5 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-lime-400 mb-1">
                        {data.totalVolume ? <Zap className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                        <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
                            {data.totalVolume ? 'Volume' : 'Peso'}
                        </span>
                    </div>
                    <span className="text-base font-black text-white tracking-tight">
                        {data.totalVolume ? `${data.totalVolume} kg` : (data.weight ? `${data.weight} kg` : '--')}
                    </span>
                </div>
            </div>

            {/* Lista de Exercícios Destaque */}
            {data.exercises.length > 0 && (
                <div className="space-y-2 relative z-10 bg-zinc-900/40 border border-zinc-800/60 p-4 rounded-2xl">
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 pb-1 border-b border-zinc-800/50 flex justify-between items-center">
                        <span>Exercícios Realizados</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    </div>

                    <div className="space-y-2 pt-1 max-h-[220px] overflow-hidden">
                        {data.exercises.slice(0, 5).map((ex, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="font-bold text-zinc-200 truncate max-w-[240px]">
                                    {ex.name}
                                </span>
                                <span className="font-extrabold text-lime-400 text-[11px] shrink-0 bg-lime-400/10 px-2 py-0.5 rounded-md border border-lime-400/20">
                                    {ex.setsCount}x {ex.bestWeight ? `${ex.bestWeight}kg` : (ex.bestReps ? `${ex.bestReps} reps` : '')}
                                </span>
                            </div>
                        ))}

                        {data.exercises.length > 5 && (
                            <div className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest text-center pt-1 italic">
                                + {data.exercises.length - 5} exercícios concluídos
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Rodapé / Marca D'água */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400 font-bold relative z-10">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                    <span className="uppercase tracking-widest">Treino Finalizado com Sucesso</span>
                </div>
                <span className="text-zinc-400 font-mono tracking-tight">gymaux.app</span>
            </div>
        </div>
    );
});

WorkoutShareCard.displayName = 'WorkoutShareCard';
