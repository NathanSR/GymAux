"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Trash2, Dumbbell, HelpCircle, Save, Zap, ArrowRight, Sliders, Edit2, Edit } from 'lucide-react';
import { ExerciseGroup, PlannedSet, GroupType, SetTechnique } from '@/config/types';
import { ExerciseSelector } from '@/components/exercises/ExerciseSelector';
import { GroupTypeHelpModal } from './GroupTypeHelpModal';
import { DropsetModal, DropsetPart } from '@/components/session/DropsetModal';
import { numberInputUtils } from '@/utils/numberUtil';

export interface ExerciseConfigFormProps {
    initialGroupData?: ExerciseGroup | null;
    onSave: (group: ExerciseGroup) => void;
    onCancel?: () => void;
    submitLabel?: string;
    className?: string;
}

const DEFAULT_SET: PlannedSet = {
    reps: 10,
    weight: 0,
    restTime: 60,
    technique: 'normal'
};

const DEFAULT_GROUP: ExerciseGroup = {
    groupType: 'straight',
    rounds: 3,
    restBetweenRounds: 0,
    restAfterGroup: 60,
    exercises: [
        {
            exerciseId: 0,
            exerciseName: '',
            restAfterExercise: 0,
            sets: [
                { ...DEFAULT_SET },
                { ...DEFAULT_SET },
                { ...DEFAULT_SET }
            ]
        }
    ]
};

