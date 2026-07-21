'use client';

import WorkoutsClient from '@/components/workouts/WorkoutsClient';
import { useSession } from '@/hooks/useSession';
import { useDexieWorkouts } from '@/hooks/useDexieData';
import { HeaderSkeleton, ListSkeleton } from '@/components/ui/Skeleton';

export default function WorkoutsPage() {
    const { activeUser, loading } = useSession();
    const workouts = useDexieWorkouts(activeUser?.id);

    if (loading && !activeUser) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 space-y-6">
                <HeaderSkeleton />
                <ListSkeleton count={4} />
            </div>
        );
    }

    if (!activeUser) return null;

    return (
        <WorkoutsClient 
            initialWorkouts={workouts} 
            initialTotalCount={workouts.length}
            userId={activeUser.id!}
        />
    );
}