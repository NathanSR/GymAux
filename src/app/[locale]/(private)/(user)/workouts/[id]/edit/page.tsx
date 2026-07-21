'use client';

import { use, useEffect, useState } from 'react';
import EditWorkoutClient from '@/components/workouts/EditWorkoutClient';
import { WorkoutService } from '@/services/workoutService';
import { useSession } from '@/hooks/useSession';
import { useDexieExercises } from '@/hooks/useDexieData';
import { Workout } from '@/config/types';
import { useRouter } from '@/i18n/routing';

interface EditWorkoutPageProps {
    params: Promise<{ id: string }>;
}

export default function EditWorkoutPage({ params }: EditWorkoutPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { activeUser, loading: sessionLoading } = useSession();
    const availableExercises = useDexieExercises();

    const [workout, setWorkout] = useState<Workout | null>(null);
    const [fetchingWorkout, setFetchingWorkout] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setFetchingWorkout(true);

        WorkoutService.getWorkoutById(id).then(fetched => {
            if (!isMounted) return;
            if (!fetched) {
                router.push('/workouts');
            } else {
                setWorkout(fetched);
            }
        }).catch(() => {
            if (isMounted) router.push('/workouts');
        }).finally(() => {
            if (isMounted) setFetchingWorkout(false);
        });

        return () => {
            isMounted = false;
        };
    }, [id, router]);

    if ((sessionLoading || fetchingWorkout) && !workout) {
        return (
            <div className="min-h-screen bg-zinc-950 p-6 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!activeUser || !workout) return null;

    return (
        <EditWorkoutClient
            initialWorkout={workout}
            availableExercises={availableExercises}
            workoutId={id}
            callerId={activeUser.id!}
        />
    );
}