import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/config/db';
import { getBrazilDayRange } from '@/utils/dateUtil';
import { Workout, History } from '@/config/types';

/**
 * Hook to track the status of today's workout.
 * Reactive to local IndexedDB changes (offline-first).
 */
export function useTodayWorkoutStatus(
    todayWorkout: Workout | null, 
    initialTodayHistory: History | null
) {
    const localHistory = useLiveQuery(async () => {
        if (!todayWorkout?.id) return null;
        
        const { start, end } = getBrazilDayRange();
        
        // Find if there's a history record for this workout today
        return await db.history
            .where('workoutId')
            .equals(todayWorkout.id)
            .and(h => {
                const hDate = new Date(h.date);
                return hDate >= start && hDate <= end;
            })
            .first();
    }, [todayWorkout?.id]);

    // Priority to local history for instant UI updates, fallback to server data
    const todayHistory = localHistory || initialTodayHistory;
    
    const isCompleted = !!todayHistory;
    const isRestDay = !todayWorkout;

    return {
        todayHistory,
        isCompleted,
        isRestDay,
        isDisabled: isRestDay || isCompleted
    };
}
