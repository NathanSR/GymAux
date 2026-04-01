import SchedulesClient from '@/components/schedules/SchedulesClient';
import { createClient } from '@/lib/supabase/server';
import { ScheduleService } from '@/services/scheduleService';

export default async function SchedulesPage() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Busca inicial no servidor
    const result = await ScheduleService.getSchedulesByUserId(
        user.id,
        '',
        { page: 1, limit: 20 },
        supabase
    );

    return (
        <SchedulesClient 
            initialSchedules={result.schedules} 
            initialTotalCount={result.totalCount}
            userId={user.id}
        />
    );
}