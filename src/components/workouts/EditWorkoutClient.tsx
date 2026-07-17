'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';
import { useTranslations } from 'next-intl';
import WorkoutForm from '@/components/workouts/WorkoutForm';
import { WorkoutService } from '@/services/workoutService';
import { useAlerts } from '@/hooks/useAlerts';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'react-toastify';
import { Exercise, Workout } from '@/config/types';
import PageHeader from '@/components/ui/PageHeader';

interface EditWorkoutClientProps {
    initialWorkout: Workout;
    availableExercises: Exercise[];
    workoutId: string;
    callerId: string;
    baseUrl?: string;
}

export default function EditWorkoutClient({ initialWorkout, availableExercises, workoutId, callerId, baseUrl = '/workouts' }: EditWorkoutClientProps) {
    const { isDark } = useTheme();
    const { navigateAfterAction } = useSmartNavigation({ fallbackUrl: baseUrl });
    const t = useTranslations('WorkoutEdit');
    const alerts = useAlerts();

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
            navigateAfterAction(baseUrl);
        } catch (error: any) {
            console.error("Erro ao atualizar treino:", error?.message || error);
            toast.error("Error updating workout");
            setIsSaving(false);
        } finally {
        }
    };

    const handleDelete = async () => {
        const result = await alerts.confirm({
            title: t('confirmDeleteTitle'),
            text: t('confirmDeleteText'),
            confirmText: t('confirmDeleteButton'),
            cancelText: t('cancelButton'),
            variant: 'delete',
        });

        if (result.isConfirmed) {
            try {
                await WorkoutService.deleteWorkout(workoutId, callerId);
                navigateAfterAction(baseUrl);
            } catch (error: any) {
                console.error("Erro ao deletar:", error?.message || error);
            }
        }
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
