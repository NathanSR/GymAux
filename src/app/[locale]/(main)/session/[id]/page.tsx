'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, Dumbbell, Check, ArrowRight, Trophy, List, Play, CircleQuestionMark } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Session } from '@/config/types';
import { RestTimer } from '@/components/session/RestTimer';
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { WorkoutDrawer } from '@/components/session/WorkoutDrawer';
import Swal from 'sweetalert2';
import { SessionService } from '@/services/sessionService';
import { useTheme } from '@/context/ThemeContext';
import { useTranslations } from 'next-intl';
import { CompletedSession } from '@/components/session/CompletedSession';
import { ExerciseInstructionModal } from '@/components/session/ExerciseInstructionModal';

export default function SessionPage() {
    const t = useTranslations('Session');
    const te = useTranslations('Exercises');
    const { theme } = useTheme();
    const { id } = useParams();
    const router = useRouter();

    const [session, setSession] = useState<Session | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data: any = await SessionService.getSessionById(Number(id));
                if (data) {
                    setSession(data);
                } else {
                    router.push('/home');
                }
            } catch (error) {
                console.error(t('loadingError'), error);
                router.push('/home');
            }
        };
        fetchSession();
    }, [id, router, t]);

    const currentExercise = session?.exercisesToDo?.[session.current?.exerciseIndex || 0];

    const { register, handleSubmit, watch, reset, getValues, setValue } = useForm({
        defaultValues: {
            weight: 0,
            reps: currentExercise?.reps || 0,
            rpe: 7,
            userWeight: 0,
            description: '',
            usingCreatine: false
        }
    });



    // Efeito para sincronizar os inputs com a progressão da sessão
    useEffect(() => {
        // Atualiza peso APENAS na troca de exercício
        setValue("weight", 0);
    }, [session?.current.exerciseIndex]);

    useEffect(() => {
        // Atualiza reps em QUALQUER mudança de série
        setValue("reps", currentExercise?.reps || 0);
    }, [session?.current.setIndex]);



    const synchronizeProgress = async () => {
        if (!session) return;
        await SessionService.syncSessionProgress(session.id as number, { ...session });
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

        // --- LÓGICA DE TRANSIÇÃO ---
        const isLastSet = session.current.setIndex >= currentExercise.sets - 1;
        const isLastExercise = session.current.exerciseIndex >= session.exercisesToDo.length - 1;

        let nextStep: 'executing' | 'resting' | 'completion' = 'resting';

        if (isLastSet)
            if (isLastExercise)
                nextStep = 'completion';
            else
                nextStep = 'resting';
        else
            nextStep = 'resting';

        session.current.step = nextStep;
        session.exercisesDone = updatedExecutions;
        setSession({ ...session } as Session);

        synchronizeProgress();
    };

    const moveToNextStep = () => {
        if (!session) return;

        session.current.step = 'executing';
        if (session.current.setIndex < (currentExercise?.sets || 0) - 1) {
            session.current.setIndex = session.current.setIndex + 1;
        } else if (session.current.exerciseIndex < session.exercisesToDo.length - 1) {
            session.current.exerciseIndex = session.current.exerciseIndex + 1;
            session.current.setIndex = 0;
        } else {
            session.current.step = 'completion';
        }
        setSession({ ...session } as Session);
        synchronizeProgress();
    };

    const handleForceFinishWorkout = () => {
        if (!session) return;

        Swal.fire({
            title: t('finishWorkoutTitle'),
            text: t('finishWorkoutText'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#a3e635', // lime-400
            cancelButtonColor: '#3f3f46',  // zinc-700
            confirmButtonText: t('finishConfirm'),
            cancelButtonText: t('finishCancel'),
            background: theme === 'dark' ? '#09090b' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#09090b',
        }).then((result) => {
            if (result.isConfirmed) {
                session.current.step = 'completion';
                setSession({ ...session } as Session);
            }
        });
    };

    if (!session) return null;

    // TELA DE CONCLUSÃO
    if (session.current.step === 'completion') {
        return <CompletedSession session={session} />;
    }

    // TELA DE EXECUÇÃO
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-lime-400 selection:text-zinc-950">
            <WorkoutDrawer
                showPreview={showPreview}
                onClose={() => setShowPreview(false)}
                session={session}
                setSession={setSession}
                syncSession={synchronizeProgress}
                currentExerciseIndex={session.current.exerciseIndex || 0}
            />

            <ExerciseInstructionModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                exerciseId={currentExercise?.exerciseId as number}
            />

            {/* HEADER COM ANIMAÇÃO DE ENTRADA */}
            <header className="px-6 pt-12 pb-6 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700">
                <button
                    onClick={() => router.back()}
                    className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 active:scale-90 transition-all duration-300"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="text-center group cursor-default">
                    <h1 className="font-black text-zinc-500 uppercase text-[10px] tracking-[0.3em] truncate max-w-[180px] mb-2 group-hover:text-zinc-300 transition-colors">
                        {session.workoutName}
                    </h1>
                    <div className="flex items-center justify-center gap-1.5">
                        {Array.from({ length: currentExercise?.sets || 0 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-700 ease-out ${i < session.current.setIndex
                                    ? 'bg-lime-400 w-6'
                                    : i === session.current.setIndex
                                        ? 'bg-white w-6 shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-pulse'
                                        : 'bg-zinc-800 w-6'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setShowPreview(true)}
                    className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-lime-400 hover:bg-lime-400/10 active:scale-90 transition-all duration-300"
                >
                    <List size={20} />
                </button>
            </header>

            <main className="flex-1 flex flex-col px-6 py-4">
                {/* TÍTULO E TUTORIAL COM ANIMAÇÃO STAGGERED */}
                <div className="mb-10 animate-in fade-in slide-in-from-left-6 duration-700 ease-out fill-mode-both">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <span className="inline-block text-[9px] font-black text-lime-400 uppercase tracking-widest bg-lime-400/10 px-2 py-1 rounded-md mb-3 animate-bounce-subtle">
                                {t('exercise')} {(session.current.exerciseIndex || 0) + 1}/{session.exercisesToDo.length}
                            </span>
                            <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-tight decoration-lime-400/30 underline-offset-8">
                                {te.has(currentExercise?.exerciseName!) ? te(currentExercise?.exerciseName!) : currentExercise?.exerciseName}
                            </h2>
                        </div>

                        <button
                            onClick={() => setShowInstructions(true)}
                            className="mt-6 flex flex-col items-center gap-2 group relative"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-400 group-hover:border-lime-400 group-hover:shadow-[0_0_20px_rgba(163,230,71,0.2)] group-active:scale-90 transition-all duration-300 overflow-hidden">
                                <CircleQuestionMark size={22} className="group-hover:rotate-12 transition-transform" />
                            </div>
                            <span className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.1em] group-hover:text-lime-400 transition-colors">
                                {t('howTo') || 'Tutorial'}
                            </span>
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
                            </span>
                        </button>
                    </div>

                    {/* STATUS BAR COM TRANSIÇÃO DE OPACIDADE */}
                    <div className="flex items-center gap-8 mt-8 p-4 bg-zinc-900/30 rounded-[24px] border border-white/5">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('currentSet')}</span>
                            <span className="text-3xl font-black mt-1 tabular-nums">
                                {session.current.setIndex + 1}
                                <span className="text-zinc-600 text-sm ml-1 font-bold">{t('of')} {currentExercise?.sets}</span>
                            </span>
                        </div>
                        <div className="h-10 w-[1px] bg-zinc-800/50" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('goal')}</span>
                            <span className="text-3xl font-black mt-1 tabular-nums">
                                {currentExercise?.reps} <span className="text-xs text-zinc-500 uppercase font-black">{t('reps')}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {session.current.step === 'resting' ? (
                    <div className="animate-in zoom-in-95 fade-in duration-500">
                        <RestTimer
                            seconds={currentExercise?.restTime || 0}
                            onFinish={moveToNextStep}
                        />
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit(handleSetCompletion)}
                        className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 fill-mode-both"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {/* INPUT WEIGHT */}
                            <div className="group bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 focus-within:border-lime-400 focus-within:ring-4 focus-within:ring-lime-400/10 transition-all duration-300">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-3 group-focus-within:text-lime-400 transition-colors">
                                    {t('weight')}
                                </label>
                                <div className="flex items-center gap-3">
                                    <Dumbbell size={24} className="text-lime-400 animate-in zoom-in duration-500" />
                                    <input {...register("weight")} type="number" className="bg-transparent border-none p-0 text-4xl font-black outline-none w-full text-white placeholder:text-zinc-800" />
                                </div>
                            </div>

                            {/* INPUT REPS */}
                            <div className="group bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 focus-within:border-lime-400 focus-within:ring-4 focus-within:ring-lime-400/10 transition-all duration-300">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-3 group-focus-within:text-lime-400 transition-colors">
                                    {t('performed')}
                                </label>
                                <div className="flex items-center gap-3">
                                    <Check size={24} className="text-lime-400 animate-in zoom-in duration-500" />
                                    <input {...register("reps")} type="number" className="bg-transparent border-none p-0 text-4xl font-black outline-none w-full text-white placeholder:text-zinc-800" />
                                </div>
                            </div>
                        </div>

                        {/* SLIDER RPE PERSONALIZADO */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 hover:border-zinc-700 transition-colors duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{t('effort')}</label>
                                <div className="px-5 py-2 bg-lime-400 rounded-2xl text-zinc-950 font-black italic text-2xl shadow-[0_10px_20px_rgba(163,230,71,0.3)] animate-in zoom-in">
                                    {watch("rpe")}
                                </div>
                            </div>
                            <input
                                {...register("rpe")}
                                type="range" min="0" max="10"
                                className="w-full h-3 bg-zinc-800 rounded-full appearance-none accent-lime-400 cursor-pointer hover:accent-lime-300 transition-all"
                            />
                            <div className="flex justify-between mt-6 px-1 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                                <span className="hover:text-zinc-400 transition-colors">{t('rpeHigh')}</span>
                                <span className="hover:text-zinc-400 transition-colors">{t('rpeTechnical')}</span>
                                <span className="hover:text-zinc-400 transition-colors">{t('rpeTotal')}</span>
                            </div>
                        </div>

                        {/* BOTÃO SUBMIT COM EFEITO GLOW */}
                        <button
                            type="submit"
                            className="group w-full py-6 bg-lime-400 text-zinc-950 rounded-[32px] font-black uppercase text-sm tracking-[0.4em] flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(163,230,71,0.15)] hover:shadow-[0_20px_40px_rgba(163,230,71,0.3)] hover:-translate-y-1 active:scale-[0.97] active:translate-y-0 transition-all duration-300 border-b-4 border-lime-600"
                        >
                            {t('confirmSet')}
                            <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />
                        </button>
                    </form>
                )}

                <button
                    type="button"
                    onClick={handleForceFinishWorkout}
                    className="mt-8 w-full py-4 text-zinc-500 dark:text-zinc-300  hover:text-red-500 transition-colors font-black uppercase text-[10px] tracking-[0.3em] opacity-50 hover:opacity-100 duration-300"
                >
                    {t('finishNow')}
                </button>
            </main>
        </div>
    );
}