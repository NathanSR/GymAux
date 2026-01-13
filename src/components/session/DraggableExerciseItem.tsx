'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical, Trash2, Pencil } from "lucide-react";
import { useTranslations } from 'next-intl';

export const DraggableExerciseItem = ({ ex, idx, currentExerciseIndex, onRemove, onEdit }: any) => {
    const t = useTranslations('WorkoutDrawer');
    const te = useTranslations('Exercises');

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: ex.exerciseId,
        disabled: idx < currentExerciseIndex
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : "auto",
        opacity: isDragging ? 0.6 : 1,
        // Mantemos o touchAction auto no container pai para permitir scroll na lista
        touchAction: 'auto'
    };

    const isCurrent = idx === currentExerciseIndex;
    const isCompleted = idx < currentExerciseIndex;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center justify-between p-4 rounded-[28px] border transition-all ${isCurrent ? 'bg-lime-400/10 border-lime-400/40' : 'bg-zinc-900/50 border-zinc-800/50'
                } ${isCompleted ? 'opacity-40' : ''} ${isDragging ? 'shadow-2xl border-lime-400/50 ring-1 ring-lime-400/20' : ''}`}
        >
            <div className="flex items-center gap-3">
                {!isCompleted && (
                    /* AJUSTE CHAVE: 
                       1. touch-action: none impede o browser de rolar quando tocamos no Grip
                       2. listeners e attributes ficam apenas aqui para um controle preciso
                    */
                    <div
                        {...attributes}
                        {...listeners}
                        className="p-2 cursor-grab active:cursor-grabbing text-zinc-600 active:text-lime-400"
                        style={{ touchAction: 'none' }}
                    >
                        <GripVertical size={18} />
                    </div>
                )}

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${isCurrent ? 'bg-lime-400 text-zinc-950' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                    {isCompleted ? <Check size={18} strokeWidth={3} /> : idx + 1}
                </div>

                <div>
                    <p className={`font-black text-sm uppercase tracking-tight ${isCurrent ? 'text-white' : 'text-zinc-400'
                        }`}>
                        {te.has(ex.exerciseName) ? te(ex.exerciseName) : ex.exerciseName}
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

            {!isCompleted && (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(ex)}
                        className="p-3 text-zinc-600 hover:text-lime-400 active:scale-90 transition-all"
                    >
                        <Pencil size={18} />
                    </button>

                    {!isCurrent && (
                        <button
                            onClick={() => onRemove(ex.exerciseId)}
                            className="p-3 text-zinc-600 hover:text-red-400 active:scale-90 transition-all"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};