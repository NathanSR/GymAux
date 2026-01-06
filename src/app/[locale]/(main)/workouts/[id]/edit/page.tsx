"use client"

import { useState, useEffect } from 'react';
import { ChevronLeft, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import WorkoutForm from '@/components/workouts/WorkoutForm';
import { useParams } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { ExerciseService } from '@/services/exerciseService';
import { WorkoutService } from '@/services/workoutService';
import Swal from 'sweetalert2';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'react-toastify';
import Loading from '@/app/[locale]/loading';

export default function EditWorkoutPage() {
    const { theme } = useTheme();
    const router = useRouter();
    const { id } = useParams();

    // Namespace solicitado: WorkoutEdit
    const t = useTranslations('WorkoutEdit');

    const [workout, setWorkout] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Procurar exercícios disponíveis para o formulário
    const availableExercises = useLiveQuery(() => ExerciseService.getAllExercises()) || [];

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const data: any = await WorkoutService.getWorkoutById(Number(id));
                if (data) {
                    setWorkout(data);
                } else {
                    router.push('/workouts');
                }
            } catch (error) {
                console.error("Erro ao carregar treino:", error);
                router.push('/workouts');
            }
        };
        fetchWorkout();
    }, [id, router]);

    const handleUpdate = async (data: any) => {
        setIsSaving(true);
        try {
            await WorkoutService.updateWorkout(Number(id), {
                ...data,
                updatedAt: new Date()
            });
            toast.success(t('updatedWorkout'));
            router.push('/workouts');
        } catch (error) {
            console.error("Erro ao atualizar treino:", error);
            toast.error("Error updating workout");
        } finally {
            setIsSaving(false);
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
            background: theme === 'dark' ? '#18181b' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#18181b',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await WorkoutService.deleteWorkout(Number(id));
                    router.push('/workouts');
                } catch (error) {
                    console.error("Erro ao deletar:", error);
                }
            }
        });
    };

    if (!workout) return <Loading />

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                    <ChevronLeft size={24} />
                </button>

                <h1 className="font-black text-lg tracking-tight uppercase">
                    {t('editWorkout')}
                </h1>

                <button
                    onClick={handleDelete}
                    className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-50 hover:text-white transition-all cursor-pointer"
                >
                    <Trash2 size={20} />
                </button>
            </header>

            <main className="p-6 max-w-3xl mx-auto animate-in fade-in duration-500">
                <WorkoutForm
                    initialData={workout}
                    availableExercises={availableExercises}
                    onSubmit={handleUpdate}
                    isLoading={isSaving}
                />
            </main>
        </div>
    );
}