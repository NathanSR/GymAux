import { HomeHeader as HomeUIHeader, HomeWorkoutBanner as HomeUIWorkoutBanner, HomeLists } from '@/components/home/HomeClient';
import { createClient } from '@/lib/supabase/server';
import { userService } from '@/services/userService';
import { ScheduleService } from '@/services/scheduleService';
import { WorkoutService } from '@/services/workoutService';
import { HistoryService } from '@/services/historyService';
import { SessionService } from '@/services/sessionService';
import { Workout, History, Session, User as AppUser } from '@/config/types';
import { Suspense } from 'react';
import { BannerSkeleton, HeaderSkeleton, ListSkeleton, Skeleton } from '@/components/ui/Skeleton';
import HomeMenuTabHandler from '@/components/home/HomeMenuTabHandler';

/**
 * Optimized Home Page
 * 
 * Implements granular Suspense to allow instantaneous layout rendering
 * while the data streams from the server/supabase.
 */
export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Initial user fetch is the only blocking task for the main shell identity
  const activeUser = await userService.getUserById(user.id, supabase);
  if (!activeUser) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-6 pb-32 transition-colors duration-300 font-sans">
      <Suspense fallback={<HeaderSkeleton />}>
        <HomeHeader activeUser={activeUser} />
      </Suspense>

      <Suspense fallback={<BannerSkeleton />}>
        <HomeWorkoutBanner activeUser={activeUser} />
      </Suspense>

      <Suspense fallback={<div className="mt-12 space-y-4"><Skeleton className="h-8 w-40 mb-4" /><ListSkeleton count={2} /></div>}>
        <HomeContent activeUser={activeUser} />
      </Suspense>

      <Suspense fallback={null}>
        <HomeMenuTab activeUser={activeUser} />
      </Suspense>
    </div>
  );
}

/**
 * Data Fetchers (Internal Components)
 * Using Suspense mechanism in Next.js Server Components.
 */

async function HomeMenuTab({ activeUser }: { activeUser: AppUser }) {
  const supabase = await createClient();
  const today = new Date();
  const dayOfWeek = today.getDay();

  const activeSchedule = await ScheduleService.getActiveSchedule(activeUser.id as string, supabase);

  let todayWorkout: Workout | null = null;
  let todayHistory: History | null = null;

  if (activeSchedule?.workouts?.[dayOfWeek]) {
    todayWorkout = await WorkoutService.getWorkoutById(activeSchedule.workouts[dayOfWeek]!, supabase);
    if (todayWorkout?.id) {
      const startTodayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endTodayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const history = await HistoryService.getHistoryByRange(activeUser.id as string, startTodayDate, endTodayDate, supabase);
      todayHistory = history.find((h: any) => h.workoutId === todayWorkout?.id) || null;
    }
  }

  return (
    <HomeMenuTabHandler
      todayWorkout={todayWorkout}
      todayHistory={todayHistory}
    />
  );
}


/**
 * Data Fetchers (Internal Components)
 * Using Suspense mechanism in Next.js Server Components.
 */

async function HomeHeader({ activeUser }: { activeUser: AppUser }) {
  const locale = 'pt'; // can be fetched from context or params if needed
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(today);

  return (
    <HomeUIHeader
      activeUser={activeUser}
      formattedDate={formattedDate}
    />
  );
}

async function HomeWorkoutBanner({ activeUser }: { activeUser: AppUser }) {
  const supabase = await createClient();
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startTodayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endTodayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const activeSchedule = await ScheduleService.getActiveSchedule(activeUser.id as string, supabase);

  let todayWorkout: Workout | null = null;
  let todayHistory: History | null = null;

  if (activeSchedule?.workouts?.[dayOfWeek]) {
    todayWorkout = await WorkoutService.getWorkoutById(activeSchedule.workouts[dayOfWeek]!, supabase);
    if (todayWorkout?.id) {
      const history = await HistoryService.getHistoryByRange(activeUser.id as string, startTodayDate, endTodayDate, supabase);
      todayHistory = history.find((h: any) => h.workoutId === todayWorkout?.id) || null;
    }
  }

  return (
    <HomeUIWorkoutBanner
      todayWorkout={todayWorkout}
      todayHistory={todayHistory}
    />
  );
}

async function HomeContent({ activeUser }: { activeUser: AppUser }) {
  const supabase = await createClient();

  const [historyList, sessionList] = await Promise.all([
    HistoryService.getUserHistory(activeUser.id as string, 1, 4, supabase),
    SessionService.getSessionsByUserId(activeUser.id as string, supabase)
  ]);

  return (
    <HomeLists
      historyList={historyList}
      sessionList={sessionList}
      activeUserId={activeUser.id!}
    />
  );
}

