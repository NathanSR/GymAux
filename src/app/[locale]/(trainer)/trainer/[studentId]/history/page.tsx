import HistoryClient from '@/components/history/HistoryClient';
import { createClient } from '@/lib/supabase/server';
import { HistoryService } from '@/services/historyService';

export default async function TrainerStudentHistoryPage({
    params,
    searchParams
}: {
    params: Promise<{ studentId: string }>,
    searchParams: Promise<{ date?: string, workoutId?: string }>
}) {
    const { studentId } = await params;
    const { date, workoutId } = await searchParams;
    const supabase = await createClient();
    
    // Initial range: based on query date or current month
    const now = date ? new Date(date) : new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const historyList = await HistoryService.getHistoryByRange(
        studentId,
        start,
        end,
        supabase
    );

    return (
        <HistoryClient 
            userId={studentId}
            initialHistoryList={historyList}
            initialDate={date}
            initialWorkoutId={workoutId}
            baseUrl={`/trainer/${studentId}/history`}
        />
    );
}
