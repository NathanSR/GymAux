"use client";

import { useState, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Save, Plus, Trash2, Dumbbell, ChevronDown, GripVertical, Copy, HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Exercise } from '@/config/types';
import QuickExerciseDrawer from '../exercises/QuickExerciseDrawer';
import { ExerciseSelector } from '../exercises/ExerciseSelector';
import { GroupTypeHelpModal } from './GroupTypeHelpModal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
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
    openSelectorFor,
    setValue,
    watch,
    onShowHelp,
    onGroupTypeChange
}: any) {
    const t = useTranslations('WorkoutForm');
    const te = useTranslations('Exercises');
    const groupType = watch(`exercises.${groupIndex}.groupType`);
    const isFixedType = groupType === 'bi_set' || groupType === 'tri_set';

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

    const handleRemoveExercise = (idx: number) => {
        removeExercise(idx);
        // Atualizar o tipo de grupo após remoção
        const currentExs = watch(`exercises.${groupIndex}.exercises`);
        if (currentExs) {
            const nextCount = currentExs.length - 1;
            if (nextCount === 1) setValue(`exercises.${groupIndex}.groupType`, 'straight');
            else if (nextCount === 2) setValue(`exercises.${groupIndex}.groupType`, 'bi_set');
            else if (nextCount === 3) setValue(`exercises.${groupIndex}.groupType`, 'tri_set');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            ref={setNodeRef}
            style={style}
            className={`bg-white dark:bg-zinc-900 border ${isDragging ? 'border-lime-400 shadow-xl' : 'border-zinc-200 dark:border-zinc-800'} rounded-3xl p-4 mb-4 relative flex flex-col gap-3 transition-colors overflow-hidden`}
        >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                    <div
                        {...attributes}
                        {...listeners}
                        className="p-2 -ml-2 cursor-grab active:cursor-grabbing text-zinc-400 hover:text-lime-500 transition-colors"
                        style={{ touchAction: 'none' }}
                    >
                        <GripVertical size={18} />
                    </div>
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
                </div>

                <button
                    type="button"
                    onClick={() => removeGroup(groupIndex)}
                    className="text-zinc-300 hover:text-red-500 p-2 rounded-xl transition-all"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="space-y-3">
                {exerciseFields.map((exSubField: any, exIndex: number) => (
                    <div key={exSubField.id} className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-3 border border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => openSelectorFor(groupIndex, exIndex)}
                                className="flex-1 flex items-center gap-2 p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-lime-400/50 transition-all text-left group"
                            >
                                <Dumbbell size={14} className="text-lime-500" />
                                <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 flex-1 truncate uppercase tracking-tight">
                                    {exSubField.exerciseName ? (te.has(exSubField.exerciseName) ? te(exSubField.exerciseName) : exSubField.exerciseName) : t('selectExercise')}
                                </span>
                                <ChevronDown size={14} className="text-zinc-400 group-hover:text-lime-500" />
                            </button>
                            {exerciseFields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveExercise(exIndex)}
                                    className="p-2.5 text-zinc-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        <SetsList groupIndex={groupIndex} exerciseIndex={exIndex} control={control} register={register} />
                    </div>
                ))}
            </div>

            {!isFixedType && (
                <button
                    type="button"
                    onClick={() => openSelectorFor(groupIndex, null)}
                    className="w-full py-2.5 rounded-xl border-2 border-dashed border-zinc-100 dark:border-zinc-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest hover:border-lime-400/50 hover:text-lime-500 transition-all"
                >
                    + {t('addExercise')}
                </button>
            )}

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <div className="bg-zinc-50 dark:bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                    <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('restAfterGroup')}</span>
                    <div className='flex items-center gap-2'>
                        <input type="number" {...register(`exercises.${groupIndex}.restAfterGroup`)} className="w-full bg-transparent font-black text-sm outline-none text-zinc-800 dark:text-zinc-200" />
                        <span className='text-[10px] text-zinc-500 font-bold'>s</span>
                    </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                    <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('rounds')}</span>
                    <input type="number" {...register(`exercises.${groupIndex}.rounds`)} className="w-full bg-transparent font-black text-sm outline-none text-zinc-800 dark:text-zinc-200" />
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
        <div className="space-y-1.5">
            <div className="grid grid-cols-12 gap-1 px-1 text-[8px] font-black tracking-[0.1em] uppercase text-zinc-400">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-3 text-center">{t('reps')}</div>
                <div className="col-span-3 text-center">{t('rest')}</div>
                <div className="col-span-4 text-center">{t('tech')}</div>
                <div className="col-span-1"></div>
            </div>

            <AnimatePresence initial={false}>
                {setFields.map((setField: any, setIndex: number) => (
                    <motion.div
                        key={setField.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-12 gap-1 items-center bg-white dark:bg-zinc-800/40 p-1.5 rounded-xl group/set"
                    >
                        <div className="col-span-1 text-center font-bold text-[10px] text-zinc-400">{setIndex + 1}</div>
                        <div className="col-span-3">
                            <input type="number" {...register(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets.${setIndex}.reps`)} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-transparent focus:border-lime-500/30 rounded-lg p-1.5 text-xs font-bold font-mono outline-none text-center text-zinc-800 dark:text-zinc-200" />
                        </div>
                        <div className="col-span-3">
                            <input type="number" {...register(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets.${setIndex}.restTime`)} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-transparent focus:border-lime-500/30 rounded-lg p-1.5 text-xs font-bold font-mono outline-none text-center text-zinc-800 dark:text-zinc-200" />
                        </div>
                        <div className="col-span-4">
                            <select {...register(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets.${setIndex}.technique`)} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-transparent focus:border-lime-500/30 rounded-lg p-1.5 text-[10px] font-black uppercase outline-none cursor-pointer appearance-none text-center text-zinc-800 dark:text-zinc-200">
                                <option className='bg-background text-foreground' value="normal">{t('techShorthand.normal')}</option>
                                <option className='bg-background text-foreground' value="drop_set">{t('techShorthand.drop_set')}</option>
                                <option className='bg-background text-foreground' value="rest_pause">{t('techShorthand.rest_pause')}</option>
                                <option className='bg-background text-foreground' value="to_failure">{t('techShorthand.to_failure')}</option>
                            </select>
                        </div>
                        <div className="col-span-1 flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover/set:opacity-100 transition-opacity">
                            <button type="button" onClick={() => removeSet(setIndex)} className="text-red-400 hover:text-red-500 transition-colors p-1"><Trash2 size={12} /></button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="flex gap-2 mt-2">
                <button
                    type="button"
                    // @ts-ignore
                    onClick={() => appendSet({ reps: setFields[setFields.length - 1]?.reps || 10, restTime: setFields[setFields.length - 1]?.restTime || 60, technique: 'normal' })}
                    className="flex-1 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 hover:text-lime-500 text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
                >
                    <Plus size={12} /> {t('addSet')}
                </button>
                {setFields.length > 0 && (
                    <button
                        type="button"
                        onClick={() => insert(setFields.length, { ...setFields[setFields.length - 1], id: undefined })}
                        className="px-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 hover:text-lime-500 transition-colors"
                        title={t('copySet')}
                    >
                        <Copy size={12} />
                    </button>
                )}
            </div>
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
            update(groupIndex, { ...group, exercises: newExs, groupType: newType });
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
                update(groupIndex, { ...group, exercises: newExs, groupType: newType });
            }
        } else {
            // Apenas mudar o tipo (pode ser giant_set, circuit ou o mesmo count)
            setValue(`exercises.${groupIndex}.groupType`, newType);
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
        update(groupIndex, { ...group, exercises: newExs, groupType: newType });
        
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
                    groupType: newGroupType
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