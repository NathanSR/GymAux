"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Trash2, Dumbbell, HelpCircle, Save } from 'lucide-react';
import { ExerciseGroup, PlannedSet, GroupType, SetTechnique } from '@/config/types';
import { ExerciseSelector } from '@/components/exercises/ExerciseSelector';
import { GroupTypeHelpModal } from './GroupTypeHelpModal';
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

    const [group, setGroup] = useState<ExerciseGroup>(() => {
        return initialGroupData ? JSON.parse(JSON.stringify(initialGroupData)) : JSON.parse(JSON.stringify(DEFAULT_GROUP));
    });
    const [selectingExIndex, setSelectingExIndex] = useState<number | null>(null);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

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
                            className="text-zinc-400 hover:text-lime-500 transition-colors p-1 flex items-center gap-1 text-[10px] font-bold"
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
                    {group.exercises.map((ex, exIndex) => (
                        <div
                            key={exIndex}
                            className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 relative shadow-2xs"
                        >
                            {/* Exercise Selector Header */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleOpenSelector(exIndex)}
                                    className="flex-1 flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-lime-500/50 rounded-xl transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-2.5 truncate">
                                        <Dumbbell size={16} className="text-lime-500 shrink-0" />
                                        <span className="font-black text-xs uppercase tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                                            {ex.exerciseName
                                                ? (te.has(ex.exerciseName) ? te(ex.exerciseName) : ex.exerciseName)
                                                : t('selectExercise')}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-lime-600 dark:text-lime-400 group-hover:underline">
                                        {t('selectExercise')}
                                    </span>
                                </button>

                                {group.exercises.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExerciseFromGroup(exIndex)}
                                        className="p-3 text-zinc-400 hover:text-red-500 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-xl transition-all"
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

                            {/* Sets Table */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                        {tw('sets')} ({ex.sets?.length || 0})
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleAddSet(exIndex)}
                                        className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tight text-lime-600 dark:text-lime-400 hover:underline cursor-pointer"
                                    >
                                        <Plus size={12} /> {tw('addExercise')}
                                    </button>
                                </div>

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
                                    {ex.sets?.map((setObj, sIndex) => (
                                        <div key={sIndex} className="grid grid-cols-12 gap-1.5 items-center">
                                            <span className="col-span-1 text-[10px] font-black text-zinc-400 dark:text-zinc-500 pl-1">
                                                {sIndex + 1}
                                            </span>
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
                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    onFocus={numberInputUtils.onFocus}
                                                    value={numberInputUtils.formatValue(setObj.restTime)}
                                                    onChange={(e) => numberInputUtils.onChange(e, (val) => handleSetChange(exIndex, sIndex, 'restTime', val))}
                                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1.5 text-xs font-black outline-none text-center text-zinc-900 dark:text-zinc-100"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <select
                                                    value={setObj.technique || 'normal'}
                                                    onChange={(e) => handleSetChange(exIndex, sIndex, 'technique', e.target.value as SetTechnique)}
                                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1 text-[10px] font-black text-center outline-none text-zinc-800 dark:text-zinc-200 cursor-pointer"
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
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

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
        </div>
    );
};

export default ExerciseConfigForm;
