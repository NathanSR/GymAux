'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import ExerciseForm from './ExerciseForm';
import { useTranslations } from 'next-intl';
import { ExerciseService } from '@/services/exerciseService';
import { useSession } from '@/hooks/useSession';
import { toast } from 'react-toastify';
import { Drawer } from '@/components/ui/Drawer';

export default function QuickExerciseDrawer({
    isOpen,
    onClose,
    onExerciseCreated
}: {
    isOpen: boolean;
    onClose: () => void;
    onExerciseCreated: (exercise: any) => void;
}) {
    const t = useTranslations('ExerciseForm');
    const { activeUser } = useSession();

    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            const formattedData = {
                ...data,
                userId: activeUser?.id,
                tags: data.tags
                    ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
                    : []
            };

            const newExercise = await ExerciseService.createExercise(formattedData);
            setShowSuccess(true);

            setTimeout(() => {
                onExerciseCreated(newExercise);
                setShowSuccess(false);
                onClose();
            }, 1200);

        } catch (error: any) {
            console.error("Erro ao criar exercício:", error);
            toast.error(t('errorCreating') || "Erro ao criar exercício");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-lg mx-auto"
            title={<h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">{t('quickAdd')}</h2>}
            subtitle={<p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('quickAddSubtitle')}</p>}
        >
            {showSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="w-24 h-24 bg-lime-400/20 text-lime-500 rounded-full flex items-center justify-center shadow-lg shadow-lime-500/10">
                        <CheckCircle2 size={48} />
                    </div>
                    <div className="text-center">
                        <p className="font-black uppercase tracking-widest text-base text-lime-500">{t('success') || t('createdExercise')}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">{t('savingSubtitle')}</p>
                    </div>
                </div>
            ) : (
                <ExerciseForm
                    onSubmit={onSubmit}
                    isLoading={isSaving}
                />
            )}
        </Drawer>
    );
}