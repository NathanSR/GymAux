"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
    Play,
    Calendar,
    PlusCircle,
    Trophy,
    History,
    AlertCircle,
    ChevronRight,
    Languages,
    Moon,
    Sun,
    Clock,
    Dumbbell,
    Hand
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSession } from '@/hooks/useSession';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/config/db';
import { useRouter } from '@/i18n/routing';
import { MenuTab } from '@/components/MenuTab';



export default function HomePage() {
    const t = useTranslations('Home');
    const router = useRouter();

    // Simulação de hooks que falhariam sem a instalação local
    const [isDarkMode, setIsDarkMode] = useState(true);

    const { activeUser, loading } = useSession();

    const activeSchedule = useLiveQuery(() =>
        db.schedules.where('userId').equals(activeUser?.id ?? -1).filter(s => s.active === true).first(),
        [activeUser?.id]);

    const workouts = useLiveQuery(() =>
        db.workouts.where('userId').equals(activeUser?.id ?? -1).toArray(),
        [activeUser?.id]) || [];

    const history = useLiveQuery(() =>
        db.history.where('userId').equals(activeUser?.id ?? -1).reverse().toArray(),
        [activeUser?.id]) || [];

    const locale = "pt";

    const today = new Date();
    const dayOfWeek = today.getDay();

    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }).format(today);

    // 2. Identifica o treino de hoje usando a interface Schedule
    const todayWorkout = useMemo(() => {
        if (!activeSchedule || !workouts) return null;
        const workoutIdForToday = activeSchedule.workouts[dayOfWeek];
        return workouts.find(w => w.id === workoutIdForToday);
    }, [dayOfWeek]);

    // 3. Lógica de Alerta de Ontem
    const missedWorkout = useMemo(() => {
        const yesterdayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const yesterdayId = activeSchedule?.workouts[yesterdayIdx] || null;
        return yesterdayId ? workouts!.find(w => w.id === yesterdayId) : null;
    }, [dayOfWeek]);

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className={`${isDarkMode ? 'dark' : ''}`}>
            <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-6 pb-32 transition-colors duration-300 font-sans">

                {/* Header */}
                <header className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">
                            {t('greeting', { name: activeUser?.name || '' })} 👋
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm capitalize">{formattedDate}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-lime-500 transition-colors"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 flex items-center gap-1 text-xs font-bold">
                            <Languages size={20} />
                            {locale.toUpperCase()}
                        </button>
                    </div>
                </header>

                {/* Alerta de Treino Perdido */}
                {missedWorkout && (
                    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-[24px] mb-8 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                        <div className="bg-orange-500 p-2 rounded-xl text-white">
                            <AlertCircle size={20} />
                        </div>
                        <div className="flex-1 text-sm">
                            <p className="font-bold text-orange-600 dark:text-orange-500">{t('missedTitle')}</p>
                            <p className="text-orange-800/70 dark:text-orange-200/50">{t('missedDesc', { name: missedWorkout.name })}</p>
                        </div>
                    </div>
                )}

                {/* Card Principal: Treino do Dia */}
                <section className="relative group mb-10">
                    <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 to-lime-600 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative bg-gradient-to-br from-lime-400 to-lime-500 dark:from-lime-400 dark:to-lime-600 rounded-[32px] p-8 shadow-xl text-zinc-950">
                        <div className="flex justify-between items-start mb-6">
                            <span className="bg-black/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {t('todayWorkoutLabel')}
                            </span>
                            <Trophy size={20} className="opacity-40" />
                        </div>

                        <h2 className="text-3xl font-black mb-2 leading-tight">
                            {todayWorkout ? todayWorkout.name : t('noWorkoutToday')}
                        </h2>

                        <div className="flex items-center gap-4 mb-8 text-sm font-medium opacity-70">
                            <div className="flex items-center gap-2">
                                <Clock size={16} /> {todayWorkout ? '45 min' : '--'}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black uppercase">
                                <Dumbbell size={16} /> {todayWorkout?.exercises?.length || 0} {t('exercisesCount')}
                            </div>
                        </div>

                        <button
                            disabled={!todayWorkout}
                            className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg"
                        >
                            <Play size={22} fill="currentColor" />
                            {t('startNow').toUpperCase()}
                        </button>
                    </div>
                </section>

                {/* Atalhos */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <button
                        onClick={() => router.push('/exercises')}
                        className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[32px] flex flex-col items-center gap-3 active:scale-95 shadow-sm cursor-pointer"
                    >
                        <div className="bg-amber-500/10 p-4 rounded-2xl text-amber-500"><Hand size={28} /></div>
                        <span className="text-sm font-black uppercase tracking-tighter">{t('exercises')}</span>
                    </button>
                    <button
                        onClick={() => router.push('/workouts')}
                        className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[32px] flex flex-col items-center gap-3 active:scale-95 shadow-sm cursor-pointer"
                    >
                        <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-500"><PlusCircle size={28} /></div>
                        <span className="text-sm font-black uppercase tracking-tighter">{t('newWorkout')}</span>
                    </button>
                    <button className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[32px] flex flex-col items-center gap-3 active:scale-95 shadow-sm cursor-pointer">
                        <div className="bg-purple-500/10 p-4 rounded-2xl text-purple-500"><Calendar size={28} /></div>
                        <span className="text-sm font-black uppercase tracking-tighter">{t('schedule')}</span>
                    </button>
                </div>

                {/* Atividade Recente baseada no TrainingLog */}
                <section className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm mb-10">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-lg flex items-center gap-2">
                            <History size={20} className="text-lime-500" />
                            {t('activeGoals')}
                        </h3>
                        <button className="text-[10px] text-lime-600 dark:text-lime-400 font-black uppercase tracking-widest flex items-center gap-1">
                            {t('viewAll')} <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {workouts!.slice(0, 3).map(workout => {
                            const sessionsCount = workout.id === 101 ? 8 : 4;
                            const goal = 12;
                            return (
                                <div key={workout.id} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <p className="font-bold text-sm">{workout.name}</p>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase">
                                            {sessionsCount}/{goal} {t('sessions')}
                                        </p>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-lime-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${(sessionsCount / goal) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Tab Bar Inferior */}
                <MenuTab user={activeUser} todayWorkout={todayWorkout} />
            </div>
        </div>
    );
}