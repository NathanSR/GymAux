"use client";

import { useState, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Save, Plus, Trash2, Dumbbell, ChevronDown, GripVertical, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Exercise } from '@/config/types';
import QuickExerciseDrawer from '../exercises/QuickExerciseDrawer';
import { ExerciseSelector } from '../exercises/ExerciseSelector';
import { motion, AnimatePresence } from 'framer-motion';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    TouchSensor,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Group Item Component ---
function SortableGroupItem({
    group,
    groupIndex,
    control,
    register,
    removeGroup,
    openSelectorFor
}: any) {
    const t = useTranslations('WorkoutForm');
    const te = useTranslations('Exercises');

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: group.id || `group-${groupIndex}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.9 : 1,
    };

    const { fields: exerciseFields, remove: removeExercise } = useFieldArray({
        control,
        name: `exercises.${groupIndex}.exercises`
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            ref={setNodeRef}
            style={style}
            className={`bg-white dark:bg-zinc-900 border ${isDragging ? 'border-lime-400 shadow-xl' : 'border-zinc-200 dark:border-zinc-800'} rounded-3xl p-5 mb-4 relative flex flex-col gap-4 overflow-hidden`}
        >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-lime-500 transition-colors"
                        style={{ touchAction: 'none' }}
                    >
                        <GripVertical size={20} />
                    </div>
                    <select
                        {...register(`exercises.${groupIndex}.groupType`)}
                        className="bg-transparent text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100 outline-none cursor-pointer"
                    >
                        <option value="straight">{t('groupTypes.straight')}</option>
                        <option value="bi_set">{t('groupTypes.bi_set')}</option>
                        <option value="tri_set">{t('groupTypes.tri_set')}</option>
                        <option value="giant_set">{t('groupTypes.giant_set')}</option>
                        <option value="circuit">{t('groupTypes.circuit')}</option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={() => removeGroup(groupIndex)}
                    className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-xl transition-all"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="space-y-4">
                {exerciseFields.map((exSubField: any, exIndex: number) => (
                    <div key={exSubField.id} className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3 mb-4">
                            <button
                                type="button"
                                onClick={() => openSelectorFor(groupIndex, exIndex)}
                                className="flex-1 flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-lime-400/50 transition-all text-left group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-lime-400/10 flex items-center justify-center">
                                    <Dumbbell size={16} className="text-lime-500" />
                                </div>
                                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex-1">
                                    {exSubField.exerciseName ? (te.has(exSubField.exerciseName) ? te(exSubField.exerciseName) : exSubField.exerciseName) : t('selectExercise')}
                                </span>
                                <ChevronDown size={16} className="text-zinc-400 group-hover:text-lime-500" />
                            </button>
                            {exerciseFields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeExercise(exIndex)}
                                    className="p-3 text-zinc-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>

                        {/* Sets List Minimal UI */}
                        <SetsList groupIndex={groupIndex} exerciseIndex={exIndex} control={control} register={register} />
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => openSelectorFor(groupIndex, null)}
                    className="flex-1 py-3 mt-2 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs font-black uppercase tracking-widest hover:border-lime-400 hover:text-lime-500 transition-all"
                >
                    + {t('addExercise')}
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                 <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl">
                    <span className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('restAfterGroup')}</span>
                    <input type="number" {...register(`exercises.${groupIndex}.restAfterGroup`)} className="w-full bg-transparent font-bold text-sm outline-none" />
                </div>
                 <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl">
                    <span className="block text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('rounds')}</span>
                    <input type="number" {...register(`exercises.${groupIndex}.rounds`)} className="w-full bg-transparent font-bold text-sm outline-none" />
                </div>
            </div>
        </motion.div>
    );
}

function SetsList({ groupIndex, exerciseIndex, control, register }: any) {
    const t = useTranslations('WorkoutForm');
    const { fields: setFields, append: appendSet, remove: removeSet, insert } = useFieldArray({
        control,
        name: `exercises.${groupIndex}.exercises.${exerciseIndex}.sets`
    });

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 px-2 text-[9px] font-black tracking-widest uppercase text-zinc-400">
                <div className="col-span-1 text-center">{t('set')}</div>
                <div className="col-span-3">{t('reps')}</div>
                <div className="col-span-3">{t('rest')}</div>
                <div className="col-span-3">{t('tech')}</div>
                <div className="col-span-2 text-right"></div>
            </div>
            
            <AnimatePresence initial={false}>
                {setFields.map((setField: any, setIndex: number) => (
                    <motion.div 
                        key={setField.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-12 gap-2 items-center bg-white dark:bg-zinc-800/50 p-2 rounded-xl group"
                    >
                        <div className="col-span-1 text-center font-bold text-xs text-zinc-500">{setIndex + 1}</div>
                        <div className="col-span-3">
                            <input type="number" {...register(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets.${setIndex}.reps`)} className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-lg p-2 text-xs font-bold font-mono outline-none focus:ring-2 ring-lime-400 text-center" />
                        </div>
                        <div className="col-span-3">
                            <input type="number" {...register(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets.${setIndex}.restTime`)} className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-lg p-2 text-xs font-bold font-mono outline-none focus:ring-2 ring-lime-400 text-center" />
                        </div>
                        <div className="col-span-3">
                            <select {...register(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets.${setIndex}.technique`)} className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-lg p-2 text-xs font-bold outline-none cursor-pointer appearance-none truncate">
                                <option value="normal">{t('techShorthand.normal')}</option>
                                <option value="drop_set">{t('techShorthand.drop_set')}</option>
                                <option value="rest_pause">{t('techShorthand.rest_pause')}</option>
                                <option value="to_failure">{t('techShorthand.to_failure')}</option>
                            </select>
                        </div>
                        <div className="col-span-2 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => insert(setIndex + 1, setFields[setIndex])} className="p-1.5 text-lime-500 hover:bg-lime-500/20 rounded-lg"><Copy size={12} /></button>
                            <button type="button" onClick={() => removeSet(setIndex)} className="p-1.5 text-red-400 hover:bg-red-400/20 rounded-lg"><Trash2 size={12} /></button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => appendSet({ reps: 10, restTime: 60, technique: 'normal' })}
                className="w-full mt-2 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
            >
                <Plus size={14} /> {t('addSet')}
            </button>
        </div>
    );
}

