"use client";

import { useState } from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ExerciseForm from '@/components/exercises/ExerciseForm';
import { ExerciseService } from '@/services/exerciseService';
import Swal from 'sweetalert2';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'react-toastify';
import { Exercise } from '@/config/types';

interface EditExerciseClientProps {
    initialExercise: any;
    exerciseId: number;
}

export default function EditExerciseClient({ initialExercise, exerciseId }: EditExerciseClientProps) {
    const { isDark } = useTheme();
    const router = useRouter();
    const t = useTranslations('ExerciseEdit');

    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async (data: any) => {
        setIsLoading(true);
        try {
            const formattedData = {
                ...data,
                tags: typeof data.tags === 'string'
                    ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
                    : data.tags
            };

            await ExerciseService.updateExercise(exerciseId, formattedData);
            toast.success(t('updatedExercise'));
            router.push('/exercises');
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            toast.error("Error updating exercise");
            setIsLoading(false);
        } finally {
        }
    };

    const handleDelete = async () => {
        Swal.fire({
            title: t('confirmDeleteTitle'),
            text: t('confirmDeleteText'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: t('confirmDeleteButton'),
            cancelButtonText: t('cancelButton'),
            background: isDark ? '#18181b' : '#ffffff',
            color: isDark ? '#ffffff' : '#18181b',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await ExerciseService.deleteExercise(exerciseId);
                    router.push('/exercises');
                } catch (error) {
                    console.error("Erro ao deletar:", error);
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>

                <h1 className="font-black text-lg tracking-tight uppercase">
                    {t('editExercise')}
                </h1>

                <button
                    onClick={handleDelete}
                    className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                >
                    <Trash2 size={20} />
                </button>
            </header>

            <main className="p-6 max-2xl mx-auto animate-in fade-in duration-500">
                <ExerciseForm
                    initialData={initialExercise}
                    onSubmit={handleUpdate}
                    isLoading={isLoading}
                />
            </main>
        </div>
    );
}
