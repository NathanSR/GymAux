'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Zap,
    CalendarDays,
    Dumbbell,
    Flame,
    ShieldCheck,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    RefreshCw,
    SlidersHorizontal,
    Clock,
    Play,
    Save,
    Check,
    Target,
    Layers,
    Activity,
    X,
    GripVertical,
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    TouchSensor,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { useTranslations, useLocale } from 'next-intl';
import { Exercise, Workout, ExerciseGroup } from '@/config/types';
import { db } from '@/config/db';
import { Drawer } from '@/components/ui/Drawer';
import {
    WorkoutGenerator,
    GeneratorScope,
    GeneratorGoal,
    GeneratorLevel,
    GeneratorEquipmentAccess,
    GeneratorTodayFocus,
    GeneratorDuration,
} from '@/utils/workoutGenerator';
import { ExerciseSubstituteModal } from '@/components/exercises/ExerciseSubstituteModal';
import { ExerciseConfigModal } from './ExerciseConfigModal';
import { WorkoutExerciseCard } from './WorkoutExerciseCard';
import { InsertionPoint } from './InsertionPoint';
import { ExerciseSelector } from '@/components/exercises/ExerciseSelector';
import { CATEGORY_METADATA, CategoryType, CATEGORIES } from '@/config/constants';
import { WorkoutService } from '@/services/workoutService';
import { ScheduleService } from '@/services/scheduleService';
import { useSessionActions } from '@/hooks/useSessionActions';

interface SortablePreviewExerciseItemProps {
    group: ExerciseGroup;
    index: number;
    exerciseDetails?: Exercise;
    isReorderMode?: boolean;
    isOverlay?: boolean;
    onEdit: () => void;
    onReplace: () => void;
    onRemove: () => void;
}

function SortablePreviewExerciseItem({
    group,
    index,
    exerciseDetails,
    isReorderMode = false,
    isOverlay = false,
    onEdit,
    onReplace,
    onRemove,
}: SortablePreviewExerciseItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        isDragging,
    } = useSortable({
        id: group.id || `gen-group-${index}`,
        disabled: isOverlay || !isReorderMode,
    });

    const style = {
        zIndex: isOverlay ? 100 : (isDragging ? 50 : 1),
    };

    const dragHandle = isReorderMode ? (
        <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-lg cursor-grab active:cursor-grabbing text-zinc-400 hover:text-lime-500 transition-colors"
            style={{ touchAction: 'none' }}
        >
            <GripVertical size={16} />
        </div>
    ) : undefined;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{
                opacity: isOverlay ? 1 : (isDragging ? 0.3 : 1),
                y: 0,
                scale: isOverlay ? 1.01 : 1,
            }}
            ref={setNodeRef}
            style={style}
        >
            <WorkoutExerciseCard
                group={group}
                index={index}
                exerciseDetails={exerciseDetails}
                isDragging={isDragging && !isOverlay}
                isReorderMode={isReorderMode}
                dragHandle={dragHandle}
                onEdit={!isReorderMode && !isOverlay ? onEdit : undefined}
                onReplace={!isReorderMode && !isOverlay ? onReplace : undefined}
                onRemove={!isReorderMode && !isOverlay ? onRemove : undefined}
                className={isOverlay ? 'ring-2 ring-lime-400/30 border-lime-500 shadow-xl' : ''}
            />
        </motion.div>
    );
}
import { useExerciseLocalization, getExerciseLocalized } from '@/utils/exerciseLocalization';
import { toast } from 'react-toastify';

interface WorkoutGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onWorkoutCreated?: (workouts: Workout[]) => void;
}

