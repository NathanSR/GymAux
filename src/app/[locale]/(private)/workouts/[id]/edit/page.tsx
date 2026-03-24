import EditWorkoutClient from '@/components/workouts/EditWorkoutClient';
import { WorkoutService } from '@/services/workoutService';
import { ExerciseService } from '@/services/exerciseService';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface EditWorkoutPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const [workout, availableExercises] = await Promise.all([
        WorkoutService.getWorkoutById(id, supabase),
        ExerciseService.getAllExercises(supabase)
    ]);

    if (!workout) {
        redirect('/workouts');
    }

    return (
        <EditWorkoutClient 
            initialWorkout={workout} 
            availableExercises={availableExercises} 
            workoutId={id} 
        />
    );
}