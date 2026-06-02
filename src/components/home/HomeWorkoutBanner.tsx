"use client";

import {
    Play,
    Flame,
    CheckCircle2,
    Dumbbell,
    Clock,
    Trophy,
    Bed,
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

    return (
        <section className="relative group mb-8">
            <div className={`absolute -inset-1 rounded-[40px] blur opacity-20 transition duration-1000 ${todayHistory ? 'bg-zinc-500' : 'bg-lime-400'}`}></div>

            <div className={`relative rounded-[32px] p-8 shadow-xl transition-all duration-500 ${todayHistory
                ? 'bg-zinc-200 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400'
                : 'bg-gradient-to-br from-lime-400 to-lime-600 text-zinc-950'
                }`}>
                <div className="flex justify-between items-start mb-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${todayHistory ? 'bg-gradient-to-br from-lime-400 to-lime-600 text-zinc-950' : 'bg-black/10'}`}>
                        {todayHistory ? t('completedToday') : t('todayWorkout')}
                    </span>
                    {todayHistory ? <CheckCircle2 size={22} className='text-lime-400' /> : <Trophy size={22} className="opacity-40" />}
                </div>

                <h2 className={`text-3xl font-black mb-2 leading-tight uppercase italic ${todayHistory ? 'opacity-50' : ''}`}>
                    {todayWorkout ? todayWorkout.name : t('restDay')}
                </h2>

                <div className="flex items-center gap-6 mb-8 text-[10px] font-black uppercase tracking-wider opacity-70">
                    <div className="flex items-center gap-1.5">
                        <Dumbbell size={14} /> {todayWorkout?.exercises?.reduce((acc, g) => acc + g.exercises.length, 0) || 0} {t('exercises')}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} /> {estimatedTimeTodayWorkout}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        disabled={!todayWorkout || !!todayHistory}
                        className={` w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 ${todayHistory || !todayWorkout
                            ? 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : 'cursor-pointer bg-zinc-950 text-white hover:scale-[1.02]'
                            }`}
                        onClick={() => startWorkout(todayWorkout as Workout)}
                    >
                        {todayHistory ? <CheckCircle2 size={20} /> : todayWorkout ? <Play size={20} fill="currentColor" /> : <Bed size={20} fill="currentColor" />}
                        {!todayWorkout ? t('restButton') : todayHistory ? t('finishedButton') : t('startButton')}
                    </button>
                </div>
            </div>
        </section>
    );
}
