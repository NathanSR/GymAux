import { createClient } from '@/lib/supabase/server';
import { taxonomyService } from '@/services/taxonomyService';
import AdminCategoriesClient from '@/components/admin/AdminCategoriesClient';
import { redirect } from 'next/navigation';

export default async function AdminCategoriesPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/admin/login');
    }

    const categories = await taxonomyService.getAllCategoriesAdmin(supabase);

    return (
        <AdminCategoriesClient initialCategories={categories} />
    );
}
