import { useState, useEffect } from 'react';
import { getDatabase } from '@/config/rxDatabase';
import { getBrazilDayRange } from '@/utils/dateUtil';
import { Workout, History } from '@/config/types';

/**
 * Hook reativo para monitorar o status do treino de hoje no RxDB.
 */
export function useTodayWorkoutStatus(
    todayWorkout: Workout | null, 
    initialTodayHistory: History | null
) {
    const [localHistory, setLocalHistory] = useState<History | null>(null);

    useEffect(() => {
        if (!todayWorkout?.id) {
            setLocalHistory(null);
            return;
        }

        let subscription: any;

        const setupQuery = async () => {
            try {
                const db = await getDatabase();
                const { start, end } = getBrazilDayRange();

                // Busca se há registro de histórico para este treino na data de hoje
                const query = db.history.find({
                    selector: {
                        workoutId: todayWorkout.id,
                        date: {
                            $gte: start.toISOString(),
                            $lte: end.toISOString()
                        }
                    }
                });

                subscription = query.$.subscribe((docs: any[]) => {
                    if (docs && docs.length > 0) {
                        const json = docs[0].toJSON();
                        setLocalHistory({
                            ...json,
                            date: new Date(json.date),
                            endDate: json.endDate ? new Date(json.endDate) : undefined
                        } as History);
                    } else {
                        setLocalHistory(null);
                    }
                });
            } catch (err) {
                console.error('[useTodayWorkoutStatus] Error setting up query:', err);
            }
        };

        setupQuery();

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [todayWorkout?.id]);

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
