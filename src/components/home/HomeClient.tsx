"use client";

/**
 * HomeClient
 *
 * Re-exports the granular sub-components for backward compatibility
 * and exposes the monolithic HomeClient default export for simple use-cases.
 */

export { HomeHeader } from '@/components/home/HomeHeader';
export { HomeWorkoutBanner } from '@/components/home/HomeWorkoutBanner';
export { HomeLists } from '@/components/home/HomeLists';

import { useLocale } from 'next-intl';
import { useSessionActions } from '@/hooks/useSessionActions';
import { MenuTab } from '@/components/ui/MenuTab';
import { Workout, History, Session, User as AppUser } from '@/config/types';
import { useTodayWorkoutStatus } from '@/hooks/useTodayWorkoutStatus';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeWorkoutBanner } from '@/components/home/HomeWorkoutBanner';
import { HomeLists } from '@/components/home/HomeLists';
// Note: The three lines above are needed for use inside this file;
// The export {} lines at the top re-export them for external consumers.

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

    const { isCompleted, isRestDay } = useTodayWorkoutStatus(initialTodayWorkout, initialTodayHistory);

    return (
        <div className="min-h-dvh bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-6 pb-32 transition-colors duration-300 font-sans">
            <HomeHeader activeUser={activeUser} formattedDate={formattedDate} />
            <HomeWorkoutBanner todayWorkout={initialTodayWorkout} todayHistory={initialTodayHistory} />
            <HomeLists historyList={initialHistoryList} sessionList={initialSessionList} activeUserId={activeUser?.id!} />

            <MenuTab onPlay={() => startWorkout(initialTodayWorkout as Workout)} completed={isRestDay || isCompleted} />
        </div>
    );
}

// Attach subcomponents to the main functional component for easier access (e.g. HomeClient.Header)
HomeClient.Header = HomeHeader;
HomeClient.WorkoutBanner = HomeWorkoutBanner;
HomeClient.Lists = HomeLists;
