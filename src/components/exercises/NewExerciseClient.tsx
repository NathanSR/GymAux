"use client";

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useSession } from '@/hooks/useSession';
import ExerciseForm from '@/components/exercises/ExerciseForm';
import { ExerciseService } from '@/services/exerciseService';
import { toast } from 'react-toastify';
import PageHeader from '@/components/ui/PageHeader';

export default function NewExerciseClient() {
    const router = useRouter();
    const t = useTranslations('ExerciseRegister');
    const { activeUser } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (data: any) => {
        setIsLoading(true);
        try {
            const formattedData = {
                ...data,
                userId: activeUser?.id,
                tags: data.tags
                    ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
                    : []
            };

            await ExerciseService.createExercise(formattedData);
            toast.success(t('createdExercise'));
            router.refresh();
            router.replace('/exercises');
        } catch (error: any) {
            console.error("Erro ao criar exercício:", error?.message || error);
            toast.error(t('errorCreating'));
            setIsLoading(false);
        } finally {
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
            <PageHeader title={t('newExercise')} backHref="/exercises" />

            <main className="p-6 max-w-2xl mx-auto">
                <ExerciseForm onSubmit={handleCreate} isLoading={isLoading} />
            </main>
        </div>
    );
}
