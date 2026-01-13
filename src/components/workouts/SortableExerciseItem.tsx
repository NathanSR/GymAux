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
        zIndex: isDragging ? 100 : 0,
        opacity: isDragging ? 0.8 : 1,
        touchAction: 'auto', // Permite o scroll no container pai
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white dark:bg-zinc-900 border ${isDragging
                    ? 'border-lime-400 shadow-[0_20px_50px_rgba(163,230,53,0.1)] scale-[1.02] z-50'
                    : 'border-zinc-100 dark:border-zinc-800'
                } rounded-[32px] p-5 shadow-sm space-y-4 transition-all duration-200 relative`}
        >
            <div className="flex items-center gap-3">
                {/* Handle de Arrasto - AJUSTADO PARA MOBILE */}
                <div
                    {...attributes}
                    {...listeners}
                    className="p-3 -ml-2 cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-600 hover:text-lime-500 transition-colors"
                    style={{ touchAction: 'none' }} // Crucial para mobile
                >
                    <GripVertical size={22} />
                </div>

                {/* Seletor de Exercício */}
                <button
                    type="button"
                    onClick={() => openSelectorFor(index)}
                    className="flex-1 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-left hover:border-lime-400/30 transition-all cursor-pointer group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-lime-400/10 flex items-center justify-center">
                            <Dumbbell size={16} className="text-lime-500 group-hover:rotate-12 transition-transform" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
                            {field.exerciseName ? (te.has(field.exerciseName) ? te(field.exerciseName) : field.exerciseName) : t('selectExercise')}
                        </span>
                    </div>
                    <ChevronDown size={16} className="text-zinc-400 group-hover:translate-y-0.5 transition-transform" />
                </button>

                {/* Botão Remover */}
                <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-3 text-zinc-300 dark:text-zinc-700 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {/* Grid de Inputs Estilizado */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: t('sets'), key: 'sets' },
                    { label: t('reps'), key: 'reps' },
                    { label: t('rest'), key: 'restTime' }
                ].map((input) => (
                    <div
                        key={input.key}
                        className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 focus-within:border-lime-400/50 focus-within:ring-4 focus-within:ring-lime-400/5 transition-all"
                    >
                        <span className="block text-[7px] font-black text-zinc-400 dark:text-zinc-500 uppercase mb-1 tracking-[0.1em]">
                            {input.label}
                        </span>
                        <input
                            type="number"
                            {...register(`exercises.${index}.${input.key}`)}
                            className="w-full bg-transparent font-black outline-none text-zinc-900 dark:text-white text-base"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}