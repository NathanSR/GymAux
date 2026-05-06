"use client";

import { useTranslations } from 'next-intl';
import { useSortable } from '@dnd-kit/sortable';
import { useFieldArray } from 'react-hook-form';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { 
    GripVertical, 
    HelpCircle, 
    Trash2, 
    Dumbbell, 
    ChevronDown, 
    Activity 
} from 'lucide-react';
import { SetsList } from './SetsList';

interface SortableGroupItemProps {
    group: any;
    groupIndex: number;
    control: any;
    register: any;
    removeGroup: (index: number) => void;
    openSelectorFor: (groupIndex: number | null, exerciseIndex: number | null) => void;
    setValue: any;
    watch: any;
    onShowHelp: () => void;
    onGroupTypeChange: (index: number, type: string) => void;
    isAnyItemDragging?: boolean;
    isReorderMode?: boolean;
    isOverlay?: boolean;
}

export function SortableGroupItem({
    group,
    groupIndex,
    control,
    register,
    removeGroup,
    openSelectorFor,
    setValue,
    watch,
    onShowHelp,
    onGroupTypeChange,
    isAnyItemDragging = false,
    isReorderMode = false,
    isOverlay = false
}: SortableGroupItemProps) {
    const t = useTranslations('WorkoutForm');
    const te = useTranslations('Exercises');
    const groupType = watch(`exercises.${groupIndex}.groupType`);
    const isStraight = groupType === 'straight';
    const isFixedType = groupType === 'bi_set' || groupType === 'tri_set';
    const rounds = watch(`exercises.${groupIndex}.rounds`) || 1;

    const handleRoundsChange = (val: number) => {
        const newVal = Math.max(1, val);
        setValue(`exercises.${groupIndex}.rounds`, newVal);

        // Sync all exercises in group to have exactly newVal sets
        const currentExs = watch(`exercises.${groupIndex}.exercises`);
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
                relative flex flex-col gap-3 rounded-3xl p-4 mb-4 transition-all overflow-hidden border
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
                                    {exSubField.exerciseName ? (te.has(exSubField.exerciseName) ? te(exSubField.exerciseName) : exSubField.exerciseName) : t('selectExercise')}
                                </span>
                                {!isMinimized && <ChevronDown size={14} className="text-zinc-400 group-hover:text-lime-500 shrink-0" />}
                            </button>

                            {isCompound && !isMinimized && (
                                <div className="w-20 shrink-0 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 px-2 py-1 flex flex-col justify-center items-center">
                                    <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest">{t('reps')}</span>
                                    <input
                                        type="number"
                                        className="w-full bg-transparent text-center font-black text-xs outline-none text-lime-500"
                                        value={watch(`exercises.${groupIndex}.exercises.${exIndex}.sets.0.reps`) || 0}
                                        onChange={(e) => {
                                            const newVal = parseInt(e.target.value) || 0;
                                            const currentSets = watch(`exercises.${groupIndex}.exercises.${exIndex}.sets`) || [];
                                            setValue(`exercises.${groupIndex}.exercises.${exIndex}.sets`, currentSets.map((s: any) => ({ ...s, reps: newVal })));
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {!isMinimized && (
                            <SetsList 
                                groupIndex={groupIndex} 
                                exerciseIndex={exIndex} 
                                control={control} 
                                register={register} 
                                isStraight={isStraight} 
                                watch={watch}
                                setValue={setValue}
                            />
                        )}
                    </div>
                ))}
            </div>

            {!isFixedType && !isMinimized && (
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
                            <input type="number" {...register(`exercises.${groupIndex}.restAfterGroup`)} className="w-full bg-transparent font-black text-sm outline-none text-zinc-800 dark:text-zinc-200" />
                            <span className='text-[10px] text-zinc-500 font-bold'>s</span>
                        </div>
                    </div>
                    {!isStraight && (
                        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                            <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('rounds')}</span>
                            <input
                                type="number"
                                value={rounds}
                                onChange={(e) => handleRoundsChange(parseInt(e.target.value) || 1)}
                                className="w-full bg-transparent font-black text-sm outline-none text-zinc-800 dark:text-zinc-200"
                            />
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}
