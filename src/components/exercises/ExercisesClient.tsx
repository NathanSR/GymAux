"use client";

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Search, Dumbbell, Info, PlayCircle, Plus, Edit, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { ExerciseService } from '@/services/exerciseService';
import { useDebounce } from '@/hooks/useDebounce';
import { CATEGORIES } from '@/config/constants';
import { Exercise } from '@/config/types';
import { Pagination } from '@/components/ui/Pagination';

interface ExercisesClientProps {
    initialExercises: Exercise[];
    initialTotalCount: number;
}

export default function ExercisesClient({ initialExercises, initialTotalCount }: ExercisesClientProps) {
    const router = useRouter();

    // Estados de interface
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
    const [loading, setLoading] = useState(false);

    // Paginação
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalCount, setTotalCount] = useState(initialTotalCount);

    // Debounce de 300ms para a busca
    const debouncedSearch = useDebounce(searchQuery, 300);

    const t = useTranslations('ExerciseList');
    const te = useTranslations('Exercises');
    const tt = useTranslations('Tags');
    const tc = useTranslations('Categories');

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        setPage(1); // Resetar para primeira página ao buscar
    };

    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        setPage(1); // Resetar para primeira página ao mudar categoria
    };

    const categories = useMemo(() => {
        return ['all', ...CATEGORIES];
    }, []);

    useEffect(() => {
        // Se for o carregamento inicial (primeira página, sem filtros), não bucar de novo
        if (page === 1 && selectedCategory === 'all' && debouncedSearch === '' && exercises === initialExercises) {
            return;
        }

        const fetchExercises = async () => {
            setLoading(true);
            try {
                const result = await ExerciseService.getAllExercises({
                    searchQuery: debouncedSearch,
                    category: selectedCategory,
                    pagination: { page, limit },
                    translations: { te, tt }
                });
                setExercises(result.exercises);
                setTotalCount(result.totalCount);
            } catch (error) {
                console.error("Error fetching exercises:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, [debouncedSearch, selectedCategory, page, limit, te, tt, initialExercises]);

    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300 font-sans pb-10">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => router.push('/home')} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 cursor-pointer">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="font-black text-lg uppercase tracking-tight">{t('title')}</h1>
                    <button onClick={() => router.push('/exercises/new')} className="p-2 rounded-xl bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/20 active:scale-90 transition-transform cursor-pointer">
                        <Plus size={24} />
                    </button>
                </div>

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
            </header>

            <main className="p-6">
                {/* Categorias */}
                <section className="mb-8 overflow-x-auto no-scrollbar flex gap-2 pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat
                                ? 'bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/20'
                                : 'bg-white dark:bg-zinc-900 text-zinc-400 border border-zinc-100 dark:border-zinc-800'
                                }`}
                        >
                            {tc(cat)}
                        </button>
                    ))}
                </section>

                {/* Listagem */}
                <div className="grid grid-cols-1 gap-4 mb-10">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-[32px] animate-pulse" />
                        ))
                    ) : exercises && exercises.length > 0 ? (
                        exercises.map(exercise => (
                            <div
                                key={exercise.id}
                                className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-5 shadow-sm transition-all overflow-hidden"
                            >
                                <div className="flex gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center shrink-0 overflow-hidden relative">
                                        <Dumbbell size={20} className="text-zinc-300 dark:text-zinc-800" />
                                        {exercise.mediaUrl && (
                                            <div className="absolute inset-0 bg-lime-500/10 flex items-center justify-center">
                                                <PlayCircle size={18} className="text-lime-600 dark:text-lime-400" />
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
                                    <button
                                        onClick={() => router.push(`/exercises/${exercise.id}`)}
                                        className="flex-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Eye size={14} />
                                        {t('viewDetails')}
                                    </button>

                                    {(isNaN(Number(exercise.id)) || Number(exercise.id) >= 1000) && (
                                        <button
                                            onClick={() => router.push(`/exercises/${exercise.id}/edit`)}
                                            className="bg-lime-400 hover:bg-lime-500 text-zinc-950 px-4 py-3 rounded-2xl transition-colors flex items-center justify-center"
                                            title={t('edit')}
                                        >
                                            <Edit size={16} />
                                        </button>
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
                </div>
            </main>

            {/* Paginação */}
            <div className="fixed bottom-0 left-0 right-0 z-40">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    limit={limit}
                    onLimitChange={(l) => {
                        setLimit(l);
                        setPage(1);
                    }}
                    totalCount={totalCount}
                />
            </div>
        </div>
    );
}
