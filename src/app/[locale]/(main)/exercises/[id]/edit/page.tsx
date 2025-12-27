"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ExerciseForm from '@/components/exercises/ExerciseForm';
import { db } from '@/config/db';
import { useParams } from 'next/navigation';

export default function EditExercisePage() {
    const router = useRouter();
    const { id } = useParams();
    const t = useTranslations('Exercises');
    const [exercise, setExercise] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchExercise = async () => {
            const data: any = await db.exercises.get(Number(id));
            if (data) setExercise(data);
            else router.push('/exercises');
        };
        fetchExercise();
    }, [id, router]);

    const handleUpdate = async (data: any) => {
        setIsLoading(true);
        try {
            const formattedData = {
                ...data,
                tags: typeof data.tags === 'string'
                    ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
                    : data.tags
            };

            await db.exercises.update(Number(id), formattedData);
            router.push('/exercises');
        } catch (error) {
            console.error("Erro ao atualizar:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm(t('confirmDelete'))) {
            await db.exercises.delete(Number(id));
            router.push('/exercises');
        }
    };

    if (!exercise) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-zinc-950">
                <Loader2 className="animate-spin text-lime-400" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4 flex items-center justify-between">
                <button onClick={() => router.back()} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="font-black text-lg tracking-tight uppercase">{t('editExercise')}</h1>
                <button onClick={handleDelete} className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={20} />
                </button>
            </header>

            <main className="p-6 max-w-2xl mx-auto animate-in fade-in duration-500">
                <ExerciseForm
                    initialData={exercise}
                    onSubmit={handleUpdate}
                    isLoading={isLoading}
                />
            </main>
        </div>
    );
}