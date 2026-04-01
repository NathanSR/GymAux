import EditWorkoutClient from '@/components/workouts/EditWorkoutClient';
import { WorkoutService } from '@/services/workoutService';
import { ExerciseService } from '@/services/exerciseService';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function TrainerStudentEditWorkoutPage({
    params
}: {
    params: Promise<{ studentId: string, workoutId: string }>
}) {
    const { studentId, workoutId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect(`/trainer/${studentId}/workouts`);

    const [workout, availableExercises] = await Promise.all([
        WorkoutService.getWorkoutById(workoutId, supabase),
        ExerciseService.getAllExercises({ supabase })
    ]);

    if (!workout) {
        redirect(`/trainer/${studentId}/workouts`);
    }

    return (
        <EditWorkoutClient
            initialWorkout={workout}
            availableExercises={availableExercises.exercises}
            workoutId={workoutId}
            callerId={user.id}
            baseUrl={`/trainer/${studentId}/workouts`}
        />
    );
}
