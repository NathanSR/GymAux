'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical, Trash2, Pencil, RefreshCw, Activity } from "lucide-react";
import { useTranslations } from 'next-intl';
import { ExerciseGroup } from '@/config/types';

interface DraggableExerciseItemProps {
    group: ExerciseGroup;
    idx: number;
    currentGroupIndex: number;
    onRemove: (idx: number) => void;
    onEdit: (group: ExerciseGroup, idx: number) => void;
}

export const DraggableExerciseItem = ({ group, idx, currentGroupIndex, onRemove, onEdit }: DraggableExerciseItemProps) => {
    const t = useTranslations('WorkoutDrawer');
    const te = useTranslations('Exercises');

    const groupId = `group-${idx}`;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: groupId,
        disabled: idx < currentGroupIndex
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : "auto",
        opacity: isDragging ? 0.6 : 1,
        touchAction: 'auto' as const
    };

    const isCurrent = idx === currentGroupIndex;
    const isCompleted = idx < currentGroupIndex;
    const isAlternating = group.groupType !== 'straight';

    const totalSets = group.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative rounded-[28px] border transition-all overflow-hidden 
                ${isCurrent ? 'bg-lime-400/10 border-lime-400/40' : 'bg-zinc-900/50 border-zinc-800/50'} 
                ${isAlternating && !isCompleted ? 'bg-gradient-to-br from-lime-500/5 to-zinc-900/40 border-lime-500/30 shadow-lg shadow-lime-500/5' : ''}
                ${isCompleted ? 'opacity-40' : ''} 
                ${isDragging ? 'shadow-2xl border-lime-400/50 ring-1 ring-lime-400/20 z-50' : ''}
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
                            className="p-2 cursor-grab active:cursor-grabbing text-zinc-600 active:text-lime-400 flex-shrink-0"
                            style={{ touchAction: 'none' }}
                        >
                            <GripVertical size={18} />
                        </div>
                    )}

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${isCurrent ? 'bg-lime-400 text-zinc-950' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                        {isCompleted ? <Check size={18} strokeWidth={3} /> : idx + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                        {isAlternating && (
                            <span className="inline-flex items-center gap-1 text-[8px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-0.5 rounded-full mb-1">
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
                                    <p className={`font-black text-xs sm:text-sm uppercase italic tracking-tight truncate ${isCurrent ? 'text-white' : 'text-zinc-400'}`}>
                                        {te.has(ex.exerciseName) ? te(ex.exerciseName) : ex.exerciseName}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                {totalSets} {t('sets')}
                            </span>
                            {group.rounds > 1 && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                        {group.rounds} {t('rounds')}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {!isCompleted && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                            onClick={() => onEdit(group, idx)}
                            className="p-3 text-zinc-600 hover:text-lime-400 active:scale-90 transition-all"
                        >
                            <Pencil size={18} />
                        </button>

                        {!isCurrent && (
                            <button
                                onClick={() => onRemove(idx)}
                                className="p-3 text-zinc-600 hover:text-red-400 active:scale-90 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};