export const ExerciseConfigForm: React.FC<ExerciseConfigFormProps> = ({
    initialGroupData,
    onSave,
    submitLabel,
    className = ""
}) => {
    const t = useTranslations('WorkoutForm');
    const te = useTranslations('Exercises');
    const tw = useTranslations('WorkoutDrawer');
    const ts = useTranslations('Session');

    const [group, setGroup] = useState<ExerciseGroup>(() => {
        return initialGroupData ? JSON.parse(JSON.stringify(initialGroupData)) : JSON.parse(JSON.stringify(DEFAULT_GROUP));
    });
    const [selectingExIndex, setSelectingExIndex] = useState<number | null>(null);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [showDetailedView, setShowDetailedView] = useState(false);
    const [activeDropsetTarget, setActiveDropsetTarget] = useState<{
        exIndex: number;
        setIndex: number | 'all';
    } | null>(null);

    useEffect(() => {
        if (initialGroupData) {
            setGroup(JSON.parse(JSON.stringify(initialGroupData)));
        } else {
            setGroup(JSON.parse(JSON.stringify(DEFAULT_GROUP)));
        }
    }, [initialGroupData]);

    const handleGroupTypeChange = (newType: GroupType) => {
        let maxAllowed = 1;
        if (newType === 'bi_set') maxAllowed = 2;
        else if (newType === 'tri_set') maxAllowed = 3;
        else if (newType === 'giant_set' || newType === 'circuit') maxAllowed = 4;
        else if (newType === 'superset') maxAllowed = 2;

        let updatedExercises = [...group.exercises];
        if (updatedExercises.length > maxAllowed) {
            updatedExercises = updatedExercises.slice(0, maxAllowed);
        } else if (updatedExercises.length < maxAllowed && (newType === 'bi_set' || newType === 'tri_set' || newType === 'superset')) {
            while (updatedExercises.length < maxAllowed) {
                const baseSets = updatedExercises[0]?.sets || [DEFAULT_SET, DEFAULT_SET, DEFAULT_SET];
                updatedExercises.push({
                    exerciseId: 0,
                    exerciseName: '',
                    restAfterExercise: 0,
                    sets: JSON.parse(JSON.stringify(baseSets))
                });
            }
        }

        setGroup(prev => ({
            ...prev,
            groupType: newType,
            exercises: updatedExercises
        }));
    };

    const handleOpenSelector = (index: number) => {
        setSelectingExIndex(index);
        setIsSelectorOpen(true);
    };

    const handleSelectExercise = (exercise: any) => {
        if (selectingExIndex !== null) {
            const updatedExercises = [...group.exercises];
            updatedExercises[selectingExIndex] = {
                ...updatedExercises[selectingExIndex],
                exerciseId: exercise.id,
                exerciseName: exercise.name
            };
            setGroup(prev => ({ ...prev, exercises: updatedExercises }));
        }
        setIsSelectorOpen(false);
        setSelectingExIndex(null);
    };

    const handleAddExerciseToGroup = () => {
        const baseSets = group.exercises[0]?.sets || [DEFAULT_SET, DEFAULT_SET, DEFAULT_SET];
        const newExIndex = group.exercises.length;
        setGroup(prev => ({
            ...prev,
            exercises: [
                ...prev.exercises,
                {
                    exerciseId: 0,
                    exerciseName: '',
                    restAfterExercise: 0,
                    sets: JSON.parse(JSON.stringify(baseSets))
                }
            ]
        }));
        handleOpenSelector(newExIndex);
    };

    const handleRemoveExerciseFromGroup = (index: number) => {
        if (group.exercises.length <= 1) return;
        const updatedExercises = group.exercises.filter((_, i) => i !== index);
        setGroup(prev => ({ ...prev, exercises: updatedExercises }));
    };

    const handleSetsCountChange = (exIndex: number, newCount: number) => {
        if (newCount < 1) return;
        setGroup(prev => {
            const updatedExercises = [...prev.exercises];
            const currentSets = updatedExercises[exIndex]?.sets || [];
            let newSets = [...currentSets];

            if (currentSets.length < newCount) {
                const lastSet = currentSets[currentSets.length - 1] || DEFAULT_SET;
                while (newSets.length < newCount) {
                    newSets.push(JSON.parse(JSON.stringify(lastSet)));
                }
            } else if (currentSets.length > newCount) {
                newSets = newSets.slice(0, newCount);
            }

            updatedExercises[exIndex].sets = newSets;
            return {
                ...prev,
                rounds: newCount,
                exercises: updatedExercises
            };
        });
    };

    const handleGlobalRepsChange = (exIndex: number, newReps: number) => {
        setGroup(prev => {
            const updatedExercises = [...prev.exercises];
            const updatedSets = (updatedExercises[exIndex].sets || []).map(s => ({
                ...s,
                reps: newReps
            }));
            updatedExercises[exIndex].sets = updatedSets;
            return { ...prev, exercises: updatedExercises };
        });
    };

    const handleGlobalWeightChange = (exIndex: number, newWeight: number) => {
        setGroup(prev => {
            const updatedExercises = [...prev.exercises];
            const updatedSets = (updatedExercises[exIndex].sets || []).map(s => ({
                ...s,
                weight: newWeight
            }));
            updatedExercises[exIndex].sets = updatedSets;
            return { ...prev, exercises: updatedExercises };
        });
    };

    const handleGlobalRestChange = (exIndex: number, newRest: number) => {
        setGroup(prev => {
            const updatedExercises = [...prev.exercises];
            const updatedSets = (updatedExercises[exIndex].sets || []).map(s => ({
                ...s,
                restTime: newRest
            }));
            updatedExercises[exIndex].sets = updatedSets;
            return {
                ...prev,
                restAfterGroup: newRest,
                exercises: updatedExercises
            };
        });
    };

    const handleRoundsChange = (newRounds: number) => {
        if (newRounds < 1) return;
        setGroup(prev => {
            const updatedExercises = prev.exercises.map(ex => {
                const currentSets = ex.sets || [];
                let newSets = [...currentSets];
                if (currentSets.length < newRounds) {
                    const lastSet = currentSets[currentSets.length - 1] || DEFAULT_SET;
                    while (newSets.length < newRounds) {
                        newSets.push({ ...lastSet });
                    }
                } else if (currentSets.length > newRounds) {
                    newSets = newSets.slice(0, newRounds);
                }
                return { ...ex, sets: newSets };
            });
            return {
                ...prev,
                rounds: newRounds,
                exercises: updatedExercises
            };
        });
    };

    const handleSetChange = (exIndex: number, setIndex: number, field: keyof PlannedSet, value: any) => {
        const updatedExercises = [...group.exercises];
        const currentSets = [...(updatedExercises[exIndex].sets || [])];
        currentSets[setIndex] = {
            ...currentSets[setIndex],
            [field]: value
        };
        updatedExercises[exIndex].sets = currentSets;
        setGroup(prev => ({ ...prev, exercises: updatedExercises }));

        if (field === 'technique' && value === 'drop_set') {
            setActiveDropsetTarget({ exIndex, setIndex });
        }
    };

    const handleAddSet = (exIndex: number) => {
        const updatedExercises = [...group.exercises];
        const currentSets = [...(updatedExercises[exIndex].sets || [])];
        const lastSet = currentSets[currentSets.length - 1] || DEFAULT_SET;
        currentSets.push({ ...lastSet });
        updatedExercises[exIndex].sets = currentSets;
        setGroup(prev => ({
            ...prev,
            rounds: currentSets.length,
            exercises: updatedExercises
        }));
    };

    const handleRemoveSet = (exIndex: number, setIndex: number) => {
        const updatedExercises = [...group.exercises];
        const currentSets = [...(updatedExercises[exIndex].sets || [])];
        if (currentSets.length <= 1) return;
        currentSets.splice(setIndex, 1);
        updatedExercises[exIndex].sets = currentSets;
        setGroup(prev => ({
            ...prev,
            rounds: currentSets.length,
            exercises: updatedExercises
        }));
    };

    const handleNotesChange = (exIndex: number, notes: string) => {
        const updatedExercises = [...group.exercises];
        updatedExercises[exIndex] = {
            ...updatedExercises[exIndex],
            notes
        };
        setGroup(prev => ({ ...prev, exercises: updatedExercises }));
    };

    const handleSaveDropset = (dropsetData: DropsetPart[] | null) => {
        if (!activeDropsetTarget) return;
        const { exIndex, setIndex } = activeDropsetTarget;

        const updatedExercises = [...group.exercises];
        const currentSets = [...(updatedExercises[exIndex].sets || [])];

        if (setIndex === 'all') {
            const updatedSets = currentSets.map(s => {
                if (dropsetData && dropsetData.length > 1) {
                    return {
                        ...s,
                        technique: 'drop_set' as SetTechnique,
                        dropset: JSON.parse(JSON.stringify(dropsetData))
                    };
                } else {
                    return {
                        ...s,
                        technique: s.technique === 'drop_set' ? ('normal' as SetTechnique) : s.technique,
                        dropset: undefined
                    };
                }
            });
            updatedExercises[exIndex].sets = updatedSets;
        } else {
            if (dropsetData && dropsetData.length > 1) {
                currentSets[setIndex] = {
                    ...currentSets[setIndex],
                    technique: 'drop_set',
                    dropset: JSON.parse(JSON.stringify(dropsetData))
                };
            } else {
                currentSets[setIndex] = {
                    ...currentSets[setIndex],
                    technique: currentSets[setIndex].technique === 'drop_set' ? 'normal' : currentSets[setIndex].technique,
                    dropset: undefined
                };
            }
            updatedExercises[exIndex].sets = currentSets;
        }

        setGroup(prev => ({ ...prev, exercises: updatedExercises }));
        setActiveDropsetTarget(null);
    };

    const handleRemoveDropset = (exIndex: number, setIndex: number | 'all') => {
        const updatedExercises = [...group.exercises];
        const currentSets = [...(updatedExercises[exIndex].sets || [])];

        if (setIndex === 'all') {
            const updatedSets = currentSets.map(s => ({
                ...s,
                technique: s.technique === 'drop_set' ? ('normal' as SetTechnique) : s.technique,
                dropset: undefined
            }));
            updatedExercises[exIndex].sets = updatedSets;
        } else {
            currentSets[setIndex] = {
                ...currentSets[setIndex],
                technique: currentSets[setIndex].technique === 'drop_set' ? 'normal' : currentSets[setIndex].technique,
                dropset: undefined
            };
            updatedExercises[exIndex].sets = currentSets;
        }

        setGroup(prev => ({ ...prev, exercises: updatedExercises }));
    };

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        const missingExercise = group.exercises.find(ex => !ex.exerciseId || !ex.exerciseName);
        if (missingExercise) {
            const missingIdx = group.exercises.indexOf(missingExercise);
            handleOpenSelector(missingIdx);
            return;
        }

        onSave(group);
    };

    const isStraight = group.groupType === 'straight';

    const getGlobalDropset = (exIndex: number) => {
        const sets = group.exercises[exIndex]?.sets || [];
        return sets.find(s => s.dropset && s.dropset.length > 1)?.dropset || null;
    };

    return (
        <div className={className}>
            <form onSubmit={handleConfirm} className="space-y-5">
                {/* Header Controls: Group Type */}
                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                            {tw('groupTypeLabel')}
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsHelpOpen(true)}
                            className="text-zinc-400 hover:text-lime-500 transition-colors p-1 flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                        >
                            <HelpCircle size={14} />
                            <span>{t('groupTypesHelp.title')}</span>
                        </button>
                    </div>
                    <select
                        value={group.groupType}
                        onChange={(e) => handleGroupTypeChange(e.target.value as GroupType)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs font-black uppercase text-zinc-800 dark:text-zinc-200 outline-none focus:border-lime-500 transition-all cursor-pointer"
                    >
                        <option value="straight">{t('groupTypes.straight')}</option>
                        <option value="bi_set">{t('groupTypes.bi_set')}</option>
                        <option value="tri_set">{t('groupTypes.tri_set')}</option>
                        <option value="giant_set">{t('groupTypes.giant_set')}</option>
                        <option value="circuit">{t('groupTypes.circuit')}</option>
                        <option value="superset">{t('groupTypes.superset')}</option>
                    </select>
                </div>

                {/* Exercises in Group */}
                <div className="space-y-4">
                    {group.exercises.map((ex, exIndex) => {
                        const globalDropset = getGlobalDropset(exIndex);

                        return (
                            <div
                                key={exIndex}
                                className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 relative shadow-2xs min-w-0"
                            >
                                {/* Exercise Selector Header */}
                                <div className="flex items-center gap-2 min-w-0">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenSelector(exIndex)}
                                        className="flex-1 flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-lime-500/50 rounded-xl transition-all cursor-pointer group min-w-0 overflow-hidden"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                                            <Dumbbell size={16} className="text-lime-500 shrink-0" />
                                            <span className="font-black text-xs uppercase tracking-tight text-zinc-900 dark:text-zinc-100 truncate block">
                                                {ex.exerciseName
                                                    ? (te.has(ex.exerciseName) ? te(ex.exerciseName) : ex.exerciseName)
                                                    : t('selectExercise')}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-lime-600 dark:text-lime-400 group-hover:underline shrink-0">
                                            <Edit size={16} className="text-lime-500" />
                                        </span>
                                    </button>

                                    {group.exercises.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExerciseFromGroup(exIndex)}
                                            className="p-3 text-zinc-400 hover:text-red-500 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl transition-all shrink-0 cursor-pointer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                {/* Exercise Notes */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder={t('exerciseNotesPlaceholder')}
                                        value={ex.notes || ''}
                                        onChange={(e) => handleNotesChange(exIndex, e.target.value)}
                                        className="w-full bg-amber-500/[0.04] dark:bg-amber-500/5 border border-amber-500/20 focus:border-amber-500/50 rounded-xl px-3 py-2 text-xs font-medium outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all"
                                    />
                                </div>

                                {/* Exercise Metrics Configuration */}
                                {isStraight ? (
                                    <div className="space-y-4">
                                        {/* Toggle View Header */}
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                                {tw('sets')} ({ex.sets?.length || 0})
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setShowDetailedView(prev => !prev)}
                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[9px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:text-lime-600 dark:hover:text-lime-400 transition-all cursor-pointer"
                                            >
                                                <Sliders size={12} className="text-lime-500" />
                                                <span>{showDetailedView ? t('simplifiedView') : t('detailedView')}</span>
                                            </button>
                                        </div>

                                        {!showDetailedView ? (
                                            /* SIMPLIFIED MAIN INPUTS VIEW */
                                            <div className="space-y-3">
                                                {!globalDropset ? (
                                                    /* STANDARD 4-CARD INPUT GRID (No Dropset) */
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-2 gap-2.5">
                                                            {/* Séries Stepper */}
                                                            <div className="bg-zinc-50/90 dark:bg-zinc-950/70 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 flex flex-col justify-between">
                                                                <span className="block text-[8.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                                                                    {tw('sets')}
                                                                </span>
                                                                <div className="flex items-center justify-between">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSetsCountChange(exIndex, (ex.sets?.length || 1) - 1)}
                                                                        className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:border-lime-500 transition-colors font-bold cursor-pointer"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="text-base font-black text-zinc-900 dark:text-white">
                                                                        {ex.sets?.length || 0}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSetsCountChange(exIndex, (ex.sets?.length || 1) + 1)}
                                                                        className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:border-lime-500 transition-colors font-bold cursor-pointer"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Repetições Input */}
                                                            <div className="bg-zinc-50/90 dark:bg-zinc-950/70 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                                                                <span className="block text-[8.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                                                                    {t('reps')}
                                                                </span>
                                                                <input
                                                                    type="number"
                                                                    onFocus={numberInputUtils.onFocus}
                                                                    value={numberInputUtils.formatValue(ex.sets?.[0]?.reps || 10)}
                                                                    onChange={(e) => numberInputUtils.onChange(e, (val) => handleGlobalRepsChange(exIndex, Number(val)))}
                                                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-xl p-2 text-sm font-black outline-none text-center text-zinc-900 dark:text-zinc-100"
                                                                />
                                                            </div>

                                                            {/* Carga (kg) Input */}
                                                            <div className="bg-zinc-50/90 dark:bg-zinc-950/70 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                                                                <span className="block text-[8.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                                                                    {t('weight')} (kg)
                                                                </span>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    onFocus={numberInputUtils.onFocus}
                                                                    value={numberInputUtils.formatValue(ex.sets?.[0]?.weight || 0)}
                                                                    onChange={(e) => numberInputUtils.onChange(e, (val) => handleGlobalWeightChange(exIndex, Number(val)))}
                                                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-xl p-2 text-sm font-black outline-none text-center text-lime-600 dark:text-lime-400"
                                                                />
                                                            </div>

                                                            {/* Descanso (s) Input */}
                                                            <div className="bg-zinc-50/90 dark:bg-zinc-950/70 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                                                                <span className="block text-[8.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                                                                    {t('rest')} (s)
                                                                </span>
                                                                <input
                                                                    type="number"
                                                                    onFocus={numberInputUtils.onFocus}
                                                                    value={numberInputUtils.formatValue(ex.sets?.[0]?.restTime || 60)}
                                                                    onChange={(e) => numberInputUtils.onChange(e, (val) => handleGlobalRestChange(exIndex, Number(val)))}
                                                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-xl p-2 text-sm font-black outline-none text-center text-zinc-900 dark:text-zinc-100"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Configurar Dropset Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveDropsetTarget({ exIndex, setIndex: 'all' })}
                                                            className="w-full py-3 px-4 bg-zinc-50 hover:bg-lime-400/10 dark:bg-zinc-950/60 dark:hover:bg-lime-400/10 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-lime-500/40 text-zinc-600 dark:text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer active:scale-[0.99]"
                                                        >
                                                            <Zap size={14} className="text-lime-500" />
                                                            <span>{t('configureDropset')}</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    /* DROIPSET ACTIVE VIEW (Hide Reps & Weight, Show Séries + Descanso + Dropset Card) */
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-2 gap-2.5">
                                                            {/* Séries Stepper */}
                                                            <div className="bg-zinc-50/90 dark:bg-zinc-950/70 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 flex flex-col justify-between">
                                                                <span className="block text-[8.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                                                                    {tw('sets')}
                                                                </span>
                                                                <div className="flex items-center justify-between">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSetsCountChange(exIndex, (ex.sets?.length || 1) - 1)}
                                                                        className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:border-lime-500 transition-colors font-bold cursor-pointer"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="text-base font-black text-zinc-900 dark:text-white">
                                                                        {ex.sets?.length || 0}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleSetsCountChange(exIndex, (ex.sets?.length || 1) + 1)}
                                                                        className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:border-lime-500 transition-colors font-bold cursor-pointer"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Descanso (s) Input */}
                                                            <div className="bg-zinc-50/90 dark:bg-zinc-950/70 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                                                                <span className="block text-[8.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                                                                    {t('rest')} (s)
                                                                </span>
                                                                <input
                                                                    type="number"
                                                                    onFocus={numberInputUtils.onFocus}
                                                                    value={numberInputUtils.formatValue(ex.sets?.[0]?.restTime || 60)}
                                                                    onChange={(e) => numberInputUtils.onChange(e, (val) => handleGlobalRestChange(exIndex, Number(val)))}
                                                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-xl p-2 text-sm font-black outline-none text-center text-zinc-900 dark:text-zinc-100"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* DROIPSET ACTIVE CARD */}
                                                        <div className="p-3.5 bg-lime-400/10 dark:bg-lime-400/5 rounded-2xl border border-lime-500/30 dark:border-lime-400/30 space-y-2.5">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <Zap size={14} className="text-lime-500 fill-current" />
                                                                    <span className="text-[10px] font-black uppercase tracking-wider text-lime-700 dark:text-lime-400">
                                                                        {t('dropsetConfigured', { count: globalDropset.length })}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setActiveDropsetTarget({ exIndex, setIndex: 'all' })}
                                                                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[9px] font-black uppercase text-zinc-700 dark:text-zinc-300 hover:text-lime-500 transition-colors cursor-pointer"
                                                                    >
                                                                        {ts('edit')}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveDropset(exIndex, 'all')}
                                                                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[9px] font-black uppercase text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                                                                    >
                                                                        {ts('remove')}
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Horizontal Drops Preview */}
                                                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                                                                {globalDropset.map((drop, idx) => (
                                                                    <React.Fragment key={idx}>
                                                                        {idx > 0 && <ArrowRight size={10} className="text-zinc-400 shrink-0" />}
                                                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black shrink-0 ${idx === 0
                                                                            ? 'bg-lime-400/20 text-lime-800 dark:text-lime-300'
                                                                            : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800'
                                                                            }`}>
                                                                            {drop.weight}kg × {drop.reps}
                                                                        </span>
                                                                    </React.Fragment>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* EXPANDED DETAILED PER-SET TABLE VIEW */
                                            <div className="space-y-2">
                                                <div className="bg-zinc-50/80 dark:bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 space-y-2">
                                                    {/* Table Header */}
                                                    <div className="grid grid-cols-12 gap-1.5 text-[7.5px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-1 text-center">
                                                        <span className="col-span-1 text-left">#</span>
                                                        <span className="col-span-3">{t('reps')}</span>
                                                        <span className="col-span-3">{t('weight')}</span>
                                                        <span className="col-span-2">{t('rest')}</span>
                                                        <span className="col-span-2">{t('tech')}</span>
                                                        <span className="col-span-1"></span>
                                                    </div>

                                                    {/* Table Rows */}
                                                    {ex.sets?.map((setObj, sIndex) => {
                                                        const hasRowDropset = setObj.dropset && setObj.dropset.length > 1;

                                                        return (
                                                            <div key={sIndex} className="grid grid-cols-12 gap-1.5 items-center">
                                                                <span className="col-span-1 text-[10px] font-black text-zinc-400 dark:text-zinc-500 pl-1">
                                                                    {sIndex + 1}
                                                                </span>

                                                                {hasRowDropset ? (
                                                                    /* DROIPSET ROW SUMMARY (Replaces Reps & Weight inputs) */
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setActiveDropsetTarget({ exIndex, setIndex: sIndex })}
                                                                        className="col-span-6 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-lime-400/10 dark:bg-lime-400/10 border border-lime-500/30 text-[10px] font-black text-lime-700 dark:text-lime-400 hover:border-lime-500 transition-all cursor-pointer truncate shadow-xs min-w-0"
                                                                    >
                                                                        <div className="flex items-center gap-1.5 truncate min-w-0">
                                                                            <Zap size={11} className="fill-current text-lime-500 shrink-0" />
                                                                            <span className="truncate">{setObj.dropset?.[0]?.weight || 0}kg × {setObj.dropset?.[0]?.reps || 0} ({setObj.dropset?.length || 0} drops)</span>
                                                                        </div>
                                                                        <span className="text-[9px] underline shrink-0 ml-1 opacity-80 hover:opacity-100">{ts('edit')}</span>
                                                                    </button>
                                                                ) : (
                                                                    /* STANDARD REPS & WEIGHT INPUTS */
                                                                    <>
                                                                        <div className="col-span-3">
                                                                            <input
                                                                                type="number"
                                                                                onFocus={numberInputUtils.onFocus}
                                                                                value={numberInputUtils.formatValue(setObj.reps)}
                                                                                onChange={(e) => numberInputUtils.onChange(e, (val) => handleSetChange(exIndex, sIndex, 'reps', val))}
                                                                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1.5 text-xs font-black outline-none text-center text-zinc-900 dark:text-zinc-100"
                                                                            />
                                                                        </div>
                                                                        <div className="col-span-3">
                                                                            <input
                                                                                type="number"
                                                                                step="any"
                                                                                onFocus={numberInputUtils.onFocus}
                                                                                value={numberInputUtils.formatValue(setObj.weight)}
                                                                                onChange={(e) => numberInputUtils.onChange(e, (val) => handleSetChange(exIndex, sIndex, 'weight', val))}
                                                                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1.5 text-xs font-black outline-none text-center text-lime-600 dark:text-lime-400"
                                                                            />
                                                                        </div>
                                                                    </>
                                                                )}

                                                                <div className="col-span-2">
                                                                    <input
                                                                        type="number"
                                                                        onFocus={numberInputUtils.onFocus}
                                                                        value={numberInputUtils.formatValue(setObj.restTime)}
                                                                        onChange={(e) => numberInputUtils.onChange(e, (val) => handleSetChange(exIndex, sIndex, 'restTime', val))}
                                                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1.5 text-xs font-black outline-none text-center text-zinc-900 dark:text-zinc-100"
                                                                    />
                                                                </div>
                                                                <div className="col-span-2 flex items-center gap-1 min-w-0">
                                                                    <select
                                                                        value={setObj.technique || 'normal'}
                                                                        onChange={(e) => handleSetChange(exIndex, sIndex, 'technique', e.target.value as SetTechnique)}
                                                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1 text-[10px] font-black text-center outline-none text-zinc-800 dark:text-zinc-200 cursor-pointer truncate"
                                                                    >
                                                                        <option value="normal">{t('techniques.normal')}</option>
                                                                        <option value="drop_set">{t('techniques.drop_set')}</option>
                                                                        <option value="rest_pause">{t('techniques.rest_pause')}</option>
                                                                        <option value="forced_reps">{t('techniques.forced_reps')}</option>
                                                                        <option value="negative">{t('techniques.negative')}</option>
                                                                        <option value="isometric">{t('techniques.isometric')}</option>
                                                                        <option value="tempo">{t('techniques.tempo')}</option>
                                                                        <option value="cluster">{t('techniques.cluster')}</option>
                                                                        <option value="to_failure">{t('techniques.to_failure')}</option>
                                                                    </select>

                                                                    {/* Row-specific dropset trigger */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setActiveDropsetTarget({ exIndex, setIndex: sIndex })}
                                                                        title={t('configureDropset')}
                                                                        className={`p-1 rounded-md transition-colors shrink-0 cursor-pointer shadow-xs active:scale-95 ${hasRowDropset
                                                                            ? 'bg-lime-400 text-zinc-950 hover:bg-lime-300'
                                                                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 hover:text-lime-500'
                                                                            }`}
                                                                    >
                                                                        <Zap size={11} className="fill-current" />
                                                                    </button>
                                                                </div>
                                                                <div className="col-span-1 flex justify-center">
                                                                    {ex.sets.length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveSet(exIndex, sIndex)}
                                                                            className="text-zinc-300 hover:text-red-500 transition-colors cursor-pointer"
                                                                        >
                                                                            <Trash2 size={13} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleAddSet(exIndex)}
                                                    className="w-full py-2 bg-zinc-50 dark:bg-zinc-950/60 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-lime-500/40 text-lime-600 dark:text-lime-400 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                                                >
                                                    <Plus size={12} /> {tw('addExercise')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* COMPOUND GROUPS VIEW */
                                    <div className="bg-zinc-50/80 dark:bg-zinc-950/60 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                                                    {t('reps')}
                                                </span>
                                                <input
                                                    type="number"
                                                    onFocus={numberInputUtils.onFocus}
                                                    value={numberInputUtils.formatValue(ex.sets?.[0]?.reps || 10)}
                                                    onChange={(e) => {
                                                        numberInputUtils.onChange(e, (val) => {
                                                            const updatedExercises = [...group.exercises];
                                                            const updatedSets = (updatedExercises[exIndex].sets || [DEFAULT_SET]).map(s => ({
                                                                ...s,
                                                                reps: Number(val)
                                                            }));
                                                            updatedExercises[exIndex].sets = updatedSets;
                                                            setGroup(prev => ({ ...prev, exercises: updatedExercises }));
                                                        });
                                                    }}
                                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-2 text-xs font-black outline-none text-zinc-900 dark:text-zinc-100"
                                                />
                                            </div>
                                            <div>
                                                <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                                                    {t('weight')} (kg)
                                                </span>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    onFocus={numberInputUtils.onFocus}
                                                    value={numberInputUtils.formatValue(ex.sets?.[0]?.weight || 0)}
                                                    onChange={(e) => {
                                                        numberInputUtils.onChange(e, (val) => {
                                                            const updatedExercises = [...group.exercises];
                                                            const updatedSets = (updatedExercises[exIndex].sets || [DEFAULT_SET]).map(s => ({
                                                                ...s,
                                                                weight: Number(val)
                                                            }));
                                                            updatedExercises[exIndex].sets = updatedSets;
                                                            setGroup(prev => ({ ...prev, exercises: updatedExercises }));
                                                        });
                                                    }}
                                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-2 text-xs font-black outline-none text-lime-600 dark:text-lime-400"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                                                {t('restAfterExercise')}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="number"
                                                    onFocus={numberInputUtils.onFocus}
                                                    value={numberInputUtils.formatValue(ex.restAfterExercise || 0)}
                                                    onChange={(e) => {
                                                        numberInputUtils.onChange(e, (val) => {
                                                            const updatedExercises = [...group.exercises];
                                                            updatedExercises[exIndex].restAfterExercise = Number(val);
                                                            setGroup(prev => ({ ...prev, exercises: updatedExercises }));
                                                        });
                                                    }}
                                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-2 text-xs font-black outline-none text-zinc-900 dark:text-zinc-100"
                                                />
                                                <span className="text-[10px] text-zinc-500 font-bold">s</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Add Exercise to Compound Group */}
                    {!isStraight && (
                        <button
                            type="button"
                            onClick={handleAddExerciseToGroup}
                            className="w-full py-2.5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:border-lime-500 hover:text-lime-500 transition-all cursor-pointer"
                        >
                            + {t('addExercise')}
                        </button>
                    )}
                </div>

                {/* Group Footer Controls: Rest & Rounds */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className={`${isStraight ? 'col-span-2' : ''} bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80`}>
                        <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                            {isStraight ? t('restAfterGroup') : t('restBetweenRounds')}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <input
                                type="number"
                                value={numberInputUtils.formatValue(group.restAfterGroup)}
                                onFocus={numberInputUtils.onFocus}
                                onChange={(e) => numberInputUtils.onChange(e, (val) => setGroup(prev => ({ ...prev, restAfterGroup: val as number })))}
                                className="w-full bg-transparent font-black text-sm outline-none text-zinc-900 dark:text-zinc-100"
                            />
                            <span className="text-[10px] text-zinc-500 font-bold">s</span>
                        </div>
                    </div>

                    {!isStraight && (
                        <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80">
                            <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                                {t('rounds')}
                            </span>
                            <input
                                type="number"
                                value={numberInputUtils.formatValue(group.rounds)}
                                onFocus={numberInputUtils.onFocus}
                                onChange={(e) => numberInputUtils.onChange(e, (val) => handleRoundsChange(Number(val)))}
                                className="w-full bg-transparent font-black text-sm outline-none text-zinc-900 dark:text-zinc-100"
                            />
                        </div>
                    )}
                </div>

                {/* Save Button */}
                <button
                    type="submit"
                    className="w-full py-4 bg-lime-400 hover:bg-lime-300 text-zinc-950 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-lime-400/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                    <Save size={16} />
                    <span>{submitLabel || t('confirmAdd')}</span>
                </button>
            </form>

            {/* Exercise Selector */}
            <ExerciseSelector
                isOpen={isSelectorOpen}
                onClose={() => setIsSelectorOpen(false)}
                onSelect={handleSelectExercise}
            />

            {/* Group Type Help Modal */}
            <GroupTypeHelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />

            {/* Dropset Configuration Modal */}
            <DropsetModal
                isOpen={!!activeDropsetTarget}
                onClose={() => setActiveDropsetTarget(null)}
                defaultWeight={
                    activeDropsetTarget
                        ? (activeDropsetTarget.setIndex === 'all'
                            ? (group.exercises[activeDropsetTarget.exIndex]?.sets?.[0]?.weight ?? 20)
                            : (group.exercises[activeDropsetTarget.exIndex]?.sets?.[activeDropsetTarget.setIndex]?.weight ?? 20))
                        : 20
                }
                defaultReps={
                    activeDropsetTarget
                        ? (activeDropsetTarget.setIndex === 'all'
                            ? (group.exercises[activeDropsetTarget.exIndex]?.sets?.[0]?.reps ?? 10)
                            : (group.exercises[activeDropsetTarget.exIndex]?.sets?.[activeDropsetTarget.setIndex]?.reps ?? 10))
                        : 10
                }
                initialDropset={
                    activeDropsetTarget
                        ? (activeDropsetTarget.setIndex === 'all'
                            ? (group.exercises[activeDropsetTarget.exIndex]?.sets?.[0]?.dropset || null)
                            : (group.exercises[activeDropsetTarget.exIndex]?.sets?.[activeDropsetTarget.setIndex]?.dropset || null))
                        : null
                }
                onSave={handleSaveDropset}
            />
        </div>
    );
};

export default ExerciseConfigForm;
