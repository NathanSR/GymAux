'use client';

import { Check, ChevronRight, X } from "lucide-react";
import { useTranslations } from 'next-intl';

interface WorkoutDrawerProps {
    showPreview: boolean;
    onClose: () => void;
    exercises: any[];
    currentExerciseIndex: number;
}

export const WorkoutDrawer = ({ showPreview, onClose, exercises, currentExerciseIndex }: WorkoutDrawerProps) => {
    const t = useTranslations('WorkoutDrawer');
    const te = useTranslations('Exercises');

    return (
        showPreview && (
            <div className="fixed inset-0 z-[60] flex items-end animate-in fade-in duration-300">
                {/* Backdrop com desfoque mais intenso */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    onClick={onClose}
                />

                <div className="relative w-full bg-zinc-950 rounded-t-[40px] border-t border-zinc-800/50 p-8 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-500 shadow-2xl">

                    {/* Barra de arraste visual (indicador de modal) */}
                    <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-6 opacity-50" />

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                                {t('title')}
                            </h3>
                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">
                                {exercises.length} {t('totalExercises')}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-90"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {exercises.map((ex: any, idx: number) => {
                            const isCurrent = idx === currentExerciseIndex;
                            const isCompleted = idx < currentExerciseIndex;

                            return (
                                <div
                                    key={ex.exerciseId || idx}
                                    className={`flex items-center justify-between p-5 rounded-[28px] border transition-all duration-300 ${isCurrent
                                        ? 'bg-lime-400/10 border-lime-400/40 shadow-[0_0_20px_rgba(163,230,31,0.05)]'
                                        : 'bg-zinc-900/50 border-zinc-800/50'
                                        } ${isCompleted ? 'opacity-40' : 'opacity-100'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        {/* Número do Exercício ou Check */}
                                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm transition-colors ${isCurrent
                                            ? 'bg-lime-400 text-zinc-950 shadow-lg shadow-lime-400/20'
                                            : isCompleted
                                                ? 'bg-zinc-800 text-lime-400'
                                                : 'bg-zinc-800 text-zinc-500'
                                            }`}>
                                            {isCompleted ? <Check size={20} strokeWidth={3} /> : idx + 1}
                                        </div>

                                        <div>
                                            <p className={`font-black text-sm uppercase tracking-tight ${isCurrent ? 'text-white' : 'text-zinc-400'
                                                }`}>
                                                {te(ex.exerciseName)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                                    {ex.sets} {t('sets')}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                                    {ex.reps} {t('reps')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Indicador Lateral */}
                                    {!isCompleted && (
                                        <ChevronRight
                                            size={18}
                                            className={isCurrent ? 'text-lime-400' : 'text-zinc-800'}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    );
};