'use client';

import { MenuTab } from '@/components/ui/MenuTab';
import { useSessionActions } from '@/hooks/useSessionActions';
import { Workout, History } from '@/config/types';
import { useTodayWorkoutStatus } from '@/hooks/useTodayWorkoutStatus';

export default function HomeMenuTabHandler({
  todayWorkout,
  todayHistory: initialTodayHistory
}: {
  todayWorkout: Workout | null,
  todayHistory: History | null
}) {
  const { startWorkout } = useSessionActions();
  const { isCompleted, isRestDay } = useTodayWorkoutStatus(todayWorkout, initialTodayHistory);

  return (
    <MenuTab
      onPlay={() => startWorkout(todayWorkout as Workout)}
      completed={isRestDay || isCompleted}
    />
  );
}
