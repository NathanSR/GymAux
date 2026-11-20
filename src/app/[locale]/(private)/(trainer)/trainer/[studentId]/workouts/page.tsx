'use client';

import { use } from 'react';
import WorkoutsClient from '@/components/workouts/WorkoutsClient';
import { useSession } from '@/hooks/useSession';
import { useDexieWorkouts } from '@/hooks/useDexieData';
import { usePathname } from '@/i18n/routing';
import { resolveDynamicRouteId } from '@/utils/activeAuthUser';

export default function TrainerStudentWorkoutsPage({
    params
}: {
    params: Promise<{ studentId: string }>;
}) {
    const resolvedParams = use(params);
    const pathname = usePathname();
    const studentId = resolveDynamicRouteId(/\/trainer\/([^/?#]+)\/workouts/, pathname, resolvedParams?.studentId);
    const { activeUser, loading } = useSession();
    const workouts = useDexieWorkouts(studentId);
    const isInitialLoading = (loading && !activeUser) && (workouts === undefined || workouts.length === 0);

    return (
        <WorkoutsClient
            initialWorkouts={workouts || []}
            initialTotalCount={(workouts || []).length}
            userId={studentId}
            callerId={activeUser?.id}
            baseUrl={`/trainer/${studentId}/workouts`}
            isSessionLoading={isInitialLoading}
        />
    );
}
