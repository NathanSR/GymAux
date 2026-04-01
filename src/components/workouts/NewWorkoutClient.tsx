"use client";

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import WorkoutForm from '@/components/workouts/WorkoutForm';
import { WorkoutService } from '@/services/workoutService';
import { toast } from 'react-toastify';
import { Exercise } from '@/config/types';

interface NewWorkoutClientProps {
    availableExercises: Exercise[];
    userId: string;
    baseUrl?: string;
}

import PageHeader from '@/components/ui/PageHeader';

export default function NewWorkoutClient({ availableExercises, userId, baseUrl = '/workouts' }: NewWorkoutClientProps) {
    const router = useRouter();
    const t = useTranslations('WorkoutRegister');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (data: any) => {
        setIsLoading(true);
        try {
            await WorkoutService.createWorkout({
                ...data,
                userId,
                callerId: userId,
                createdAt: new Date(),
            });

            toast.success(t('createdWorkout'));
            router.push(baseUrl);
        } catch (error: any) {
            console.error("Erro ao criar treino:", error?.message || error);
            toast.error(t('errorCreating'));
            setIsLoading(false);
        } finally {
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
            <PageHeader title={t('newWorkout')} backHref={baseUrl} />

            <main className="p-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <WorkoutForm
                    availableExercises={availableExercises}
                    onSubmit={handleCreate}
                    isLoading={isLoading}
                />
            </main>
        </div>
    );
}
