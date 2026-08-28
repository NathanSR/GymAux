'use client';

import NewWorkoutClient from '@/components/workouts/NewWorkoutClient';
import { useSession } from '@/hooks/useSession';
import { useDexieExercises } from '@/hooks/useDexieData';

export default function NewWorkoutPage() {
    const { activeUser } = useSession();
    const availableExercises = useDexieExercises();

    return (
        <NewWorkoutClient 
            availableExercises={availableExercises || []} 
            userId={activeUser?.id || ''} 
        />
    );
}