import { userService } from '@/services/userService';
import { HistoryService } from '@/services/historyService';
import { WorkoutService } from '@/services/workoutService';
import { SessionService } from '@/services/sessionService';
import { createClient } from '@/lib/supabase/server';
import TrainerStudentDashboard from '@/components/trainers/TrainerStudentDashboard';
import { notFound } from 'next/navigation';

export default async function TrainerStudentPage({
    params
}: {
    params: Promise<{ studentId: string }>
}) {
    const { studentId } = await params;
    const supabase = await createClient();

    // Fetch student data, history, and workouts in parallel
    const [student, history, workoutsResult, sessions] = await Promise.all([
        userService.getUserById(studentId, supabase),
        HistoryService.getUserHistory(studentId, 1, 10, supabase),
        WorkoutService.getWorkoutsByUserId(studentId, '', undefined, supabase),
        SessionService.getSessionsByUserId(studentId, supabase)
    ]);

    if (!student) {
        notFound();
    }

    // Since we didn't pass pagination to getWorkoutsByUserId, it returns the array directly
    const workouts = Array.isArray(workoutsResult) ? workoutsResult : (workoutsResult as any).workouts;
    const activeSession = sessions.length > 0 ? sessions[0] : null;

    return (
        <TrainerStudentDashboard 
            studentId={studentId}
            student={student}
            activeSession={activeSession}
            recentHistory={history}
            workouts={workouts}
        />
    );
}
