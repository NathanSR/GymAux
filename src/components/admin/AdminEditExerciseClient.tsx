'use client';

import { useState } from 'react';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';
import ExerciseForm from '@/components/exercises/ExerciseForm';
import { adminService } from '@/services/adminService';
import { toast } from 'react-toastify';
import { User, Exercise } from '@/config/types';
import PageHeader from '@/components/ui/PageHeader';

interface AdminEditExerciseClientProps {
  exercise: Exercise;
  users: User[];
}

export default function AdminEditExerciseClient({ exercise, users }: AdminEditExerciseClientProps) {
  const { navigateAfterAction } = useSmartNavigation({ fallbackUrl: '/admin/exercises' });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (data: any) => {
    if (!exercise.id) return;
    setIsLoading(true);
    try {
      const formattedData = {
        ...data,
        tags: typeof data.tags === 'string'
          ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : data.tags
      };

      await adminService.updateExerciseAdmin(exercise.id, formattedData);
      toast.success('Exercício atualizado com sucesso!');
      navigateAfterAction('/admin/exercises');
    } catch (error: any) {
      console.error('Erro ao atualizar exercício:', error?.message || error);
      toast.error('Erro ao atualizar o exercício.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white transition-colors duration-300">
      <PageHeader title="Editar Exercício" backHref="/admin/exercises" />

      <main className="p-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ExerciseForm
          initialData={exercise as any}
          users={users}
          onSubmit={handleUpdate}
          isLoading={isLoading}
          showAdminFields={true}
        />
      </main>
    </div>
  );
}
