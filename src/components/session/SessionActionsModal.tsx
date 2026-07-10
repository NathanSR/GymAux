import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, SkipForward, FastForward, CheckCircle, AlertCircle, Dumbbell, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SessionActionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSkipSet: () => void;
    onSkipExercise: () => void;
    onAddSet: () => void;
    onForceFinishWorkout: () => void;
    isGroupAlternating: boolean;
    onSubstituteExercise: () => void;
}

export function SessionActionsModal({
    isOpen,
    onClose,
    onSkipSet,
    onSkipExercise,
    onAddSet,
    onForceFinishWorkout,
    isGroupAlternating,
    onSubstituteExercise
}: SessionActionsModalProps) {
    const t = useTranslations('Session');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-end justify-center">
                {/* Backdrop Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/75 backdrop-blur-sm"
                />

                {/* Bottom Drawer Card */}
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 220 }}
                    className="relative w-full max-w-md bg-zinc-900 border-t border-zinc-800 rounded-t-[32px] p-6 shadow-2xl z-10 flex flex-col focus:outline-none"
                >
                    {/* Drawer Handle */}
                    <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-5 flex-shrink-0" />

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-black uppercase italic tracking-tighter text-white">
                                Ações do Treino
                            </h3>
                            <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                Gerencie o fluxo da sessão atual
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Actions List */}
                    <div className="space-y-3 pb-6">
                        {/* 1. Add Set (Primary Constructive Action) */}
                        <button
                            type="button"
                            onClick={() => {
                                onAddSet();
                                onClose();
                            }}
                            className="w-full py-4 px-4 bg-lime-400 hover:bg-lime-500 text-zinc-950 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-lime-400/10"
                        >
                            <Plus size={16} strokeWidth={3} className="flex-shrink-0" />
                            <div className="flex flex-col items-start leading-none">
                                <span className="font-black text-left">Adicionar Série Extra</span>
                                <span className="text-[9px] font-bold text-zinc-850 opacity-60 mt-0.5 text-left normal-case">
                                    Adiciona mais um set ao exercício atual
                                </span>
                            </div>
                        </button>

                        {/* Substituir Exercício */}
                        <button
                            type="button"
                            onClick={() => {
                                onSubstituteExercise();
                                onClose();
                            }}
                            className="w-full py-4 px-4 bg-zinc-950 border border-zinc-800/80 hover:bg-zinc-800/30 text-lime-400 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                        >
                            <RefreshCw size={16} className="text-lime-400 flex-shrink-0" />
                            <div className="flex flex-col items-start leading-none">
                                <span className="font-black text-left">Substituir Exercício</span>
                                <span className="text-[9px] font-bold text-zinc-500 mt-0.5 text-left normal-case">
                                    Troca o exercício atual por uma alternativa semelhante
                                </span>
                            </div>
                        </button>

                        <div className="h-[1px] bg-zinc-800/60 my-2" />

                        {/* 2. Skip Set */}
                        <button
                            type="button"
                            onClick={() => {
                                onSkipSet();
                                onClose();
                            }}
                            className="w-full py-4 px-4 bg-zinc-950 border border-zinc-800/80 hover:bg-zinc-800/30 text-zinc-200 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                        >
                            <SkipForward size={16} className="text-zinc-400 flex-shrink-0" />
                            <div className="flex flex-col items-start leading-none">
                                <span className="font-black text-left">{t('skipSet')}</span>
                                <span className="text-[9px] font-bold text-zinc-500 mt-0.5 text-left normal-case">
                                    Pula e deixa a série atual em branco
                                </span>
                            </div>
                        </button>

                        {/* 3. Skip Exercise / Skip Group */}
                        <button
                            type="button"
                            onClick={() => {
                                onSkipExercise();
                                onClose();
                            }}
                            className="w-full py-4 px-4 bg-rose-950/20 border border-rose-900/30 hover:bg-rose-900/20 text-rose-400 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                        >
                            <FastForward size={16} className="flex-shrink-0" />
                            <div className="flex flex-col items-start leading-none">
                                <span className="font-black text-left">
                                    {isGroupAlternating ? t('skipGroup') : t('skipExercise')}
                                </span>
                                <span className="text-[9px] font-bold text-rose-400/60 mt-0.5 text-left normal-case">
                                    Ignora o restante do exercício/grupo atual
                                </span>
                            </div>
                        </button>

                        <div className="h-[1px] bg-zinc-800/60 my-2" />

                        {/* 4. Finish Workout Now */}
                        <button
                            type="button"
                            onClick={() => {
                                onForceFinishWorkout();
                                onClose();
                            }}
                            className="w-full py-4 px-4 bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-rose-500 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                        >
                            <CheckCircle size={16} className="text-zinc-500 flex-shrink-0" />
                            <div className="flex flex-col items-start leading-none">
                                <span className="font-black text-left">{t('finishNow')}</span>
                                <span className="text-[9px] font-bold text-zinc-600 mt-0.5 text-left normal-case">
                                    Encerra a sessão inteira neste momento
                                </span>
                            </div>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
