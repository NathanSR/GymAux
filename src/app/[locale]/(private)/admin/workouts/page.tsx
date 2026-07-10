import { createClient } from '@/lib/supabase/server';
import { adminService } from '@/services/adminService';
import AdminWorkoutsClient from '@/components/admin/AdminWorkoutsClient';
import { redirect } from 'next/navigation';

export default async function AdminWorkoutsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Busca todos os treinos
  const workouts = await adminService.getAllWorkoutsWithUsers(supabase);

  return (
    <AdminWorkoutsClient initialWorkouts={workouts} adminId={user.id} />
  );
}
