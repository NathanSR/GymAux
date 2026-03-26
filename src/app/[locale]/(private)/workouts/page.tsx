import WorkoutsClient from '@/components/workouts/WorkoutsClient';
import { createClient } from '@/lib/supabase/server';
import { WorkoutService } from '@/services/workoutService';

export default async function WorkoutsPage() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Busca inicial no servidor
    const result = await WorkoutService.getWorkoutsByUserId(
        user.id,
        '',
        { page: 1, limit: 20 },
        supabase
    );

    const initialWorkouts = (result as any).workouts || [];
    const initialTotalCount = (result as any).totalCount || 0;

    return (
        <WorkoutsClient 
            initialWorkouts={initialWorkouts} 
            initialTotalCount={initialTotalCount}
            userId={user.id}
        />
    );
}