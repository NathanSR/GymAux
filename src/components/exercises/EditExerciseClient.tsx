"use client";

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';
import { useTranslations } from 'next-intl';
import ExerciseForm from '@/components/exercises/ExerciseForm';
import { ExerciseService } from '@/services/exerciseService';
import { useAlerts } from '@/hooks/useAlerts';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'react-toastify';
import { Exercise } from '@/config/types';
import { useSession } from '@/hooks/useSession';
import PageHeader from '@/components/ui/PageHeader';

interface EditExerciseClientProps {
    initialExercise: any;
    exerciseId: number;
}

export default function EditExerciseClient({ initialExercise, exerciseId }: EditExerciseClientProps) {
    const { isDark } = useTheme();
    const { navigateAfterAction } = useSmartNavigation({ fallbackUrl: '/exercises' });
    const t = useTranslations('ExerciseEdit');
    const { activeUser } = useSession();
    const alerts = useAlerts();

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

            await ExerciseService.updateExercise(exerciseId, { ...formattedData, userId: activeUser!.id as string });
            toast.success(t('updatedExercise'));
            navigateAfterAction('/exercises');
        } catch (error: any) {
            console.error("Erro ao atualizar:", error?.message || error);
            toast.error("Error updating exercise");
            setIsLoading(false);
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
                await ExerciseService.deleteExercise(exerciseId, activeUser!.id as string);
                navigateAfterAction('/exercises');
            } catch (error: any) {
                console.error("Erro ao deletar:", error?.message || error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
            <PageHeader 
                title={t('editExercise')}
                backHref="/exercises"
                rightAction={
                    <button
                        onClick={handleDelete}
                        className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                        <Trash2 size={20} />
                    </button>
                }
            />

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
