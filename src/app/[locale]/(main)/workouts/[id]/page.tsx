import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import WorkoutForm from '@/components/workouts/WorkoutForm';
import { db } from '@/config/db';
import { useParams } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';

export default function EditWorkoutPage() {
    const router = useRouter();
    const { id } = useParams();
    const t = useTranslations('Workouts');
    const [workout, setWorkout] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Procurar exercícios disponíveis para o formulário
    const availableExercises = useLiveQuery(() => db.exercises.toArray()) || [];

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const data: any = await db.workouts.get(Number(id));
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
            await db.workouts.update(Number(id), {
                ...data,
                updatedAt: new Date()
            });
            router.push('/workouts');
        } catch (error) {
            console.error("Erro ao atualizar treino:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        // Nota: Em produção, recomenda-se um modal de confirmação costumizado
        if (confirm(t('confirmDeleteWorkout'))) {
            try {
                await db.workouts.delete(Number(id));
                router.push('/workouts');
            } catch (error) {
                console.error("Erro ao eliminar treino:", error);
            }
        }
    };

    if (!workout) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-colors">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-lime-400" size={40} />
                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">A carregar treino...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="font-black text-lg tracking-tight uppercase">{t('editWorkout')}</h1>
                <button
                    onClick={handleDelete}
                    className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-50 hover:text-white transition-all"
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