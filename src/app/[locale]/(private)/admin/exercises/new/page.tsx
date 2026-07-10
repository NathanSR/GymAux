import { createClient } from '@/lib/supabase/server';
import { adminService } from '@/services/adminService';
import AdminNewExerciseClient from '@/components/admin/AdminNewExerciseClient';
import { redirect } from 'next/navigation';

export default async function AdminNewExercisePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Busca lista de alunos para associação
  const users = await adminService.getAllUsers(supabase);

  return (
    <AdminNewExerciseClient users={users} />
  );
}
