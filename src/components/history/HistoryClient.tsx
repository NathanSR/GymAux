"use client";

import { HistoryCalendar } from "@/components/history/HistoryCalendar";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { WorkoutHistoryModal } from "@/components/history/WorkoutHistoryModal";
import { useDebounce } from "@/hooks/useDebounce";
import PageHeader from "@/components/ui/PageHeader";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/config/db";
import { History } from "@/config/types";
import { useRouter } from "@/i18n/routing";
import { HistoryService } from "@/services/historyService";

interface HistoryClientProps {
    userId: string;
    initialHistoryList: History[];
    initialDate?: string;
    initialWorkoutId?: string;
    baseUrl?: string;
    isSessionLoading?: boolean;
}

export default function HistoryClient({
    userId,
    initialHistoryList,
    initialDate,
    initialWorkoutId,
    baseUrl = '/history',
    isSessionLoading = false
}: HistoryClientProps) {
    const t = useTranslations('History');
    const locale = useLocale();
    const router = useRouter();

    // States
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [currentDate, setCurrentDate] = useState(() => initialDate ? new Date(initialDate) : new Date());
    const [selectedWorkouts, setSelectedWorkouts] = useState<History[] | null>(null);
    const [remoteHistoryList, setRemoteHistoryList] = useState<History[]>([]);
    const [hasOpenedInitial, setHasOpenedInitial] = useState(false);

    // Date Helpers
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const startMonthDate = useMemo(() => new Date(year, month, 1, 0, 0, 0, 0), [year, month]);
    const endMonthDate = useMemo(() => new Date(year, month + 1, 0, 23, 59, 59, 999), [year, month]);

    // Live query from Dexie for current month range
    const dexieMonthHistory = useLiveQuery(
        async () => {
            if (!userId) return [];
            const all = await db.history
                .where('userId')
                .equals(userId)
                .toArray();
            const start = startMonthDate.getTime();
            const end = endMonthDate.getTime();
            return all.filter(h => {
                const d = new Date(h.date).getTime();
                return d >= start && d <= end;
            });
        },
        [userId, startMonthDate.getTime(), endMonthDate.getTime()]
    );

    const isDexieLoading = dexieMonthHistory === undefined;
    const hasAnyData = (initialHistoryList && initialHistoryList.length > 0) || (dexieMonthHistory && dexieMonthHistory.length > 0) || remoteHistoryList.length > 0;
    const isInitialLoading = isSessionLoading || (isDexieLoading && !hasAnyData);

    // Merge initialHistoryList, Dexie live query results, and remote fetches
    const historyList = useMemo(() => {
        const map = new Map<string, History>();
        (initialHistoryList || []).forEach(h => {
            const key = h.id || `${h.workoutId}-${new Date(h.date).getTime()}`;
            map.set(key, h);
        });
        (dexieMonthHistory || []).forEach(h => {
            const key = h.id || `${h.workoutId}-${new Date(h.date).getTime()}`;
            map.set(key, h);
        });
        (remoteHistoryList || []).forEach(h => {
            const key = h.id || `${h.workoutId}-${new Date(h.date).getTime()}`;
            map.set(key, h);
        });
        return Array.from(map.values());
    }, [initialHistoryList, dexieMonthHistory, remoteHistoryList]);

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

    // Fetch Logic para atualização remota em segundo plano
    useEffect(() => {
        let isSubscribed = true;
        const fetchHistory = async () => {
            try {
                const list = await HistoryService.getHistoryByRange(userId, startMonthDate, endMonthDate);
                if (isSubscribed) {
                    setRemoteHistoryList(list || []);
                }
            } catch (error: any) {
                console.error("Error fetching history:", error?.message || error);
            }
        };

        if (userId) {
            fetchHistory();
        }
        return () => {
            isSubscribed = false;
        };
    }, [userId, startMonthDate, endMonthDate]);

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

    const dayLabels = (t.raw('dayLabels') as string[]) || ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const isTrainerMode = Boolean(baseUrl?.startsWith('/trainer'));

    return (
        <div className={isTrainerMode ? "flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-10 transition-colors duration-300" : "min-h-dvh bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-10 transition-colors duration-300"}>
            <PageHeader
                title={t('title')}
                variant="minimal"
                backHref={baseUrl === '/history' || !baseUrl ? '/home' : baseUrl.replace(/\/history$/, '')}
            >
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input type="text" placeholder={t('filterPlaceholder')}
                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
            </PageHeader>

            <section className="p-6">
                <HistoryCalendar
                    currentDate={currentDate}
                    onMonthChange={changeMonth}
                    calendarDays={calendarDays}
                    loading={isInitialLoading}
                    onSelectDay={setSelectedWorkouts}
                    dayLabels={dayLabels}
                    locale={locale}
                />
            </section>

            <WorkoutHistoryModal
                selectedWorkouts={selectedWorkouts}
                onClose={handleCloseModal}
                initialActiveWorkoutId={initialWorkoutId}
            />
        </div>
    );
}