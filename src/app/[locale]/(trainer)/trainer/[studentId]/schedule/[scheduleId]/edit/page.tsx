import EditScheduleClient from '@/components/schedules/EditScheduleClient';
import { ScheduleService } from '@/services/scheduleService';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function TrainerStudentEditSchedulePage({ 
    params 
}: { 
    params: Promise<{ studentId: string, scheduleId: string }> 
}) {
    const { studentId, scheduleId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect(`/trainer/${studentId}/schedule`);

    const data: any = await ScheduleService.getScheduleById(scheduleId, supabase);
    if (!data) {
        redirect(`/trainer/${studentId}/schedule`);
    }

    // Format dates for input type="date"
    const formattedData = {
        ...data,
        startDate: data.startDate.toISOString().split('T')[0],
        endDate: data.endDate ? data.endDate.toISOString().split('T')[0] : undefined
    };

    return (
        <EditScheduleClient 
            initialData={formattedData} 
            scheduleId={scheduleId}
            callerId={user.id}
            baseUrl={`/trainer/${studentId}/schedule`}
        />
    );
}
