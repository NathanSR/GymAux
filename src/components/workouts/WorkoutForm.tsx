"use client";

import { useState, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Save, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Exercise } from '@/config/types';
import QuickExerciseDrawer from '../exercises/QuickExerciseDrawer';
import { ExerciseSelector } from '../exercises/ExerciseSelector';
import { GroupTypeHelpModal } from './GroupTypeHelpModal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { SortableGroupItem } from './SortableGroupItem';

interface WorkoutFormProps {
    initialData?: any;
    availableExercises: Exercise[];
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

export default function WorkoutForm({ initialData, availableExercises = [], onSubmit, isLoading }: WorkoutFormProps) {
    const t = useTranslations('WorkoutForm');

    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
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
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [targetGroupIndex, setTargetGroupIndex] = useState<number | null>(null);
    const [targetExerciseIndex, setTargetExerciseIndex] = useState<number | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        groupIndex: number | null;
        newType: string | null;
    }>({
        isOpen: false,
        groupIndex: null,
        newType: null
    });

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
            if (oldIndex !== -1 && newIndex !== -1) {
                move(oldIndex, newIndex);
            }
        }
    };

    const handleGroupTypeChange = (groupIndex: number, newType: string) => {
        const group = watch(`exercises.${groupIndex}`);
        const currentExercises = group.exercises || [];

        let requiredCount = currentExercises.length;
        if (newType === 'straight') requiredCount = 1;
        else if (newType === 'bi_set') requiredCount = 2;
        else if (newType === 'tri_set') requiredCount = 3;

        if (requiredCount > currentExercises.length) {
            // Adicionar exercícios vazios
            const newExs = [...currentExercises];
            while (newExs.length < requiredCount) {
                newExs.push({
                    exerciseId: '',
                    exerciseName: '',
                    restAfterExercise: 0,
                    sets: currentExercises[0]?.sets
                        ? JSON.parse(JSON.stringify(currentExercises[0].sets))
                        : [{ reps: 10, restTime: 60, technique: 'normal' }]
                });
            }
            update(groupIndex, { ...group, exercises: newExs, groupType: newType, rounds: newExs[0]?.sets.length || 0 });
        } else if (requiredCount < currentExercises.length) {
            // Verificar se exercícios que serão removidos estão preenchidos
            const toRemove = currentExercises.slice(requiredCount);
            const hasData = toRemove.some((ex: any) => ex.exerciseId || ex.exerciseName);

            if (hasData) {
                setConfirmModal({
                    isOpen: true,
                    groupIndex,
                    newType
                });
            } else {
                // Remover imediatamente
                const newExs = currentExercises.slice(0, requiredCount);
                update(groupIndex, { ...group, exercises: newExs, groupType: newType, rounds: newExs[0]?.sets.length || 0 });
            }
        } else {
            // Apenas mudar o tipo (pode ser giant_set, circuit ou o mesmo count)
            update(groupIndex, { ...group, groupType: newType, rounds: currentExercises[0]?.sets.length || 0 });
        }
    };

    const confirmTypeChange = () => {
        if (confirmModal.groupIndex === null || confirmModal.newType === null) return;

        const groupIndex = confirmModal.groupIndex;
        const newType = confirmModal.newType;
        const group = watch(`exercises.${groupIndex}`);

        let requiredCount = group.exercises.length;
        if (newType === 'straight') requiredCount = 1;
        else if (newType === 'bi_set') requiredCount = 2;
        else if (newType === 'tri_set') requiredCount = 3;

        const newExs = group.exercises.slice(0, requiredCount);
        update(groupIndex, { ...group, exercises: newExs, groupType: newType, rounds: newExs[0]?.sets.length || 0 });

        setConfirmModal({ isOpen: false, groupIndex: null, newType: null });
    };

    const processingSelection = useRef(false);

    const handleExerciseSelected = (exercise: Exercise) => {
        if (processingSelection.current) return;
        processingSelection.current = true;

        if (targetGroupIndex === null) {
            // Criar novo grupo com 1 exercício (Straight)
            appendGroup({
                groupType: 'straight',
                rounds: 3,
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
                    sets: (group.exercises && group.exercises[0]?.sets)
                        ? JSON.parse(JSON.stringify(group.exercises[0].sets)) // Copiar estrutura do primeiro exercício
                        : [{ reps: 10, restTime: 60, technique: 'normal' }]
                };

                const newExercises = [...(group.exercises || []), newEx];
                let newGroupType = group.groupType;

                // Sugerir tipo de grupo baseado na quantidade
                if (newExercises.length === 2) newGroupType = 'bi_set';
                else if (newExercises.length === 3) newGroupType = 'tri_set';
                else if (newExercises.length >= 4) newGroupType = 'giant_set';

                update(targetGroupIndex, {
                    ...group,
                    exercises: newExercises,
                    groupType: newGroupType,
                    rounds: newExercises[0]?.sets.length || 0
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-40">
                <section className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
                    <div className="mb-4">
                        <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 tracking-widest">
                            {t('nameLabel')}
                        </label>
                        <input
                            {...register("name", { required: t('nameRequired') })}
                            placeholder={t('namePlaceholder')}
                            className={`w-full bg-zinc-50 dark:bg-zinc-950 border ${errors.name ? 'border-red-500' : 'border-transparent'} rounded-2xl p-4 text-base font-black focus:border-lime-400 focus:ring-4 focus:ring-lime-400/10 outline-none transition-all text-zinc-900 dark:text-zinc-100`}
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
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-transparent rounded-2xl p-4 text-sm font-medium focus:border-lime-400 focus:ring-4 focus:ring-lime-400/10 outline-none resize-none transition-all text-zinc-900 dark:text-zinc-100"
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
                                        setValue={setValue}
                                        watch={watch}
                                        onShowHelp={() => setIsHelpOpen(true)}
                                        onGroupTypeChange={handleGroupTypeChange}
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

            <GroupTypeHelpModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />

            <ConfirmDialog
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmTypeChange}
                title={t('confirmTypeChange')}
                description={t('confirmTypeChangeText', { type: confirmModal.newType ? t(`groupTypes.${confirmModal.newType}`) : '' })}
                confirmText={t('confirmChange')}
                cancelText={t('cancelChange')}
                variant="warning"
            />
        </>
    );
}