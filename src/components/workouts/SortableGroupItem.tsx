"use client";

import { useState, memo } from 'react';
import { useTranslations } from 'next-intl';
import { useSortable } from '@dnd-kit/sortable';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronDown, Dumbbell, GripVertical, HelpCircle, NotebookPen, Trash2 } from 'lucide-react';
import { numberInputUtils } from '../../utils/numberUtil';
import SetsList from './SetsList';

interface SortableGroupItemProps {
    group: any;
    groupIndex: number;
    removeGroup: (index: number) => void;
    openSelectorFor: (groupIndex: number | null, exerciseIndex: number | null) => void;
    onShowHelp: () => void;
    onGroupTypeChange: (index: number, type: string) => void;
    isAnyItemDragging?: boolean;
    isReorderMode?: boolean;
    isOverlay?: boolean;
}

export const SortableGroupItem = memo(({
    group,
    groupIndex,
    removeGroup,
    openSelectorFor,
    onShowHelp,
    onGroupTypeChange,
    isAnyItemDragging = false,
    isReorderMode = false,
    isOverlay = false
}: SortableGroupItemProps) => {
    const { control, setValue, getValues } = useFormContext();
    const t = useTranslations('WorkoutForm');
    const te = useTranslations('Exercises');
    const [openNotes, setOpenNotes] = useState<Record<number, boolean>>({});

    const groupType = useWatch({
        control,
        name: `exercises.${groupIndex}.groupType`
    });

    const rounds = useWatch({
        control,
        name: `exercises.${groupIndex}.rounds`
    });

    const exercisesInGroup = useWatch({
        control,
        name: `exercises.${groupIndex}.exercises`
    });

    const restAfterGroup = useWatch({
        control,
        name: `exercises.${groupIndex}.restAfterGroup`
    });

    const isStraight = groupType === 'straight';

    const handleRoundsChange = (val: number | "") => {
        setValue(`exercises.${groupIndex}.rounds`, val);

        if (val === "" || val < 1) return;

        const newVal = val;
        const currentExs = getValues(`exercises.${groupIndex}.exercises`);
        if (currentExs) {
            currentExs.forEach((ex: any, exIdx: number) => {
                const currentSets = ex.sets || [];
                if (currentSets.length < newVal) {
                    const lastSet = currentSets[currentSets.length - 1] || { reps: 10, weight: 0, restTime: 60, technique: 'normal' };
                    const toAdd = newVal - currentSets.length;
                    const newSets = [...currentSets];
                    for (let i = 0; i < toAdd; i++) {
                        newSets.push({ ...lastSet, id: undefined });
                    }
                    setValue(`exercises.${groupIndex}.exercises.${exIdx}.sets`, newSets);
                } else if (currentSets.length > newVal) {
                    setValue(`exercises.${groupIndex}.exercises.${exIdx}.sets`, currentSets.slice(0, newVal));
                }
            });
        }
    };

    const {
        attributes,
        listeners,
        setNodeRef,
        isDragging
    } = useSortable({
        id: group.id,
        disabled: isOverlay || !isReorderMode
    });

    const style = {
        zIndex: isOverlay ? 100 : (isDragging ? 50 : 1),
    };

    const isMinimized = isAnyItemDragging || isDragging || isOverlay || isReorderMode;

    const { fields: exerciseFields } = useFieldArray({
        control,
        name: `exercises.${groupIndex}.exercises`
    });

    const isCompound = !isStraight;
    const maxExercises = isStraight ? 1 : (groupType === 'bi_set' ? 2 : (groupType === 'tri_set' ? 3 : 10));
    const canAddMore = exerciseFields.length < maxExercises;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{
                opacity: isOverlay ? 1 : (isDragging ? 0.3 : 1),
                y: 0,
                scale: isOverlay ? 1.01 : 1,
                boxShadow: isOverlay
                    ? '0 20px 40px -10px rgba(132, 204, 22, 0.2)'
                    : (isDragging ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)')
            }}
            exit={{ opacity: 0, scale: 0.96 }}
            ref={setNodeRef}
            style={style}
            className={`
                relative flex flex-col gap-2.5 rounded-2xl p-3 sm:p-3.5 transition-all overflow-hidden border
                ${isOverlay ? 'border-lime-400 bg-white dark:bg-zinc-900 ring-2 ring-lime-400/20 z-[100]' : ''}
                ${isDragging && !isOverlay ? 'border-dashed border-lime-400/50 bg-lime-400/5' : ''}
                ${!isMinimized && (isStraight
                    ? 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs'
                    : 'bg-gradient-to-br from-lime-500/[0.04] to-white dark:from-lime-500/[0.04] dark:to-zinc-900 border-lime-500/30 dark:border-lime-500/20 shadow-2xs')
                }
                ${isMinimized && !isDragging && !isOverlay ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-60' : ''}
            `}
        >
            {isCompound && (
                <div className="absolute top-0 right-0 p-1.5 opacity-15 pointer-events-none">
                    <Activity size={32} className="text-lime-500" />
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2 relative z-10">
                <div className="flex items-center gap-1.5">
                    <div
                        {...attributes}
                        {...listeners}
                        className={`p-1 -ml-1 transition-all duration-300 ${
                            isReorderMode
                            ? 'cursor-grab active:cursor-grabbing text-lime-500 opacity-100 scale-100'
                            : 'cursor-default text-zinc-300 opacity-0 scale-50 pointer-events-none w-0 overflow-hidden'
                        }`}
                        style={{ touchAction: 'none' }}
                    >
                        <GripVertical size={16} />
                    </div>
                    {isMinimized ? (
                        <span className="text-[9px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 py-0.5 px-2 bg-lime-500/10 rounded-md">
                            {t(`groupTypes.${groupType}`)}
                        </span>
                    ) : (
                        <div className="flex items-center gap-1">
                            <select
                                value={groupType}
                                onChange={(e) => onGroupTypeChange(groupIndex, e.target.value)}
                                className="bg-transparent text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 outline-none cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                <option className='bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' value="straight">{t('groupTypes.straight')}</option>
                                <option className='bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' value="bi_set">{t('groupTypes.bi_set')}</option>
                                <option className='bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' value="tri_set">{t('groupTypes.tri_set')}</option>
                                <option className='bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' value="giant_set">{t('groupTypes.giant_set')}</option>
                                <option className='bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100' value="circuit">{t('groupTypes.circuit')}</option>
                            </select>
                            <button
                                type="button"
                                onClick={onShowHelp}
                                className="p-0.5 text-zinc-400 hover:text-lime-500 transition-colors cursor-pointer"
                                title={t('groupTypesHelp.title')}
                            >
                                <HelpCircle size={13} />
                            </button>
                        </div>
                    )}
                </div>

                {!isMinimized && (
                    <button
                        type="button"
                        onClick={() => removeGroup(groupIndex)}
                        className="text-zinc-400 hover:text-red-500 p-1 rounded-lg transition-all cursor-pointer"
                    >
                        <Trash2 size={15} />
                    </button>
                )}
            </div>

            {/* Exercises List */}
            <div className={`space-y-2 relative ${isCompound && !isMinimized ? 'pl-4' : ''}`}>
                {exerciseFields.map((exSubField: any, exIndex: number) => (
                    <div key={exSubField.id} className="relative">
                        <div className="flex items-center gap-1.5">
                            {isCompound && !isMinimized && (
                                <>
                                    <div className={`absolute -left-3 w-0.5 bg-lime-500/40 ${
                                        exIndex === 0 ? 'top-1/2 rounded-t-full' : 'top-[-8px]'
                                    } ${
                                        exIndex === exerciseFields.length - 1 ? 'bottom-1/2 rounded-b-full' : 'bottom-[-8px]'
                                    }`} />
                                    <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime-500 ring-2 ring-lime-500/20 z-10" />
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() => !isMinimized && openSelectorFor(groupIndex, exIndex)}
                                className={`flex-1 flex items-center gap-2 p-2 rounded-xl border transition-all text-left group overflow-hidden ${
                                    isMinimized
                                    ? 'bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800/80'
                                    : 'bg-white dark:bg-zinc-900/90 border-zinc-200/80 dark:border-zinc-800/80 hover:border-lime-500/40 cursor-pointer'
                                }`}
                            >
                                <Dumbbell size={14} className="text-lime-500 shrink-0" />
                                <span className={`font-black flex-1 truncate uppercase tracking-tight ${isMinimized ? 'text-[10px] text-zinc-600 dark:text-zinc-400' : 'text-xs text-zinc-800 dark:text-zinc-200'}`}>
                                    {exSubField.exerciseName
                                        ? (te.has(exSubField.exerciseName) ? te(exSubField.exerciseName) : exSubField.exerciseName)
                                        : t('selectExercise')}
                                </span>
                                {!isMinimized && <ChevronDown size={13} className="text-zinc-400 group-hover:text-lime-500 shrink-0" />}
                            </button>

                            {!isMinimized && (
                                <button
                                    type="button"
                                    onClick={() => setOpenNotes(prev => ({ ...prev, [exIndex]: !prev[exIndex] }))}
                                    className={`p-2 rounded-xl border transition-all shrink-0 cursor-pointer ${
                                        exercisesInGroup?.[exIndex]?.notes
                                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-2xs'
                                        : 'bg-white dark:bg-zinc-900/90 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-400 hover:text-amber-500 hover:border-amber-500/40'
                                    }`}
                                    title={t('exerciseNotes')}
                                >
                                    <NotebookPen size={14} />
                                </button>
                            )}

                            {isCompound && !isMinimized && (
                                <div className="flex items-center gap-1 shrink-0">
                                    <div className="w-16 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 px-1.5 py-0.5 flex flex-col justify-center items-center">
                                        <span className="text-[6.5px] font-black text-zinc-400 uppercase tracking-widest">{t('reps')}</span>
                                        <input
                                            type="number"
                                            className="w-full bg-transparent text-center font-black text-xs outline-none text-zinc-900 dark:text-zinc-100"
                                            onFocus={numberInputUtils.onFocus}
                                            value={numberInputUtils.formatValue(exercisesInGroup?.[exIndex]?.sets?.[0]?.reps)}
                                            onChange={(e) => {
                                                numberInputUtils.onChange(e, (newVal) => {
                                                    const finalVal = newVal;
                                                    const currentSets = exercisesInGroup?.[exIndex]?.sets || [];
                                                    setValue(`exercises.${groupIndex}.exercises.${exIndex}.sets`, currentSets.map((s: any) => ({ ...s, reps: finalVal })));
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="w-16 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 px-1.5 py-0.5 flex flex-col justify-center items-center">
                                        <span className="text-[6.5px] font-black text-zinc-400 uppercase tracking-widest">{t('weight')}</span>
                                        <input
                                            type="number"
                                            step="any"
                                            className="w-full bg-transparent text-center font-black text-xs outline-none text-lime-600 dark:text-lime-400"
                                            onFocus={numberInputUtils.onFocus}
                                            value={numberInputUtils.formatValue(exercisesInGroup?.[exIndex]?.sets?.[0]?.weight)}
                                            onChange={(e) => {
                                                numberInputUtils.onChange(e, (newVal) => {
                                                    const finalVal = newVal;
                                                    const currentSets = exercisesInGroup?.[exIndex]?.sets || [];
                                                    setValue(`exercises.${groupIndex}.exercises.${exIndex}.sets`, currentSets.map((s: any) => ({ ...s, weight: finalVal })));
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isMinimized && (openNotes[exIndex] || exercisesInGroup?.[exIndex]?.notes) && (
                            <div className="mt-1">
                                <input
                                    type="text"
                                    placeholder={t('exerciseNotesPlaceholder')}
                                    value={exercisesInGroup?.[exIndex]?.notes || ''}
                                    onChange={(e) => {
                                        setValue(`exercises.${groupIndex}.exercises.${exIndex}.notes`, e.target.value);
                                    }}
                                    className="w-full bg-amber-500/[0.04] dark:bg-amber-500/5 border border-amber-500/20 focus:border-amber-500/50 rounded-xl px-2.5 py-1.5 text-xs font-medium outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all"
                                />
                            </div>
                        )}

                        {!isMinimized && (
                            <SetsList
                                groupIndex={groupIndex}
                                exerciseIndex={exIndex}
                                isStraight={isStraight}
                            />
                        )}
                    </div>
                ))}
            </div>

            {!isMinimized && canAddMore && (
                <button
                    type="button"
                    onClick={() => openSelectorFor(groupIndex, null)}
                    className="w-full py-2 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800/80 text-zinc-400 text-[9px] font-black uppercase tracking-widest hover:border-lime-500/40 hover:text-lime-500 transition-all cursor-pointer"
                >
                    + {t('addExercise')}
                </button>
            )}

            {!isMinimized && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                    <div className={`${isStraight ? 'col-span-2' : ''} bg-zinc-50/80 dark:bg-zinc-950/60 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800/60`}>
                        <span className="block text-[7.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">
                            {isStraight ? t('restAfterGroup') : t('restBetweenRounds')}
                        </span>
                        <div className='flex items-center gap-1.5'>
                            <input
                                type="number"
                                value={numberInputUtils.formatValue(restAfterGroup)}
                                onFocus={numberInputUtils.onFocus}
                                onChange={(e) => numberInputUtils.onChange(e, (val) => setValue(`exercises.${groupIndex}.restAfterGroup`, val))}
                                className="w-full bg-transparent font-black text-xs sm:text-sm outline-none text-zinc-800 dark:text-zinc-200"
                            />
                            <span className='text-[10px] text-zinc-500 font-bold'>s</span>
                        </div>
                    </div>
                    {!isStraight && (
                        <div className="bg-zinc-50/80 dark:bg-zinc-950/60 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800/60">
                            <span className="block text-[7.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">{t('rounds')}</span>
                            <input
                                type="number"
                                onFocus={numberInputUtils.onFocus}
                                value={(rounds === 0 || rounds === "" || rounds === undefined) ? "" : numberInputUtils.formatValue(rounds)}
                                onChange={(e) => numberInputUtils.onChange(e, (val) => handleRoundsChange(val === "" ? "" : val))}
                                onBlur={() => {
                                    if (rounds === "" || rounds < 1 || rounds === undefined) {
                                        handleRoundsChange(1);
                                    }
                                }}
                                className="w-full bg-transparent font-black text-xs sm:text-sm outline-none text-zinc-800 dark:text-zinc-200"
                            />
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
});

export default SortableGroupItem;
