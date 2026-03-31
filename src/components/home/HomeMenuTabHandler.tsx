'use client';

import { MenuTab } from '@/components/MenuTab';
import { useSessionActions } from '@/hooks/useSessionActions';
import { Workout, History } from '@/config/types';

export default function HomeMenuTabHandler({ 
  todayWorkout, 
  todayHistory 
}: { 
  todayWorkout: Workout | null, 
  todayHistory: History | null 
}) {
  const { startWorkout } = useSessionActions();

  return (
    <MenuTab 
      onPlay={() => startWorkout(todayWorkout as Workout)} 
      completed={!todayWorkout || !!todayHistory} 
    />
  );
}
