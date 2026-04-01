import SchedulesClient from '@/components/schedules/SchedulesClient';
import { createClient } from '@/lib/supabase/server';
import { ScheduleService } from '@/services/scheduleService';

export default async function TrainerStudentSchedulePage({
    params
}: {
    params: Promise<{ studentId: string }>
}) {
    const { studentId } = await params;
    const supabase = await createClient();
    
    const result = await ScheduleService.getSchedulesByUserId(
        studentId,
        '',
        { page: 1, limit: 20 },
        supabase
    );

    const initialSchedules = (result as any).schedules || [];
    const initialTotalCount = (result as any).totalCount || 0;

    return (
        <SchedulesClient 
            initialSchedules={initialSchedules} 
            initialTotalCount={initialTotalCount}
            userId={studentId}
            baseUrl={`/trainer/${studentId}/schedule`}
        />
    );
}
