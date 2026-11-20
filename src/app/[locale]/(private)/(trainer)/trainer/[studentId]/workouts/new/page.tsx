'use client';

import { use, useMemo } from 'react';
import NewWorkoutClient from '@/components/workouts/NewWorkoutClient';
import { useSession } from '@/hooks/useSession';
import { useDexieExercises } from '@/hooks/useDexieData';
import { usePathname } from '@/i18n/routing';
import { resolveDynamicRouteId } from '@/utils/activeAuthUser';

export default function TrainerStudentNewWorkoutPage({
    params
}: {
    params: Promise<{ studentId: string }>;
}) {
    const resolvedParams = use(params);
    const pathname = usePathname();
    const studentId = resolveDynamicRouteId(/\/trainer\/([^/?#]+)\/workouts/, pathname, resolvedParams?.studentId);
    const { activeUser } = useSession();
    const allExercises = useDexieExercises();

    const availableExercises = useMemo(() => {
        return (allExercises || []).filter(ex => {
            const isSystem = ex.created_by_type === 'system' || (ex.id !== undefined && ex.id < 1000);
            if (isSystem) return true;
            const isTrainer = activeUser?.id ? ex.created_by === activeUser.id : true;
            const isAccessible = ex.visibility === 'public' || ex.visibility === 'students';
            return isTrainer && isAccessible;
        });
    }, [allExercises, activeUser?.id]);

    return (
        <NewWorkoutClient
            availableExercises={availableExercises}
            userId={studentId}
            callerId={activeUser?.id}
            studentMode={true}
            baseUrl={`/trainer/${studentId}/workouts`}
        />
    );
}
