'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import ExerciseForm from '@/components/exercises/ExerciseForm';
import { adminService } from '@/services/adminService';
import { toast } from 'react-toastify';
import { User } from '@/config/types';
import PageHeader from '@/components/ui/PageHeader';

interface AdminNewExerciseClientProps {
  users: User[];
}

export default function AdminNewExerciseClient({ users }: AdminNewExerciseClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (data: any) => {
    setIsLoading(true);
    try {
      const formattedData = {
        ...data,
        tags: data.tags
          ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
          : []
      };

      await adminService.createExerciseAdmin(formattedData);
      toast.success('Exercício criado com sucesso!');
      router.refresh();
      router.replace('/admin/exercises');
    } catch (error: any) {
      console.error('Erro ao criar exercício:', error?.message || error);
      toast.error('Erro ao criar exercício. Verifique os dados.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white transition-colors duration-300">
      <PageHeader title="Novo Exercício" backHref="/admin/exercises" />

      <main className="p-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ExerciseForm
          users={users}
          onSubmit={handleCreate}
          isLoading={isLoading}
          showAdminFields={true}
        />
      </main>
    </div>
  );
}
