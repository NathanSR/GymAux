'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import AdminWorkoutForm from '@/components/admin/AdminWorkoutForm';
import { WorkoutService } from '@/services/workoutService';
import { toast } from 'react-toastify';
import { User, Exercise } from '@/config/types';
import PageHeader from '@/components/ui/PageHeader';

interface AdminEditWorkoutClientProps {
  workout: any;
  users: User[];
  availableExercises: Exercise[];
  adminId: string;
}

export default function AdminEditWorkoutClient({
  workout,
  users,
  availableExercises,
  adminId
}: AdminEditWorkoutClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (data: any) => {
    setIsLoading(true);
    try {
      await WorkoutService.updateWorkout(workout.id, {
        ...data,
        callerId: adminId,
      });

      toast.success('Treino atualizado com sucesso!');
      router.refresh();
      router.replace('/admin/workouts');
    } catch (error: any) {
      console.error('Erro ao editar treino:', error?.message || error);
      toast.error('Erro ao atualizar o treino.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white transition-colors duration-300">
      <PageHeader title="Editar Treino" backHref="/admin/workouts" />

      <main className="p-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AdminWorkoutForm
          users={users}
          availableExercises={availableExercises}
          initialData={workout}
          onSubmit={handleUpdate}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
