'use client';

import WorkoutsClient from '@/components/workouts/WorkoutsClient';
import { useSession } from '@/hooks/useSession';
import { useDexieWorkouts } from '@/hooks/useDexieData';

export default function WorkoutsPage() {
    const { activeUser, loading } = useSession();
    const workouts = useDexieWorkouts(activeUser?.id);

    return (
        <WorkoutsClient 
            initialWorkouts={workouts} 
            initialTotalCount={workouts.length}
            userId={activeUser?.id || ''}
            isSessionLoading={loading && !activeUser}
        />
    );
}