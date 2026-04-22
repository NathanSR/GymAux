"use client";

import { useState } from 'react';
import {
    Play,
    Plus,
    Flame,
    CheckCircle2,
    Calendar,
    ChevronRight,
    ArrowRight,
    Search,
    Dumbbell,
    Clock,
    History as HistoryIcon,
    Trash2,
    Trophy,
    User,
    Bed,
} from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useSessionActions } from '@/hooks/useSessionActions';
import { MenuTab } from '@/components/ui/MenuTab';
import ProfileMenu from '@/components/home/ProfileMenu';
import ConnectionConfirmationModal from '@/components/home/ConnectionConfirmationModal';
import { Workout, History, Session, User as AppUser } from '@/config/types';
import { formatDuration, getRelativeTime } from '@/utils/dateUtil';
import Link from 'next/link';

// --- Sub-components for Suspense Support ---

/**
 * HomeHeader Component
 */
export function HomeHeader({ activeUser, formattedDate }: { activeUser: AppUser | null, formattedDate: string }) {
    const t = useTranslations('Home');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <header className="mb-8 flex justify-between items-center relative">
            <div>
                <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    {formattedDate}
                </p>
                <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
                    {t('greeting', { name: activeUser?.name || t('defaultUser') })}
                </h1>
            </div>

            <div className="relative">
                <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="group relative w-12 h-12 rounded-[20px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 overflow-hidden active:scale-95 transition-all shadow-sm hover:shadow-md hover:border-lime-500/50"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-400/0 to-lime-400/0 group-hover:from-lime-400/5 group-hover:to-lime-400/10 transition-all duration-500" />
                    {activeUser?.avatar
                        ? <img src={activeUser.avatar} alt="User" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        : <User size={22} className="group-hover:scale-110 transition-transform duration-500" />}
                </button>
                <ProfileMenu
                    showProfileMenu={showProfileMenu}
                    setShowProfileMenu={setShowProfileMenu}
                    activeUser={activeUser}
                />
            </div>
        </header>
    );
}

/**
 * HomeWorkoutBanner Component
 */
