import NewWorkoutClient from '@/components/workouts/NewWorkoutClient';
import { createClient } from '@/lib/supabase/server';
import { ExerciseService } from '@/services/exerciseService';
import { redirect } from 'next/navigation';

export default async function NewWorkoutPage() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/');
    }

    const availableExercises = await ExerciseService.getAllExercises(supabase);

    return (
        <NewWorkoutClient availableExercises={availableExercises} userId={user.id} />
    );
}