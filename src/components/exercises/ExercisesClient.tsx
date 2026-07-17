"use client";

import { useEffect, useMemo, useState, useCallback } from 'react';
import { Search, Dumbbell, Info, PlayCircle, Plus, Edit, Eye, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ExerciseService } from '@/services/exerciseService';
import { useDebounce } from '@/hooks/useDebounce';
import { CATEGORIES, CATEGORY_METADATA } from '@/config/constants';
import { Exercise } from '@/config/types';
import { useSession } from '@/hooks/useSession';
import PageHeader from '@/components/ui/PageHeader';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ExerciseFilterPanel } from './ExerciseFilterPanel';

interface ExercisesClientProps {
    initialExercises: Exercise[];
    initialTotalCount: number;
}

export default function ExercisesClient({ initialExercises, initialTotalCount }: ExercisesClientProps) {
    const { activeUser } = useSession();

    // Estados de interface
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedEquipment, setSelectedEquipment] = useState('all');
    const [loading, setLoading] = useState(false);

    // Debounce de 300ms para a busca
    const debouncedSearch = useDebounce(searchQuery, 300);

    const t = useTranslations('ExerciseList');
    const te = useTranslations('Exercises');
    const tt = useTranslations('Tags');
    const tc = useTranslations('Categories');

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
    };

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
    };

    // Função para buscar dados da próxima página
    const fetchMoreExercises = useCallback(async (page: number, pageSize: number) => {
        try {
            const result = await ExerciseService.getAllExercises({
                searchQuery: debouncedSearch,
                category: selectedCategory,
                equipment: selectedEquipment,
                pagination: { page, limit: pageSize },
                translations: { te, tt }
            });
            return result.exercises;
        } catch (error) {
            console.error("Error fetching more exercises:", error);
            return [];
        }
    }, [debouncedSearch, selectedCategory, selectedEquipment, te, tt]);

    // Estados locais para controlar a data inicial que será passada para o hook
    const [initialData, setInitialData] = useState<Exercise[]>(initialExercises);

    const fetchFirstPage = useCallback(async () => {
        setLoading(true);
        try {
            const result = await ExerciseService.getAllExercises({
                searchQuery: debouncedSearch,
                category: selectedCategory,
                equipment: selectedEquipment,
                pagination: { page: 1, limit: 20 },
                translations: { te, tt }
            });
            setInitialData(result.exercises);
        } catch (error: any) {
            console.error("Error fetching exercises:", error?.message || error);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, selectedCategory, selectedEquipment, te, tt]);

    useEffect(() => {
        setInitialData(initialExercises);
    }, [initialExercises]);

    // Efeito para lidar com filtros e resetar a lista
    useEffect(() => {
        // Se for o carregamento inicial (primeira página, sem filtros), não bucar de novo
        if (selectedCategory === 'all' && selectedEquipment === 'all' && debouncedSearch === '' && initialData === initialExercises) {
            return;
        }

        fetchFirstPage();
    }, [debouncedSearch, selectedCategory, selectedEquipment, initialExercises, fetchFirstPage]);

    // Handle online/visibility recovery
    useEffect(() => {
        const handleRecovery = () => {
            console.log('[ExercisesClient] App recovered, refreshing exercises...');
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

    // Hook de Scroll Infinito
    const { visibleData, isLoadingMore, lastItemRef } = useInfiniteScroll(initialData, {
        pageSize: 20,
        fetchData: fetchMoreExercises,
        keyExtractor: (item) => item.id as number
    });

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300 font-sans pb-32">
            {/* Header */}
            <PageHeader
                title={t('title')}
                backHref="/home"
                rightAction={
                    <Link href="/exercises/new" className="p-2 rounded-xl bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/20 active:scale-90 transition-transform flex items-center justify-center">
                        <Plus size={24} />
                    </Link>
                }
            >
                <div className="relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery.startsWith('#') ? 'text-lime-500' : 'text-zinc-400'}`} size={18} />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        className={`w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 transition-all ${searchQuery.startsWith('#') ? 'focus:ring-lime-400 ring-2 ring-lime-400/20' : 'focus:ring-lime-400'}`}
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    {searchQuery.startsWith('#') && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-lime-600 uppercase tracking-tighter bg-lime-100 dark:bg-lime-900/30 px-2 py-1 rounded-md">
                            {t("filteringByTag")}
                        </span>
                    )}
                </div>
            </PageHeader>

            <main className="p-6">
                <ExerciseFilterPanel
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedEquipment={selectedEquipment}
                    onEquipmentChange={setSelectedEquipment}
                    className="mb-6"
                />

                {/* Listagem */}
                <div className="grid grid-cols-1 gap-4 mb-10">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-[32px] animate-pulse" />
                        ))
                    ) : visibleData.length > 0 ? (
                        visibleData.map((exercise, index) => (
                            <div
                                key={exercise.id}
                                ref={index === visibleData.length - 1 ? lastItemRef : null}
                                className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-5 shadow-sm transition-all overflow-hidden"
                            >
                                <div className="flex gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 flex items-center justify-center shrink-0 overflow-hidden relative p-1">
                                        {exercise.category && CATEGORY_METADATA[exercise.category] ? (
                                            <>
                                                <img
                                                    src={CATEGORY_METADATA[exercise.category].imagePath}
                                                    alt={tc(exercise.category)}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        const icon = e.currentTarget.nextElementSibling;
                                                        if (icon) icon.classList.remove('hidden');
                                                    }}
                                                />
                                                <Dumbbell size={24} className="text-zinc-300 dark:text-zinc-800 hidden" />
                                            </>
                                        ) : (
                                            <Dumbbell size={24} className="text-zinc-300 dark:text-zinc-800" />
                                        )}
                                        {exercise.mediaUrl && (
                                            <div className="absolute right-1 bottom-1 w-5 h-5 bg-lime-400 text-zinc-950 rounded-full flex items-center justify-center shadow-md">
                                                <PlayCircle size={12} className="fill-current text-zinc-950" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-black uppercase text-lime-600 dark:text-lime-400 tracking-widest mb-0.5 block">
                                            {tc(exercise.category)}
                                        </span>
                                        <h3 className="font-black text-base truncate">
                                            {te.has(exercise.name) ? te(exercise.name) : exercise.name}
                                        </h3>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                            {te.has(exercise.description as string) ? te(exercise.description as string) : exercise.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-5">
                                    <Link
                                        href={`/exercises/${exercise.id}`}
                                        className="flex-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Eye size={14} />
                                        {t('viewDetails')}
                                    </Link>

                                    {(exercise.created_by === activeUser?.id) && (
                                        <Link
                                            href={`/exercises/${exercise.id}/edit`}
                                            className="bg-lime-400 hover:bg-lime-500 text-zinc-950 px-4 py-3 rounded-2xl transition-colors flex items-center justify-center"
                                            title={t('edit')}
                                        >
                                            <Edit size={16} />
                                        </Link>
                                    )}
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
                </div>
            </main>
        </div>
    );
}
