"use client";

import { useState } from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import WorkoutForm from '@/components/workouts/WorkoutForm';
import { WorkoutService } from '@/services/workoutService';
import Swal from 'sweetalert2';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'react-toastify';
import { Exercise, Workout } from '@/config/types';

interface EditWorkoutClientProps {
    initialWorkout: Workout;
    availableExercises: Exercise[];
    workoutId: string;
    callerId: string;
    baseUrl?: string;
}

import PageHeader from '@/components/ui/PageHeader';

export default function EditWorkoutClient({ initialWorkout, availableExercises, workoutId, callerId, baseUrl = '/workouts' }: EditWorkoutClientProps) {
    const { isDark } = useTheme();
    const router = useRouter();
    const t = useTranslations('WorkoutEdit');

    const [isSaving, setIsSaving] = useState(false);

    const handleUpdate = async (data: any) => {
        setIsSaving(true);
        try {
            await WorkoutService.updateWorkout(workoutId, {
                ...data,
                callerId,
                updatedAt: new Date()
            });
            toast.success(t('updatedWorkout'));
            router.refresh();
            router.replace(baseUrl);
        } catch (error: any) {
            console.error("Erro ao atualizar treino:", error?.message || error);
            toast.error("Error updating workout");
            setIsSaving(false);
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
                    await WorkoutService.deleteWorkout(workoutId, callerId);
                    router.refresh();
                    router.replace(baseUrl);
                } catch (error: any) {
                    console.error("Erro ao deletar:", error?.message || error);
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
            <PageHeader
                title={t('editWorkout')}
                backHref={baseUrl}
                rightAction={
                    <button
                        onClick={handleDelete}
                        className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                        <Trash2 size={20} />
                    </button>
                }
            />

            <main className="p-6 max-w-3xl mx-auto animate-in fade-in duration-500">
                <WorkoutForm
                    initialData={initialWorkout}
                    availableExercises={availableExercises}
                    onSubmit={handleUpdate}
                    isLoading={isSaving}
                />
            </main>
        </div>
    );
}
