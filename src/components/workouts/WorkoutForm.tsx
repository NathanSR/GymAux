import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
    Save,
    Plus,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ExerciseSelector } from '../exercises/ExerciseSelector';
import { Exercise } from '@/config/types';
import QuickExerciseDrawer from '../exercises/QuickExerciseDrawer';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableExerciseItem } from './SortableExerciseItem';


export default function WorkoutForm({ initialData, availableExercises = [], onSubmit, isLoading }: {
    initialData?: {
        name: string;
        description: string;
        exercises: any[];
    };
    availableExercises: any[];
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}) {
    // Mock de tradução para o Preview
    const t = useTranslations('WorkoutForm');

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData || {
            name: '',
            description: '',
            exercises: [{ exerciseId: '', exerciseName: '', sets: 3, reps: 12, restTime: 45 }]
        }
    });

    const { fields, append, remove, update, move } = useFieldArray({
        control,
        name: "exercises"
    });



    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQuickDrawerOpen, setIsQuickDrawerOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null); // Para saber qual slot de exercício estamos editando

    // Configuração de Sensores para o Drag & Drop
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id);
            const newIndex = fields.findIndex((f) => f.id === over.id);
            move(oldIndex, newIndex);
        }
    };

    const openSelectorFor = (index: number | null) => {
        setActiveIndex(index);
        setIsModalOpen(true);
    };

    const addExerciseToWorkout = (exercise: Exercise) => {
        if (activeIndex === null) {
            append({
                exerciseId: exercise.id,
                exerciseName: exercise.name,
                sets: 3,
                reps: '12',
                restTime: 45
            });
        } else {
            update(activeIndex, {
                ...fields[activeIndex],
                exerciseId: exercise.id,
                exerciseName: exercise.name
            });
        }
        setIsModalOpen(false);
        setActiveIndex(null);
    };

    const handleQuickCreated = (exercise: Exercise) => {
        addExerciseToWorkout(exercise);
        setIsQuickDrawerOpen(false);
    }

    return (<>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
            {/* Informações Básicas */}
            <section className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 tracking-widest">
                        {t('nameLabel')}
                    </label>
                    <input
                        {...register("name", { required: t('nameRequired') })}
                        placeholder={t('namePlaceholder')}
                        className={`w-full bg-white dark:bg-zinc-900 border ${errors.name ? 'border-red-500' : 'border-zinc-100 dark:border-zinc-800'} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-lime-400 outline-none transition-all shadow-sm`}
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 tracking-widest">
                        {t('descriptionLabel')}
                    </label>
                    <textarea
                        {...register("description")}
                        rows={2}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-lime-400 outline-none resize-none shadow-sm"
                    />
                </div>
            </section>

            {/* Lista de Exercícios com Drag & Drop */}
            <section className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 tracking-widest">
                        Exercícios do Treino
                    </label>
                    <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-500">
                        {fields.length} itens
                    </span>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={fields.map(f => f.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <SortableExerciseItem
                                    key={field.id}
                                    field={field}
                                    index={index}
                                    register={register}
                                    remove={remove}
                                    openSelectorFor={openSelectorFor}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <button
                    type="button"
                    onClick={() => openSelectorFor(null)}
                    className="w-full py-5 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px] text-zinc-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-lime-400 hover:text-lime-500 transition-all active:scale-[0.98]"
                >
                    <Plus size={18} />
                    {t('addExercise')}
                </button>
            </section>

            {/* Botão Salvar Fixo no Bottom ou ao final */}
            <div className="pt-6">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-lime-400 hover:bg-lime-500 text-zinc-950 py-5 rounded-[28px] font-black flex items-center justify-center gap-3 shadow-xl shadow-lime-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-4 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save size={22} />
                            {t('saveWorkout').toUpperCase()}
                        </>
                    )}
                </button>
            </div>
        </form>
        <ExerciseSelector
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={addExerciseToWorkout}
        />

        <QuickExerciseDrawer
            isOpen={isQuickDrawerOpen}
            onClose={() => setIsQuickDrawerOpen(false)}
            onExerciseCreated={handleQuickCreated}
        />
    </>

    );
}