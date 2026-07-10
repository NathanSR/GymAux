import { createClient } from '@/lib/supabase/server';
import { adminService } from '@/services/adminService';
import { ExerciseService } from '@/services/exerciseService';
import AdminEditExerciseClient from '@/components/admin/AdminEditExerciseClient';
import { redirect, notFound } from 'next/navigation';

export default async function AdminEditExercisePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    notFound();
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Busca o exercício e a lista de usuários em paralelo
  const [exercise, users] = await Promise.all([
    ExerciseService.getExerciseById(numericId, supabase),
    adminService.getAllUsers(supabase)
  ]);

  if (!exercise) {
    notFound();
  }

  return (
    <AdminEditExerciseClient exercise={exercise} users={users} />
  );
}
