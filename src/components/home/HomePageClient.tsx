'use client';

import { useSession } from '@/hooks/useSession';
import { useDexieActiveSchedule, useDexieHistory, useDexieWorkouts } from '@/hooks/useDexieData';
import { useDataPreloader } from '@/hooks/useDataPreloader';
import { HomeHeader as HomeUIHeader } from '@/components/home/HomeHeader';
import { HomeWorkoutBanner as HomeUIWorkoutBanner } from '@/components/home/HomeWorkoutBanner';
import { HomeLists } from '@/components/home/HomeLists';
import { BannerSkeleton, ListSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { getBrazilToday, getBrazilDayRange } from '@/utils/dateUtil';
import { useEffect, useState } from 'react';
import { Workout, History } from '@/config/types';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/config/db';
import { stopTopLoader } from '@/utils/topLoader';
import { WorkoutGeneratorModal } from '@/components/workouts/WorkoutGeneratorModal';
import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function HomePageClient() {
    const { activeUser, loading: sessionLoading } = useSession();
    useDataPreloader(activeUser?.id);
    const tg = useTranslations('WorkoutGenerator');
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

    useEffect(() => {
        stopTopLoader();
    }, []);

    const activeSchedule = useDexieActiveSchedule(activeUser?.id);
    const historyList = useDexieHistory(activeUser?.id, 4) || [];
    const userWorkouts = useDexieWorkouts(activeUser?.id) || [];

    const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
    const [todayHistory, setTodayHistory] = useState<History | null>(null);

    const activeSessions = useLiveQuery(
        async () => {
            if (!activeUser?.id) return [];
            return await db.sessions
                .where('userId')
                .equals(activeUser.id)
                .and(s => !s.isFinishedLocally)
                .toArray();
        },
        [activeUser?.id]
    );

    useEffect(() => {
        if (!activeUser?.id || !activeSchedule) {
            setTodayWorkout(null);
            setTodayHistory(null);
            return;
        }

        const today = getBrazilToday();
        const dayOfWeek = today.getDay();
        const workoutIdForToday = activeSchedule.workouts?.[dayOfWeek];

        if (workoutIdForToday) {
            const foundWorkout = userWorkouts.find(w => w.id === workoutIdForToday) || null;
            setTodayWorkout(foundWorkout);

            if (foundWorkout?.id) {
                const { start, end } = getBrazilDayRange();
                const matchedHistory = historyList.find(h => {
                    const hTime = new Date(h.date).getTime();
                    return h.workoutId === foundWorkout.id && hTime >= start.getTime() && hTime <= end.getTime();
                });
                setTodayHistory(matchedHistory || null);
            }
        } else {
            setTodayWorkout(null);
            setTodayHistory(null);
        }
    }, [activeUser?.id, activeSchedule, userWorkouts, historyList]);

    const locale = 'pt';
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        timeZone: 'America/Sao_Paulo'
    }).format(today);

    const isInitialLoading = (sessionLoading && !activeUser) || (!!activeUser && activeSchedule === undefined);

    return (
        <div className="min-h-dvh bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-6 pb-28 transition-colors duration-300 font-sans">
            <HomeUIHeader activeUser={activeUser} formattedDate={formattedDate} />
            
            {isInitialLoading ? (
                <div className="space-y-6">
                    <BannerSkeleton />
                    <div className="mt-8 space-y-4">
                        <Skeleton className="h-8 w-40 mb-4" />
                        <ListSkeleton count={2} />
                    </div>
                </div>
            ) : (
                <>
                    <HomeUIWorkoutBanner todayWorkout={todayWorkout} todayHistory={todayHistory} />

                    {/* Quick Action: Montador Automático de Treino */}
                    <div className="mb-8">
                        <button
                            type="button"
                            onClick={() => setIsGeneratorOpen(true)}
                            className="w-full p-4 rounded-3xl bg-gradient-to-r from-lime-500/15 via-emerald-500/10 to-transparent border border-lime-500/30 hover:border-lime-500/60 dark:hover:border-lime-400/50 flex items-center justify-between gap-4 text-left transition-all active:scale-[0.99] group shadow-xs cursor-pointer"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-lime-400 text-zinc-950 flex items-center justify-center font-black shadow-md shadow-lime-500/20 group-hover:scale-105 transition-transform shrink-0">
                                    <Sparkles size={22} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                                            {tg('ctaHome')}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-lime-500/20 text-lime-600 dark:text-lime-400">
                                            IA & Bio
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5 line-clamp-1">
                                        {tg('ctaHomeDesc')}
                                    </p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-zinc-200/60 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-500 group-hover:bg-lime-400 group-hover:text-zinc-950 transition-colors shrink-0">
                                <Sparkles size={14} />
                            </div>
                        </button>
                    </div>

                    <HomeLists
                        historyList={historyList}
                        sessionList={activeSessions || []}
                        activeUserId={activeUser?.id || ''}
                    />
                </>
            )}

            {/* Modal do Montador Inteligente */}
            {activeUser?.id && (
                <WorkoutGeneratorModal
                    isOpen={isGeneratorOpen}
                    onClose={() => setIsGeneratorOpen(false)}
                    userId={activeUser.id}
                />
            )}
        </div>
    );
}

