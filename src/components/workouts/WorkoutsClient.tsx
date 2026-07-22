"use client";

import { useEffect, useState, useCallback } from 'react';
import {
    Plus,
    Search,
    Calendar,
    Edit,
    Play,
    Info,
    Dumbbell,
    Loader2
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { WorkoutService } from '@/services/workoutService';
import { useSessionActions } from '@/hooks/useSessionActions';
import { useTranslations, useLocale } from 'next-intl';
import { Workout } from '@/config/types';
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import PageHeader from '@/components/ui/PageHeader';
import { ListSkeleton } from '@/components/ui/Skeleton';

interface WorkoutsClientProps {
    initialWorkouts: Workout[];
    initialTotalCount: number;
    userId: string;
    baseUrl?: string;
    isSessionLoading?: boolean;
}

export default function WorkoutsClient({ initialWorkouts, initialTotalCount, userId, baseUrl = '/workouts', isSessionLoading = false }: WorkoutsClientProps) {
    const { startWorkout } = useSessionActions();
    const locale = useLocale();

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const debouncedSearch = useDebounce(searchQuery, 300);
    const t = useTranslations('WorkoutList');

    // Função para buscar mais treinos
    const fetchMoreWorkouts = useCallback(async (page: number, pageSize: number) => {
        try {
            const result = await WorkoutService.getWorkoutsByUserId(
                userId,
                debouncedSearch,
                { page, limit: pageSize }
            );
            // @ts-ignore
            return result.workouts;
        } catch (error) {
            console.error("Error fetching more workouts:", error);
            return [];
        }
    }, [userId, debouncedSearch]);

    const [initialData, setInitialData] = useState<Workout[]>(initialWorkouts);

    const fetchFirstPage = useCallback(async () => {
        setLoading(true);
        try {
            const result = await WorkoutService.getWorkoutsByUserId(
                userId,
                debouncedSearch,
                { page: 1, limit: 20 }
            );
            // @ts-ignore
            setInitialData(result.workouts);
        } catch (error: any) {
            console.error("Error fetching workouts:", error?.message || error);
        } finally {
            setLoading(false);
        }
    }, [userId, debouncedSearch]);

    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setInitialData(initialWorkouts);
        }
    }, [initialWorkouts, debouncedSearch]);

    useEffect(() => {
        // Se a busca estiver vazia, os dados iniciais providos por props/Dexie já são utilizados
        if (!debouncedSearch.trim()) {
            setInitialData(initialWorkouts);
            return;
        }

        fetchFirstPage();
    }, [debouncedSearch, fetchFirstPage]);

    // Handle online/visibility recovery (somente se houver busca ativa)
    useEffect(() => {
        const handleRecovery = () => {
            if (debouncedSearch !== '') {
                console.log('[WorkoutsClient] App recovered, refreshing search results...');
                fetchFirstPage();
            }
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
    }, [debouncedSearch, fetchFirstPage]);

    const { visibleData, isLoadingMore, lastItemRef } = useInfiniteScroll(initialData, {
        pageSize: 20,
        fetchData: fetchMoreWorkouts,
        keyExtractor: (item) => item.id as string
    });

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-32 transition-colors">
            {/* Header */}
            <PageHeader
                title={t('title')}
                backHref={baseUrl === '/workouts' ? '/home' : `/trainer/${userId}`}
                rightAction={
                    <Link
                        href={`${baseUrl}/new`}
                        className="p-2 rounded-xl bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/20 active:scale-90 transition-transform cursor-pointer"
                    >
                        <Plus size={24} />
                    </Link>
                }
            >
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder') || "Buscar treinos..."}
                        className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-lime-400 transition-all font-bold"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                        }}
                    />
                </div>
            </PageHeader>

            {/* Grid de Treinos */}
            <main className="px-6 space-y-4 pt-4">
                {loading || isSessionLoading ? (
                    <ListSkeleton count={4} />
                ) : visibleData.length > 0 ? (
                    visibleData.map((workout, index) => (
                        <div
                            key={workout.id}
                            ref={index === visibleData.length - 1 ? lastItemRef : null}
                            className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-lime-400/10 text-lime-600 dark:text-lime-400 text-[10px] font-black uppercase tracking-wider rounded-md">
                                            {t('exercisesCount', { count: workout?.exercises?.length || 0 })}
                                        </span>
                                        <span className="text-[10px] font-bold text-zinc-300 dark:text-zinc-600">•</span>
                                        <div className="flex items-center gap-1 text-zinc-400 font-bold text-[10px] uppercase">
                                            <Calendar size={10} />
                                            {new Intl.DateTimeFormat(locale).format(new Date(workout.createdAt))}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black leading-tight text-zinc-900 dark:text-zinc-100 italic uppercase tracking-tighter">
                                        {workout.name}
                                    </h3>
                                </div>

                                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400">
                                    <Dumbbell size={20} />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => startWorkout(workout)}
                                    className="flex-[2] flex items-center justify-center gap-3 bg-lime-400 hover:bg-lime-500 text-zinc-950 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all active:scale-95 shadow-lg shadow-lime-500/20"
                                >
                                    <Play size={16} fill="currentColor" />
                                    {t('train')}
                                </button>

                                <Link
                                    href={`${baseUrl}/${workout.id}/edit`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-300 py-4 rounded-2xl font-bold text-xs uppercase transition-all active:scale-95 border border-zinc-200/50 dark:border-zinc-700/50"
                                >
                                    <Edit size={16} />
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                        <Info size={40} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium">{t('noResults')}</p>
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
