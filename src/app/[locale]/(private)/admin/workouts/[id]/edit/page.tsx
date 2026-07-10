import { createClient } from '@/lib/supabase/server';
import { adminService } from '@/services/adminService';
import { WorkoutService } from '@/services/workoutService';
import { ExerciseService } from '@/services/exerciseService';
import AdminEditWorkoutClient from '@/components/admin/AdminEditWorkoutClient';
import { redirect, notFound } from 'next/navigation';

export default async function AdminEditWorkoutPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Busca o treino pelo ID
  const workout = await WorkoutService.getWorkoutById(id, supabase);
  if (!workout) {
    notFound();
  }

  // Busca dados de alunos e exercícios em paralelo
  const [users, exerciseData] = await Promise.all([
    adminService.getAllUsers(supabase),
    ExerciseService.getAllExercises({ supabase })
  ]);

  return (
    <AdminEditWorkoutClient 
      workout={workout}
      users={users} 
      availableExercises={exerciseData.exercises || []} 
      adminId={user.id} 
    />
  );
}
