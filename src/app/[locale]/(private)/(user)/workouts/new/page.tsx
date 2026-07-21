'use client';

import NewWorkoutClient from '@/components/workouts/NewWorkoutClient';
import { useSession } from '@/hooks/useSession';
import { useDexieExercises } from '@/hooks/useDexieData';
import { FormSkeleton } from '@/components/ui/Skeleton';

export default function NewWorkoutPage() {
    const { activeUser, loading } = useSession();
    const availableExercises = useDexieExercises();

    if (loading && !activeUser) {
        return <FormSkeleton />;
    }

    if (!activeUser) return null;

    return (
        <NewWorkoutClient availableExercises={availableExercises} userId={activeUser.id!} />
    );
}