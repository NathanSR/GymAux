import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import ExerciseForm from './ExerciseForm';
import { useTranslations } from 'next-intl';
import { ExerciseService } from '@/services/exerciseService';
import { useSession } from '@/hooks/useSession';
import { toast } from 'react-toastify';

export default function QuickExerciseDrawer({ isOpen, onClose, onExerciseCreated }: {
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
                userId: activeUser?.id, // Let the service resolve if this is undefined
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center p-0 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Drawer / Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 transition-all border-t sm:border border-zinc-100 dark:border-zinc-800 max-h-[90vh] overflow-y-auto overflow-x-hidden">

                {/* Handle para Mobile */}
                <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-6 sm:hidden" />

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">{t('quickAdd')}</h2>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('quickAddSubtitle')}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

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
            </div>
        </div>
    );
}