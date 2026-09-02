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
} from 'lucide-react';
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
import { WorkoutService } from '@/services/workoutService';
import { ScheduleService } from '@/services/scheduleService';
import { useSessionActions } from '@/hooks/useSessionActions';
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
    const [duration, setDuration] = useState<GeneratorDuration>('min45');
    const [weeklyDays, setWeeklyDays] = useState<number>(4);
    const [syncSchedule, setSyncSchedule] = useState<boolean>(true);

    // Generation State
    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
    const [generatedWorkouts, setGeneratedWorkouts] = useState<Workout[]>([]);
    const [activePreviewTab, setActivePreviewTab] = useState<number>(0);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Substitute Modal State
    const [substituteState, setSubstituteState] = useState<{
        isOpen: boolean;
        exerciseId: number | null;
        exerciseName: string | null;
        workoutIndex: number;
        groupIndex: number;
        exerciseIndex: number;
    }>({
        isOpen: false,
        exerciseId: null,
        exerciseName: null,
        workoutIndex: 0,
        groupIndex: 0,
        exerciseIndex: 0,
    });

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setDirection(1);
            setGeneratedWorkouts([]);
            setActivePreviewTab(0);

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

    // Executa o algoritmo gerador
    const handleGenerate = () => {
        setIsGenerating(true);
        try {
            const workouts = WorkoutGenerator.generate({
                userId,
                scope,
                goal,
                level,
                equipmentAccess,
                todayFocus,
                duration,
                weeklyDays,
                availableExercises,
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
                                        <div>
                                            <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block mb-2">
                                                {t('focusAreas.title')}
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {([
                                                    'chest_triceps',
                                                    'back_biceps',
                                                    'legs',
                                                    'shoulders_arms',
                                                    'upper_body',
                                                    'lower_body',
                                                    'full_body',
                                                    'core_cardio',
                                                ] as GeneratorTodayFocus[]).map((f) => (
                                                    <button
                                                        key={f}
                                                        type="button"
                                                        onClick={() => setTodayFocus(f)}
                                                        className={`p-3 rounded-xl border text-xs font-black uppercase text-left transition-all ${
                                                            todayFocus === f
                                                                ? 'bg-lime-500 text-zinc-950 border-lime-500 shadow-sm'
                                                                : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                                                        }`}
                                                    >
                                                        {t(`focusAreas.${f}`)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <label className="text-[11px] font-black uppercase tracking-wider text-zinc-400 block mb-2">
                                                {t('duration.title')}
                                            </label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {(['min30', 'min45', 'min75'] as GeneratorDuration[]).map((d) => (
                                                    <button
                                                        key={d}
                                                        type="button"
                                                        onClick={() => setDuration(d)}
                                                        className={`p-3 rounded-xl border text-[11px] font-black uppercase text-center transition-all ${
                                                            duration === d
                                                                ? 'bg-lime-500 text-zinc-950 border-lime-500'
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

                                        {/* Lista de Exercícios do Treino */}
                                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                                            {currentWorkout.exercises.flatMap((group, gIdx) =>
                                                group.exercises.map((ex, eIdx) => {
                                                    const setsCount = ex.sets.length;
                                                    const reps = ex.sets[0]?.reps || 10;
                                                    const rest = ex.sets[0]?.restTime || 60;
                                                    const isCompound = rest >= 90;

                                                    return (
                                                        <div
                                                            key={`${gIdx}-${eIdx}-${ex.exerciseId}`}
                                                            className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between gap-3 group hover:border-lime-500/30 transition-all"
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-black text-xs shrink-0">
                                                                    {gIdx + 1}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-black uppercase text-zinc-900 dark:text-white truncate">
                                                                        {getLocalizedName(ex.exerciseId, ex.exerciseName)}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-500 font-bold">
                                                                        <span>{setsCount}x{reps} reps</span>
                                                                        <span>•</span>
                                                                        <span>{rest}s descanso</span>
                                                                        <span className={`px-1.5 py-0.2 rounded text-[8px] uppercase tracking-wider font-black ${
                                                                            isCompound
                                                                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                                                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                                                                        }`}>
                                                                            {isCompound ? t('preview.mechanicsCompound') : t('preview.mechanicsIsolation')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenSubstitute(activePreviewTab, gIdx, eIdx)}
                                                                className="px-2.5 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-lime-500 hover:text-zinc-950 text-zinc-700 dark:text-zinc-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 cursor-pointer active:scale-95"
                                                                title={t('preview.replaceExercise')}
                                                            >
                                                                <RefreshCw size={12} />
                                                                <span>{t('preview.replaceExercise')}</span>
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            )}
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

            {/* MODAL DE SUBSTITUIÇÃO REUTILIZÁVEL */}
            <ExerciseSubstituteModal
                isOpen={substituteState.isOpen}
                onClose={() => setSubstituteState((s) => ({ ...s, isOpen: false }))}
                exerciseId={substituteState.exerciseId}
                exerciseName={substituteState.exerciseName}
                onSelectSubstitute={handleSelectSubstitute}
            />
        </>
    );
}
