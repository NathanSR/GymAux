'use client';

import { useState } from 'react';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';
import AdminWorkoutForm from '@/components/admin/AdminWorkoutForm';
import { WorkoutService } from '@/services/workoutService';
import { toast } from 'react-toastify';
import { User, Exercise } from '@/config/types';
import PageHeader from '@/components/ui/PageHeader';

interface AdminNewWorkoutClientProps {
  users: User[];
  availableExercises: Exercise[];
  adminId: string;
}

export default function AdminNewWorkoutClient({
  users,
  availableExercises,
  adminId
}: AdminNewWorkoutClientProps) {
  const { navigateAfterAction } = useSmartNavigation({ fallbackUrl: '/admin/workouts' });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (data: any) => {
    setIsLoading(true);
    try {
      await WorkoutService.createWorkout({
        ...data,
        callerId: adminId,
        createdAt: new Date(),
      });

      toast.success('Treino criado com sucesso!');
      navigateAfterAction('/admin/workouts');
    } catch (error: any) {
      console.error('Erro ao criar treino:', error?.message || error);
      toast.error('Erro ao criar o treino. Verifique os dados.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white transition-colors duration-300">
      <PageHeader title="Novo Treino" backHref="/admin/workouts" />

      <main className="p-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AdminWorkoutForm
          users={users}
          availableExercises={availableExercises}
          onSubmit={handleCreate}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