interface WorkoutFormProps {
    initialData?: any;
    availableExercises: Exercise[];
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

export default function WorkoutForm({ initialData, availableExercises = [], onSubmit, isLoading }: WorkoutFormProps) {
    const t = useTranslations('WorkoutForm');

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialData || {
            name: '',
            description: '',
            exercises: []
        }
    });

    const { fields: groupFields, append: appendGroup, remove: removeGroup, update, move } = useFieldArray({
        control,
        name: "exercises"
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQuickDrawerOpen, setIsQuickDrawerOpen] = useState(false);
    const [targetGroupIndex, setTargetGroupIndex] = useState<number | null>(null);
    const [targetExerciseIndex, setTargetExerciseIndex] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const openSelectorFor = (grpIdx: number | null, exIdx: number | null = null) => {
        setTargetGroupIndex(grpIdx);
        setTargetExerciseIndex(exIdx);
        setIsModalOpen(true);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = groupFields.findIndex((f: any) => f.id === active.id || `group-${f.id}` === active.id);
            const newIndex = groupFields.findIndex((f: any) => f.id === over.id || `group-${f.id}` === over.id);
            if(oldIndex !== -1 && newIndex !== -1) {
                move(oldIndex, newIndex);
            }
        }
    };

    const processingSelection = useRef(false);

    const handleExerciseSelected = (exercise: Exercise) => {
        if (processingSelection.current) return;
        processingSelection.current = true;

        if (targetGroupIndex === null) {
            // Criar novo grupo com 1 exercício (Straight)
            appendGroup({
                groupType: 'straight',
                rounds: 1,
                restBetweenRounds: 0,
                restAfterGroup: 60,
                exercises: [{
                    exerciseId: exercise.id,
                    exerciseName: exercise.name,
                    restAfterExercise: 0,
                    sets: [
                        { reps: 10, restTime: 60, technique: 'normal' },
                        { reps: 10, restTime: 60, technique: 'normal' },
                        { reps: 10, restTime: 60, technique: 'normal' },
                    ]
                }]
            });
        } else {
            const group = groupFields[targetGroupIndex] as any;
            if (targetExerciseIndex === null) {
                // Adicionar novo exercício a um grupo existente (transforma em bi-set/tri-set)
                const newEx = {
                    exerciseId: exercise.id,
                    exerciseName: exercise.name,
                    restAfterExercise: 0,
                    sets: [{ reps: 10, restTime: 60, technique: 'normal' }]
                };
                update(targetGroupIndex, {
                    ...group,
                    exercises: [...(group.exercises || []), newEx]
                });
            } else {
                // Substituir exercício existente
                const newExercises = [...group.exercises];
                newExercises[targetExerciseIndex] = {
                    ...newExercises[targetExerciseIndex],
                    exerciseId: exercise.id,
                    exerciseName: exercise.name
                };
                update(targetGroupIndex, { ...group, exercises: newExercises });
            }
        }
        setIsModalOpen(false);
        setTargetGroupIndex(null);
        setTargetExerciseIndex(null);

        setTimeout(() => {
            processingSelection.current = false;
        }, 500);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
                <section className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
                    <div className="mb-4">
                        <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 tracking-widest">
                            {t('nameLabel')}
                        </label>
                        <input
                            {...register("name", { required: t('nameRequired') })}
                            placeholder={t('namePlaceholder')}
                            className={`w-full bg-zinc-50 dark:bg-zinc-950 border ${errors.name ? 'border-red-500' : 'border-transparent'} rounded-2xl p-4 text-base font-black focus:border-lime-400 focus:ring-4 focus:ring-lime-400/10 outline-none transition-all`}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 tracking-widest">
                            {t('descriptionLabel')}
                        </label>
                        <textarea
                            {...register("description")}
                            rows={2}
                            placeholder={t('descriptionPlaceholder')}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-transparent rounded-2xl p-4 text-sm font-medium focus:border-lime-400 focus:ring-4 focus:ring-lime-400/10 outline-none resize-none transition-all"
                        />
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <label className="text-xs font-black uppercase text-zinc-800 dark:text-zinc-200 tracking-widest">
                            {t('programming')}
                        </label>
                        <span className="text-[10px] font-bold bg-lime-400 text-zinc-900 px-3 py-1 rounded-full">
                            {t('groupsCount', { count: groupFields.length })}
                        </span>
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={groupFields.map((f: any) => f.id || `group-${f}`)} strategy={verticalListSortingStrategy}>
                            <AnimatePresence>
                                {groupFields.map((field: any, index) => (
                                    <SortableGroupItem
                                        key={field.id}
                                        group={field}
                                        groupIndex={index}
                                        control={control}
                                        register={register}
                                        removeGroup={removeGroup}
                                        openSelectorFor={openSelectorFor}
                                    />
                                ))}
                            </AnimatePresence>
                        </SortableContext>
                    </DndContext>

                    <button
                        type="button"
                        onClick={() => openSelectorFor(null)}
                        className="w-full py-6 mt-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:border-lime-400 hover:text-lime-500 transition-all active:scale-[0.98] cursor-pointer"
                    >
                        <Plus size={20} />
                        {t('addBlock')}
                    </button>
                </section>

                <div className="fixed bottom-6 left-6 right-6 max-w-3xl mx-auto z-40">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-lime-400 hover:bg-lime-500 text-zinc-950 py-5 rounded-[24px] font-black text-sm tracking-wide flex items-center justify-center gap-3 shadow-2xl shadow-lime-500/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-4 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={20} />
                                {t('saveWorkout').toUpperCase()}
                            </>
                        )}
                    </button>
                </div>
            </form>

            <ExerciseSelector
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleExerciseSelected}
            />

            <QuickExerciseDrawer
                isOpen={isQuickDrawerOpen}
                onClose={() => setIsQuickDrawerOpen(false)}
                onExerciseCreated={handleExerciseSelected}
            />
        </>
    );
}