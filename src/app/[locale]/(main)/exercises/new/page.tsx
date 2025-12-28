"use client";

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ExerciseForm from '@/components/exercises/ExerciseForm';
import { ExerciseService } from '@/services/exerciseService';

export default function NewExercisePage() {
    const router = useRouter();
    const t = useTranslations('Exercises');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (data: any) => {
        setIsLoading(true);
        try {
            const formattedData = {
                ...data,
                tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []
            };

            await ExerciseService.createExercise(formattedData);
            router.push('/exercises');
        } catch (error) {
            console.error("Erro ao criar exercício:", error);
        } finally {
            setIsLoading(false);
        }
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
                <h1 className="font-black text-lg tracking-tight uppercase">{t('newExercise')}</h1>
                <div className="w-10" />
            </header>

            <main className="p-6 max-w-2xl mx-auto">
                <ExerciseForm onSubmit={handleCreate} isLoading={isLoading} />
            </main>
        </div>
    );
}