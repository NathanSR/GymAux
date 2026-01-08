"use client"

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Trash2,
    GripVertical,
    Dumbbell,
    ChevronDown,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SortableExerciseItemProps {
    field: any;
    index: number;
    register: any;
    remove: any;
    openSelectorFor: (index: number) => void;
}

export function SortableExerciseItem({
    field,
    index,
    register,
    remove,
    openSelectorFor
}: SortableExerciseItemProps) {
    const t = useTranslations('WorkoutForm');
    const te = useTranslations('Exercises');

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white dark:bg-zinc-900 border ${isDragging
                ? 'border-lime-400 shadow-2xl scale-[1.02] rotate-1'
                : 'border-zinc-100 dark:border-zinc-800'
                } rounded-[32px] p-5 shadow-sm space-y-4 transition-all duration-200`}
        >
            <div className="flex items-center gap-3">
                {/* Handle de Arrasto */}
                <div
                    {...attributes}
                    {...listeners}
                    className="p-2 cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 transition-colors"
                >
                    <GripVertical size={20} />
                </div>

                {/* Seletor de Exercício */}
                <button
                    type="button"
                    onClick={() => openSelectorFor(index)}
                    className="flex-1 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-left hover:border-lime-200 dark:hover:border-lime-900/30 transition-all cursor-pointer group"
                >
                    <div className="flex items-center gap-3">
                        <Dumbbell size={16} className="text-lime-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-black uppercase tracking-tight">
                            {field.exerciseName ? te.has(field.exerciseName) ? te(field.exerciseName) : field.exerciseName : t('selectExercise')}
                        </span>
                    </div>
                    <ChevronDown size={16} className="text-zinc-400" />
                </button>

                {/* Botão Remover */}
                <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {/* Grid de Inputs */}
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-lime-400/50 transition-all">
                    <span className="block text-[8px] font-black text-zinc-400 uppercase mb-1 tracking-tighter">
                        {t('sets')}
                    </span>
                    <input
                        type="number"
                        {...register(`exercises.${index}.sets`)}
                        className="w-full bg-transparent font-black outline-none text-zinc-900 dark:text-white"
                    />
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-lime-400/50 transition-all">
                    <span className="block text-[8px] font-black text-zinc-400 uppercase mb-1 tracking-tighter">
                        {t('reps')}
                    </span>
                    <input
                        {...register(`exercises.${index}.reps`)}
                        className="w-full bg-transparent font-black outline-none text-zinc-900 dark:text-white"
                    />
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-lime-400/50 transition-all">
                    <span className="block text-[8px] font-black text-zinc-400 uppercase mb-1 tracking-tighter">
                        {t('rest')}
                    </span>
                    <input
                        type="number"
                        step="1"
                        {...register(`exercises.${index}.restTime`)}
                        className="w-full bg-transparent font-black outline-none text-zinc-900 dark:text-white"
                    />
                </div>
            </div>
        </div>
    );
}