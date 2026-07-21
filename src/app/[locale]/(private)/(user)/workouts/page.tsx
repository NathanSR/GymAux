'use client';

import WorkoutsClient from '@/components/workouts/WorkoutsClient';
import { useSession } from '@/hooks/useSession';
import { useDexieWorkouts } from '@/hooks/useDexieData';

export default function WorkoutsPage() {
    const { activeUser, loading } = useSession();
    const workouts = useDexieWorkouts(activeUser?.id);

    if (loading && !activeUser) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
                <div className="space-y-4 pt-20">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-40 bg-zinc-100 dark:bg-zinc-900 rounded-[32px] animate-pulse" />
                    ))}
                </div>
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