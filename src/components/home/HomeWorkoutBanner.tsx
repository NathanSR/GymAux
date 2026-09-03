"use client";

import {
    Play,
    CheckCircle2,
    Dumbbell,
    Clock,
    Bed,
    Layers,
    Sparkles,
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { useSessionActions } from '@/hooks/useSessionActions';
import { Workout, History } from '@/config/types';
import { formatDuration } from '@/utils/dateUtil';
import { useTodayWorkoutStatus } from '@/hooks/useTodayWorkoutStatus';

export function HomeWorkoutBanner({
    todayWorkout,
    todayHistory: initialTodayHistory,
}: {
    todayWorkout: Workout | null;
    todayHistory: History | null;
}) {
    const t = useTranslations('Home');
    const { startWorkout } = useSessionActions();

    const { todayHistory } = useTodayWorkoutStatus(todayWorkout, initialTodayHistory);

    const exercisesCount = todayWorkout?.exercises?.reduce((acc, g) => acc + (g.exercises?.length || 0), 0) || 0;
    const setsCount = todayWorkout?.exercises?.reduce(
        (acc, g) => acc + g.exercises.reduce((sAcc, e) => sAcc + (e.sets?.length || 0), 0),
        0
    ) || 0;

    const estimatedTimeTodayWorkout = formatDuration(
        Math.round(
            (todayWorkout?.exercises?.reduce((acc, group) => {
                return acc + group.exercises.reduce((gAcc, exercise) => {
                    const exSeconds = exercise.sets.reduce((sAcc, set) => {
                        return sAcc + ((set.reps * 2.5) + set.restTime) * 1000;
                    }, 0);
                    return gAcc + exSeconds;
                }, 0);
            }, 0) || 0)
        )
    );

    // Estado 1: Dia de Descanso (Sem treino programado para hoje)
    if (!todayWorkout) {
        return (
            <section className="mb-5 sm:mb-6">
                <div className="relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-zinc-100/90 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-800/80 shadow-xs transition-all">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-11 h-11 rounded-2xl bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0 border border-zinc-300/40 dark:border-zinc-700/50">
                                <Bed size={20} />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                                        {t('restDay')}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 truncate mt-0.5">
                                    {t('restDescription')}
                                </p>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/60 text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 shrink-0">
                            <Sparkles size={12} className="text-amber-500" />
                            <span>Recuperação</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Estado 2: Treino Concluído Hoje
    if (todayHistory) {
        const completedDuration = todayHistory.duration ? formatDuration(todayHistory.duration) : null;

        return (
            <section className="mb-5 sm:mb-6">
                <div className="relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-zinc-100/90 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-800/80 shadow-xs transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                                    <CheckCircle2 size={11} />
                                    {t('completedToday')}
                                </span>
                                {completedDuration && (
                                    <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                                        <Clock size={11} className="text-emerald-500" />
                                        {completedDuration}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-base sm:text-lg font-black uppercase italic tracking-tight text-zinc-800 dark:text-zinc-200 truncate">
                                {todayWorkout.name}
                            </h2>

                            <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                <span>{exercisesCount} {t('exercises')}</span>
                                <span>•</span>
                                <span>{setsCount} {t('sets')}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-200/60 dark:border-zinc-800/60">
                            <div className="w-full sm:w-auto h-10 px-4 rounded-xl bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border border-zinc-300/40 dark:border-zinc-700/40">
                                <CheckCircle2 size={15} className="text-emerald-500" />
                                <span>{t('finishedButton')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Estado 3: Treino do Dia Ativo e Pronto para Iniciar (Background Gradiente Lime com Alto Contraste)
    return (
        <section className="mb-5 sm:mb-6 group">
            <div className="relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-lime-400 via-lime-400 to-lime-500 text-zinc-950 border border-lime-300/60 dark:border-lime-400/40 shadow-xl shadow-lime-500/20 transition-all">
                {/* Glow sutil no fundo */}
                <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/20 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Informações do Treino */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/10 text-zinc-950 border border-black/10 text-[9px] font-black uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-pulse" />
                                {t('todayWorkout')}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-black text-zinc-900/80">
                                <Clock size={12} className="text-zinc-950" />
                                <span>{estimatedTimeTodayWorkout}</span>
                            </span>
                        </div>

                        <h2 className="text-lg sm:text-xl font-black uppercase italic tracking-tight text-zinc-950 truncate mb-2.5">
                            {todayWorkout.name}
                        </h2>

                        {/* Chips de Métricas Rápidas */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-zinc-900">
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/10 border border-black/10 text-zinc-950">
                                <Dumbbell size={12} className="text-zinc-950" />
                                <span className="font-black text-zinc-950">{exercisesCount}</span>
                                <span className="text-zinc-800 text-[10px] uppercase font-black tracking-wide">{t('exercises')}</span>
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/10 border border-black/10 text-zinc-950">
                                <Layers size={12} className="text-zinc-950" />
                                <span className="font-black text-zinc-950">{setsCount}</span>
                                <span className="text-zinc-800 text-[10px] uppercase font-black tracking-wide">{t('sets')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Botão de Iniciar Sessão */}
                    <div className="shrink-0">
                        <button
                            onClick={() => startWorkout(todayWorkout as Workout)}
                            className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-2xl bg-zinc-950 hover:bg-zinc-900 text-white font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-black/20 active:scale-95 transition-all cursor-pointer"
                        >
                            <Play size={16} fill="currentColor" className="text-lime-400" />
                            <span>{t('startButton')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
