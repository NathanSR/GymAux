import CreateScheduleClient from '@/components/schedules/CreateScheduleClient';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function CreateSchedulePage() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/');
    }

    return (
        <CreateScheduleClient userId={user.id} />
    );
}