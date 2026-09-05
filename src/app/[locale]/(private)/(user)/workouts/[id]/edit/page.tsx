'use client';

import { use, useEffect, useState } from 'react';
import EditWorkoutClient from '@/components/workouts/EditWorkoutClient';
import { WorkoutService } from '@/services/workoutService';
import { useSession } from '@/hooks/useSession';
import { useDexieExercises } from '@/hooks/useDexieData';
import { Workout } from '@/config/types';
import { useRouter, usePathname } from '@/i18n/routing';

interface EditWorkoutPageProps {
    params: Promise<{ id: string }>;
}

export default function EditWorkoutPage({ params }: EditWorkoutPageProps) {
    const resolvedParams = use(params);
    const pathname = usePathname();
    const router = useRouter();
    const { activeUser, loading: sessionLoading } = useSession();
    const availableExercises = useDexieExercises();

    // Prioridade máxima: ID real da URL ativa (navegação SPA / fallback de shell offline)
    const resolveWorkoutId = (): string => {
        if (typeof window !== 'undefined' && window.location.pathname) {
            const winMatch = window.location.pathname.match(/\/workouts\/([^/?#]+)\/edit/);
            if (winMatch && winMatch[1] && winMatch[1] !== 'template' && winMatch[1] !== 'shell') {
                return winMatch[1];
            }
        }
        if (pathname) {
            const pathMatch = pathname.match(/\/workouts\/([^/?#]+)\/edit/);
            if (pathMatch && pathMatch[1] && pathMatch[1] !== 'template' && pathMatch[1] !== 'shell') {
                return pathMatch[1];
            }
        }
        return (resolvedParams?.id && resolvedParams.id !== 'template' && resolvedParams.id !== 'shell')
            ? resolvedParams.id
            : (resolvedParams?.id || '');
    };

    const rawId = resolveWorkoutId();

    const [workout, setWorkout] = useState<Workout | null>(null);
    const [fetchingWorkout, setFetchingWorkout] = useState(true);

    useEffect(() => {
        let isMounted = true;
        if (!rawId || rawId === 'template' || rawId === 'shell') {
            return;
        }

        setFetchingWorkout(true);

        WorkoutService.getWorkoutById(rawId).then(fetched => {
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
    }, [rawId, router]);

    const isFetching = (sessionLoading || fetchingWorkout) && !workout;

    return (
        <EditWorkoutClient
            initialWorkout={workout}
            availableExercises={availableExercises || []}
            workoutId={rawId}
            callerId={activeUser?.id || ''}
            isFetching={isFetching}
        />
    );
}