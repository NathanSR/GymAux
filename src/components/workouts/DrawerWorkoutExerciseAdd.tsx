'use client'

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    X,
    Dumbbell,
    Plus,
    Hash,
    RotateCcw,
    Clock,
    CheckCircle2,
    ChevronLeft,
    ArrowRight
} from "lucide-react";
import { Exercise, Workout } from "@/config/types";
import { useSession } from "@/hooks/useSession";
import { useLiveQuery } from "dexie-react-hooks";
import { WorkoutService } from "@/services/workoutService";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    exercise: Exercise;
}

interface FormData {
    sets: number;
    reps: number;
    restTime: number;
}

export default function DrawerWorkoutExerciseAdd({
    isOpen,
    onClose,
    exercise,
}: DrawerProps) {
    const router = useRouter();
    const { activeUser } = useSession();
    const [step, setStep] = useState<'select' | 'form'>('select');
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [success, setSuccess] = useState(false);

    const t = useTranslations('DrawerWorkoutExerciseAdd');
    const te = useTranslations('Exercises');

    const { control, handleSubmit, setValue, watch, reset } = useForm<FormData>({
        defaultValues: {
            sets: 3,
            reps: 12,
            restTime: 60
        }
    });

    const currentValues = watch();

    const userWorkouts = useLiveQuery(() =>
        WorkoutService.getWorkoutsByUserId(activeUser?.id ?? -1),
        [activeUser?.id]
    ) || [];

    const handleSelectWorkout = (workout: Workout) => {
        setSelectedWorkout(workout);
        setStep('form');
    };

    const handleBackToSelect = () => {
        setStep('select');
        setSelectedWorkout(null);
    };

    const onFormSubmit = async (data: FormData) => {
        if (!selectedWorkout?.id) return;

        WorkoutService.addExerciseToWorkout(selectedWorkout.id, {
            ...data,
            exerciseId: exercise.id as number,
            exerciseName: exercise.name
        });
        setSuccess(true);
    };

    const resetAndClose = () => {
        setSuccess(false);
        setStep('select');
        setSelectedWorkout(null);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={resetAndClose}
            />

            {/* Painel */}
            <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-t-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-y-auto max-h-[95vh]">
                <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-8" />

                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black uppercase italic tracking-tight">
                            {success
                                ? t("successTitle")
                                : step === 'select' ? t("selectWorkout") : t("configureSets")}
                        </h2>
                        {!success && step === 'form' && (
                            <button
                                onClick={handleBackToSelect}
                                className="flex items-center gap-1 text-[10px] font-black uppercase text-lime-500 hover:opacity-70 transition-opacity"
                            >
                                <ChevronLeft size={12} /> {t("backToSelect")}
                            </button>
                        )}
                    </div>
                    <button onClick={resetAndClose} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {success ? (
                    <div className="py-8 flex flex-col items-center text-center space-y-6">
                        <div className="w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center text-zinc-950 shadow-lg shadow-lime-400/20">
                            <CheckCircle2 size={40} className="animate-in zoom-in duration-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold">{t("addedSuccess")}</h3>
                            <p className="text-sm text-zinc-500 px-8">
                                <strong>{te.has(exercise.name) ? te(exercise.name) : exercise.name}</strong> {t("addedTo")} <strong>{selectedWorkout?.name}</strong>.
                            </p>
                        </div>

                        <div className="flex flex-col w-full gap-3 pt-4">
                            <button
                                onClick={() => {
                                    router.push(`/workouts/${selectedWorkout?.id}/edit`);
                                }}
                                className="w-full py-5 bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2"
                            >
                                {t("goToWorkout")} <ArrowRight size={16} />
                            </button>
                            <button
                                onClick={resetAndClose}
                                className="w-full py-4 bg-transparent text-zinc-500 font-bold text-sm"
                            >
                                {t("continueExploring")}
                            </button>
                        </div>
                    </div>
                ) : step === 'select' ? (
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        {userWorkouts.length > 0 ? (
                            userWorkouts.map((workout) => (
                                <button
                                    key={workout.id}
                                    onClick={() => handleSelectWorkout(workout)}
                                    className="w-full p-5 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-lime-50 dark:hover:bg-lime-900/10 border border-zinc-100 dark:border-zinc-800 rounded-3xl flex items-center justify-between transition-all group active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 shadow-sm">
                                            <Dumbbell size={20} className="text-zinc-400 group-hover:text-lime-500 transition-colors" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-sm">{workout.name}</p>
                                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                                                {workout.exercises.length} {t("exercisesCount")}
                                            </p>
                                        </div>
                                    </div>
                                    <Plus size={20} className="text-zinc-300 group-hover:text-lime-500" />
                                </button>
                            ))
                        ) : (
                            <div className="py-10 text-center space-y-4">
                                <p className="text-zinc-400 text-sm">{t("noWorkouts")}</p>
                                <button className="text-lime-500 font-black uppercase text-xs tracking-widest">
                                    {t("createFirstWorkout")}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                        <div className="p-4 bg-lime-400/10 dark:bg-lime-400/5 rounded-2xl border border-dashed border-lime-400/30">
                            <p className="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 mb-1">{t("destination")}</p>
                            <p className="text-sm font-bold">{selectedWorkout?.name}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Séries */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                    <Hash size={12} /> {t("sets")}
                                </label>
                                <Controller
                                    name="sets"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range" min="1" max="12"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-lime-400"
                                            />
                                            <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center font-black text-xl italic border border-zinc-200 dark:border-zinc-700">
                                                {field.value}
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Repetições */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                    <RotateCcw size={12} /> {t("reps")}
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {[8, 10, 12, 15].map((val) => (
                                        <button
                                            key={val} type="button"
                                            onClick={() => setValue('reps', val)}
                                            className={`py-4 rounded-2xl text-xs font-black transition-all ${currentValues.reps === val ? 'bg-lime-400 text-zinc-950 shadow-lg shadow-lime-400/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                    <Controller
                                        name="reps"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="number"
                                                placeholder="+"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-center text-xs font-black outline-none focus:ring-2 ring-lime-400 placeholder:text-zinc-400"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Descanso */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                    <Clock size={12} /> {t("restTime")} ({t("seconds")})
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 grid grid-cols-3 gap-2">
                                        {[45, 60, 90].map(s => (
                                            <button
                                                key={s} type="button"
                                                onClick={() => setValue('restTime', s)}
                                                className={`py-4 rounded-2xl text-xs font-black ${currentValues.restTime === s ? 'bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}
                                            >
                                                {s}s
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative w-24">
                                        <Controller
                                            name="restTime"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-center text-xs font-black outline-none focus:ring-2 ring-lime-400"
                                                />
                                            )}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-bold text-zinc-400 pointer-events-none uppercase">{t("secAbbr")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-zinc-950 dark:bg-lime-400 dark:text-zinc-950 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 mt-4 active:scale-[0.98] transition-transform"
                        >
                            {t("confirmBtn")}
                        </button>
                    </form>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; }
                
                @keyframes slide-in-bottom {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-in { animation: slide-in-bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
            `}</style>
        </div>
    );
}