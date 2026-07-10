import { createClient } from '@/lib/supabase/server';
import { adminService } from '@/services/adminService';
import AdminExercisesClient from '@/components/admin/AdminExercisesClient';
import { redirect } from 'next/navigation';

export default async function AdminExercisesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Busca a primeira página de exercícios do catálogo (limite 12)
  const { exercises, totalCount } = await adminService.getAllExercisesAdmin({
    page: 1,
    limit: 12,
    supabaseInput: supabase
  });

  return (
    <AdminExercisesClient initialExercises={exercises} initialTotalCount={totalCount} />
  );
}
