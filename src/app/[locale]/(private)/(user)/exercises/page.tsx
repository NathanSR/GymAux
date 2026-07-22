'use client';

import ExercisesClient from '@/components/exercises/ExercisesClient';
import { useDexieExercises } from '@/hooks/useDexieData';
import { useSession } from '@/hooks/useSession';

export default function ExerciseLibraryPage() {
    const { activeUser, loading } = useSession();
    const exercises = useDexieExercises();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
            <ExercisesClient 
                initialExercises={exercises} 
                initialTotalCount={exercises.length}
                isSessionLoading={loading && !activeUser} 
            />
        </div>
    );
}