'use client';

import NewWorkoutClient from '@/components/workouts/NewWorkoutClient';
import { useSession } from '@/hooks/useSession';
import { useDexieExercises } from '@/hooks/useDexieData';

export default function NewWorkoutPage() {
    const { activeUser, loading } = useSession();
    const availableExercises = useDexieExercises();

    if (loading && !activeUser) {
        return (
            <div className="min-h-screen bg-zinc-950 p-6 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!activeUser) return null;

    return (
        <NewWorkoutClient availableExercises={availableExercises} userId={activeUser.id!} />
    );
}