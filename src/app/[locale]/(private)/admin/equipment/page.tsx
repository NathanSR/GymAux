import { createClient } from '@/lib/supabase/server';
import { taxonomyService } from '@/services/taxonomyService';
import AdminEquipmentClient from '@/components/admin/AdminEquipmentClient';
import { redirect } from 'next/navigation';

export default async function AdminEquipmentPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/admin/login');
    }

    const equipment = await taxonomyService.getAllEquipmentAdmin(supabase);

    return (
        <AdminEquipmentClient initialEquipment={equipment} />
    );
}
