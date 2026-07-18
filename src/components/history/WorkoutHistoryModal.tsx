'use client'

import { History } from "@/config/types";
import { Activity, Clock, MessageSquare, RefreshCw, Scale, Trophy, X } from "lucide-react";
import { useState, useEffect } from "react";
import { formatDuration } from "@/utils/dateUtil";
import { useTranslations, useLocale } from "next-intl";
import { Modal } from "@/components/ui/Modal";

interface WorkoutHistoryModalProps {
    selectedWorkouts?: History[] | null;
    onClose: () => void;
    initialActiveWorkoutId?: string;
}

export function WorkoutHistoryModal({ selectedWorkouts, onClose, initialActiveWorkoutId }: WorkoutHistoryModalProps) {
    const language = useLocale();

    const isOpen = Boolean(selectedWorkouts && selectedWorkouts.length > 0);

    const handleClose = () => {
        onClose();
    };

    const [activeId, setActiveId] = useState<string>(() => {
        if (!selectedWorkouts || selectedWorkouts.length === 0) return '';
        const found = initialActiveWorkoutId
            ? selectedWorkouts.find(w => String(w.workoutId) === String(initialActiveWorkoutId) || String(w.id) === String(initialActiveWorkoutId))
            : null;
        return String(found?.id || found?.workoutId || selectedWorkouts[0]?.id || selectedWorkouts[0]?.workoutId || '');
    });

    useEffect(() => {
        if (!selectedWorkouts || selectedWorkouts.length === 0) {
            setActiveId('');
            return;
        }

        const found = initialActiveWorkoutId
            ? selectedWorkouts.find(w => String(w.workoutId) === String(initialActiveWorkoutId) || String(w.id) === String(initialActiveWorkoutId))
            : null;

        const firstWorkout = selectedWorkouts[0];
        const firstKey = String(firstWorkout?.id || firstWorkout?.workoutId || '');

        if (found) {
            setActiveId(String(found.id || found.workoutId || firstKey));
        } else {
            setActiveId(firstKey);
        }
    }, [initialActiveWorkoutId, selectedWorkouts]);

    const t = useTranslations('History');
    const te = useTranslations('Exercises');
    const tw = useTranslations('WorkoutForm');

    if (!selectedWorkouts || selectedWorkouts.length === 0) {
        return (
            <Modal isOpen={false} onClose={handleClose} title="" maxWidth="max-w-md">
                {null}
            </Modal>
        );
    }

    const currentWorkout = selectedWorkouts.find(w => String(w.id || w.workoutId) === activeId) || selectedWorkouts[0];

    const formattedDate = new Date(currentWorkout.date).toLocaleDateString(language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const executionGroups = currentWorkout.executions || [];

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title=""
            maxWidth="max-w-md"
        >
            <div className="p-6 sm:p-8 space-y-6">
                {/* Tabs for multiple workouts on same day */}
                {selectedWorkouts.length > 1 && (
                    <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
                        {selectedWorkouts.map((workout, idx) => {
                            const workoutKey = String(workout.id || workout.workoutId || idx);
                            return (
                                <button
                                    key={workoutKey}
                                    type="button"
                                    onClick={() => setActiveId(workoutKey)}
                                    className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer
                                        ${activeId === workoutKey ? 'bg-lime-400 text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}
                                >
                                    {t('workout')} {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Modal Header */}
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <span className="inline-block px-2 py-1 bg-lime-400/10 text-lime-500 text-[10px] font-black uppercase tracking-widest rounded mb-2">
                            {formattedDate} • {t('details')}
                        </span>
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white leading-tight break-words">
                            {currentWorkout.workoutName}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 active:scale-90 transition-all shrink-0 cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
                        <Scale size={16} className="text-lime-500 mb-2" />
                        <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('bodyWeight')}</span>
                        <span className="text-sm font-black">{currentWorkout.weight || '--'} kg</span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
                        <Clock size={16} className="text-lime-500 mb-2" />
                        <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('duration')}</span>
                        <span className="text-sm font-black">
                            {currentWorkout.duration
                                ? formatDuration(currentWorkout.duration)
                                : '-- min'}
                        </span>
                    </div>
                </div>

                {/* Executed Groups */}
                {executionGroups.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{t('performedExercises')}</h3>

                        {executionGroups.map((group, gi) => (
                            <div key={gi} className="space-y-3">
                                {/* Group type label for non-straight groups */}
                                {group.groupType !== 'straight' && (
                                    <div className="flex items-center gap-2 px-1">
                                        <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 dark:bg-indigo-400/10 px-2.5 py-1 rounded-full">
                                            <RefreshCw size={9} />
                                            {t(`groupTypes.${group.groupType}`)}
                                        </span>
                                    </div>
                                )}

                                {group.exercises.map((ex, ei) => (
                                    <div key={ei} className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-xl bg-lime-400 text-zinc-950 flex items-center justify-center">
                                                <Activity size={16} />
                                            </div>
                                            <span className="text-sm font-black uppercase italic tracking-tight">
                                                {(() => {
                                                    const baseName = te.has(ex.exerciseName) ? te(ex.exerciseName) : ex.exerciseName;
                                                    const currentVar = ex.variation || 'none';
                                                    const currentMode = ex.executionMode || 'bilateral';
                                                    const parts = [];
                                                    if (currentVar !== 'none') {
                                                        const isPredefined = ['none', 'barbell', 'dumbbell', 'cable', 'machine', 'smith'].includes(currentVar);
                                                        parts.push(isPredefined ? tw(`variationOptions.${currentVar}`) : currentVar);
                                                    }
                                                    if (currentMode !== 'bilateral') {
                                                        parts.push(tw(`executionModes.${currentMode}`));
                                                    }
                                                    if (parts.length > 0) {
                                                        return `${baseName} (${parts.join(' • ')})`;
                                                    }
                                                    return baseName;
                                                })()}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {ex.sets.map((set, si) => (
                                                <div key={si} className="flex flex-col bg-white dark:bg-zinc-900/50 px-4 py-3 rounded-2xl gap-1.5">
                                                    <div className="flex justify-between items-center text-[11px] font-bold">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-zinc-400">{t('set')} {si + 1}</span>
                                                            {set.skipped && (
                                                                <span className="text-[8px] font-black text-rose-400 bg-rose-400/10 px-1.5 py-0.5 rounded-full uppercase">
                                                                    {t('skipped')}
                                                                </span>
                                                            )}
                                                            {set.technique && set.technique !== 'normal' && (
                                                                <span className="text-[8px] font-black text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full uppercase">
                                                                    {t(`techniques.${set.technique}`)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-4 text-zinc-900 dark:text-zinc-300 uppercase items-center">
                                                            {set.dropset && set.dropset.length > 0 ? (
                                                                <span className="text-lime-500 font-black uppercase text-[9px] tracking-tight bg-lime-500/10 px-1.5 py-0.5 rounded">
                                                                    Dropset ({set.dropset.length}x)
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    <span>{set.weight ?? 0}kg</span>
                                                                    <span>{set.reps} reps</span>
                                                                </>
                                                            )}
                                                            {set.rpe !== undefined && set.rpe !== null && (
                                                                <span className="font-black text-lime-500">RPE {set.rpe}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {set.dropset && set.dropset.length > 0 && (
                                                        <div className="flex flex-wrap gap-x-2.5 gap-y-1 justify-end text-[10px] text-zinc-500 dark:text-zinc-400 font-medium border-t border-zinc-150 dark:border-zinc-800/40 pt-1.5 mt-0.5">
                                                            {set.dropset.map((drop, dropIdx) => (
                                                                <span key={dropIdx} className="flex items-center">
                                                                    <span className="font-black text-zinc-700 dark:text-zinc-300">{drop.weight}kg</span>
                                                                    <span className="mx-0.5 text-zinc-400">×</span>
                                                                    <span>{drop.reps} reps</span>
                                                                    {dropIdx < (set.dropset?.length || 0) - 1 && (
                                                                        <span className="ml-2.5 text-zinc-400">➔</span>
                                                                    )}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {/* Notes and Creatine */}
                <div className="flex flex-col gap-4">
                    {currentWorkout.description && (
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 mb-3 text-zinc-500">
                                <MessageSquare size={14} className="text-lime-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest">{t('feedbackNotes')}</span>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic font-medium leading-relaxed">
                                &quot;{currentWorkout.description}&quot;
                            </p>
                        </div>
                    )}

                    <div className={`flex items-center gap-2 px-6 py-3 rounded-full w-fit mx-auto transition-all ${currentWorkout.usingCreatine ? 'bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                        {currentWorkout.usingCreatine ? <Trophy size={14} /> : <X size={14} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {currentWorkout.usingCreatine ? t('creatineYes') : t('creatineNo')}
                        </span>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
