import React, { useState, useEffect } from 'react';
import { X, Plus, CheckCircle2, Loader2 } from 'lucide-react';
import ExerciseForm from './ExerciseForm';
import { useTranslations } from 'next-intl';

/**
 * Nota: As importações de 'next-intl' e 'db' estão comentadas para o Preview.
 * Este componente utiliza o ExerciseForm de forma adaptada para ser rápido.
 */

export default function QuickExerciseDrawer({ isOpen, onClose, onExerciseCreated }: {
    isOpen: boolean;
    onClose: () => void;
    onExerciseCreated: (exercise: any) => void;
}) {
    const t = useTranslations('ExerciseForm');

    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {

            setShowSuccess(true);

            console.log("Simulando criação de exercício:", data);

        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Drawer / Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 transition-all border-t border-zinc-100 dark:border-zinc-800">

                {/* Handle para Mobile */}
                <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-6 sm:hidden" />

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">{t('quickAdd')}</h2>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sem sair do seu treino</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {showSuccess ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-lime-400/20 text-lime-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={40} />
                        </div>
                        <p className="font-black uppercase tracking-widest text-sm text-lime-500">{t('success')}</p>
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