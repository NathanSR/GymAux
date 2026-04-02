"use client";

import { useEffect, useState, useMemo } from 'react';
import {
    ChevronLeft,
    Dumbbell,
    Check,
    ArrowRight,
    List,
    CircleHelp,
    Plus,
    Minus,
    SkipForward,
    FastForward,
    Flame,
    Zap,
    Trophy,
    RefreshCw
} from 'lucide-react';
import { Session, ExecutedGroup, ExecutedExercise, ExecutedSet } from '@/config/types';
import { RestTimer } from '@/components/session/RestTimer';
import { useForm } from 'react-hook-form';
import { WorkoutDrawer } from '@/components/session/WorkoutDrawer';
import { SessionService } from '@/services/sessionService';
import { useTranslations } from 'next-intl';
import { useSessionActions } from '@/hooks/useSessionActions';
import { CompletedSession } from '@/components/session/CompletedSession';
import { ExerciseInstructionModal } from '@/components/session/ExerciseInstructionModal';
import { useSessionNavigation } from '@/hooks/useSessionNavigation';
import { useAlerts } from '@/hooks/useAlerts';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

interface SessionClientProps {
    initialSession: Session;
    isReadOnly?: boolean;
}

const RPE_EMOJIS: Record<number, { emoji: string; labelKey: string }> = {
    0: { emoji: "☁️", labelKey: "rpeVeryLight" },
    1: { emoji: "☁️", labelKey: "rpeVeryLight" },
    2: { emoji: "☁️", labelKey: "rpeVeryLight" },
    3: { emoji: "🙂", labelKey: "rpeLight" },
    4: { emoji: "🙂", labelKey: "rpeLight" },
    5: { emoji: "😐", labelKey: "rpeModerate" },
    6: { emoji: "😐", labelKey: "rpeModerate" },
    7: { emoji: "💪", labelKey: "rpeHard" },
    8: { emoji: "🔥", labelKey: "rpeVeryHard" },
    9: { emoji: "💀", labelKey: "rpeTechnical" },
    10: { emoji: "🚀", labelKey: "rpeTotal" },
};

const RPE_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const GROUP_CONFIG: Record<string, {
    color: string;
    bg: string;
    border: string;
    icon: any;
    glow: string;
}> = {
    straight: {
        color: 'text-lime-400',
        bg: 'bg-lime-400/10',
        border: 'border-lime-400/20',
        icon: Zap,
        glow: 'shadow-lime-400/20'
    },
    bi_set: {
        color: 'text-indigo-400',
        bg: 'bg-indigo-400/10',
        border: 'border-indigo-400/20',
        icon: RefreshCw,
        glow: 'shadow-indigo-400/20'
    },
    tri_set: {
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
        border: 'border-amber-400/20',
        icon: Flame,
        glow: 'shadow-amber-400/20'
    },
    giant_set: {
        color: 'text-rose-400',
        bg: 'bg-rose-400/10',
        border: 'border-rose-400/20',
        icon: Trophy,
        glow: 'shadow-rose-400/20'
    },
    circuit: {
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10',
        border: 'border-cyan-400/20',
        icon: RefreshCw,
        glow: 'shadow-cyan-400/20'
    },
    superset: {
        color: 'text-fuchsia-400',
        bg: 'bg-fuchsia-400/10',
        border: 'border-fuchsia-400/20',
        icon: Zap,
        glow: 'shadow-fuchsia-400/20'
    }
};

