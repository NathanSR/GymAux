"use client";

import { History } from "@/config/types";
import { useRouter } from "@/i18n/routing";
import { HistoryService } from "@/services/historyService";
import { ChevronLeft, ChevronRight, Dumbbell, Search } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { WorkoutHistoryModal } from "@/components/history/WorkoutHistoryModal";
import { useDebounce } from "@/hooks/useDebounce";

interface HistoryClientProps {
    userId: string;
    initialHistoryList: History[];
    initialDate?: string;
    initialWorkoutId?: string;
    baseUrl?: string;
}

export default function HistoryClient({
    userId, initialHistoryList, initialDate, initialWorkoutId, baseUrl = '/history'
}: HistoryClientProps) {
    const t = useTranslations('History');
    const locale = useLocale();
    const router = useRouter();

    // States
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [currentDate, setCurrentDate] = useState(() => initialDate ? new Date(initialDate) : new Date());
    const [selectedWorkouts, setSelectedWorkouts] = useState<History[] | null>(null);
    const [historyList, setHistoryList] = useState<History[]>(initialHistoryList);
    const [loading, setLoading] = useState(false);
    const [hasOpenedInitial, setHasOpenedInitial] = useState(false);

    // Date Helpers
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const startMonthDate = useMemo(() => new Date(year, month, 1), [year, month]);
    const endMonthDate = useMemo(() => new Date(year, month + 1, 0), [year, month]);

    // Grouping data (Memoized to prevent unnecessary re-renders)
    const workoutData = useMemo(() => {
        const data: Record<string, History[]> = {};
        const filtered = historyList.filter(h =>
            h.workoutName.toLowerCase().includes(debouncedSearch.toLowerCase())
        );

        filtered.forEach(h => {
            const dateKey = new Date(h.date).toISOString().split('T')[0];
            if (!data[dateKey]) data[dateKey] = [];
            data[dateKey].push(h);
        });
        return data;
    }, [historyList, debouncedSearch]);

    // Fetch Logic
    useEffect(() => {
        const isCurrentMonth = () => {
            const now = new Date();
            return month === now.getMonth() && year === now.getFullYear();
        };

        if (isCurrentMonth() && historyList === initialHistoryList) return;

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const list = await HistoryService.getHistoryByRange(userId, startMonthDate, endMonthDate);
                setHistoryList(list || []);
            } catch (error: any) {
                console.error("Error fetching history:", error?.message || error);
                setHistoryList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userId, month, year, startMonthDate.toISOString(), endMonthDate.toISOString()]);

    // Auto-open logic for deep links
    useEffect(() => {
        if (!hasOpenedInitial && initialDate && initialWorkoutId && Object.keys(workoutData).length > 0) {
            const dateKey = new Date(initialDate).toISOString().split('T')[0];
            const workoutsAtDate = workoutData[dateKey];

            if (workoutsAtDate?.some(w => String(w.workoutId) === initialWorkoutId || String(w.id) === initialWorkoutId)) {
                setSelectedWorkouts(workoutsAtDate);
            }
            setHasOpenedInitial(true);
        }
    }, [hasOpenedInitial, initialDate, initialWorkoutId, workoutData]);

    // Calendar Generation
    const calendarDays = useMemo(() => {
        const days = [];
        const totalDays = new Date(year, month + 1, 0).getDate();
        const offset = new Date(year, month, 1).getDay();

        for (let i = 0; i < offset; i++) days.push(null);
        for (let i = 1; i <= totalDays; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({ day: i, date: dateStr, workouts: workoutData[dateStr] || [] });
        }
        return days;
    }, [year, month, workoutData]);

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(year, month + offset, 1));
    };

    const handleCloseModal = () => {
        setSelectedWorkouts(null);
        if (initialWorkoutId) router.replace(baseUrl);
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-24 transition-colors">
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => router.push(baseUrl === '/history' ? '/home' : `/trainer/${userId}`)}
                        className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 active:scale-95 transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-400">{t('title')}</h1>
                    <div className="w-10" />
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input type="text" placeholder={t('filterPlaceholder')}
                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
            </header>

            <section className="p-6 space-y-4 max-w-lg mx-auto">
                <div className="flex items-center bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-zinc-100 dark:border-zinc-800 p-2">
                    <button onClick={() => changeMonth(-1)} className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors"><ChevronLeft size={18} /></button>
                    <span className="flex-1 font-black uppercase text-[10px] tracking-[0.2em] text-center italic text-lime-500">
                        {currentDate.toLocaleString(locale, { month: 'long' })} {year}
                    </span>
                    <button onClick={() => changeMonth(1)} className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors"><ChevronRight size={18} /></button>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
                    <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        {(t.raw('dayLabels') as string[]).map((d, i) => (
                            <div key={i} className="py-4 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {calendarDays.map((item, idx) => {
                            const hasWorkout = !!item?.workouts.length;
                            return (
                                <div key={idx} onClick={() => hasWorkout && setSelectedWorkouts(item.workouts)}
                                    className={`aspect-square border-b border-r border-zinc-50 dark:border-zinc-800/50 p-1 flex flex-col items-center justify-center relative transition-all
                                    ${!item ? 'bg-zinc-50/20 dark:bg-zinc-950/20' : 'hover:bg-lime-400/5 dark:hover:bg-lime-400/10 cursor-pointer'}`}>
                                    {item && (
                                        <>
                                            <span className={`text-[11px] font-black mb-1 ${hasWorkout ? 'text-lime-500' : 'text-zinc-300 dark:text-zinc-700'}`}>{item.day}</span>
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
                {loading && <div className="text-center py-4"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500" /></div>}
            </section>

            {selectedWorkouts && (
                <WorkoutHistoryModal
                    selectedWorkouts={selectedWorkouts}
                    onClose={handleCloseModal}
                    initialActiveWorkoutId={initialWorkoutId}
                />
            )}
        </div>
    );
}