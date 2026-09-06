import NewWorkoutClient from '@/components/workouts/NewWorkoutClient';
import { createClient } from '@/lib/supabase/server';
import { ExerciseService } from '@/services/exerciseService';
import { redirect } from 'next/navigation';

export default async function TrainerStudentNewWorkoutPage({
    params
}: {
    params: Promise<{ studentId: string }>
}) {
    const { studentId } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/');
    }

    const availableExercises = await ExerciseService.getAllExercises({
        supabase,
        studentMode: true,
        trainerId: user.id
    });

    return (
        <NewWorkoutClient 
            availableExercises={availableExercises.exercises} 
            userId={studentId} 
            callerId={user.id}
            studentMode={true}
            baseUrl={`/trainer/${studentId}/workouts`}
        />
    );
}
