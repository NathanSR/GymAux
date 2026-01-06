"use client";

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import ExerciseForm from '@/components/exercises/ExerciseForm';
import { ExerciseService } from '@/services/exerciseService';
import { toast } from 'react-toastify';

export default function NewExercisePage() {
    const router = useRouter();
    const t = useTranslations('ExerciseRegister');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (data: any) => {
        setIsLoading(true);
        try {
            const formattedData = {
                ...data,
                // Limpa as tags transformando string em array e removendo espaços vazios
                tags: data.tags
                    ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
                    : []
            };

            await ExerciseService.createExercise(formattedData);

            // Tradução para o feedback de sucesso
            toast.success(t('createdExercise'));

            router.push('/exercises');
        } catch (error) {
            console.error("Erro ao criar exercício:", error);
            // Tradução para o feedback de erro
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
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    aria-label="Voltar"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Título traduzido */}
                <h1 className="font-black text-lg tracking-tight uppercase">
                    {t('newExercise')}
                </h1>

                <div className="w-10" /> {/* Spacer para centralizar o título */}
            </header>

            <main className="p-6 max-w-2xl mx-auto">
                {/* Certifique-se de que o componente ExerciseForm também receba 
                   as labels traduzidas via props ou use o useTranslations internamente.
                */}
                <ExerciseForm onSubmit={handleCreate} isLoading={isLoading} />
            </main>
        </div>
    );
}