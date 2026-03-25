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
    Trophy
} from 'lucide-react';
import { Session } from '@/config/types';
import { RestTimer } from '@/components/session/RestTimer';
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { WorkoutDrawer } from '@/components/session/WorkoutDrawer';
import { SessionService } from '@/services/sessionService';
import { useTranslations } from 'next-intl';
import { useSessionActions } from '@/hooks/useSessionActions';
import { CompletedSession } from '@/components/session/CompletedSession';
import { ExerciseInstructionModal } from '@/components/session/ExerciseInstructionModal';
import { useAlerts } from '@/hooks/useAlerts';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

interface SessionClientProps {
    initialSession: Session;
}

const RPE_EMOJIS: Record<number, { emoji: string; label: string }> = {
    0: { emoji: "☁️", label: "Muito Leve" },
    1: { emoji: "☁️", label: "Muito Leve" },
    2: { emoji: "☁️", label: "Muito Leve" },
    3: { emoji: "🙂", label: "Leve" },
    4: { emoji: "🙂", label: "Leve" },
    5: { emoji: "😐", label: "Moderado" },
    6: { emoji: "😐", label: "Moderado" },
    7: { emoji: "💪", label: "Difícil" },
    8: { emoji: "🔥", label: "Muito Difícil" },
    9: { emoji: "💀", label: "Falha Técnica" },
    10: { emoji: "🚀", label: "Falha Total" },
};

