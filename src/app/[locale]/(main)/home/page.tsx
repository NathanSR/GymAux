"use client";

import { useState } from 'react';
import {
    Play,
    Trophy,
    History as HistoryIcon,
    ChevronRight,
    PlayCircle,
    Clock,
    Dumbbell,
    User,
    CheckCircle2,
    Bed,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl'; // Importado useLocale
import { useSession } from '@/hooks/useSession';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRouter } from '@/i18n/routing';
import { ScheduleService } from '@/services/scheduleService';
import { WorkoutService } from '@/services/workoutService';
import { HistoryService } from '@/services/historyService';
import moment from 'moment';
import { SessionService } from '@/services/sessionService';
import { MenuTab } from '@/components/MenuTab';
import ProfileMenu from '@/components/home/ProfileMenu';
import Loading from '@/app/[locale]/loading';
import { Workout } from '@/config/types';
import { formatDuration, getRelativeTime } from '@/utils/dateUtil';

export default function HomePage() {
    const t = useTranslations('Home');
    const te = useTranslations('Exercises');
    const locale = useLocale(); // Detecta o idioma atual (pt, en, es)
    const router = useRouter();
    const { activeUser, loading } = useSession();

    const today = moment().toDate();
    const dayOfWeek = moment().day();
    const startTodayDate = moment().startOf('day').toDate();
    const endTodayDate = moment().endOf('day').toDate();

    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const activeSchedule = useLiveQuery(() =>
        ScheduleService.getActiveSchedule(activeUser?.id ?? -1),
        [activeUser?.id]
    );

    const todayWorkout = useLiveQuery(() =>
        WorkoutService.getWorkoutById(activeSchedule?.workouts?.[dayOfWeek] ?? -1),
        [activeSchedule?.id]
    );

    const estimatedTimeTodayWorkout = Math.round(todayWorkout?.exercises.reduce((acc: number, exercise) => (acc + ((exercise.sets * (exercise.reps * 2.5 + exercise.restTime)) / 60)), 0) || 0);

    const todayHistory = useLiveQuery(() =>
        HistoryService
            .getHistoryByRange(activeUser?.id ?? -1, startTodayDate, endTodayDate)
            .then(h => h.find(h => h.workoutId === todayWorkout?.id)),
        [activeUser?.id, todayWorkout?.id]) || null;

    const historyList = useLiveQuery(() =>
        HistoryService
            .getUserHistory(activeUser?.id ?? -1, 1, 4),
        [activeUser?.id, todayWorkout?.id]) || [];

    const sessionList = useLiveQuery(() =>
        SessionService
            .getSessionsByUserId(activeUser?.id ?? -1),
        [activeUser?.id, todayWorkout?.id]) || [];

    // Data formatada respeitando o locale dinâmico
    const formattedDate = new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }).format(today);

    // Botao Play no MenuTab
    const onPlayWorkout = async () => {
        if (!todayWorkout) return;

        const session = sessionList.find(s => s.workoutId === todayWorkout.id);

        if (session) return SessionService.onResumeWorkout(session.id as number, router);
        else SessionService.onPlayWorkout(todayWorkout, router)
    }

    if (loading) return <Loading />

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-6 pb-32 transition-colors duration-300 font-sans">

            <header className="mb-8 flex justify-between items-center relative">
                <div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                        {formattedDate}
                    </p>
                    <h1 className="text-2xl font-black tracking-tight">
                        {t('greeting', { name: activeUser?.name || t('defaultUser') })}
                    </h1>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 overflow-hidden active:scale-90 transition-transform shadow-sm"
                    >
                        {activeUser?.avatar
                            ? <img src={activeUser.avatar} alt="User" className="w-full h-full object-cover" />
                            : <User size={24} />}
                    </button>
                    <ProfileMenu showProfileMenu={showProfileMenu} setShowProfileMenu={setShowProfileMenu} />
                </div>
            </header>

            {/* Treino do dia */}
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
                            <Dumbbell size={14} /> {todayWorkout?.exercises?.length || 0} {t('exercises')}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} /> {t('estimatedTime', { time: estimatedTimeTodayWorkout })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            disabled={!todayWorkout || !!todayHistory}
                            className={` w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 ${todayHistory || !todayWorkout
                                ? 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : 'cursor-pointer bg-zinc-950 text-white hover:scale-[1.02]'
                                }`}
                            onClick={() => SessionService.onPlayWorkout(todayWorkout as Workout, router)}
                        >
                            {todayHistory ? <CheckCircle2 size={20} /> : todayWorkout ? <Play size={20} fill="currentColor" /> : <Bed size={20} fill="currentColor" />}
                            {!todayWorkout ? t('restButton') : todayHistory ? t('finishedButton') : t('startButton')}
                        </button>
                    </div>
                </div>
            </section>

            {/* Sessão de treinos */}
            <section className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-10">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                        {t('openSessions')}
                    </h2>
                    <span className="px-2 py-0.5 bg-lime-100 dark:bg-lime-500/10 text-lime-600 dark:text-lime-400 text-[10px] font-black rounded-full">
                        {t('pendingCount', { count: sessionList.length })}
                    </span>
                </div>

                <div className="grid gap-3">
                    {sessionList.map((session) => {
                        const total = session.exercisesToDo.length;
                        const done = session.exercisesDone.length;
                        const progressPercent = Math.round((done / total) * 100);

                        return (
                            <div key={session.id} className="group relative flex flex-col gap-4 p-4 bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm transition-all active:scale-[0.98]">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 flex items-center justify-center bg-lime-100 dark:bg-lime-500/10 rounded-2xl text-lime-500">
                                        <HistoryIcon size={22} className="animate-pulse" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black uppercase tracking-tight truncate text-zinc-800 dark:text-zinc-100">
                                            {session.workoutName}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-lime-400 rounded-full" style={{ width: `${progressPercent}%` }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-400 whitespace-nowrap">
                                                {t('exsCount', { done, total })}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => SessionService.onResumeWorkout(session.id as number, router)}
                                        className="flex items-center justify-center w-10 h-10 bg-zinc-900 dark:bg-lime-400 text-white dark:text-zinc-950 rounded-xl hover:scale-105 transition-transform cursor-pointer shadow-lg"
                                    >
                                        <Play size={18} fill="currentColor" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-zinc-50 dark:border-zinc-800/50">
                                    <span className="text-[10px] text-zinc-400 font-medium">
                                        {t('pausedAt', { date: session.pausedAt!.toLocaleString(locale) })}
                                    </span>
                                    <p className="text-[10px] font-bold text-lime-500 uppercase tracking-wider">
                                        {t('continueFrom', { exercise: te.has(session.exercisesToDo[done]?.exerciseName) ? te(session.exercisesToDo[done]?.exerciseName) : t('next') })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Histórico de treinos */}
            <section className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-lg flex items-center gap-2 uppercase italic tracking-tight">
                        <HistoryIcon size={20} className="text-lime-500" />
                        {t('history')}
                    </h3>
                    <button
                        onClick={() => router.push("/history")}
                        className="text-[10px] text-lime-600 dark:text-lime-400 font-black uppercase tracking-widest flex items-center gap-1"
                    >
                        {t('viewAll')} <ChevronRight size={14} />
                    </button>
                </div>

                <div className="space-y-4">
                    {historyList.map((item) => {
                        const timeAgo = getRelativeTime(item.endDate as Date, locale);
                        const durationDisplay = formatDuration(item.duration || 0);

                        return (
                            <div key={item.id} className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-[24px] border border-zinc-100 dark:border-zinc-800/50 hover:border-lime-400/30 transition-colors">
                                <div className="w-12 h-12 bg-lime-400/10 rounded-2xl flex items-center justify-center text-lime-500 shadow-inner">
                                    <CheckCircle2 size={22} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
                                        {item.workoutName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-zinc-500 font-bold capitalize">
                                            {timeAgo}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                        <div className="flex items-center gap-1 text-[10px] text-lime-600 dark:text-lime-400 font-black uppercase">
                                            <Clock size={10} />
                                            {durationDisplay}
                                        </div>
                                    </div>
                                </div>

                                {/* Opcional: Indicador de volume ou seta */}
                                <ChevronRight size={16} className="text-zinc-300 dark:text-zinc-700" />
                            </div>
                        );
                    })}
                </div>
            </section>

            <MenuTab
                onPlay={onPlayWorkout}
                completed={!todayWorkout || !!todayHistory}
            />
        </div>
    );
}