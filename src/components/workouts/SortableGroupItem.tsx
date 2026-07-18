"use client";

import { memo } from 'react';
import { useTranslations } from 'next-intl';
import { useSortable } from '@dnd-kit/sortable';
import { useWatch, useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Dumbbell, GripVertical, Trash2, Edit3, NotebookPen, Zap, Clock, Repeat } from 'lucide-react';

interface SortableGroupItemProps {
    group: any;
    groupIndex: number;
    removeGroup: (index: number) => void;
    onOpenConfigModal: (groupIndex: number) => void;
    isAnyItemDragging?: boolean;
    isReorderMode?: boolean;
    isOverlay?: boolean;
}

export const SortableGroupItem = memo(({
    group,
    groupIndex,
    removeGroup,
    onOpenConfigModal,
    isAnyItemDragging = false,
    isReorderMode = false,
    isOverlay = false
}: SortableGroupItemProps) => {
    const { control } = useFormContext();
    const t = useTranslations('WorkoutForm');
    const te = useTranslations('Exercises');

    const groupType = useWatch({
        control,
        name: `exercises.${groupIndex}.groupType`
    }) || group?.groupType || 'straight';

    const rounds = useWatch({
        control,
        name: `exercises.${groupIndex}.rounds`
    }) || group?.rounds || 1;

    const exercisesInGroup = useWatch({
        control,
        name: `exercises.${groupIndex}.exercises`
    }) || group?.exercises || [];

    const restAfterGroup = useWatch({
        control,
        name: `exercises.${groupIndex}.restAfterGroup`
    }) || group?.restAfterGroup || 60;

    const isStraight = groupType === 'straight';

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

    // Calculate summary statistics
    const firstExSets = exercisesInGroup[0]?.sets || [];
    const setsCount = firstExSets.length || 3;
    const repsRange = firstExSets[0]?.reps || 10;
    const hasNotes = exercisesInGroup.some((ex: any) => !!ex.notes);
    const specialTechnique = exercisesInGroup.flatMap((ex: any) => ex.sets || []).find((s: any) => s.technique && s.technique !== 'normal')?.technique;

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
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!isReorderMode) {
                    onOpenConfigModal(groupIndex);
                }
            }}
            className={`
                relative flex items-center justify-between gap-3 rounded-2xl p-3 sm:p-4 transition-all overflow-hidden border cursor-pointer select-none group
                ${isOverlay ? 'border-lime-400 bg-white dark:bg-zinc-900 ring-2 ring-lime-400/20 z-[100]' : ''}
                ${isDragging && !isOverlay ? 'border-dashed border-lime-400/50 bg-lime-400/5' : ''}
                ${isStraight
                    ? 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800/80 hover:border-lime-500/40 shadow-2xs'
                    : 'bg-gradient-to-br from-lime-500/[0.04] to-white dark:from-lime-500/[0.04] dark:to-zinc-900 border-lime-500/30 dark:border-lime-500/20 hover:border-lime-500/50 shadow-2xs'
                }
            `}
        >
            {/* Drag Handle & Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                    {...attributes}
                    {...listeners}
                    onClick={(e) => e.stopPropagation()}
                    className={`p-1 -ml-1 transition-all duration-300 ${isReorderMode
                        ? 'cursor-grab active:cursor-grabbing text-lime-500 opacity-100 scale-100'
                        : 'cursor-default text-zinc-300 opacity-0 scale-50 pointer-events-none w-0 overflow-hidden'
                        }`}
                    style={{ touchAction: 'none' }}
                >
                    <GripVertical size={16} />
                </div>

                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    {/* Header: Group Type Badge */}
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 py-0.5 px-2 bg-lime-500/10 rounded-md shrink-0">
                            {t(`groupTypes.${groupType}`)}
                        </span>
                        {!isStraight && (
                            <span className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                                <Repeat size={10} /> {rounds} rounds
                            </span>
                        )}
                    </div>

                    {/* Exercises Names */}
                    <div className="flex flex-col gap-1">
                        {exercisesInGroup.map((ex: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                                <Dumbbell size={14} className="text-lime-500 shrink-0" />
                                <span className="font-black text-xs uppercase tracking-tight text-zinc-800 dark:text-zinc-200 truncate">
                                    {ex.exerciseName
                                        ? (te.has(ex.exerciseName) ? te(ex.exerciseName) : ex.exerciseName)
                                        : t('selectExercise')}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Summary Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[9px] font-black text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-1">
                            {setsCount} {t('sets')} × {repsRange} reps
                        </span>

                        <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-400 bg-zinc-100/70 dark:bg-zinc-800/50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <Clock size={10} className="text-zinc-400" />
                            {restAfterGroup}s
                        </span>

                        {specialTechnique && (
                            <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                <Zap size={10} />
                                {t(`techniques.${specialTechnique}`)}
                            </span>
                        )}

                        {hasNotes && (
                            <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                <NotebookPen size={10} />
                                Nota
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onOpenConfigModal(groupIndex);
                    }}
                    className="p-2 text-zinc-400 hover:text-lime-500 hover:bg-lime-500/10 rounded-xl transition-all cursor-pointer"
                // title={t('editExercise')}
                >
                    <Edit3 size={15} />
                </button>

                <button
                    type="button"
                    onClick={() => removeGroup(groupIndex)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                // title={t('removeExercise')}
                >
                    <Trash2 size={15} />
                </button>
            </div>
        </motion.div>
    );
});

export default SortableGroupItem;
