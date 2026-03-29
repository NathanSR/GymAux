import WorkoutsClient from '@/components/workouts/WorkoutsClient';
import { createClient } from '@/lib/supabase/server';
import { WorkoutService } from '@/services/workoutService';

export default async function TrainerStudentWorkoutsPage({
    params
}: {
    params: Promise<{ studentId: string }>
}) {
    const { studentId } = await params;
    const supabase = await createClient();
    
    const result = await WorkoutService.getWorkoutsByUserId(
        studentId,
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
            userId={studentId}
            baseUrl={`/trainer/${studentId}/workouts`}
        />
    );
}
