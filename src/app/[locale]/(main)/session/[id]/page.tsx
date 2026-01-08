'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, Dumbbell, Check, ArrowRight, Trophy, List } from 'lucide-react';
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

export default function SessionPage() {
    const t = useTranslations('Session');
    const te = useTranslations('Exercises');
    const { theme } = useTheme();
    const { id } = useParams();
    const router = useRouter();

    const [session, setSession] = useState<Session | null>(null);
    const [showPreview, setShowPreview] = useState(false);

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

    const { register, handleSubmit, watch, reset, getValues } = useForm({
        defaultValues: {
            weight: 0,
            reps: 0,
            rpe: 7,
            userWeight: 0,
            description: '',
            usingCreatine: false
        }
    });

    const currentExercise = session?.exercisesToDo?.[session.current?.exerciseIndex || 0];

    const synchronizeProgress = async () => {
        if (!session) return;
        await SessionService.syncSessionProgress(session.id as number, { ...session });
    };

    const handleSetCompletion = (formData: any) => {
        if (!session) return;

        const newSet = {
            weight: Number(formData.weight),
            reps: Number(formData.reps),
            rpe: Number(formData.rpe),
        };

        let updatedExecutions = [...session.exercisesDone];
        const exIdx = updatedExecutions.findIndex((e: any) => e.exerciseId === currentExercise?.exerciseId);

        if (exIdx !== -1) {
            updatedExecutions[exIdx].sets.push(newSet);
        } else {
            updatedExecutions.push({
                exerciseId: currentExercise?.exerciseId as number,
                exerciseName: currentExercise?.exerciseName as string,
                sets: [newSet]
            });
        }

        reset({ ...getValues() });
        session.current.step = 'resting';
        setSession({ ...session, exercisesDone: updatedExecutions } as Session);
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
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
            <WorkoutDrawer
                showPreview={showPreview}
                onClose={() => setShowPreview(false)}
                session={session}
                setSession={setSession}
                syncSession={synchronizeProgress}
                currentExerciseIndex={session.current.exerciseIndex || 0}
            />

            <header className="px-6 pt-12 pb-6 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 active:scale-90 transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                    <h1 className="font-black text-zinc-500 uppercase text-[10px] tracking-[0.3em] truncate max-w-[180px] mb-2">{session.workoutName}</h1>
                    <div className="flex items-center justify-center gap-1.5">
                        {Array.from({ length: currentExercise?.sets || 0 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 w-5 rounded-full transition-all duration-500 ${i < session.current.setIndex ? 'bg-lime-400' :
                                    i === session.current.setIndex ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-zinc-800'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => setShowPreview(true)}
                    className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-lime-400 active:scale-90 transition-all"
                >
                    <List size={20} />
                </button>
            </header>

            <main className="flex-1 flex flex-col px-6 py-4">
                <div className="mb-10 animate-in slide-in-from-left duration-500">
                    <span className="text-[9px] font-black text-lime-400 uppercase tracking-widest bg-lime-400/10 px-2 py-1 rounded-md">
                        {t('exercise')} {(session.current.exerciseIndex || 0) + 1}/{session.exercisesToDo.length}
                    </span>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-tight mt-3">
                        {te.has(currentExercise?.exerciseName!) ? te(currentExercise?.exerciseName!) : currentExercise?.exerciseName}
                    </h2>

                    <div className="flex items-center gap-8 mt-8">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('currentSet')}</span>
                            <span className="text-3xl font-black mt-1">
                                {session.current.setIndex + 1}
                                <span className="text-zinc-600 text-sm ml-1 font-bold">{t('of')} {currentExercise?.sets}</span>
                            </span>
                        </div>
                        <div className="h-10 w-[1px] bg-zinc-800" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('goal')}</span>
                            <span className="text-3xl font-black mt-1">
                                {currentExercise?.reps} <span className="text-xs text-zinc-500 uppercase font-black">{t('reps')}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {session.current.step === 'resting' ? (
                    <RestTimer
                        seconds={currentExercise?.restTime || 0}
                        onFinish={moveToNextStep}
                    />
                ) : (
                    <form onSubmit={handleSubmit(handleSetCompletion)} className="space-y-6 animate-in fade-in duration-500">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 focus-within:border-lime-400/50 transition-all">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-3">{t('weight')}</label>
                                <div className="flex items-center gap-3">
                                    <Dumbbell size={20} className="text-lime-400" />
                                    <input {...register("weight")} type="number" className="bg-transparent border-none p-0 text-3xl font-black outline-none w-full text-white" />
                                </div>
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 focus-within:border-lime-400/50 transition-all">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-3">{t('performed')}</label>
                                <div className="flex items-center gap-3">
                                    <Check size={20} className="text-lime-400" />
                                    <input {...register("reps")} type="number" className="bg-transparent border-none p-0 text-3xl font-black outline-none w-full text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8">
                            <div className="flex justify-between items-center mb-6">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{t('effort')}</label>
                                <div className="px-4 py-1 bg-lime-400 rounded-xl text-zinc-950 font-black italic text-xl">
                                    {watch("rpe")}
                                </div>
                            </div>
                            <input {...register("rpe")} type="range" min="0" max="10" className="w-full h-2 bg-zinc-800 rounded-full appearance-none accent-lime-400 cursor-pointer" />
                            <div className="flex justify-between mt-4 px-1 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                                <span>{t('rpeHigh')}</span>
                                <span>{t('rpeTechnical')}</span>
                                <span>{t('rpeTotal')}</span>
                            </div>
                        </div>

                        <button type="submit" className="w-full py-5 bg-lime-400 text-zinc-950 rounded-[32px] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-lime-400/10 active:scale-95 transition-all border-b-4 border-lime-600">
                            {t('confirmSet')} <ArrowRight size={20} />
                        </button>
                    </form>
                )}

                <button
                    type="button"
                    onClick={handleForceFinishWorkout}
                    className="mt-6 w-full py-4 text-zinc-600 hover:text-red-500/80 transition-colors font-black uppercase text-[10px] tracking-[0.2em]"
                >
                    {t('finishNow')}
                </button>
            </main>
        </div>
    );
}