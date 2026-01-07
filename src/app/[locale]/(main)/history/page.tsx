'use client'

import { History } from "@/config/types";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "@/i18n/routing";
import { HistoryService } from "@/services/historyService";
import { useLiveQuery } from "dexie-react-hooks";
import { Activity, ChevronLeft, ChevronRight, Clock, Dumbbell, MessageSquare, Scale, Search, Trophy, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export default function HistoryPage() {
    const t = useTranslations('History');
    const te = useTranslations('Exercises');
    const locale = useLocale();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedWorkouts, setSelectedWorkouts] = useState<History[] | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [workoutData, setWorkoutData] = useState<Record<string, History[]>>({});

    const { activeUser } = useSession();

    // Cálculo de range de data simplificado
    const startMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const historyList = useLiveQuery(() =>
        HistoryService.getHistoryByRange(activeUser?.id ?? -1, startMonthDate, endMonthDate),
        [activeUser?.id, currentDate] // Recarrega ao mudar o mês
    );

    useEffect(() => {
        if (!historyList) return;
        const data: Record<string, History[]> = {};

        const filteredHistory = historyList.filter(hist =>
            hist.workoutName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        filteredHistory.forEach(h => {
            const d = new Date(h.date);
            const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (!data[dateKey]) data[dateKey] = [];
            data[dateKey].push(h);
        });

        setWorkoutData(data);
    }, [historyList, searchQuery]);

    const dayLabels = t.raw('dayLabels') as string[];

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = [];
        const totalDays = new Date(year, month + 1, 0).getDate();
        const offset = new Date(year, month, 1).getDay();

        for (let i = 0; i < offset; i++) days.push(null);

        for (let i = 1; i <= totalDays; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({
                day: i,
                date: dateStr,
                workouts: workoutData[dateStr] || []
            });
        }
        return days;
    }, [currentDate, workoutData]);

    const monthName = currentDate.toLocaleString(locale, { month: 'long' });
    const yearDisplay = currentDate.getFullYear();

    const openModal = (workouts: History[]) => {
        setSelectedWorkouts(workouts);
        setActiveTab(0);
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-24 transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => router.push('/home')}
                        className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 cursor-pointer active:scale-90 transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-400">{t('title')}</h1>
                    <div className="w-10"></div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('filterPlaceholder')}
                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            {/* Calendário */}
            <section className="p-6 space-y-4 max-w-lg mx-auto">
                <div className="flex items-center bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-zinc-100 dark:border-zinc-800 p-2">
                    <button onClick={handlePrevMonth} className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors">
                        <ChevronLeft size={18} />
                    </button>
                    <span className="flex-1 font-black uppercase text-[10px] tracking-[0.2em] text-center italic text-lime-500">
                        {monthName} {yearDisplay}
                    </span>
                    <button onClick={handleNextMonth} className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors">
                        <ChevronRight size={18} />
                    </button>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-xl shadow-zinc-200/20 dark:shadow-none border border-zinc-100 dark:border-zinc-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        {dayLabels.map((d, i) => (
                            <div key={i} className="py-4 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {calendarDays.map((item, idx) => {
                            const hasWorkout = item && item.workouts.length > 0;
                            return (
                                <div
                                    key={idx}
                                    className={`aspect-square border-b border-r border-zinc-50 dark:border-zinc-800/50 p-1 flex flex-col items-center justify-center relative transition-all
                                        ${!item ? 'bg-zinc-50/20 dark:bg-zinc-950/20' : 'hover:bg-lime-400/5 dark:hover:bg-lime-400/10 cursor-pointer'}`}
                                    onClick={() => hasWorkout && openModal(item.workouts)}
                                >
                                    {item && (
                                        <>
                                            <span className={`text-[11px] font-black mb-1 ${hasWorkout ? 'text-lime-500' : 'text-zinc-300 dark:text-zinc-700'}`}>
                                                {item.day}
                                            </span>
                                            {hasWorkout && (
                                                <div className="flex -space-x-1">
                                                    {item.workouts.slice(0, 2).map((_, i) => (
                                                        <div key={i} className="bg-lime-400 p-1 rounded-lg border-2 border-white dark:border-zinc-900">
                                                            <Dumbbell size={8} className="text-zinc-950" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Modal de Detalhes */}
            {selectedWorkouts && (
                <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center">
                    <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedWorkouts(null)} />

                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl z-10 overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
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

                        <div className="p-8 pb-0 flex justify-between items-start">
                            <div className="flex-1">
                                <span className="inline-block px-2 py-1 bg-lime-400/10 text-lime-500 text-[10px] font-black uppercase tracking-widest rounded mb-2">
                                    {new Date(selectedWorkouts[activeTab].date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} • {t('details')}
                                </span>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white leading-tight">
                                    {selectedWorkouts[activeTab].workoutName}
                                </h2>
                            </div>
                            <button onClick={() => setSelectedWorkouts(null)} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 active:scale-90 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
                                    <Scale size={16} className="text-lime-500 mb-2" />
                                    <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('bodyWeight')}</span>
                                    <span className="text-sm font-black">{selectedWorkouts[activeTab].weight || '--'} kg</span>
                                </div>
                                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
                                    <Clock size={16} className="text-lime-500 mb-2" />
                                    <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('duration')}</span>
                                    <span className="text-sm font-black">
                                        {selectedWorkouts[activeTab].endDate
                                            ? `${Math.floor((new Date(selectedWorkouts[activeTab].endDate).getTime() - new Date(selectedWorkouts[activeTab].date).getTime()) / 60000)} min`
                                            : '-- min'}
                                    </span>
                                </div>
                            </div>

                            {(selectedWorkouts[activeTab].executions?.length || 0) > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{t('performedExercises')}</h3>
                                    {selectedWorkouts[activeTab].executions?.map((ex, i) => (
                                        <div key={i} className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-xl bg-lime-400 text-zinc-950 flex items-center justify-center">
                                                    <Activity size={16} />
                                                </div>
                                                <span className="text-sm font-black uppercase italic tracking-tight">{te.has(ex.exerciseName) ? te(ex.exerciseName) : ex.exerciseName}</span>
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

                            {/* Creatina e Notas */}
                            <div className="flex flex-col gap-4">
                                {selectedWorkouts[activeTab].description && (
                                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-2 mb-3 text-zinc-500">
                                            <MessageSquare size={14} className="text-lime-500" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{t('feedbackNotes')}</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic font-medium leading-relaxed">
                                            "{selectedWorkouts[activeTab].description}"
                                        </p>
                                    </div>
                                )}

                                <div className={`flex items-center gap-2 px-6 py-3 rounded-full w-fit mx-auto transition-all ${selectedWorkouts[activeTab].usingCreatine ? 'bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                                    {selectedWorkouts[activeTab].usingCreatine ? <Trophy size={14} /> : <X size={14} />}
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {selectedWorkouts[activeTab].usingCreatine ? t('creatineYes') : t('creatineNo')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}