export function HomeWorkoutBanner({ todayWorkout, todayHistory }: { todayWorkout: Workout | null, todayHistory: History | null }) {
    const t = useTranslations('Home');
    const { startWorkout } = useSessionActions();

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

/**
 * HomeLists Component
 */
export function HomeLists({ historyList, sessionList, activeUserId }: { historyList: History[], sessionList: Session[], activeUserId: string }) {
    const t = useTranslations('Home');
    const te = useTranslations('Exercises');
    const locale = useLocale();
    const router = useRouter();
    const { resumeWorkout, cancelSession } = useSessionActions();
    const [sessions, setSessions] = useState<Session[]>(sessionList);

    const handleCancelSession = async (sessionId: string) => {
        const cancelled = await cancelSession(sessionId);
        if (cancelled) {
            setSessions(prev => prev.filter(s => s.id !== sessionId));
        }
    };

    return (
        <>
            {/* Sessão de treinos em aberto */}
            {sessions.length > 0 && (
                <section className="relative overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[32px] sm:rounded-[40px] p-4 sm:p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-lime-500/5 mb-8 sm:mb-12 group/section">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 sm:w-64 sm:h-64 bg-lime-500/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

                    <div className="flex items-center justify-between mb-6 sm:mb-8 relative">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-lime-600 dark:text-lime-400">
                                {t('openSessions')}
                            </h2>
                            <p className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                {t('pendingCount', { count: sessions.length })}
                                <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:gap-4 relative">
                        {sessions.map((session) => {
                            const total = session.exercisesToDo.length;
                            const done = session.exercisesDone.filter(g => g.exercises.length > 0).length;
                            const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

                            return (
                                <div
                                    key={session.id}
                                    className="group relative flex flex-col gap-4 sm:gap-5 p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-[24px] sm:rounded-[32px] border border-zinc-100 dark:border-zinc-800/50 transition-all duration-500 hover:border-lime-500/30 hover:shadow-lg"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl text-lime-500 shadow-sm border border-zinc-100 dark:border-zinc-800">
                                                <div className="absolute inset-0 bg-lime-500/5 rounded-2xl blur-sm" />
                                                <HistoryIcon size={20} className="sm:w-6 sm:h-6 relative z-10" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm sm:text-base font-black uppercase italic tracking-tighter truncate text-zinc-900 dark:text-zinc-100">
                                                    {session.workoutName}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <div className="flex-1 h-1.5 sm:h-2 bg-zinc-200 dark:bg-zinc-800/50 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all duration-1000 ease-out"
                                                            style={{ width: `${progressPercent}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] sm:text-[11px] font-black text-zinc-500 dark:text-zinc-400 tabular-nums shrink-0">
                                                        {progressPercent}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 sm:ml-auto">
                                            <button
                                                onClick={() => handleCancelSession(session.id!)}
                                                className="flex-1 sm:flex-none flex items-center justify-center h-12 sm:w-12 sm:h-12 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-xl sm:rounded-2xl transition-all border border-zinc-200/50 dark:border-zinc-700/50 active:scale-95"
                                            >
                                                <Trash2 size={18} className="sm:w-5 sm:h-5" />
                                            </button>
                                            <button
                                                onClick={() => resumeWorkout(session.id!)}
                                                className="flex-[2] sm:flex-none flex items-center justify-center h-12 sm:w-12 sm:h-12 bg-lime-400 text-zinc-950 hover:bg-lime-300 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-lime-500/10 active:scale-95 font-black"
                                            >
                                                <Play size={18} fill="currentColor" className="sm:w-5 sm:h-5" />
                                                <span className="sm:hidden ml-2 uppercase italic tracking-tighter text-sm">{t('resume')}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400">
                                                {t('pausedAt', { date: '' }).split(':')[0]}
                                            </span>
                                            <span className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-300 font-bold">
                                                {session.pausedAt?.toLocaleString(locale, { hour: '2-digit', minute: '2-digit' }) || ''}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400">
                                                {t('next')}
                                            </span>
                                            <p className="text-[10px] sm:text-[11px] font-black text-lime-500 uppercase italic tracking-tight truncate max-w-[120px] sm:max-w-none">
                                                {(() => {
                                                    const nextGroup = session.exercisesToDo[session.current?.groupIndex || 0];
                                                    const nextExercise = nextGroup?.exercises?.[session.current?.exerciseIndex || 0];
                                                    const name = nextExercise?.exerciseName;
                                                    return name && te.has(name) ? te(name) : name || t('next');
                                                })()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Histórico de treinos */}
            <section className="relative bg-zinc-50/50 dark:bg-zinc-900/30 rounded-[32px] sm:rounded-[40px] p-5 sm:p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner group/history mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                    <div className="flex flex-col gap-1">
                        <p className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase text-zinc-900 dark:text-zinc-100">
                            {t('history')}
                        </p>
                    </div>

                    <Link
                        href="/history"
                        className="w-full sm:w-auto h-11 sm:h-10 px-6 sm:px-4 bg-white dark:bg-zinc-800 text-[10px] text-zinc-900 dark:text-zinc-100 font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-lime-500/50 active:scale-95 transition-all shadow-sm group/btn"
                    >
                        {t('viewAll')}
                        <ChevronRight size={14} className="text-lime-500 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid gap-3">
                    {historyList.map((item) => {
                        const timeAgo = item.endDate ? getRelativeTime(item.endDate as Date, locale) : "";
                        const durationDisplay = formatDuration(item.duration || 0);

                        return (
                            <Link
                                key={item.id}
                                href={`/history?date=${new Date(item.date).toISOString()}&workoutId=${item.workoutId}`}
                                className="group relative flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white dark:bg-zinc-900 rounded-[24px] sm:rounded-[28px] border border-zinc-100 dark:border-zinc-800/80 hover:border-lime-500/30 hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.98]"
                            >
                                <div className="shrink-0 w-11 h-11 sm:w-14 sm:h-14 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg sm:rounded-2xl flex items-center justify-center text-lime-500 transition-colors group-hover:bg-lime-500/10">
                                    <CheckCircle2 size={20} className="sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1.5 sm:mb-1">
                                        <p className="text-sm font-black uppercase italic tracking-tight text-zinc-900 dark:text-zinc-100 truncate pr-2">
                                            {item.workoutName}
                                        </p>
                                        <span className="text-[8px] sm:text-[9px] text-zinc-400 font-bold uppercase tracking-wider shrink-0">
                                            {timeAgo}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 sm:py-1 bg-lime-500/5 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] text-lime-600 dark:text-lime-400 font-black uppercase">
                                            <Clock size={11} className="sm:w-3 sm:h-3" />
                                            {durationDisplay}
                                        </div>
                                        <span className="hidden sm:block w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-zinc-400 font-bold uppercase">
                                            <Calendar size={11} className="sm:w-3 sm:h-3" />
                                            {item.endDate && item.endDate.toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {activeUserId && <ConnectionConfirmationModal userId={activeUserId} />}
        </>
    );
}

/**
 * Monolithic Entry Point (Optional, for backward compatibility or simple use cases)
 */
export default function HomeClient({
    activeUser,
    initialTodayWorkout,
    initialTodayHistory,
    initialHistoryList,
    initialSessionList
}: {
    activeUser: AppUser | null;
    initialActiveSchedule: any;
    initialTodayWorkout: Workout | null;
    initialTodayHistory: History | null;
    initialHistoryList: History[];
    initialSessionList: Session[];
}) {
    const locale = useLocale();
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(today);
    const { startWorkout } = useSessionActions();

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-6 pb-32 transition-colors duration-300 font-sans">
            <HomeHeader activeUser={activeUser} formattedDate={formattedDate} />
            <HomeWorkoutBanner todayWorkout={initialTodayWorkout} todayHistory={initialTodayHistory} />
            <HomeLists historyList={initialHistoryList} sessionList={initialSessionList} activeUserId={activeUser?.id!} />

            <MenuTab onPlay={() => startWorkout(initialTodayWorkout as Workout)} completed={!initialTodayWorkout || !!initialTodayHistory} />
        </div>
    );
}

// Attach subcomponents to the main functional component for easier access (e.g. HomeClient.Header)
HomeClient.Header = HomeHeader;
HomeClient.WorkoutBanner = HomeWorkoutBanner;
HomeClient.Lists = HomeLists;

