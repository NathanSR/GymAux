"use client"

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import WorkoutForm from '@/components/workouts/WorkoutForm';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSession } from '@/hooks/useSession';
import { WorkoutService } from '@/services/workoutService';
import { ExerciseService } from '@/services/exerciseService';
import { toast } from 'react-toastify';

export default function NewWorkoutPage() {
    const router = useRouter();
    // Ajustado para o namespace solicitado
    const t = useTranslations('WorkoutRegister');
    const [isLoading, setIsLoading] = useState(false);

    const { activeUser } = useSession();

    // Buscamos os exercícios disponíveis para popular o select no form
    const availableExercises = useLiveQuery(() => ExerciseService.getAllExercises()) || [];

    const handleCreate = async (data: any) => {
        if (!activeUser) return;

        setIsLoading(true);
        try {
            // O dado já vem estruturado pelo WorkoutForm
            await WorkoutService.createWorkout({
                ...data,
                userId: activeUser.id,
                createdAt: new Date(),
            });

            toast.success(t('createdWorkout'));
            router.push('/workouts');
        } catch (error) {
            console.error("Erro ao criar treino:", error);
            toast.error(t('errorCreating'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                    <ChevronLeft size={24} />
                </button>

                <h1 className="font-black text-lg tracking-tight uppercase">
                    {t('newWorkout')}
                </h1>

                <div className="w-10" /> {/* Spacer para centralizar o título */}
            </header>

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