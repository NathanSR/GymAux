"use client";

import { useEffect, useState, useCallback } from 'react';
import {
    Plus,
    Search,
    Edit,
    Clock,
    ClipboardList,
    CheckCircle2,
    XCircle,
    Loader2
} from 'lucide-react';
import { useRouter, Link } from '@/i18n/routing';
import { ScheduleService } from '@/services/scheduleService';
import { useLocale, useTranslations } from 'next-intl';
import { Schedule } from '@/config/types';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/utils/dateUtil';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import PageHeader from '@/components/ui/PageHeader';

interface SchedulesClientProps {
    initialSchedules: Schedule[];
    initialTotalCount: number;
    userId: string;
    baseUrl?: string;
}

export default function SchedulesClient({ initialSchedules, initialTotalCount, userId, baseUrl = '/schedules' }: SchedulesClientProps) {
    const router = useRouter();
    const t = useTranslations('ScheduleList');
    const locale = useLocale();

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Busca o array de labels traduzido (ex: ['D', 'S', 'T'...])
    const dayLabels = t.raw('dayLabels') as string[];

    // Função para buscar mais cronogramas
    const fetchMoreSchedules = useCallback(async (page: number, pageSize: number) => {
        try {
            const result = await ScheduleService.getSchedulesByUserId(
                userId,
                debouncedSearch,
                { page, limit: pageSize }
            );
            return result.schedules;
        } catch (error) {
            console.error("Error fetching more schedules:", error);
            return [];
        }
    }, [userId, debouncedSearch]);

    const [initialData, setInitialData] = useState<Schedule[]>(initialSchedules);

    const fetchFirstPage = useCallback(async () => {
        setLoading(true);
        try {
            const result = await ScheduleService.getSchedulesByUserId(
                userId,
                debouncedSearch,
                { page: 1, limit: 20 }
            );
            setInitialData(result.schedules);
        } catch (error: any) {
            console.error("Error fetching schedules:", error?.message || error);
        } finally {
            setLoading(false);
        }
    }, [userId, debouncedSearch]);

    useEffect(() => {
        // Skip initial load
        if (debouncedSearch === '' && initialData === initialSchedules) {
            return;
        }

        fetchFirstPage();
    }, [debouncedSearch, initialSchedules, fetchFirstPage]);

    // Handle online/visibility recovery
    useEffect(() => {
        const handleRecovery = () => {
            console.log('[SchedulesClient] App recovered, refreshing schedules...');
            fetchFirstPage();
        };

        window.addEventListener('online', handleRecovery);
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                handleRecovery();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('online', handleRecovery);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchFirstPage]);

    const { visibleData, isLoadingMore, lastItemRef } = useInfiniteScroll(initialData, {
        pageSize: 20,
        fetchData: fetchMoreSchedules,
        keyExtractor: (item) => item.id as string
    });

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-32 transition-colors">
            {/* Header */}
            <PageHeader
                title={t('title')}
                backHref={baseUrl === '/schedules' ? '/home' : `/trainer/${userId}`}
                rightAction={
                    <Link href={`${baseUrl}/new`} className="p-2 rounded-xl bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/20 active:scale-90 transition-transform">
                        <Plus size={24} />
                    </Link>
                }
            >
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder') || "Buscar cronogramas..."}
                        className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-lime-400 transition-all font-bold"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                        }}
                    />
                </div>
            </PageHeader>

            {/* Lista de Cards */}
            <main className="px-6 space-y-6 pt-6 mb-10">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-64 bg-white dark:bg-zinc-900 rounded-[32px] animate-pulse" />
                    ))
                ) : visibleData.length > 0 ? (
                    visibleData.map((schedule, index) => {
                        const activeDaysCount = schedule.workouts.filter((w: any) => w !== null).length;

                        return (
                            <div
                                key={schedule.id}
                                ref={index === visibleData.length - 1 ? lastItemRef : null}
                                className="block group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-6 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            {schedule.active ? (
                                                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-lime-500 tracking-widest">
                                                    <CheckCircle2 size={12} /> {t('active')}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                                                    <XCircle size={12} /> {t('inactive')}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-black leading-tight uppercase tracking-tight italic">
                                            {schedule.name || t('defaultName', { id: schedule.id?.substring(0, 8) as string })}
                                        </h3>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`${baseUrl}/${schedule.id}/edit`}
                                            className='w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-lime-500 hover:scale-105 transition-colors cursor-pointer'
                                        >
                                            <Edit size={18} />
                                        </Link>
                                    </div>
                                </div>

                                {/* Info de Datas */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <Clock size={14} className="text-zinc-300" />
                                    <div className="flex items-center gap-1 text-zinc-400 font-bold text-[10px]">
                                        <div>{formatDate(schedule.startDate, locale)}</div>
                                        <span>-</span>
                                        <div>{schedule.endDate ? formatDate(schedule.endDate, locale) : "..."}</div>
                                    </div>
                                </div>

                                {/* Visualização da Semana */}
                                <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-4">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 flex justify-between">
                                        <span>{t('weeklyRoutine')}</span>
                                        <span className="text-zinc-500 lowercase font-bold">
                                            {t('trainingDays', { count: activeDaysCount })}
                                        </span>
                                    </p>
                                    <div className="flex justify-between items-center">
                                        {dayLabels.map((label, index) => {
                                            const hasWorkout = schedule.workouts[index] !== null;
                                            const isLast = schedule.lastCompleted === index;

                                            return (
                                                <div key={index} className="flex flex-col items-center gap-2">
                                                    <span className="text-[10px] font-bold text-zinc-400">{label}</span>
                                                    <div
                                                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${hasWorkout
                                                            ? isLast
                                                                ? 'bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/40'
                                                                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                                                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 opacity-30'
                                                            }`}
                                                    >
                                                        {hasWorkout && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-20 text-center space-y-6">
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                            <ClipboardList size={32} />
                        </div>
                        <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">
                            {t('noSchedules')}
                        </p>
                    </div>
                )}

                {/* Loading More Indicator */}
                {isLoadingMore && (
                    <div className="flex justify-center py-4">
                        <Loader2 size={24} className="animate-spin text-lime-500" />
                    </div>
                )}
            </main>
        </div>
    );
}