const RPE_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function SessionClient({ initialSession }: SessionClientProps) {
    const t = useTranslations('Session');
    const te = useTranslations('Exercises');
    const router = useRouter();
    const { exitSession, forceFinishWorkout } = useSessionActions();
    const { confirm } = useAlerts();

    const [session, setSession] = useState<Session>(initialSession);
    const [showPreview, setShowPreview] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    const currentExercise = session.exercisesToDo?.[session.current?.exerciseIndex || 0];

    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            weight: 0,
            reps: currentExercise?.reps || 0,
            rpe: 7,
            userWeight: 0,
            description: '',
            usingCreatine: false
        }
    });

    const weight = watch("weight");
    const rpeValue = watch("rpe");

    useEffect(() => {
        setValue("weight", 0);
    }, [session.current.exerciseIndex, setValue]);

    useEffect(() => {
        setValue("reps", currentExercise?.reps || 0);
    }, [session.current.setIndex, setValue, currentExercise?.reps]);

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

    const synchronizeProgress = async () => {
        if (!session.id) return;
        await SessionService.syncSessionProgress(session.id, { ...session });
    };

    const handleSetCompletion = (formData: any) => {
        if (!session || !currentExercise) return;

        const newSet = {
            weight: Number(formData.weight),
            reps: Number(formData.reps),
            rpe: Number(formData.rpe),
        };

        let updatedExecutions = [...session.exercisesDone];
        const exIdx = updatedExecutions.findIndex((e: any) => e.exerciseId === currentExercise.exerciseId);

        if (exIdx !== -1) {
            updatedExecutions[exIdx].sets.push(newSet);
        } else {
            updatedExecutions.push({
                exerciseId: currentExercise.exerciseId,
                exerciseName: currentExercise.exerciseName,
                sets: [newSet]
            });
        }

        const isLastSet = session.current.setIndex >= currentExercise.sets - 1;
        const isLastExercise = session.current.exerciseIndex >= session.exercisesToDo.length - 1;

        let nextStep: Session['current']['step'] = 'resting';
        if (isLastSet)
            if (isLastExercise) nextStep = 'completion';
            else nextStep = 'resting';
        else nextStep = 'resting';

        if (nextStep === 'completion') {
            if (!session.pausedAt && session.resumedAt) {
                const finalSegment = new Date().getTime() - session.resumedAt.getTime();
                session.duration += finalSegment;
            }
        }

        const newSession = { ...session };
        newSession.current.step = nextStep;
        newSession.exercisesDone = updatedExecutions;
        setSession(newSession);
        synchronizeProgress();
    };

    const moveToNextStep = () => {
        const newSession = { ...session };
        newSession.current.step = 'executing';
        if (newSession.current.setIndex < (currentExercise?.sets || 0) - 1) {
            newSession.current.setIndex = newSession.current.setIndex + 1;
        } else if (newSession.current.exerciseIndex < newSession.exercisesToDo.length - 1) {
            newSession.current.exerciseIndex = newSession.current.exerciseIndex + 1;
            newSession.current.setIndex = 0;
        } else {
            newSession.current.step = 'completion';
        }
        setSession(newSession);
        synchronizeProgress();
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
            moveToNextStep();
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
            if (newSession.current.exerciseIndex < newSession.exercisesToDo.length - 1) {
                newSession.current.exerciseIndex = newSession.current.exerciseIndex + 1;
                newSession.current.setIndex = 0;
                newSession.current.step = 'executing';
            } else {
                newSession.current.step = 'completion';
            }
            setSession(newSession);
            synchronizeProgress();
        }
    };

    const handleForceFinishWorkout = () => {
        forceFinishWorkout(session, (s) => setSession(s as Session), synchronizeProgress);
    };

    const adjustWeight = (amount: number) => {
        const currentWeight = Number(watch("weight") || 0);
        setValue("weight", Math.max(0, currentWeight + amount));
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
                setSession={setSession as any}
                syncSession={synchronizeProgress}
                currentExerciseIndex={session.current.exerciseIndex || 0}
            />

            <ExerciseInstructionModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                exerciseId={currentExercise?.exerciseId as number}
            />

            <header className="px-5 pt-10 pb-4 flex items-center justify-between z-10 sticky top-0 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
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
                    <div className="flex items-center justify-center gap-1 w-full max-w-[100px] mx-auto">
                        {Array.from({ length: currentExercise?.sets || 0 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < session.current.setIndex
                                    ? 'bg-lime-400'
                                    : i === session.current.setIndex
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
                <section className="mb-4 mt-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <motion.span 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-1.5 text-[9px] font-black text-lime-400 uppercase tracking-widest bg-lime-400/10 px-2.5 py-1 rounded-full mb-2"
                            >
                                <Zap size={9} className="text-lime-400 fill-lime-400" />
                                {t('exercise')} {(session.current.exerciseIndex || 0) + 1}/{session.exercisesToDo.length}
                            </motion.span>
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none truncate pr-2">
                                {te.has(currentExercise?.exerciseName!) ? te(currentExercise?.exerciseName!) : currentExercise?.exerciseName}
                            </h2>
                        </div>

                        <button
                            onClick={() => setShowInstructions(true)}
                            className="flex flex-col items-center gap-1 group relative flex-shrink-0"
                        >
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-400 group-hover:border-lime-400 transition-all">
                                <CircleHelp size={20} className="group-hover:rotate-12 transition-transform" />
                            </div>
                            <span className="text-[7px] font-black uppercase text-zinc-500 tracking-widest group-hover:text-lime-400">
                                {t('howTo')}
                            </span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="flex flex-col p-4 bg-zinc-900/50 rounded-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Trophy size={30} className="text-lime-400" />
                            </div>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{t('currentSet')}</span>
                            <span className="text-3xl font-black tabular-nums flex items-baseline gap-1">
                                {session.current.setIndex + 1}
                                <span className="text-zinc-600 text-xs font-bold">/ {currentExercise?.sets}</span>
                            </span>
                        </div>
                        <div className="flex flex-col p-4 bg-zinc-900/50 rounded-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Flame size={30} className="text-orange-500" />
                            </div>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{t('goal')}</span>
                            <span className="text-3xl font-black tabular-nums flex items-baseline gap-1.5">
                                {currentExercise?.reps} 
                                <span className="text-[9px] text-zinc-500 uppercase font-black tracking-tighter">{t('reps')}</span>
                            </span>
                        </div>
                    </div>
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
                                seconds={currentExercise?.restTime || 0}
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
                                onSubmit={handleSubmit(handleSetCompletion)}
                                className="space-y-3"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 focus-within:border-lime-400/50 focus-within:ring-4 focus-within:ring-lime-400/5 transition-all">
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
                                            <div className="flex flex-col gap-1">
                                                <button type="button" onClick={() => adjustWeight(5)} className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                                                    <Plus size={12} />
                                                </button>
                                                <button type="button" onClick={() => adjustWeight(-5)} className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                                                    <Minus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 focus-within:border-lime-400/50 focus-within:ring-4 focus-within:ring-lime-400/5 transition-all">
                                        <label className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-1.5 group-focus-within:text-lime-400 transition-colors">
                                            {t('performed')}
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <Check size={18} className="text-lime-400" />
                                            <input 
                                                {...register("reps")} 
                                                type="number" 
                                                inputMode="numeric"
                                                className="bg-transparent border-none p-0 text-3xl font-black outline-none w-full text-white placeholder:text-zinc-800"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* RPE Simplificado (Apenas Emojis) */}
                                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 transition-colors duration-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">{t('effort')}</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] text-lime-400 font-bold uppercase tracking-tight">{RPE_EMOJIS[Number(rpeValue)]?.label}</span>
                                            <span className="w-6 h-6 bg-lime-400 rounded-md text-zinc-950 flex items-center justify-center font-black text-xs italic">
                                                {rpeValue}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <LayoutGroup>
                                        <div className="flex flex-wrap justify-center gap-1.5 p-1 bg-black/20 rounded-xl">
                                            {RPE_OPTIONS.map((val) => (
                                                <motion.button
                                                    key={val}
                                                    type="button"
                                                    onClick={() => setValue("rpe", val)}
                                                    whileTap={{ scale: 0.9 }}
                                                    className={`relative w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors overflow-hidden ${
                                                        Number(rpeValue) === val 
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
                                                    <span className={`absolute bottom-0 right-0 px-0.5 text-[6px] font-black z-10 ${Number(rpeValue) === val ? 'text-zinc-950/40' : 'text-zinc-600'}`}>{val}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </LayoutGroup>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={handleSkipSet}
                                        className="flex items-center justify-center gap-1.5 py-3.5 px-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all"
                                    >
                                        <SkipForward size={14} />
                                        {t('skipSet')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSkipExercise}
                                        className="flex items-center justify-center gap-1.5 py-3.5 px-3 bg-red-950/10 border border-red-900/20 rounded-xl text-red-500 text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all"
                                    >
                                        <FastForward size={14} />
                                        {t('skipExercise')}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="group w-full py-5 bg-lime-400 text-zinc-950 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(163,230,71,0.2)] hover:-translate-y-1 active:scale-[0.98] transition-all border-b-6 border-lime-600"
                                >
                                    {t('confirmSet')}
                                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="pb-6 pt-2">
                    <button
                        type="button"
                        onClick={handleForceFinishWorkout}
                        className="w-full py-4 text-zinc-600 hover:text-red-500 transition-all font-black uppercase text-[9px] tracking-[0.3em] opacity-30 hover:opacity-100 flex items-center justify-center gap-2"
                    >
                        <div className="w-6 h-[1px] bg-zinc-800" />
                        {t('finishNow')}
                        <div className="w-6 h-[1px] bg-zinc-800" />
                    </button>
                </div>
            </main>
        </div>
    );
}
