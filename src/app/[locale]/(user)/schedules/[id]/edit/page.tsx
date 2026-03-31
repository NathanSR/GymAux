import EditScheduleClient from '@/components/schedules/EditScheduleClient';
import { ScheduleService } from '@/services/scheduleService';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface EditSchedulePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditSchedulePage({ params }: EditSchedulePageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/schedules');

    const data: any = await ScheduleService.getScheduleById(id, supabase);
    if (!data) {
        redirect('/schedules');
    }

    // Formata datas para o input type="date"
    const formattedData = {
        ...data,
        startDate: data.startDate.toISOString().split('T')[0],
        endDate: data.endDate ? data.endDate.toISOString().split('T')[0] : undefined
    };

    return (
        <EditScheduleClient initialData={formattedData} scheduleId={id} callerId={user.id} />
    );
}