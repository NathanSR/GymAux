'use client';

import { use, useEffect, useMemo, useState } from 'react';
import EditWorkoutClient from '@/components/workouts/EditWorkoutClient';
import { WorkoutService } from '@/services/workoutService';
import { useSession } from '@/hooks/useSession';
import { useDexieExercises } from '@/hooks/useDexieData';
import { Workout } from '@/config/types';
import { useRouter, usePathname } from '@/i18n/routing';
import { resolveDynamicRouteId, isShellSentinel } from '@/utils/activeAuthUser';

export default function TrainerStudentEditWorkoutPage({
    params
}: {
    params: Promise<{ studentId: string; workoutId: string }>;
}) {
    const resolvedParams = use(params);
    const pathname = usePathname();
    const router = useRouter();
    const { activeUser, loading: sessionLoading } = useSession();
    const allExercises = useDexieExercises();

    const studentId = resolveDynamicRouteId(/\/trainer\/([^/?#]+)\/workouts/, pathname, resolvedParams?.studentId);
    const workoutId = resolveDynamicRouteId(/\/workouts\/([^/?#]+)\/edit/, pathname, resolvedParams?.workoutId);

    const availableExercises = useMemo(() => {
        return (allExercises || []).filter(ex => {
            const isSystem = ex.created_by_type === 'system' || (ex.id !== undefined && ex.id < 1000);
            if (isSystem) return true;
            const isTrainer = activeUser?.id ? ex.created_by === activeUser.id : true;
            const isAccessible = ex.visibility === 'public' || ex.visibility === 'students';
            return isTrainer && isAccessible;
        });
    }, [allExercises, activeUser?.id]);

    const [workout, setWorkout] = useState<Workout | null>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        let isMounted = true;
        if (!workoutId || isShellSentinel(workoutId)) return;

        setFetching(true);
        WorkoutService.getWorkoutById(workoutId)
            .then(fetched => {
                if (!isMounted) return;
                if (!fetched) {
                    router.replace(`/trainer/${studentId}/workouts`);
                } else {
                    setWorkout(fetched);
                }
            })
            .catch(() => {
                if (isMounted) router.replace(`/trainer/${studentId}/workouts`);
            })
            .finally(() => {
                if (isMounted) setFetching(false);
            });

        return () => {
            isMounted = false;
        };
    }, [workoutId, studentId, router]);

    return (
        <EditWorkoutClient
            initialWorkout={workout}
            availableExercises={availableExercises}
            workoutId={workoutId}
            callerId={activeUser?.id || ''}
            studentMode={true}
            baseUrl={`/trainer/${studentId}/workouts`}
            isFetching={(sessionLoading || fetching) && !workout}
        />
    );
}
