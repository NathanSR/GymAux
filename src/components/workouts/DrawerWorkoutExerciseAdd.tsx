'use client';

import React, { useState, useEffect } from "react";
import {
    Dumbbell,
    Plus,
    CheckCircle2,
    ChevronLeft,
    ArrowRight
} from "lucide-react";
import { Exercise, ExerciseGroup, Workout } from "@/config/types";
import { useSession } from "@/hooks/useSession";
import { WorkoutService } from "@/services/workoutService";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Drawer } from "@/components/ui/Drawer";
import { ExerciseConfigForm } from "@/components/workouts/ExerciseConfigForm";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    exercise: Exercise;
}

export default function DrawerWorkoutExerciseAdd({
    isOpen,
    onClose,
    exercise,
}: DrawerProps) {
    const { activeUser } = useSession();
    const [step, setStep] = useState<'select' | 'form'>('select');
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [success, setSuccess] = useState(false);

    const t = useTranslations('DrawerWorkoutExerciseAdd');
    const te = useTranslations('Exercises');

    const [userWorkouts, setUserWorkouts] = useState<Workout[]>([]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            if (activeUser?.id) {
                const results = await WorkoutService.getWorkoutsByUserId(activeUser.id);
                if (Array.isArray(results)) {
                    setUserWorkouts(results);
                }
            }
        };

        if (isOpen) {
            fetchWorkouts();
        }
    }, [activeUser?.id, isOpen]);

    const handleSelectWorkout = (workout: Workout) => {
        setSelectedWorkout(workout);
        setStep('form');
    };

    const handleBackToSelect = () => {
        setStep('select');
        setSelectedWorkout(null);
    };

    const handleSaveGroup = async (group: ExerciseGroup) => {
        if (!selectedWorkout?.id || !activeUser?.id) return;

        try {
            await WorkoutService.addExerciseToWorkout(selectedWorkout.id, group, activeUser.id as string);
            setSuccess(true);
        } catch (error: any) {
            console.error("Error adding exercise to workout:", error?.message || error);
        }
    };

    const resetAndClose = () => {
        setSuccess(false);
        setStep('select');
        setSelectedWorkout(null);
        onClose();
    };

    const titleText = success
        ? t("successTitle")
        : step === 'select' ? t("selectWorkout") : t("configureSets");

    const initialGroupData: ExerciseGroup = {
        groupType: 'straight',
        rounds: 3,
        restBetweenRounds: 0,
        restAfterGroup: 60,
        exercises: [
            {
                exerciseId: exercise.id as number,
                exerciseName: exercise.name,
                restAfterExercise: 0,
                sets: [
                    { reps: 10, weight: 0, restTime: 60, technique: 'normal' },
                    { reps: 10, weight: 0, restTime: 60, technique: 'normal' },
                    { reps: 10, weight: 0, restTime: 60, technique: 'normal' }
                ]
            }
        ]
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={resetAndClose}
            className="max-w-xl mx-auto"
            title={
                <div className="space-y-1">
                    <h2 className="text-xl font-black uppercase italic tracking-tight">{titleText}</h2>
                    {!success && step === 'form' && (
                        <button
                            type="button"
                            onClick={handleBackToSelect}
                            className="flex items-center gap-1 text-[10px] font-black uppercase text-lime-500 hover:opacity-70 transition-opacity"
                        >
                            <ChevronLeft size={12} /> {t("backToSelect")}
                        </button>
                    )}
                </div>
            }
        >
            {success ? (
                <div className="py-8 flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center text-zinc-950 shadow-lg shadow-lime-400/20">
                        <CheckCircle2 size={40} className="animate-in zoom-in duration-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold">{t("addedSuccess")}</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 px-8">
                            <strong>{te.has(exercise.name) ? te(exercise.name) : exercise.name}</strong> {t("addedTo")} <strong>{selectedWorkout?.name}</strong>.
                        </p>
                    </div>

                    <div className="flex flex-col w-full gap-3 pt-4">
                        <Link
                            href={`/workouts/${selectedWorkout?.id}/edit`}
                            className="w-full py-5 bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2"
                        >
                            {t("goToWorkout")} <ArrowRight size={16} />
                        </Link>
                        <button
                            type="button"
                            onClick={resetAndClose}
                            className="w-full py-4 bg-transparent text-zinc-500 font-bold text-sm"
                        >
                            {t("continueExploring")}
                        </button>
                    </div>
                </div>
            ) : step === 'select' ? (
                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                    {userWorkouts.length > 0 ? (
                        userWorkouts.map((workout) => (
                            <button
                                key={workout.id}
                                type="button"
                                onClick={() => handleSelectWorkout(workout)}
                                className="w-full p-5 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-lime-50 dark:hover:bg-lime-900/10 border border-zinc-100 dark:border-zinc-800 rounded-3xl flex items-center justify-between transition-all group active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 shadow-sm">
                                        <Dumbbell size={20} className="text-zinc-400 group-hover:text-lime-500 transition-colors" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">{workout.name}</p>
                                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                                            {workout.exercises.reduce((acc, g) => acc + g.exercises.length, 0)} {t("exercisesCount")}
                                        </p>
                                    </div>
                                </div>
                                <Plus size={20} className="text-zinc-300 group-hover:text-lime-500" />
                            </button>
                        ))
                    ) : (
                        <div className="py-10 text-center space-y-4">
                            <p className="text-zinc-400 text-sm">{t("noWorkouts")}</p>
                            <Link href="/workouts/new" className="text-lime-500 font-black uppercase text-xs tracking-widest">
                                {t("createFirstWorkout")}
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-lime-400/10 dark:bg-lime-400/5 rounded-2xl border border-dashed border-lime-400/30 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-lime-600 dark:text-lime-400 mb-0.5">{t("destination")}</p>
                            <p className="text-sm font-bold">{selectedWorkout?.name}</p>
                        </div>
                    </div>

                    <ExerciseConfigForm
                        initialGroupData={initialGroupData}
                        onSave={handleSaveGroup}
                        onCancel={handleBackToSelect}
                        submitLabel={t("confirmBtn")}
                    />
                </div>
            )}
        </Drawer>
    );
}