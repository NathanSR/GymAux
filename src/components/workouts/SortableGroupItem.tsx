"use client";

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { useSortable } from '@dnd-kit/sortable';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Activity, ChevronDown, Dumbbell, GripVertical, HelpCircle, Trash2 } from 'lucide-react';
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
    const { control, register, setValue, getValues } = useFormContext();
    const t = useTranslations('WorkoutForm');
    const te = useTranslations('Exercises');
    
    // Use useWatch for isolated re-renders
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

        // Sync all exercises in group to have exactly newVal sets
        // Using getValues here instead of watch to avoid re-renders during the handler
        const currentExs = getValues(`exercises.${groupIndex}.exercises`);
        if (currentExs) {
            currentExs.forEach((ex: any, exIdx: number) => {
                const currentSets = ex.sets || [];
                if (currentSets.length < newVal) {
                    const lastSet = currentSets[currentSets.length - 1] || { reps: 10, restTime: 60, technique: 'normal' };
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
        transform,
        transition,
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
                opacity: isOverlay ? 1 : (isDragging ? 0.3 : 1), 
                y: 0,
                scale: isOverlay ? 1.02 : 1,
                boxShadow: isOverlay 
                    ? '0 25px 50px -12px rgba(132, 204, 22, 0.25)' 
                    : (isDragging ? 'none' : '0 1px 2px 0 rgb(0 0 0 / 0.05)')
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            ref={setNodeRef}
            style={style}
            className={`
                relative flex flex-col gap-3 rounded-3xl p-4 transition-all overflow-hidden border
                ${isOverlay ? 'border-lime-400 bg-white dark:bg-zinc-900 ring-2 ring-lime-400/20 z-[100]' : ''}
                ${isDragging && !isOverlay ? 'border-dashed border-lime-400/50 bg-lime-400/5' : ''}
                ${!isMinimized && (isStraight
                    ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm'
                    : 'bg-gradient-to-br from-lime-50/50 to-white dark:from-lime-500/5 dark:to-zinc-900 border-lime-500/30 shadow-md shadow-lime-500/5')
                }
                ${isMinimized && !isDragging && !isOverlay ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-60' : ''}
            `}
        >
            {isCompound && (
                <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
                    <Activity size={40} className="text-lime-500" />
                </div>
            )}

            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 relative z-10">
                <div className="flex items-center gap-2">
                    <div
                        {...attributes}
                        {...listeners}
                        className={`p-2 -ml-2 transition-all duration-300 ${
                            isReorderMode 
                            ? 'cursor-grab active:cursor-grabbing text-lime-500 opacity-100 scale-100' 
                            : 'cursor-default text-zinc-300 opacity-0 scale-50 pointer-events-none w-0 overflow-hidden'
                        }`}
                        style={{ touchAction: 'none' }}
                    >
                        <GripVertical size={18} />
                    </div>
                    {isMinimized ? (
                        <span className="text-[10px] font-black uppercase tracking-widest text-lime-500 dark:text-lime-400 py-1 px-2 bg-lime-500/10 rounded-lg">
                            {t(`groupTypes.${groupType}`)}
                        </span>
                    ) : (
                        <>
                            <select
                                value={groupType}
                                onChange={(e) => onGroupTypeChange(groupIndex, e.target.value)}
                                className="bg-transparent text-[10px] font-black uppercase tracking-widest text-lime-500 dark:text-lime-400 outline-none cursor-pointer"
                            >
                                <option className='bg-background text-foreground' value="straight">{t('groupTypes.straight')}</option>
                                <option className='bg-background text-foreground' value="bi_set">{t('groupTypes.bi_set')}</option>
                                <option className='bg-background text-foreground' value="tri_set">{t('groupTypes.tri_set')}</option>
                                <option className='bg-background text-foreground' value="giant_set">{t('groupTypes.giant_set')}</option>
                                <option className='bg-background text-foreground' value="circuit">{t('groupTypes.circuit')}</option>
                            </select>
                            <button
                                type="button"
                                onClick={onShowHelp}
                                className="p-1 text-zinc-400 hover:text-lime-500 transition-colors"
                                title={t('groupTypesHelp.title')}
                            >
                                <HelpCircle size={12} />
                            </button>
                        </>
                    )}
                </div>

                {!isMinimized && (
                    <button
                        type="button"
                        onClick={() => removeGroup(groupIndex)}
                        className="text-zinc-300 hover:text-red-500 p-2 rounded-xl transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
            <div className={`space-y-3 relative ${isCompound && !isMinimized ? 'pl-5' : ''}`}>
                {exerciseFields.map((exSubField: any, exIndex: number) => (
                    <div key={exSubField.id} className={`${isMinimized ? 'bg-transparent p-0 border-none' : (isCompound ? 'bg-transparent p-0 border-none' : 'bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-3 border border-zinc-100 dark:border-zinc-800')} relative`}>
                        <div className={`flex items-center gap-2 ${isMinimized ? 'mb-0' : (isCompound ? 'mb-0' : 'mb-3')}`}>
                            {isCompound && !isMinimized && (
                                <>
                                    {/* Vertical Connector Line - Segmented for perfect alignment */}
                                    <div className={`absolute -left-4 w-0.5 bg-lime-500/30 ${
                                        exIndex === 0 ? 'top-1/2 rounded-t-full' : 'top-[-12px]'
                                    } ${
                                        exIndex === exerciseFields.length - 1 ? 'bottom-1/2 rounded-b-full' : 'bottom-[-12px]'
                                    }`} />
                                    
                                    {/* Indicator Dot at the joint */}
                                    <div className="absolute -left-[19px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-lime-500 ring-4 ring-lime-500/10 z-10 shadow-[0_0_8px_rgba(132,204,22,0.3)]" />
                                </>
                            )}
                            <button
                                type="button"
                                onClick={() => !isMinimized && openSelectorFor(groupIndex, exIndex)}
                                className={`flex-1 flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left group overflow-hidden ${
                                    isMinimized 
                                    ? 'bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800' 
                                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-lime-400/50'
                                }`}
                            >
                                <Dumbbell size={14} className="text-lime-500 shrink-0" />
                                <span className={`font-black flex-1 truncate uppercase tracking-tight ${isMinimized ? 'text-[10px] text-zinc-600 dark:text-zinc-400' : 'text-xs text-zinc-800 dark:text-zinc-200'}`}>
                                    {exSubField.exerciseName 
                                        ? (te.has(exSubField.exerciseName) ? te(exSubField.exerciseName) : exSubField.exerciseName) 
                                        : t('selectExercise')}
                                </span>
                                {!isMinimized && <ChevronDown size={14} className="text-zinc-400 group-hover:text-lime-500 shrink-0" />}
                            </button>

                            {isCompound && !isMinimized && (
                                <div className="w-20 shrink-0 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 px-2 py-1 flex flex-col justify-center items-center">
                                    <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest">{t('reps')}</span>
                                    <input
                                        type="number"
                                        className="w-full bg-transparent text-center font-black text-xs outline-none text-lime-500"
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
                            )}
                        </div>

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
                    className="w-full py-2.5 rounded-xl border-2 border-dashed border-zinc-100 dark:border-zinc-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest hover:border-lime-400/50 hover:text-lime-500 transition-all"
                >
                    + {t('addExercise')}
                </button>
            )}

            {!isMinimized && (
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <div className={`${isStraight ? 'col-span-2' : ''} bg-zinc-50 dark:bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/50`}>
                        <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                            {isStraight ? t('restAfterGroup') : t('restBetweenRounds')}
                        </span>
                        <div className='flex items-center gap-2'>
                            <input 
                                type="number" 
                                value={numberInputUtils.formatValue(restAfterGroup)}
                                onFocus={numberInputUtils.onFocus}
                                onChange={(e) => numberInputUtils.onChange(e, (val) => setValue(`exercises.${groupIndex}.restAfterGroup`, val))}
                                className="w-full bg-transparent font-black text-sm outline-none text-zinc-800 dark:text-zinc-200" 
                            />
                            <span className='text-[10px] text-zinc-500 font-bold'>s</span>
                        </div>
                    </div>
                    {!isStraight && (
                        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                            <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('rounds')}</span>
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
                                className="w-full bg-transparent font-black text-sm outline-none text-zinc-800 dark:text-zinc-200"
                            />
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
});

export default SortableGroupItem;
