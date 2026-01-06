'use client'

import { History } from "@/config/types";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "@/i18n/routing";
import { HistoryService } from "@/services/historyService";
import { useLiveQuery } from "dexie-react-hooks";
import { Activity, ChevronLeft, ChevronRight, Clock, Dumbbell, MessageSquare, Scale, Search, Trophy, X } from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";

export default function HistoryPage() {

    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());

    const startMonthDate = moment().startOf('month').toDate();
    const endMonthDate = moment().endOf('month').toDate();
    const { activeUser } = useSession();

    const historyList = useLiveQuery(() =>
        HistoryService.getHistoryByRange(activeUser?.id ?? -1, startMonthDate, endMonthDate),
        [activeUser?.id]
    );

    const [selectedWorkouts, setSelectedWorkouts] = useState<History[] | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    const [workoutData, setWorkoutData] = useState<Record<string, History[]>>({});

    useEffect(() => {
        if (!historyList) return;

        const data: Record<string, History[]> = {};

        const filteredHistory = historyList.filter(hist => {
            return hist.workoutName.toLowerCase().includes(searchQuery.toLowerCase());
        });

        filteredHistory.forEach(h => {
            const dateKey = moment(h.date).format('YYYY-MM-DD');
            if (!data[dateKey]) data[dateKey] = [];
            data[dateKey].push(h);
        });

        setWorkoutData(data);
    }, [historyList, searchQuery]);

    const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = [];
        const totalDays = new Date(year, month + 1, 0).getDate();
        const offset = new Date(year, month, 1).getDay();

        for (let i = 0; i < offset; i++) {
            days.push(null);
        }

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

    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
    const yearDisplay = currentDate.getFullYear();

    const openModal = (workouts: History[]) => {
        setSelectedWorkouts(workouts);
        setActiveTab(0);
    };


    return <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-24 transition-colors">

        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => router.push('/home')}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="font-black text-lg uppercase tracking-tight text-center">Histórico de treinos</h1>
                <div className="p-3"></div>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                    type="text"
                    placeholder="Filtrar treinos..."
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </header>

        {/* Calendário */}
        <section className="p-6 space-y-4 max-w-lg mx-auto">
            <div className="flex items-center bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-2">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <span className="flex-1 font-black uppercase text-xs tracking-widest text-center italic">
                    {monthName} {yearDisplay}
                </span>
                <button onClick={handleNextMonth} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    {dayLabels.map(d => (
                        <div key={d} className="py-4 text-center text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
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
                                        <span className={`text-xs font-bold mb-1 ${hasWorkout ? 'text-lime-500' : 'text-zinc-400 dark:text-zinc-600'}`}>
                                            {item.day}
                                        </span>
                                        {hasWorkout && (
                                            <div className="flex -space-x-1">
                                                {item.workouts.slice(0, 2).map((_, i) => (
                                                    <div key={i} className="bg-lime-400 p-1 rounded-lg shadow-lg shadow-lime-500/30 border-2 border-white dark:border-zinc-900">
                                                        <Dumbbell size={10} className="text-zinc-950" />
                                                    </div>
                                                ))}
                                                {item.workouts.length > 2 && (
                                                    <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-black text-white">
                                                        +{item.workouts.length - 2}
                                                    </div>
                                                )}
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

        {/* Modal */}
        {selectedWorkouts && (
            <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center">
                <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setSelectedWorkouts(null)} />

                <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl z-10 overflow-hidden transition-all duration-300">
                    {selectedWorkouts.length > 1 && (
                        <div className="flex gap-2 p-4 pb-0 overflow-x-auto no-scrollbar">
                            {selectedWorkouts.map((w, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(idx)}
                                    className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all
                                            ${activeTab === idx ? 'bg-lime-400 text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}
                                >
                                    Treino {idx + 1}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative p-6 pb-0 flex justify-between items-start">
                        <div className="flex-1">
                            <span className="inline-block px-2 py-1 bg-lime-400/10 text-lime-500 text-[10px] font-black uppercase tracking-widest rounded mb-2">
                                {selectedWorkouts[activeTab].date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • Detalhes
                            </span>
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white leading-tight">
                                {selectedWorkouts[activeTab].workoutName}
                            </h2>
                        </div>
                        <button onClick={() => setSelectedWorkouts(null)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 max-h-[60vh] overflow-y-auto no-scrollbar space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                <Scale size={16} className="text-lime-500 mb-2" />
                                <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest">Peso Corporal</span>
                                <span className="text-sm font-bold">{selectedWorkouts[activeTab].weight || '--'} kg</span>
                            </div>
                            <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                                <Clock size={16} className="text-lime-500 mb-2" />
                                <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest">Duração</span>
                                <span className="text-sm font-bold">
                                    {selectedWorkouts[activeTab].endDate
                                        ? `${Math.floor((selectedWorkouts[activeTab].endDate.getTime() - selectedWorkouts[activeTab].date.getTime()) / 60000)} min`
                                        : '-- min'}
                                </span>
                            </div>
                        </div>

                        {(selectedWorkouts[activeTab].executions?.length || 0) > 0 && <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Exercícios Realizados</h3>

                            {selectedWorkouts[activeTab].executions?.map((ex, i) => (
                                <div key={i} className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-lime-400/20 flex items-center justify-center text-lime-500">
                                            <Activity size={16} />
                                        </div>
                                        <span className="text-sm font-black uppercase italic tracking-tight">{ex.exerciseName}</span>
                                    </div>

                                    <div className="space-y-2">
                                        {ex.sets.map((set, si) => (
                                            <div key={si} className="flex justify-between items-center text-[11px] font-bold bg-white dark:bg-zinc-900/50 px-4 py-3 rounded-2xl">
                                                <span className="text-zinc-400">Série {si + 1}</span>
                                                <div className="flex gap-4 text-zinc-900 dark:text-zinc-300 uppercase">
                                                    <span>{set.weight}kg</span>
                                                    <span>{set.reps} reps</span>
                                                    {set.rpe && <div className="flex items-center gap-1.5 min-w-[50px] justify-end">
                                                        <span className="text-[9px] text-zinc-500">RPE</span>
                                                        <span className={`font-black ${set.rpe >= 9 ? 'text-red-500' : 'text-lime-500'}`}>{set.rpe}</span>
                                                    </div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>}

                        {selectedWorkouts[activeTab].description && (
                            <div className="bg-zinc-100 dark:bg-zinc-800/50 p-5 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-2 mb-3 text-zinc-500">
                                    <MessageSquare size={14} className="text-lime-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Notas de Feedback</span>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 italic leading-relaxed font-medium">
                                    "{selectedWorkouts[activeTab].description}"
                                </p>
                            </div>
                        )}

                        {selectedWorkouts[activeTab].usingCreatine ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-lime-400 text-zinc-950 rounded-full w-fit mx-auto shadow-lg shadow-lime-500/20">
                                <Trophy size={14} />
                                <span className="text-[10px] font-black uppercase">Creatina no dia!</span>
                            </div>
                        ) : <div className="flex items-center gap-2 px-4 py-2  rounded-full w-fit mx-auto">
                            <X size={14} />
                            <span className="text-[10px] font-black uppercase">Sem Creatina!</span>
                        </div>}

                    </div>
                </div>
            </div>
        )}

        <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

    </div>
}