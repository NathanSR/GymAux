'use client';

import { useSession } from '@/hooks/useSession';
import { useDexieActiveSchedule, useDexieHistory, useDexieWorkouts } from '@/hooks/useDexieData';
import { useDataPreloader } from '@/hooks/useDataPreloader';
import { HomeHeader as HomeUIHeader, HomeWorkoutBanner as HomeUIWorkoutBanner, HomeLists } from '@/components/home/HomeClient';
import HomeMenuTabHandler from '@/components/home/HomeMenuTabHandler';
import { BannerSkeleton, HeaderSkeleton, ListSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { getBrazilToday, getBrazilDayRange } from '@/utils/dateUtil';
import { useEffect, useState } from 'react';
import { Workout, History } from '@/config/types';
import { SessionService } from '@/services/sessionService';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/config/db';

export function HomePageClient() {
    const { activeUser, loading: sessionLoading } = useSession();
    useDataPreloader(activeUser?.id);

    const activeSchedule = useDexieActiveSchedule(activeUser?.id);
    const historyList = useDexieHistory(activeUser?.id, 4);
    const userWorkouts = useDexieWorkouts(activeUser?.id);

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
                    const hTime = h.date.getTime();
                    return h.workoutId === foundWorkout.id && hTime >= start.getTime() && hTime <= end.getTime();
                });
                setTodayHistory(matchedHistory || null);
            }
        } else {
            setTodayWorkout(null);
            setTodayHistory(null);
        }
    }, [activeUser?.id, activeSchedule, userWorkouts, historyList]);

    if (sessionLoading && !activeUser) {
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-6 pb-32 font-sans space-y-6">
                <HeaderSkeleton />
                <BannerSkeleton />
                <div className="mt-12 space-y-4">
                    <Skeleton className="h-8 w-40 mb-4" />
                    <ListSkeleton count={2} />
                </div>
            </div>
        );
    }

    if (!activeUser) return null;

    const locale = 'pt';
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        timeZone: 'America/Sao_Paulo'
    }).format(today);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-6 pb-32 transition-colors duration-300 font-sans">
            <HomeUIHeader activeUser={activeUser} formattedDate={formattedDate} />
            <HomeUIWorkoutBanner todayWorkout={todayWorkout} todayHistory={todayHistory} />
            <HomeLists
                historyList={historyList}
                sessionList={activeSessions || []}
                activeUserId={activeUser.id!}
            />
            <HomeMenuTabHandler todayWorkout={todayWorkout} todayHistory={todayHistory} />
        </div>
    );
}
