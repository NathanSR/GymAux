import { createClient } from '@/lib/supabase/server';
import { adminService } from '@/services/adminService';
import { ExerciseService } from '@/services/exerciseService';
import AdminNewWorkoutClient from '@/components/admin/AdminNewWorkoutClient';
import { redirect } from 'next/navigation';

export default async function AdminNewWorkoutPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Busca dados de alunos e exercícios em paralelo
  const [users, exerciseData] = await Promise.all([
    adminService.getAllUsers(supabase),
    ExerciseService.getAllExercises({ supabase })
  ]);

  return (
    <AdminNewWorkoutClient 
      users={users} 
      availableExercises={exerciseData.exercises || []} 
      adminId={user.id} 
    />
  );
}
