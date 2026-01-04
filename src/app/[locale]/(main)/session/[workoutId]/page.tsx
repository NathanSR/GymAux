'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Clock, Dumbbell, Check, ArrowRight, Plus, Trophy, Save, List } from 'lucide-react';
import { useParams } from 'next/navigation';
import { WorkoutService } from '@/services/workoutService';
import { History, Workout } from '@/config/types';
import { RestTimer } from '@/components/session/RestTimer';
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { HistoryService } from '@/services/historyService';
import { useSession } from '@/hooks/useSession';
import { WorkoutDrawer } from '@/components/session/WorkoutDrawer';
import moment from 'moment';
import Swal from 'sweetalert2';


export default function ActiveWorkoutPage() {
    const theme = "dark";
    const { workoutId } = useParams();
    const router = useRouter();
    const { activeUser } = useSession()

    const [currentStep, setCurrentStep] = useState<'executing' | 'resting' | 'completion'>('executing');
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [history, setHistory] = useState<History>();
    const [workoutExecutions, setWorkoutExecutions] = useState<any[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const [workout, setWorkout] = useState<Workout | null>(null);

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const data: any = await WorkoutService.getWorkoutById(Number(workoutId));
                if (data) {
                    setWorkout(data);
                } else {
                    router.push('/workouts');
                }
            } catch (error) {
                console.error("Erro ao carregar treino:", error);
                router.push('/workouts');
            }
        };
        fetchWorkout();
    }, [workoutId, router]);

    const currentExercise = workout?.exercises[currentExerciseIndex];

    // Configuração do React Hook Form
    const { register, handleSubmit, watch, reset, getValues } = useForm({
        defaultValues: {
            weight: 0,
            reps: 0,
            rpe: 7,
            userWeight: 0,
            description: ''
        }
    });

    const isInitializing = useRef(false);

    // Inicializa a sessão no banco de dados assim que o componente carrega
    useEffect(() => {
        if (!workout?.id || !activeUser?.id || isInitializing.current) return;

        const initializeDatabaseSession = async () => {
            isInitializing.current = true; // Bloqueia novas execuções

            try {
                const existing = await HistoryService.getPendingHistory(activeUser?.id as number);
                if (existing) {
                    setHistory(existing);
                } else {
                    const data = await HistoryService.createWorkout({
                        userId: activeUser.id as number,
                        workoutId: workout.id as number,
                        workoutName: workout.name,
                        date: moment().toDate(),
                        executions: [],
                        completed: false
                    });
                    setHistory(data);
                }
            } finally {
                // Se quiser permitir nova execução caso o workout mude, 
                // isInitializing.current = false;
            }
        };

        initializeDatabaseSession();
    }, [activeUser, workout]);

    useEffect(() => {
        // Só executa se o history existir e tiver o campo executions
        if (!history || !history.executions || history.executions.length === 0 || !workout) {
            return;
        }

        setWorkoutExecutions(history.executions);

        const lastExecutionIndex = history.executions.length - 1;
        const lastSetIndex = history.executions[lastExecutionIndex].sets.length - 1;

        if (workout.exercises[lastExecutionIndex]?.sets == lastSetIndex + 1) {
            if (workout.exercises.length == lastExecutionIndex + 1) {
                setCurrentStep('completion');
            } else {
                setCurrentSetIndex(0);
                setCurrentExerciseIndex(lastExecutionIndex + 1);
            }
        } else {
            setCurrentSetIndex(lastSetIndex + 1);
            setCurrentExerciseIndex(lastExecutionIndex);
        }

    }, [history, workout]);



    const synchronizeProgress = async (updatedExecutions: History["executions"]) => {
        if (!history) return;

        await HistoryService.updateHistory(history?.id as number, {
            executions: updatedExecutions,
            weight: Number(getValues("userWeight")),
            description: getValues("description"),
            completed: currentStep === 'completion',
            endDate: currentStep === 'completion' ? moment().toDate() : undefined
        });
    };

    const handleSetCompletion = (formData: any) => {
        // Criando o objeto da série conforme a interface History.sets
        const newSet = {
            weight: Number(formData.weight),
            reps: Number(formData.reps),
            rpe: Number(formData.rpe),
            completed: true
        };

        let updatedExecutions = [...workoutExecutions];
        const exIdx = updatedExecutions.findIndex((e: any) => e.exerciseId === currentExercise?.exerciseId);

        if (exIdx !== -1) {
            updatedExecutions[exIdx].sets.push(newSet);
        } else {
            // Primeiro set deste exercício
            updatedExecutions.push({
                exerciseId: currentExercise?.exerciseId,
                exerciseName: currentExercise?.exerciseName,
                sets: [newSet]
            });
        }

        setWorkoutExecutions(updatedExecutions);
        synchronizeProgress(updatedExecutions);

        // Resetar campos para a próxima série/exercício (opcional: manter peso anterior)
        reset({ ...getValues() });

        setIsResting(true);

    };

    const moveToNextStep = () => {
        setIsResting(false);
        if (currentSetIndex < (currentExercise?.sets || 0) - 1) {
            setCurrentSetIndex(prev => prev + 1);
        } else if (currentExerciseIndex < (workout?.exercises.length || 0) - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setCurrentSetIndex(0);
        } else {
            setCurrentStep('completion');
        }
    };

    const handleForceFinishWorkout = () => {
        Swal.fire({
            title: 'Finalizar Treino?',
            text: "Você ainda possui exercícios pendentes. Deseja encerrar mesmo assim?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981', // emerald-500 (sucesso/conclusão)
            cancelButtonColor: '#6b7280',  // gray-500
            confirmButtonText: 'Sim, finalizar',
            cancelButtonText: 'Continuar treinando',
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
        }).then((result) => {
            if (result.isConfirmed) {
                setCurrentStep('completion');
            }
        });
    };

    const onFinishWorkout = () => {
        synchronizeProgress(workoutExecutions);
        router.push('/home');
    };

    if (currentStep === 'completion') {
        return (
            <div className="min-h-screen bg-zinc-950 text-white p-6 flex flex-col items-center justify-center max-w-md mx-auto">
                <button
                    onClick={() => router.push('/home')}
                    className="fixed left-8 top-8 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="w-full space-y-8 text-center">
                    <div className="inline-flex p-6 bg-lime-400 rounded-full">
                        <Trophy size={48} className="text-zinc-950" />
                    </div>
                    <h2 className="text-4xl font-black uppercase italic">Treino Finalizado!</h2>

                    <div className="space-y-4 text-left w-full">
                        <div className="bg-zinc-900 p-6 rounded-[32px] border border-zinc-800">
                            <label className="text-[10px] font-black uppercase text-zinc-500 mb-2 block tracking-widest">Peso Corporal (kg)</label>
                            <input
                                {...register("userWeight")}
                                type='number'
                                min="0"
                                className="w-full bg-zinc-800 border-none rounded-2xl p-4 font-bold text-white outline-none"
                            />
                        </div>
                        <div className="bg-zinc-900 p-6 rounded-[32px] border border-zinc-800">
                            <label className="text-[10px] font-black uppercase text-zinc-500 mb-2 block tracking-widest">Observações Finais</label>
                            <textarea
                                {...register("description")}
                                placeholder="Notas sobre o desempenho..."
                                className="w-full bg-zinc-800 border-none rounded-2xl p-4 text-sm min-h-[120px] resize-none outline-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={onFinishWorkout}
                        className="w-full py-5 bg-lime-400 text-zinc-950 rounded-full font-black uppercase text-xs tracking-widest"
                    >
                        Salvar e Concluir
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">


            <WorkoutDrawer
                showPreview={showPreview}
                onClose={() => setShowPreview(false)}
                exercises={workout?.exercises}
                currentExerciseIndex={currentExerciseIndex}
            />


            {/* Cabeçalho */}
            <header className="px-6 pt-10 pb-4 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="">
                    <h1 className="font-black text-zinc-500 uppercase tracking-widest truncate max-w-[200px]">{workout?.name}</h1>
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                        {Array.from({ length: currentExercise?.sets || 0 }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-6 rounded-full transition-all duration-300 ${i < currentSetIndex ? 'bg-lime-500' : i === currentSetIndex ? 'bg-white shadow-[0_0_8px_white]' : 'bg-zinc-800'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => setShowPreview(true)}
                    className="ml-4 p-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-lime-400 active:scale-90 transition-transform hover:bg-zinc-800"
                >
                    <List size={20} />
                </button>
            </header>

            {/* Principal */}
            {
                <main className="flex-1 flex flex-col px-6 py-4 overflow-y-auto">
                    <div className="mb-8 animate-in slide-in-from-left duration-300">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-black text-lime-400 uppercase tracking-widest bg-lime-400/10 px-2 py-1 rounded">
                                Exercício {currentExerciseIndex + 1}/{workout?.exercises.length}
                            </span>
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tight italic leading-tight">
                            {currentExercise?.exerciseName}
                        </h2>

                        <div className="flex items-center gap-6 mt-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Série Atual</span>
                                <span className="text-2xl font-black leading-none mt-1">
                                    {currentSetIndex + 1}<span className="text-zinc-600 text-sm ml-1 font-bold">de {currentExercise?.sets}</span>
                                </span>
                            </div>
                            <div className="h-10 w-[1px] bg-zinc-800" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Objetivo</span>
                                <span className="text-2xl font-black leading-none mt-1">
                                    {currentExercise?.reps} <span className="text-xs text-zinc-500 uppercase font-black">reps</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {isResting ? (
                        <RestTimer
                            seconds={currentExercise?.restTime || 0}
                            onFinish={moveToNextStep}
                        />
                    ) : <form onSubmit={handleSubmit(handleSetCompletion)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 focus-within:border-lime-400/40 transition-colors">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-2">Carga (kg)</label>
                                <div className="flex items-center gap-3">
                                    <Dumbbell size={18} className="text-zinc-600" />
                                    <input {...register("weight")} type="number" className="bg-transparent border-none p-0 text-3xl font-black outline-none w-full text-white" />
                                </div>
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 focus-within:border-lime-400/40 transition-colors">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block mb-2">Realizadas</label>
                                <div className="flex items-center gap-3">
                                    <Check size={18} className="text-zinc-600" />
                                    <input {...register("reps")} type="number" className="bg-transparent border-none p-0 text-3xl font-black outline-none w-full text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Esforço (RPE)</label>
                                <div className="px-3 py-1 bg-lime-400 rounded-lg text-zinc-950 font-black italic text-lg shadow-lg shadow-lime-500/20">
                                    {watch("rpe")}
                                </div>
                            </div>
                            <input {...register("rpe")} type="range" min="0" max="10" className="w-full h-2 bg-zinc-800 rounded-full appearance-none accent-lime-400 cursor-pointer" />
                            <div className="flex justify-between mt-3 px-1 text-[8px] font-black text-zinc-600 uppercase tracking-tighter">
                                <span>Reserva alta</span>
                                <span>Falha técnica</span>
                                <span>Falha total</span>
                            </div>
                        </div>

                        <button type="submit" className="cursor-pointer w-full py-4 bg-lime-400 text-zinc-950 rounded-[28px] font-black uppercase text-sm tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-lime-500/10 active:scale-95 transition-all mt-4 border-b-4 border-lime-600">
                            Confirmar Série <ArrowRight size={20} />
                        </button>
                    </form>}
                    <button
                        type="button"
                        onClick={handleForceFinishWorkout}
                        className="mt-4 cursor-pointer w-full py-4 bg-zinc-900 text-red-500/60 rounded-[24px] font-black uppercase text-[10px] border border-zinc-800 tracking-widest"
                    >
                        Finalizar Agora
                    </button>
                </main>}
        </div>
    );
}