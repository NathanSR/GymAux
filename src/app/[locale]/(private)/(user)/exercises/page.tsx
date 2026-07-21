'use client';

import ExercisesClient from '@/components/exercises/ExercisesClient';
import { useDexieExercises } from '@/hooks/useDexieData';
import { useSession } from '@/hooks/useSession';
import { HeaderSkeleton, ListSkeleton } from '@/components/ui/Skeleton';

export default function ExerciseLibraryPage() {
    const { activeUser, loading } = useSession();
    const exercises = useDexieExercises();

    if (loading && !activeUser) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 pt-6 space-y-8">
                <HeaderSkeleton />
                <ListSkeleton count={4} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
            <ExercisesClient 
                initialExercises={exercises} 
                initialTotalCount={exercises.length} 
            />
        </div>
    );
}