export function WorkoutGeneratorModal({
    isOpen,
    onClose,
    userId,
    onWorkoutCreated,
}: WorkoutGeneratorModalProps) {
    const locale = useLocale();
    const t = useTranslations('WorkoutGenerator');
    const tc = useTranslations('Categories');
    const tEq = useTranslations('Equipment');
    const tLvl = useTranslations('Levels');
    const tw = useTranslations('WorkoutForm');
    const { getLocalizedName } = useExerciseLocalization();
    const { startWorkout } = useSessionActions();

    // Wizard Step State
    const [step, setStep] = useState<number>(1);
    const [direction, setDirection] = useState<number>(1);

    // Form Choices
    const [scope, setScope] = useState<GeneratorScope>('today');
    const [goal, setGoal] = useState<GeneratorGoal>('hypertrophy');
    const [level, setLevel] = useState<GeneratorLevel>('intermediate');
    const [equipmentAccess, setEquipmentAccess] = useState<GeneratorEquipmentAccess>('full_gym');
    const [todayFocus, setTodayFocus] = useState<GeneratorTodayFocus>('chest_triceps');
    const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(['chest', 'triceps']);
    const [duration, setDuration] = useState<GeneratorDuration>('min45');
    const [weeklyDays, setWeeklyDays] = useState<number>(3);
    const [syncSchedule, setSyncSchedule] = useState<boolean>(true);

    // Async / Data State
    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [generatedWorkouts, setGeneratedWorkouts] = useState<Workout[]>([]);
    const [activePreviewTab, setActivePreviewTab] = useState(0);

    // Reorder & Insertion State (Step 6)
    const [isReorderMode, setIsReorderMode] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [insertionIndex, setInsertionIndex] = useState<number | null>(null);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    // Modais internos
    const [substituteState, setSubstituteState] = useState<{
        isOpen: boolean;
        exerciseId: number;
        exerciseName: string;
        workoutIndex: number;
        groupIndex: number;
        exerciseIndex: number;
    }>({
        isOpen: false,
        exerciseId: 0,
        exerciseName: '',
        workoutIndex: 0,
        groupIndex: 0,
        exerciseIndex: 0,
    });

    const [configModalState, setConfigModalState] = useState<{
        isOpen: boolean;
        groupData: ExerciseGroup | null;
        workoutIndex: number;
        groupIndex: number;
    }>({
        isOpen: false,
        groupData: null,
        workoutIndex: 0,
        groupIndex: 0,
    });

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setDirection(1);
            setGeneratedWorkouts([]);
            setActivePreviewTab(0);
            setIsReorderMode(false);
            setActiveId(null);
            setInsertionIndex(null);
            setIsSelectorOpen(false);

            // Carrega todos os exercícios da base local Dexie
            db.exercises.toArray().then((exList) => {
                setAvailableExercises(exList as Exercise[]);
            }).catch((err) => {
                console.error('[WorkoutGeneratorModal] Erro ao carregar exercicios:', err);
            });
        }
    }, [isOpen]);

    // Navegação entre passos com efeito direcional
    const goToStep = (newStep: number) => {
        setDirection(newStep > step ? 1 : -1);
        setStep(newStep);
    };

    // Alternar seleção de categoria
    const toggleCategory = (cat: CategoryType) => {
        setSelectedCategories((prev) => {
            if (prev.includes(cat)) {
                if (prev.length === 1) {
                    toast.info(t('focusAreas.minOneMuscle'));
                    return prev;
                }
                return prev.filter((c) => c !== cat);
            }
            return [...prev, cat];
        });
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event: any) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setGeneratedWorkouts((prev) => {
                const copy = [...prev];
                const workout = { ...copy[activePreviewTab] };
                const oldIdx = workout.exercises.findIndex(g => (g.id || '') === active.id);
                const newIdx = workout.exercises.findIndex(g => (g.id || '') === over.id);
                if (oldIdx !== -1 && newIdx !== -1) {
                    workout.exercises = arrayMove(workout.exercises, oldIdx, newIdx);
                    copy[activePreviewTab] = workout;
                }
                return copy;
            });
        }
    };

    const handleDragEnd = () => {
        setActiveId(null);
    };

    const openSelectorForInsertion = (index: number) => {
        setInsertionIndex(index);
        setIsSelectorOpen(true);
    };

    const handleExerciseSelected = (exercise: Exercise) => {
        const newGroup: ExerciseGroup = {
            id: `gen-group-${Date.now()}-${crypto.randomUUID()}`,
            groupType: 'straight',
            rounds: 3,
            restBetweenRounds: 0,
            restAfterGroup: 60,
            exercises: [{
                exerciseId: exercise.id!,
                exerciseName: getExerciseLocalized(exercise, locale).name || exercise.name,
                restAfterExercise: 0,
                sets: [
                    { reps: 10, weight: 0, restTime: 60, technique: 'normal' },
                    { reps: 10, weight: 0, restTime: 60, technique: 'normal' },
                    { reps: 10, weight: 0, restTime: 60, technique: 'normal' },
                ]
            }]
        };

        setGeneratedWorkouts((prev) => {
            const copy = [...prev];
            const workout = { ...copy[activePreviewTab] };
            const exercises = [...workout.exercises];
            if (insertionIndex !== null && insertionIndex >= 0) {
                exercises.splice(insertionIndex, 0, newGroup);
            } else {
                exercises.push(newGroup);
            }
            workout.exercises = exercises;
            copy[activePreviewTab] = workout;
            return copy;
        });

        setIsSelectorOpen(false);
        setInsertionIndex(null);
    };

    const handleRemoveGroup = (workoutIndex: number, groupIndex: number) => {
        setGeneratedWorkouts((prev) => {
            const copy = [...prev];
            const workout = { ...copy[workoutIndex] };
            if (workout.exercises.length <= 1) {
                toast.warn('O treino precisa ter pelo menos um exercício.');
                return prev;
            }
            workout.exercises = workout.exercises.filter((_, idx) => idx !== groupIndex);
            copy[workoutIndex] = workout;
            return copy;
        });
    };

    // Executa o algoritmo gerador
    const handleGenerate = () => {
        if (scope === 'today' && selectedCategories.length === 0) {
            toast.warn(t('focusAreas.minOneMuscle'));
            return;
        }

        setIsGenerating(true);
        try {
            const workouts = WorkoutGenerator.generate({
                userId,
                scope,
                goal,
                level,
                equipmentAccess,
                todayFocus,
                selectedCategories,
                duration,
                weeklyDays,
                availableExercises,
            });

            workouts.forEach((w, wIdx) => {
                w.exercises = w.exercises.map((g, gIdx) => ({
                    ...g,
                    id: g.id || `gen-group-${wIdx}-${gIdx}-${crypto.randomUUID()}`
                }));
            });

            setGeneratedWorkouts(workouts);
            setActivePreviewTab(0);
            goToStep(6);
        } catch (err: any) {
            console.error('[WorkoutGenerator] Erro ao gerar:', err);
            toast.error('Erro ao gerar o treino. Tente novamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Abrir modal de configuração profissional de exercício
    const handleOpenConfigModal = (workoutIndex: number, groupIndex: number) => {
        const targetWorkout = generatedWorkouts[workoutIndex];
        const group = targetWorkout?.exercises[groupIndex];
        if (!group) return;

        setConfigModalState({
            isOpen: true,
            groupData: group,
            workoutIndex,
            groupIndex,
        });
    };

    // Salvar alterações do ExerciseConfigModal
    const handleSaveConfigGroup = (updatedGroup: ExerciseGroup) => {
        const { workoutIndex, groupIndex } = configModalState;

        setGeneratedWorkouts((prev) => {
            const copy = [...prev];
            const workout = { ...copy[workoutIndex] };
            const groups = [...workout.exercises];
            groups[groupIndex] = updatedGroup;
            workout.exercises = groups;
            copy[workoutIndex] = workout;
            return copy;
        });

        setConfigModalState((s) => ({ ...s, isOpen: false }));
        toast.success('Exercício configurado com sucesso!');
    };

    // Abrir modal de substituição para um exercício específico
    const handleOpenSubstitute = (workoutIndex: number, groupIndex: number, exerciseIndex: number) => {
        const targetWorkout = generatedWorkouts[workoutIndex];
        const group = targetWorkout?.exercises[groupIndex];
        const ex = group?.exercises[exerciseIndex];
        if (!ex) return;

        setSubstituteState({
            isOpen: true,
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            workoutIndex,
            groupIndex,
            exerciseIndex,
        });
    };

    // Aplicar a substituição do exercício
    const handleSelectSubstitute = (newExercise: Exercise) => {
        if (!newExercise.id) return;
        const { workoutIndex, groupIndex, exerciseIndex } = substituteState;

        setGeneratedWorkouts((prev) => {
            const copy = [...prev];
            const workout = { ...copy[workoutIndex] };
            const groups = [...workout.exercises];
            const group = { ...groups[groupIndex] };
            const exercises = [...group.exercises];

            const currentEx = exercises[exerciseIndex];
            exercises[exerciseIndex] = {
                ...currentEx,
                exerciseId: newExercise.id!,
                exerciseName: newExercise.name,
                executionMode: newExercise.executionMode || 'bilateral',
                variation: newExercise.equipment || 'none',
            };

            group.exercises = exercises;
            groups[groupIndex] = group;
            workout.exercises = groups;
            copy[workoutIndex] = workout;
            return copy;
        });

        setSubstituteState((s) => ({ ...s, isOpen: false }));
        toast.info(`Exercício trocado por ${getExerciseLocalized(newExercise, locale).name || newExercise.name}`);
    };

    // Salvar treinos no banco de dados / Dexie
    const handleSaveWorkouts = async (startImmediately = false): Promise<Workout[] | null> => {
        if (!userId || generatedWorkouts.length === 0) return null;
        setIsSaving(true);

        try {
            const savedList: Workout[] = [];

            for (const workout of generatedWorkouts) {
                const saved = await WorkoutService.createWorkout({
                    userId,
                    callerId: userId,
                    name: workout.name,
                    description: workout.description,
                    exercises: workout.exercises,
                });
                if (saved) savedList.push(saved);
            }

            // Se for rotina semanal e marcou para sincronizar no cronograma
            if (scope === 'weekly' && syncSchedule && savedList.length > 0) {
                try {
                    // Mapeia os treinos nos dias da semana
                    const workoutIds = savedList.map(w => w.id!).filter(Boolean);
                    const scheduleDays: (string | null)[] = Array(7).fill(null);

                    if (weeklyDays === 2) {
                        scheduleDays[2] = workoutIds[0] || null; // Terça
                        scheduleDays[4] = workoutIds[1] || null; // Quinta
                    } else if (weeklyDays === 3) {
                        scheduleDays[1] = workoutIds[0] || null; // Seg
                        scheduleDays[3] = workoutIds[1] || null; // Qua
                        scheduleDays[5] = workoutIds[2] || null; // Sex
                    } else if (weeklyDays === 4) {
                        scheduleDays[1] = workoutIds[0] || null; // Seg
                        scheduleDays[2] = workoutIds[1] || null; // Ter
                        scheduleDays[4] = workoutIds[2] || null; // Qui
                        scheduleDays[5] = workoutIds[3] || null; // Sex
                    } else if (weeklyDays === 5) {
                        scheduleDays[1] = workoutIds[0] || null;
                        scheduleDays[2] = workoutIds[1] || null;
                        scheduleDays[3] = workoutIds[2] || null;
                        scheduleDays[4] = workoutIds[3] || null;
                        scheduleDays[5] = workoutIds[4] || null;
                    } else {
                        scheduleDays[1] = workoutIds[0] || null;
                        scheduleDays[2] = workoutIds[1] || null;
                        scheduleDays[3] = workoutIds[2] || null;
                        scheduleDays[4] = workoutIds[3] || null;
                        scheduleDays[5] = workoutIds[4] || null;
                        scheduleDays[6] = workoutIds[5] || null;
                    }

                    await ScheduleService.createSchedule(
                        {
                            userId,
                            name: `Rotina ${weeklyDays}x Semanal (${goal.toUpperCase()})`,
                            workouts: scheduleDays,
                            startDate: new Date(),
                            active: true,
                        },
                        userId
                    );
                } catch (schedErr) {
                    console.warn('[WorkoutGeneratorModal] Falha ao criar schedule:', schedErr);
                }
            }

            if (onWorkoutCreated) {
                onWorkoutCreated(savedList);
            }

            toast.success(
                scope === 'today' ? t('actions.savedSuccess') : t('actions.routineSavedSuccess')
            );

            if (startImmediately && savedList[0]) {
                onClose();
                startWorkout(savedList[0]);
            } else {
                onClose();
            }

            return savedList;
        } catch (err: any) {
            console.error('[WorkoutGeneratorModal] Erro ao salvar:', err);
            toast.error(err?.message || 'Erro ao salvar o treino.');
            return null;
        } finally {
            setIsSaving(false);
        }
    };

    // Transições Framer Motion
    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 30 : -30,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -30 : 30,
            opacity: 0,
        }),
    };

    const currentWorkout = generatedWorkouts[activePreviewTab] || generatedWorkouts[0];

    // Estatísticas do treino em preview
    const previewStats = useMemo(() => {
        if (!currentWorkout) return { totalExercises: 0, totalSets: 0, estimatedMin: 0 };
        let totalExercises = 0;
        let totalSets = 0;
        let totalSeconds = 0;

        for (const group of currentWorkout.exercises) {
            for (const ex of group.exercises) {
                totalExercises += 1;
                totalSets += ex.sets.length;
                for (const s of ex.sets) {
                    totalSeconds += (s.reps * 2.5) + s.restTime;
                }
            }
        }

        return {
            totalExercises,
            totalSets,
            estimatedMin: Math.max(15, Math.round(totalSeconds / 60)),
        };
    }, [currentWorkout]);

    return (
        <>
            <Drawer
                isOpen={isOpen}
                onClose={onClose}
                className="max-w-xl mx-auto"
                title={
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-lime-400/20 text-lime-600 dark:text-lime-400 flex items-center justify-center">
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase italic tracking-tight text-zinc-900 dark:text-white">
                                {t('title')}
                            </h3>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                {t('badge')}
                            </p>
                        </div>
                    </div>
                }
                subtitle={
                    <div className="flex items-center gap-1.5 mt-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    step === i + 1
                                        ? 'w-7 bg-lime-500'
                                        : step > i + 1
                                        ? 'w-3.5 bg-lime-500/40'
                                        : 'w-3.5 bg-zinc-200 dark:bg-zinc-800'
                                }`}
                            />
                        ))}
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 ml-2">
                            {step}/6
                        </span>
                    </div>
                }
                bodyClassName="p-6 flex flex-col justify-between overflow-hidden"
            >
                {/* CONTEÚDO PRINCIPAL COM TRANSIÇÕES FRAMER-MOTION */}
                <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar min-h-[340px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        {/* PASSO 1: ESCOPO (HOJE VS SEMANAL) */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="space-y-4"
                            >
                                <div>
                                    <h4 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                                        {t('step1Title')}
                                    </h4>
                                    <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                        {t('step1Desc')}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setScope('today')}
                                        className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-4 ${
                                            scope === 'today'
                                                ? 'bg-lime-500/10 border-lime-500 shadow-sm shadow-lime-500/10'
                                                : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                        }`}
                                    >
                                        <div className={`p-3 rounded-xl shrink-0 ${
                                            scope === 'today'
                                                ? 'bg-lime-500 text-zinc-950 shadow-md shadow-lime-500/20'
                                                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                                        }`}>
                                            <Zap size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                                                    {t('scopeToday')}
                                                </span>
                                                {scope === 'today' && <Check size={18} className="text-lime-500" />}
                                            </div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-1 leading-relaxed">
                                                {t('scopeTodayDesc')}
                                            </p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setScope('weekly')}
                                        className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-4 ${
                                            scope === 'weekly'
                                                ? 'bg-lime-500/10 border-lime-500 shadow-sm shadow-lime-500/10'
                                                : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                        }`}
                                    >
                                        <div className={`p-3 rounded-xl shrink-0 ${
                                            scope === 'weekly'
                                                ? 'bg-lime-500 text-zinc-950 shadow-md shadow-lime-500/20'
                                                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                                        }`}>
                                            <CalendarDays size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                                                    {t('scopeWeekly')}
                                                </span>
                                                {scope === 'weekly' && <Check size={18} className="text-lime-500" />}
                                            </div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-1 leading-relaxed">
                                                {t('scopeWeeklyDesc')}
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* PASSO 2: OBJETIVO */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="space-y-4"
                            >
                                <div>
                                    <h4 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                                        {t('step2Title')}
                                    </h4>
                                    <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                        {t('step2Desc')}
                                    </p>
                                </div>

                                <div className="space-y-2.5 pt-2">
                                    {(['hypertrophy', 'strength', 'endurance'] as GeneratorGoal[]).map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setGoal(g)}
                                            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                                                goal === g
                                                    ? 'bg-lime-500/10 border-lime-500 shadow-sm shadow-lime-500/10'
                                                    : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                    goal === g
                                                        ? 'bg-lime-500 text-zinc-950 font-black'
                                                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                                }`}>
                                                    {g === 'hypertrophy' && <Dumbbell size={18} />}
                                                    {g === 'strength' && <Flame size={18} />}
                                                    {g === 'endurance' && <Activity size={18} />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase text-zinc-900 dark:text-white">
                                                        {t(`goals.${g}`)}
                                                    </p>
                                                    <p className="text-[11px] text-zinc-500 mt-0.5">
                                                        {t(`goals.${g}Desc`)}
                                                    </p>
                                                </div>
                                            </div>
                                            {goal === g && <Check size={18} className="text-lime-500 shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* PASSO 3: NÍVEL */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="space-y-4"
                            >
                                <div>
                                    <h4 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                                        {t('step3Title')}
                                    </h4>
                                    <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                        {t('step3Desc')}
                                    </p>
                                </div>

                                <div className="space-y-2.5 pt-2">
                                    {(['beginner', 'intermediate', 'advanced'] as GeneratorLevel[]).map((lvl) => (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => setLevel(lvl)}
                                            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                                                level === lvl
                                                    ? 'bg-lime-500/10 border-lime-500 shadow-sm shadow-lime-500/10'
                                                    : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                    level === lvl
                                                        ? 'bg-lime-500 text-zinc-950 font-black'
                                                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                                }`}>
                                                    <ShieldCheck size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase text-zinc-900 dark:text-white">
                                                        {t(`levels.${lvl}`)}
                                                    </p>
                                                    <p className="text-[11px] text-zinc-500 mt-0.5">
                                                        {t(`levels.${lvl}Desc`)}
                                                    </p>
                                                </div>
                                            </div>
                                            {level === lvl && <Check size={18} className="text-lime-500 shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* PASSO 4: EQUIPAMENTOS */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="space-y-4"
                            >
                                <div>
                                    <h4 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                                        {t('step4Title')}
                                    </h4>
                                    <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                        {t('step4Desc')}
                                    </p>
                                </div>

                                <div className="space-y-2.5 pt-2">
                                    {(['full_gym', 'dumbbells_only', 'bodyweight_only'] as GeneratorEquipmentAccess[]).map((eq) => (
                                        <button
                                            key={eq}
                                            type="button"
                                            onClick={() => setEquipmentAccess(eq)}
                                            className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                                                equipmentAccess === eq
                                                    ? 'bg-lime-500/10 border-lime-500 shadow-sm shadow-lime-500/10'
                                                    : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                    equipmentAccess === eq
                                                        ? 'bg-lime-500 text-zinc-950 font-black'
                                                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                                }`}>
                                                    <Layers size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black uppercase text-zinc-900 dark:text-white">
                                                        {t(`equipments.${eq}`)}
                                                    </p>
                                                    <p className="text-[11px] text-zinc-500 mt-0.5">
                                                        {t(`equipments.${eq}Desc`)}
                                                    </p>
                                                </div>
                                            </div>
                                            {equipmentAccess === eq && <Check size={18} className="text-lime-500 shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* PASSO 5: CONFIGURAÇÃO ESPECÍFICA (FOCO HOJE OU DIAS NA SEMANA) */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="space-y-4"
                            >
                                <div>
                                    <h4 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                                        {t('step5Title')}
                                    </h4>
                                    <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                        {t('step5Desc')}
                                    </p>
                                </div>

                                {scope === 'today' ? (
                                    <div className="space-y-4 pt-1">
                                        {/* Presets Rápidos */}
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-2">
                                                {t('focusAreas.quickPresets')}
                                            </label>
                                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                                {[
                                                    { key: 'push', label: 'Push', cats: ['chest', 'shoulders', 'triceps'] },
                                                    { key: 'pull', label: 'Pull', cats: ['back', 'biceps', 'forearms'] },
                                                    { key: 'lower', label: 'Inferiores (Pernas)', cats: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'adductors', 'abductors'] },
                                                    { key: 'upper', label: 'Superiores', cats: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'core'] },
                                                    { key: 'arms', label: 'Braços', cats: ['biceps', 'triceps', 'forearms'] },
                                                    { key: 'full_body', label: 'Full Body', cats: ['full_body'] },
                                                    { key: 'core_cardio', label: 'Abdômen & Cardio', cats: ['core', 'cardio'] },
                                                    { key: 'stretching', label: 'Alongamento', cats: ['stretching'] },
                                                ].map((preset) => {
                                                    const isSelected = preset.cats.length === selectedCategories.length &&
                                                        preset.cats.every(c => selectedCategories.includes(c as CategoryType));
                                                    return (
                                                        <button
                                                            key={preset.key}
                                                            type="button"
                                                            onClick={() => setSelectedCategories(preset.cats as CategoryType[])}
                                                            className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                                                                isSelected
                                                                    ? 'bg-lime-500 text-zinc-950 shadow-sm shadow-lime-500/20'
                                                                    : 'bg-zinc-100 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                                            }`}
                                                        >
                                                            {preset.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Grid de Músculos Selecionáveis com Imagem e Check */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                                    {t('focusAreas.selectMuscles')}
                                                </label>
                                                <span className="text-[10px] font-black uppercase text-lime-600 dark:text-lime-400">
                                                    {selectedCategories.length} selecionado(s)
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                                                {([
                                                    'chest',
                                                    'back',
                                                    'shoulders',
                                                    'biceps',
                                                    'triceps',
                                                    'forearms',
                                                    'quadriceps',
                                                    'hamstrings',
                                                    'glutes',
                                                    'calves',
                                                    'adductors',
                                                    'abductors',
                                                    'core',
                                                    'cardio',
                                                    'full_body',
                                                    'stretching',
                                                ] as CategoryType[]).map((cat) => {
                                                    const meta = CATEGORY_METADATA[cat];
                                                    const isChecked = selectedCategories.includes(cat);

                                                    return (
                                                        <button
                                                            key={cat}
                                                            type="button"
                                                            onClick={() => toggleCategory(cat)}
                                                            className={`group relative p-2.5 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between overflow-hidden ${
                                                                isChecked
                                                                    ? 'bg-lime-500/15 border-lime-500 shadow-sm shadow-lime-500/10'
                                                                    : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                                            }`}
                                                        >
                                                            <div className="flex items-start justify-between gap-1 mb-2">
                                                                <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                                                                    {meta?.imagePath ? (
                                                                        <img
                                                                            src={meta.imagePath}
                                                                            alt={tc(cat)}
                                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                                            onError={(e) => {
                                                                                e.currentTarget.style.display = 'none';
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <Dumbbell size={16} className="text-zinc-400" />
                                                                    )}
                                                                </div>
                                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                                                    isChecked
                                                                        ? 'bg-lime-500 text-zinc-950 shadow-xs'
                                                                        : 'border border-zinc-300 dark:border-zinc-700 text-transparent'
                                                                }`}>
                                                                    <Check size={12} strokeWidth={3} />
                                                                </div>
                                                            </div>
                                                            <span className="text-[11px] font-black uppercase tracking-tight text-zinc-900 dark:text-white truncate">
                                                                {tc(cat)}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Duração da Sessão */}
                                        <div className="pt-1">
                                            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-2">
                                                {t('duration.title')}
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(['min30', 'min45', 'min75'] as GeneratorDuration[]).map((d) => (
                                                    <button
                                                        key={d}
                                                        type="button"
                                                        onClick={() => setDuration(d)}
                                                        className={`p-3 rounded-xl border text-[11px] font-black uppercase text-center transition-all cursor-pointer ${
                                                            duration === d
                                                                ? 'bg-lime-500 text-zinc-950 border-lime-500 shadow-sm shadow-lime-500/20'
                                                                : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                                                        }`}
                                                    >
                                                        {t(`duration.${d}`)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 pt-1">
                                        <div>
                                            <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block mb-2">
                                                {t('weekly.daysTitle')}
                                            </label>
                                            <div className="space-y-2">
                                                {[2, 3, 4, 5, 6].map((days) => (
                                                    <button
                                                        key={days}
                                                        type="button"
                                                        onClick={() => setWeeklyDays(days)}
                                                        className={`w-full p-3.5 rounded-xl border text-left text-xs font-black uppercase transition-all flex items-center justify-between ${
                                                            weeklyDays === days
                                                                ? 'bg-lime-500/10 border-lime-500 text-lime-600 dark:text-lime-400'
                                                                : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                                                        }`}
                                                    >
                                                        <span>{t(`weekly.days${days}`)}</span>
                                                        {weeklyDays === days && <Check size={16} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="syncSchedule"
                                                checked={syncSchedule}
                                                onChange={(e) => setSyncSchedule(e.target.checked)}
                                                className="w-4 h-4 rounded-md accent-lime-500 cursor-pointer"
                                            />
                                            <label htmlFor="syncSchedule" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                                                {t('weekly.scheduleSync')}
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* PASSO 6: PREVIEW E AJUSTE FINO */}
                        {step === 6 && (
                            <motion.div
                                key="step6"
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="space-y-4"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                                            {t('step6Title')}
                                        </h4>
                                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-lime-500/20">
                                            {previewStats.estimatedMin} min
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                        {t('step6Desc')}
                                    </p>
                                </div>

                                {/* Abas para múltiplos treinos na rotina semanal */}
                                {generatedWorkouts.length > 1 && (
                                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                                        {generatedWorkouts.map((w, idx) => (
                                            <button
                                                key={w.id || idx}
                                                type="button"
                                                onClick={() => setActivePreviewTab(idx)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase whitespace-nowrap transition-all ${
                                                    activePreviewTab === idx
                                                        ? 'bg-lime-500 text-zinc-950 shadow-xs'
                                                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
                                                }`}
                                            >
                                                {w.name.split(' - ')[0] || `Treino ${idx + 1}`}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Informações do Treino Selecionado */}
                                {currentWorkout && (
                                    <div className="space-y-3">
                                        <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                                            <h5 className="text-xs font-black uppercase text-zinc-900 dark:text-white tracking-tight">
                                                {currentWorkout.name}
                                            </h5>
                                            <p className="text-[11px] text-zinc-500 mt-0.5">
                                                {currentWorkout.description}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                                <span>{previewStats.totalExercises} exercícios</span>
                                                <span>•</span>
                                                <span>{previewStats.totalSets} séries</span>
                                            </div>
                                        </div>

                                        {/* Barra de controle com botão de alternância do modo de reordenação */}
                                        <div className="flex items-center justify-between px-1">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                                {currentWorkout.exercises.length} {currentWorkout.exercises.length === 1 ? 'exercício' : 'exercícios'}
                                            </span>
                                            {currentWorkout.exercises.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsReorderMode(!isReorderMode)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                                                        isReorderMode
                                                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md'
                                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                                                    }`}
                                                >
                                                    {isReorderMode ? (
                                                        <>
                                                            <Check className="w-3 h-3" />
                                                            {tw('doneReordering')}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <GripVertical className="w-3 h-3" />
                                                            {tw('reorderItems')}
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* Lista de Exercícios do Treino com Reordenação, Inserção e Animação Suave */}
                                        <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                                            <DndContext
                                                sensors={sensors}
                                                collisionDetection={closestCenter}
                                                onDragStart={handleDragStart}
                                                onDragOver={handleDragOver}
                                                onDragEnd={handleDragEnd}
                                            >
                                                <SortableContext
                                                    items={currentWorkout.exercises.map((g, gIdx) => g.id || `gen-group-${gIdx}`)}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    <AnimatePresence>
                                                        {currentWorkout.exercises.map((group, gIdx) => {
                                                            const primaryEx = group.exercises[0];
                                                            const foundEx = availableExercises.find(a => a.id === primaryEx?.exerciseId);
                                                            return (
                                                                <div key={group.id || `gen-group-${gIdx}`} className={isReorderMode ? 'mb-2' : ''}>
                                                                    {gIdx === 0 && (
                                                                        <InsertionPoint
                                                                            isVisible={!isReorderMode && !activeId}
                                                                            onClick={() => openSelectorForInsertion(0)}
                                                                        />
                                                                    )}

                                                                    <SortablePreviewExerciseItem
                                                                        group={group}
                                                                        index={gIdx}
                                                                        exerciseDetails={foundEx}
                                                                        isReorderMode={isReorderMode}
                                                                        onEdit={() => handleOpenConfigModal(activePreviewTab, gIdx)}
                                                                        onReplace={() => handleOpenSubstitute(activePreviewTab, gIdx, 0)}
                                                                        onRemove={() => handleRemoveGroup(activePreviewTab, gIdx)}
                                                                    />

                                                                    <InsertionPoint
                                                                        isVisible={!isReorderMode && !activeId}
                                                                        onClick={() => openSelectorForInsertion(gIdx + 1)}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </AnimatePresence>
                                                </SortableContext>

                                                <DragOverlay dropAnimation={{
                                                    sideEffects: defaultDropAnimationSideEffects({
                                                        styles: {
                                                            active: {
                                                                opacity: '0.5',
                                                            },
                                                        },
                                                    }),
                                                }}>
                                                    {activeId ? (
                                                        <div className="w-full">
                                                            {(() => {
                                                                const activeItem = currentWorkout.exercises.find(g => (g.id || '') === activeId);
                                                                if (!activeItem) return null;
                                                                const primaryEx = activeItem.exercises[0];
                                                                const foundEx = availableExercises.find(a => a.id === primaryEx?.exerciseId);
                                                                return (
                                                                    <SortablePreviewExerciseItem
                                                                        group={activeItem}
                                                                        index={currentWorkout.exercises.findIndex(g => (g.id || '') === activeId)}
                                                                        exerciseDetails={foundEx}
                                                                        isReorderMode={true}
                                                                        isOverlay
                                                                        onEdit={() => { }}
                                                                        onReplace={() => { }}
                                                                        onRemove={() => { }}
                                                                    />
                                                                );
                                                            })()}
                                                        </div>
                                                    ) : null}
                                                </DragOverlay>
                                            </DndContext>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* BOTÕES DE CONTROLE / NAVEGAÇÃO INFERIOR */}
                <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-4 mt-4 flex items-center gap-2.5 shrink-0">
                    {step > 1 && step < 6 && (
                        <button
                            type="button"
                            onClick={() => goToStep(step - 1)}
                            className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
                            title={t('actions.back')}
                        >
                            <ArrowLeft size={18} />
                        </button>
                    )}

                    {step < 5 && (
                        <button
                            type="button"
                            onClick={() => goToStep(step + 1)}
                            className="flex-1 py-3.5 px-5 bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm shadow-lime-500/20"
                        >
                            <span>{t('actions.next')}</span>
                            <ArrowRight size={16} />
                        </button>
                    )}

                    {step === 5 && (
                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="flex-1 py-3.5 px-5 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md shadow-lime-500/20"
                        >
                            <Sparkles size={16} className={isGenerating ? 'animate-spin' : ''} />
                            <span>{isGenerating ? t('actions.generating') : t('actions.generate')}</span>
                        </button>
                    )}

                    {step === 6 && (
                        <div className="w-full flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => goToStep(5)}
                                className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
                                title={t('actions.back')}
                            >
                                <ArrowLeft size={18} />
                            </button>

                            {scope === 'today' ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleSaveWorkouts(false)}
                                        disabled={isSaving}
                                        className="flex-1 py-3.5 px-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-98 border border-zinc-200 dark:border-zinc-800"
                                    >
                                        <Save size={15} />
                                        <span>{t('actions.save')}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleSaveWorkouts(true)}
                                        disabled={isSaving}
                                        className="flex-1 py-3.5 px-3 bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-md shadow-lime-500/20"
                                    >
                                        <Play size={15} />
                                        <span>{t('actions.saveAndStart')}</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleSaveWorkouts(false)}
                                    disabled={isSaving}
                                    className="w-full py-3.5 px-5 bg-lime-500 hover:bg-lime-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md shadow-lime-500/20"
                                >
                                    <Save size={16} />
                                    <span>{t('actions.saveAll')}</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </Drawer>

            {/* MODAL DE CONFIGURAÇÃO PROFISSIONAL DO EXERCÍCIO */}
            <ExerciseConfigModal
                isOpen={configModalState.isOpen}
                onClose={() => setConfigModalState((s) => ({ ...s, isOpen: false }))}
                groupData={configModalState.groupData}
                onSave={handleSaveConfigGroup}
            />

            {/* MODAL DE SUBSTITUIÇÃO REUTILIZÁVEL */}
            <ExerciseSubstituteModal
                isOpen={substituteState.isOpen}
                onClose={() => setSubstituteState((s) => ({ ...s, isOpen: false }))}
                exerciseId={substituteState.exerciseId}
                exerciseName={substituteState.exerciseName}
                onSelectSubstitute={handleSelectSubstitute}
            />

            {/* SELETOR DE EXERCÍCIOS PARA INSERTION POINT */}
            <ExerciseSelector
                isOpen={isSelectorOpen}
                onClose={() => {
                    setIsSelectorOpen(false);
                    setInsertionIndex(null);
                }}
                onSelect={handleExerciseSelected}
            />
        </>
    );
}
