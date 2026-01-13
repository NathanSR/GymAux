'use client'

import { History } from "@/config/types";
import { Activity, Clock, MessageSquare, Scale, Trophy, X } from "lucide-react";
import { useState } from "react";
import { formatDuration } from "@/utils/dateUtil";
import { useTranslations } from "next-intl";
import { useLanguage } from "@/context/LanguageContext";

interface WorkoutHistoryModalProps {
    selectedWorkouts: History[];
    onClose: () => void;
}

export function WorkoutHistoryModal({ selectedWorkouts, onClose }: WorkoutHistoryModalProps) {
    const { language } = useLanguage();

    const [activeTab, setActiveTab] = useState(0);
    const currentWorkout = selectedWorkouts[activeTab];

    const t = useTranslations('History');
    const te = useTranslations('Exercises');

    const formattedDate = new Date(currentWorkout.date).toLocaleDateString(language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-zinc-950/90 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl z-10 overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                {/* Abas para múltiplos treinos no mesmo dia */}
                {selectedWorkouts.length > 1 && (
                    <div className="flex gap-2 p-6 pb-0 overflow-x-auto no-scrollbar">
                        {selectedWorkouts.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTab(idx)}
                                className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                                    ${activeTab === idx ? 'bg-lime-400 text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}
                            >
                                {t('workout')} {idx + 1}
                            </button>
                        ))}
                    </div>
                )}

                {/* Header do Modal */}
                <div className="p-8 pb-0 flex justify-between items-start">
                    <div className="flex-1">
                        <span className="inline-block px-2 py-1 bg-lime-400/10 text-lime-500 text-[10px] font-black uppercase tracking-widest rounded mb-2">
                            {formattedDate} • {t('details')}
                        </span>
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white leading-tight">
                            {currentWorkout.workoutName}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 active:scale-90 transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Conteúdo Scrollável */}
                <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar space-y-6">
                    {/* Stats Rápidas */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
                            <Scale size={16} className="text-lime-500 mb-2" />
                            <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('bodyWeight')}</span>
                            <span className="text-sm font-black">{currentWorkout.weight || '--'} kg</span>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
                            <Clock size={16} className="text-lime-500 mb-2" />
                            <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('duration')}</span>
                            <span className="text-sm font-black">
                                {currentWorkout.duration
                                    ? formatDuration(currentWorkout.duration)
                                    : '-- min'}
                            </span>
                        </div>
                    </div>

                    {/* Lista de Exercícios Executados */}
                    {(currentWorkout.executions?.length || 0) > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{t('performedExercises')}</h3>
                            {currentWorkout.executions?.map((ex, i) => (
                                <div key={i} className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-xl bg-lime-400 text-zinc-950 flex items-center justify-center">
                                            <Activity size={16} />
                                        </div>
                                        <span className="text-sm font-black uppercase italic tracking-tight">
                                            {te.has(ex.exerciseName) ? te(ex.exerciseName) : ex.exerciseName}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {ex.sets.map((set, si) => (
                                            <div key={si} className="flex justify-between items-center text-[11px] font-bold bg-white dark:bg-zinc-900/50 px-4 py-3 rounded-2xl">
                                                <span className="text-zinc-400">{t('set')} {si + 1}</span>
                                                <div className="flex gap-4 text-zinc-900 dark:text-zinc-300 uppercase">
                                                    <span>{set.weight}kg</span>
                                                    <span>{set.reps} reps</span>
                                                    {set.rpe && <span className="font-black text-lime-500">RPE {set.rpe}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Notas e Creatina */}
                    <div className="flex flex-col gap-4">
                        {currentWorkout.description && (
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-2 mb-3 text-zinc-500">
                                    <MessageSquare size={14} className="text-lime-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">{t('feedbackNotes')}</span>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 italic font-medium leading-relaxed">
                                    "{currentWorkout.description}"
                                </p>
                            </div>
                        )}

                        <div className={`flex items-center gap-2 px-6 py-3 rounded-full w-fit mx-auto transition-all ${currentWorkout.usingCreatine ? 'bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                            {currentWorkout.usingCreatine ? <Trophy size={14} /> : <X size={14} />}
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {currentWorkout.usingCreatine ? t('creatineYes') : t('creatineNo')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}