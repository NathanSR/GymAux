'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical, Trash2, Pencil, RefreshCw, Activity } from "lucide-react";
import { useTranslations } from 'next-intl';
import { ExerciseGroup } from '@/config/types';
import { motion } from 'framer-motion';

interface DraggableExerciseItemProps {
    group: ExerciseGroup;
    idx: number;
    currentGroupIndex: number;
    onRemove: (idx: number) => void;
    onEdit: (group: ExerciseGroup, idx: number) => void;
    isOverlay?: boolean;
    isAnyItemDragging?: boolean;
}

export const DraggableExerciseItem = ({ 
    group, 
    idx, 
    currentGroupIndex, 
    onRemove, 
    onEdit,
    isOverlay = false,
    isAnyItemDragging = false
}: DraggableExerciseItemProps) => {
    const t = useTranslations('WorkoutDrawer');
    const te = useTranslations('Exercises');
    const tw = useTranslations('WorkoutForm');

    const groupId = group.id || `group-${idx}`;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: groupId,
        disabled: isOverlay || idx < currentGroupIndex
    });

    const style = {
        zIndex: isOverlay ? 100 : (isDragging ? 50 : 1),
    };

    const isCurrent = idx === currentGroupIndex;
    const isCompleted = idx < currentGroupIndex;
    const isAlternating = group.groupType !== 'straight';

    const totalSets = group.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

    const isMinimized = isAnyItemDragging || isDragging || isOverlay;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
                opacity: isOverlay ? 1 : (isDragging ? 0.3 : (isAnyItemDragging ? 0.6 : 1)), 
                y: 0,
                scale: isOverlay ? 1.02 : 1,
                boxShadow: isOverlay 
                    ? '0 25px 50px -12px rgba(132, 204, 22, 0.25)' 
                    : 'none'
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            ref={setNodeRef}
            style={style}
            className={`relative rounded-[28px] border transition-all overflow-hidden 
                ${isOverlay ? 'border-lime-500 bg-white dark:bg-zinc-900 ring-2 ring-lime-400/20 shadow-xl' : (isCurrent ? 'bg-lime-400/10 border-lime-500/50 dark:border-lime-400/40 shadow-xs' : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/50 shadow-xs')} 
                ${isAlternating && !isCompleted ? 'bg-gradient-to-br from-lime-500/5 to-white dark:to-zinc-900/40 border-lime-500/30 shadow-lg shadow-lime-500/5' : ''}
                ${isCompleted && !isOverlay ? 'opacity-40' : ''} 
                ${isDragging && !isOverlay ? 'border-dashed border-lime-500/50 bg-lime-400/5' : ''}
            `}
        >
            {isAlternating && !isCompleted && (
                <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                    <Activity size={32} className="text-lime-500" />
                </div>
            )}
            {/* Group Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {!isCompleted && (
                        <div
                            {...attributes}
                            {...listeners}
                            className={`p-2 transition-all duration-300 ${
                                isOverlay ? 'cursor-grabbing text-lime-600 dark:text-lime-400' : 'cursor-grab text-zinc-400 dark:text-zinc-600 hover:text-lime-600 dark:hover:text-lime-400'
                            }`}
                            style={{ touchAction: 'none' }}
                        >
                            <GripVertical size={18} />
                        </div>
                    )}

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${isCurrent ? 'bg-lime-400 text-zinc-950 shadow-xs' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-500'
                        }`}>
                        {isCompleted ? <Check size={18} strokeWidth={3} /> : idx + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                        {isAlternating && (
                            <span className="inline-flex items-center gap-1 text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-500/10 dark:bg-indigo-400/10 px-2 py-0.5 rounded-full mb-1">
                                <RefreshCw size={8} />
                                {t(`groupTypes.${group.groupType}`)}
                            </span>
                        )}
                        <div className={`space-y-1 relative ${isAlternating ? 'pl-4' : ''}`}>
                            {isAlternating && (
                                <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-lime-500/20 rounded-full" />
                            )}
                            {group.exercises.map((ex, exIdx) => (
                                <div key={exIdx} className="relative flex items-center gap-2">
                                    {isAlternating && (
                                        <div className="absolute -left-[19px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime-500/40" />
                                    )}
                                    <p className={`font-black text-xs sm:text-sm uppercase italic tracking-tight truncate ${isCurrent ? 'text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-400'}`}>
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
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                                {totalSets} {t('sets')}
                            </span>
                            {group.rounds > 1 && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                                        {group.rounds} {t('rounds')}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {!isCompleted && !isOverlay && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onEdit(group, idx);
                            }}
                            className="p-3 text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 active:scale-90 transition-all cursor-pointer"
                        >
                            <Pencil size={18} />
                        </button>

                        {!isCurrent && (
                            <button
                                onClick={() => onRemove(idx)}
                                className="p-3 text-zinc-400 hover:text-rose-500 active:scale-90 transition-all cursor-pointer"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};