export default function SessionClient({ initialSession, isReadOnly = false }: SessionClientProps) {
    const t = useTranslations('Session');
    const te = useTranslations('Exercises');
    const { exitSession, forceFinishWorkout } = useSessionActions();
    const { confirm } = useAlerts();

    const [session, setSession] = useState<Session>(initialSession);
    const [showPreview, setShowPreview] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [restDuration, setRestDuration] = useState<number>(60);

    const { getNextState } = useSessionNavigation(session);

    // Current Nav State
    const currentGroupIndex = session.current?.groupIndex || 0;
    const currentExerciseIndex = session.current?.exerciseIndex || 0;
    const currentSetIndex = session.current?.setIndex || 0;

    const currentGroup = session.exercisesToDo?.[currentGroupIndex];
    const currentExercise = currentGroup?.exercises?.[currentExerciseIndex];
    const currentPlannedSet = currentExercise?.sets?.[currentSetIndex];

    const isGroupAlternating = currentGroup?.groupType !== 'straight';
    const groupStyle = GROUP_CONFIG[currentGroup?.groupType || 'straight'] || GROUP_CONFIG.straight;

    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            weight: 0,
            reps: currentPlannedSet?.reps || 0,
            rpe: 7,
            userWeight: 0,
            description: '',
            usingCreatine: false
        }
    });

    const weight = watch("weight");
    const rpeValue = watch("rpe");

    useEffect(() => {
        setValue("weight", currentPlannedSet?.weight || weight || 0);
        setValue("reps", currentPlannedSet?.reps || 0);
        setValue("rpe", 7); // Reset RPE on every change
    }, [currentGroupIndex, currentExerciseIndex, currentSetIndex, setValue, currentPlannedSet]);

    useEffect(() => {
        window.history.pushState(null, '', window.location.href);
        const handleBackButton = (event: PopStateEvent) => {
            event.preventDefault();
            if (session.id) exitSession(session.id);
            window.history.pushState(null, '', window.location.href);
        };
        window.addEventListener('popstate', handleBackButton);
        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [session.id, exitSession]);

    const synchronizeProgress = async (newSession: Session) => {
        if (!newSession.id) return;
        await SessionService.syncSessionProgress(newSession.id, { ...newSession });
    };

    const handleSetCompletion = (formData: any, skipped: boolean = false) => {
        if (!session || !currentExercise || !currentGroup) return;

        const newSet: ExecutedSet = {
            weight: Number(formData.weight),
            reps: Number(formData.reps),
            rpe: Number(formData.rpe),
            skipped,
            technique: currentPlannedSet?.technique || 'normal'
        };

        const newSession = { ...session };
        let updatedExecutions = [...newSession.exercisesDone];

        // Ensure ExecutedGroup exists
        if (!updatedExecutions[currentGroupIndex]) {
            updatedExecutions[currentGroupIndex] = {
                groupType: currentGroup.groupType,
                exercises: []
            };
        }

        const executedGroup = updatedExecutions[currentGroupIndex];

        // Ensure ExecutedExercise exists
        let exIdx = executedGroup.exercises.findIndex(e => e.exerciseId === currentExercise.exerciseId);
        if (exIdx === -1) {
            executedGroup.exercises.push({
                exerciseId: currentExercise.exerciseId,
                exerciseName: currentExercise.exerciseName,
                sets: []
            });
            exIdx = executedGroup.exercises.length - 1;
        }

        // Add set
        executedGroup.exercises[exIdx].sets.push(newSet);
        newSession.exercisesDone = updatedExecutions;

        // --- Calculate Next Step ---
        const { nextGroupIndex, nextExerciseIndex, nextSetIndex, isLastActionInWorkout } = getNextState();

        if (isLastActionInWorkout) {
            newSession.current.step = 'completion';
            if (!session.pausedAt && session.resumedAt) {
                const finalSegment = new Date().getTime() - session.resumedAt.getTime();
                newSession.duration += finalSegment;
            }
        } else {
            let shouldRest = true;
            let calculatedRestTime = 60;

            const isNextSameGroup = nextGroupIndex === currentGroupIndex;

            if (currentGroup.groupType === 'straight') {
                if (isNextSameGroup) {
                    calculatedRestTime = currentPlannedSet?.restTime || 60;
                } else {
                    calculatedRestTime = currentGroup.restAfterGroup || 60;
                }
            } else {
                if (isNextSameGroup) {
                    if (nextSetIndex > currentSetIndex) {
                        calculatedRestTime = currentGroup.restAfterGroup || 60;
                    } else {
                        shouldRest = true;
                        calculatedRestTime = 3;
                    }
                } else {
                    calculatedRestTime = currentGroup.restAfterGroup || 60;
                }
            }

            setRestDuration(calculatedRestTime);
            newSession.current.step = shouldRest ? 'resting' : 'executing';
            newSession.current.groupIndex = nextGroupIndex;
            newSession.current.exerciseIndex = nextExerciseIndex;
            newSession.current.setIndex = nextSetIndex;
        }

        setSession(newSession);
        if (!isReadOnly) {
            synchronizeProgress(newSession);
        }
    };

    const moveToNextStep = () => {
        const newSession = { ...session };
        newSession.current.step = 'executing';
        setSession(newSession);
        if (!isReadOnly) {
            synchronizeProgress(newSession);
        }
    };

    const handleSkipSet = async () => {
        const result = await confirm({
            title: t('skipSetTitle'),
            text: t('skipSetText'),
            icon: 'warning',
            confirmText: t('skipSetConfirm'),
            cancelText: t('exitCancel'),
        });
        if (result.isConfirmed) {
            const currentValues = {
                weight: watch("weight"),
                reps: watch("reps"),
                rpe: watch("rpe")
            };
            handleSetCompletion(currentValues, true);
        }
    };

    const handleSkipExercise = async () => {
        const result = await confirm({
            title: t('skipExerciseTitle'),
            text: t('skipExerciseText'),
            icon: 'warning',
            confirmText: t('skipExerciseConfirm'),
            cancelText: t('exitCancel'),
            danger: true
        });
        if (result.isConfirmed) {
            const newSession = { ...session };
            const nextGroupIndex = currentGroupIndex + 1;

            if (nextGroupIndex < session.exercisesToDo.length) {
                newSession.current.groupIndex = nextGroupIndex;
                newSession.current.exerciseIndex = 0;
                newSession.current.setIndex = 0;
                newSession.current.step = 'executing';
            } else {
                newSession.current.step = 'completion';
            }
            setSession(newSession);
            synchronizeProgress(newSession);
        }
    };

    const handleForceFinishWorkout = () => {
        forceFinishWorkout(session, (s) => setSession(s as Session), () => synchronizeProgress(session));
    };

    const adjustWeight = (amount: number) => {
        const currentWeight = Number(watch("weight") || 0);
        setValue("weight", Math.max(0, currentWeight + amount));
    };

    const adjustReps = (amount: number) => {
        const currentReps = Number(watch("reps") || 0);
        setValue("reps", Math.max(0, currentReps + amount));
    };

    if (session.current.step === 'completion') {
        return <CompletedSession session={session} />;
    }

    return (
        <div className="h-[100dvh] bg-zinc-950 text-white flex flex-col font-sans selection:bg-lime-400 selection:text-zinc-950 overflow-hidden">
            <WorkoutDrawer
                showPreview={showPreview}
                onClose={() => setShowPreview(false)}
                session={session}
                setSession={setSession}
                syncSession={() => synchronizeProgress(session)}
                currentExerciseIndex={currentGroupIndex}
            />

            <ExerciseInstructionModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                exerciseId={currentExercise?.exerciseId as number}
            />

            <header className="px-5 pt-10 pb-4 flex items-center justify-between z-10 sticky top-0 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5">
                <button
                    onClick={() => exitSession(session.id as string)}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white active:scale-95 transition-all"
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="group cursor-default flex-1 px-3">
                    <h1 className="font-black w-full text-center text-zinc-500 uppercase text-[9px] tracking-[0.2em] truncate mb-1.5 group-hover:text-zinc-300 transition-colors">
                        {session.workoutName}
                    </h1>
                    <div className="flex items-center justify-center gap-1 w-full max-w-[150px] mx-auto opacity-80">
                        {Array.from({ length: session.exercisesToDo.length }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < currentGroupIndex
                                    ? 'bg-lime-400'
                                    : i === currentGroupIndex
                                        ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-pulse'
                                        : 'bg-zinc-800'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setShowPreview(true)}
                    className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 text-lime-400 hover:bg-lime-400/10 active:scale-95 transition-all"
                >
                    <List size={18} />
                </button>
            </header>

            <main className="flex-1 flex flex-col px-5 py-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
                <section className="mb-6 mt-2 relative">
                    {/* Background Glow Identity */}
                    <div className={`absolute -top-10 -left-10 w-40 h-40 rounded-full blur-[80px] opacity-15 -z-10 transition-colors duration-700 ${groupStyle.bg}`} />

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {isGroupAlternating && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${groupStyle.bg} ${groupStyle.color} ${groupStyle.border} shadow-sm backdrop-blur-md`}
                                    >
                                        <groupStyle.icon size={10} className="animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                            {t('groupTypes.' + currentGroup?.groupType)}
                                        </span>
                                    </motion.div>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 shadow-sm"
                                >
                                    <Zap size={10} className="fill-current" />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                        {t('group')} {currentGroupIndex + 1}/{session.exercisesToDo.length}
                                    </span>
                                </motion.div>
                            </div>

                            <motion.h2
                                key={currentExercise?.exerciseId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl font-black uppercase tracking-tighter italic leading-[0.85] truncate pr-2 mt-1"
                            >
                                {te.has(currentExercise?.exerciseName!) ? te(currentExercise?.exerciseName!) : currentExercise?.exerciseName}
                            </motion.h2>
                        </div>

                        <button
                            onClick={() => setShowInstructions(true)}
                            className="flex flex-col items-center gap-1.5 group relative flex-shrink-0 transition-transform active:scale-90"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:border-lime-400 group-hover:text-lime-400 transition-all shadow-lg">
                                <CircleHelp size={22} className="group-hover:rotate-12 transition-transform" />
                            </div>
                            <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest group-hover:text-zinc-400 transition-colors">
                                {t('howTo')}
                            </span>
                        </button>
                    </div>

                    {/* Group Progression - visualizes all exercises in the current group */}
                    {isGroupAlternating && currentGroup?.exercises && currentGroup.exercises.length > 1 && (
                        <div className="mt-8">
                            <p className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em] mb-3 ml-1 flex items-center gap-2">
                                <List size={10} />
                                {t('groupComposition')}
                            </p>
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                                {currentGroup.exercises.map((ex, idx) => {
                                    const isActive = idx === currentExerciseIndex;
                                    return (
                                        <div key={idx} className="flex items-center gap-2 shrink-0">
                                            <div className={`
                                                px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-tight transition-all duration-300
                                                ${isActive
                                                    ? `${groupStyle.bg} ${groupStyle.color} ${groupStyle.border} shadow-lg ring-1 ${groupStyle.border}`
                                                    : 'bg-zinc-900/30 text-zinc-600 border-zinc-800/50 opacity-40'}
                                            `}>
                                                {te.has(ex.exerciseName) ? te(ex.exerciseName) : ex.exerciseName}
                                            </div>
                                            {idx < currentGroup.exercises.length - 1 && (
                                                <ArrowRight size={12} className="text-zinc-800/50 shrink-0" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 mt-5">
                        <div className="flex flex-col p-4 bg-zinc-900/40 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">
                                {isGroupAlternating ? t('round') : t('currentSet')}
                            </span>
                            <span className="text-2xl font-black tabular-nums flex items-baseline gap-1">
                                {currentSetIndex + 1}
                                <span className="text-zinc-600 text-[10px] font-bold">/ {isGroupAlternating ? (currentGroup.rounds || 1) : currentExercise.sets.length}</span>
                            </span>
                        </div>
                        <div className="flex flex-col p-4 bg-zinc-900/40 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{t('goal')}</span>
                            <span className="text-2xl font-black tabular-nums flex items-baseline gap-1.5">
                                {currentPlannedSet?.reps}
                                <span className="text-[9px] text-zinc-500 uppercase font-black tracking-tighter">{t('reps')}</span>
                            </span>
                        </div>
                    </div>
                    {currentPlannedSet?.technique && currentPlannedSet.technique !== 'normal' && (
                        <div className="mt-2 text-center p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-black text-rose-400 uppercase tracking-widest">
                            🔥 {t('techniques.' + currentPlannedSet.technique)}
                        </div>
                    )}
                </section>

                <AnimatePresence mode="wait">
                    {session.current.step === 'resting' ? (
                        <motion.div
                            key="resting"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="flex-1 flex flex-col justify-center"
                        >
                            <RestTimer
                                seconds={restDuration}
                                onFinish={moveToNextStep}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="executing"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-3"
                        >
                            <form
                                onSubmit={handleSubmit((data) => handleSetCompletion(data, false))}
                                className="space-y-3"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="group flex bg-zinc-900 border border-zinc-800 rounded-3xl px-4 py-3 focus-within:border-lime-400/50 focus-within:ring-4 focus-within:ring-lime-400/5 transition-all">
                                        <div className='flex flex-col'>
                                            <label className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-1.5 group-focus-within:text-lime-400 transition-colors">
                                                {t('weight')}
                                            </label>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <Dumbbell size={18} className="text-lime-400 flex-shrink-0" />
                                                    <input
                                                        {...register("weight")}
                                                        type="number"
                                                        inputMode="decimal"
                                                        className="bg-transparent border-none p-0 text-3xl font-black outline-none w-full text-white placeholder:text-zinc-800"
                                                    />
                                                </div>

                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 justify-center">
                                            <button type="button" onClick={() => adjustWeight(5)} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                                                <Plus size={14} />
                                            </button>
                                            <button type="button" onClick={() => adjustWeight(-5)} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                                                <Minus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="group flex bg-zinc-900 border border-zinc-800 rounded-3xl px-4 py-3 focus-within:border-lime-400/50 focus-within:ring-4 focus-within:ring-lime-400/5 transition-all">
                                        <div className='flex flex-col'>
                                            <label className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-1.5 group-focus-within:text-lime-400 transition-colors">
                                                {t('performed')}
                                            </label>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <Check size={18} className="text-lime-400 flex-shrink-0" />
                                                    <input
                                                        {...register("reps")}
                                                        type="number"
                                                        inputMode="numeric"
                                                        className="bg-transparent border-none p-0 text-3xl font-black outline-none w-full text-white placeholder:text-zinc-800"
                                                    />
                                                </div>

                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 justify-center">
                                            <button type="button" onClick={() => adjustReps(1)} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                                                <Plus size={14} />
                                            </button>
                                            <button type="button" onClick={() => adjustReps(-1)} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                                                <Minus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* RPE Simplificado (Apenas Emojis) */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 transition-colors duration-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">{t('effort')}</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] text-lime-400 font-bold uppercase tracking-tight">{t(RPE_EMOJIS[Number(rpeValue)]?.labelKey)}</span>
                                            <span className="w-6 h-6 bg-lime-400 rounded-lg text-zinc-950 flex items-center justify-center font-black text-xs italic">
                                                {rpeValue}
                                            </span>
                                        </div>
                                    </div>

                                    <LayoutGroup>
                                        <div className="flex flex-wrap justify-center gap-1.5 p-1 bg-black/20 rounded-2xl">
                                            {RPE_OPTIONS.map((val) => (
                                                <motion.button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => setValue("rpe", val)}
                                                    whileTap={{ scale: 0.9 }}
                                                    className={`relative w-[11%] aspect-square rounded-xl flex items-center justify-center text-2xl sm:text-3xl transition-colors overflow-hidden ${Number(rpeValue) === val
                                                        ? 'bg-transparent text-zinc-950'
                                                        : 'bg-zinc-800/50 text-zinc-500'
                                                        }`}
                                                >
                                                    {Number(rpeValue) === val && (
                                                        <motion.div
                                                            layoutId="activeRpe"
                                                            className="absolute inset-0 bg-lime-400"
                                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                        />
                                                    )}
                                                    <span className={`z-10 transition-transform ${Number(rpeValue) === val ? 'scale-110' : ''}`}>
                                                        {RPE_EMOJIS[val]?.emoji}
                                                    </span>
                                                    <span className={`absolute bottom-0 right-0 px-1 text-[10px] sm:text-xs font-black z-10 ${Number(rpeValue) === val ? 'text-lime-950/40' : 'text-lime-400'}`}>{val}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </LayoutGroup>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pb-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={handleSkipSet}
                                        className="flex items-center justify-center gap-1.5 py-4 px-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 active:scale-[0.98] transition-all"
                                    >
                                        <SkipForward size={14} />
                                        {t('skipSet')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSkipExercise}
                                        className="flex items-center justify-center gap-1.5 py-4 px-3 bg-rose-950/20 border border-rose-900/30 rounded-2xl text-rose-500 text-[9px] font-black uppercase tracking-widest hover:bg-rose-900/30 active:scale-[0.98] transition-all"
                                    >
                                        <FastForward size={14} />
                                        {isGroupAlternating ? t('skipGroup') : t('skipExercise')}
                                    </button>
                                </div>

                                {!isReadOnly && (
                                    <button
                                        type="submit"
                                        className="group w-full py-5 bg-lime-400 text-zinc-950 rounded-[24px] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(163,230,71,0.2)] hover:-translate-y-1 active:scale-[0.98] transition-all border-b-[6px] border-lime-600"
                                    >
                                        {t('confirmSet')}
                                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                )}
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="pb-8 pt-4">
                    <button
                        type="button"
                        onClick={handleForceFinishWorkout}
                        className="w-full py-4 text-zinc-600 hover:text-rose-500 transition-all font-black uppercase text-[9px] tracking-[0.3em] opacity-50 hover:opacity-100 flex items-center justify-center gap-2"
                    >
                        <div className="w-8 h-[1px] bg-zinc-800" />
                        {t('finishNow')}
                        <div className="w-8 h-[1px] bg-zinc-800" />
                    </button>
                </div>
            </main>
        </div>
    );
}
