'use client'

import { History } from "@/config/types";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "@/i18n/routing";
import { HistoryService } from "@/services/historyService";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronLeft, ChevronRight, Dumbbell, Search, } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { WorkoutHistoryModal } from "@/components/history/WorkoutHistoryModal";

export default function HistoryPage() {
    const t = useTranslations('History');
    const locale = useLocale();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedWorkouts, setSelectedWorkouts] = useState<History[] | null>(null);
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
                <WorkoutHistoryModal
                    selectedWorkouts={selectedWorkouts}
                    onClose={() => setSelectedWorkouts(null)}
                />
            )}

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}