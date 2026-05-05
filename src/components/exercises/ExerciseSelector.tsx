import { CATEGORIES } from '@/config/constants';
import { Exercise } from '@/config/types';
import { ExerciseService } from '@/services/exerciseService';
import {
    Search,
    Dumbbell,
    X,
    ArrowRight,
    Info,
    Loader2
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export const ExerciseSelector = ({ isOpen, onClose, onSelect }: {
    isOpen: boolean,
    onClose: () => void,
    onSelect: (exercise: Exercise) => void
}) => {
    // Namespace específico para a interface do seletor
    const t = useTranslations('ExerciseSelector');
    // Namespace geral para buscar nomes de exercícios e categorias traduzidos
    const te = useTranslations('Exercises');
    const tc = useTranslations('Categories');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const [initialData, setInitialData] = useState<Exercise[]>([]);

    // Função para buscar dados da próxima página
    const fetchMoreExercises = useCallback(async (page: number, pageSize: number) => {
        try {
            const res = await ExerciseService.getAllExercises({
                searchQuery: debouncedSearchTerm,
                category: selectedCategory,
                pagination: { page, limit: pageSize },
                translations: { te, tt: te }
            });
            return res.exercises;
        } catch (error) {
            console.error('Error fetching more exercises:', error);
            return [];
        }
    }, [debouncedSearchTerm, selectedCategory, te]);

    useEffect(() => {
        if (isOpen) {
            const fetchFirstPage = async () => {
                setIsLoading(true);
                try {
                    const res = await ExerciseService.getAllExercises({
                        searchQuery: debouncedSearchTerm,
                        category: selectedCategory,
                        pagination: { page: 1, limit: 10 },
                        translations: { te, tt: te }
                    });
                    setInitialData(res.exercises);
                } catch (error: any) {
                    console.error('Error fetching exercises:', error?.message || error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchFirstPage();
        }
    }, [isOpen, debouncedSearchTerm, selectedCategory, te]);

    // Hook de Scroll Infinito
    const { visibleData: exercises, isLoadingMore, lastItemRef } = useInfiniteScroll(initialData, {
        pageSize: 10,
        fetchData: fetchMoreExercises,
        keyExtractor: (item) => item.id as number
    });

    const categories = useMemo(() => {
        return ['all', ...CATEGORIES];
    }, []);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-950 w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[80vh] rounded-t-[32px] sm:rounded-[32px] flex flex-col overflow-hidden shadow-2xl border dark:border-zinc-800 animate-in slide-in-from-bottom-10 duration-300">

                {/* Header */}
                <div className="p-6 border-b dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="text-xl font-black uppercase tracking-tight dark:text-white">
                        {t('title')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
                    >
                        <X size={24} className="text-zinc-500" />
                    </button>
                </div>

                {/* Filtros */}
                <div className="p-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="w-full pl-12 pr-4 py-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl outline-none focus:ring-2 focus:ring-lime-500 transition-all dark:text-white font-bold text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
                                    ? 'bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/20'
                                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400'
                                    }`}
                            >
                                {tc(cat)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lista */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                            <Loader2 size={32} className="animate-spin mb-2 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">{t('loading') || 'Carregando...'}</p>
                        </div>
                    ) : exercises.length > 0 ? (
                        <>
                            {exercises.map((ex, index) => (
                                <button
                                    key={ex.id}
                                    ref={index === exercises.length - 1 ? lastItemRef : null}
                                    onClick={() => onSelect(ex)}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 hover:bg-lime-50 dark:hover:bg-lime-400/10 border border-transparent hover:border-lime-200 dark:hover:border-lime-500/30 transition-all text-left group cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-lime-200 dark:group-hover:bg-lime-400/20 transition-colors">
                                        <Dumbbell className="text-zinc-500 dark:text-zinc-400 group-hover:text-lime-600 dark:group-hover:text-lime-400" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-zinc-900 dark:text-white uppercase text-sm leading-tight">
                                            {te.has(ex.name) ? te(ex.name) : ex.name}
                                        </p>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                            {tc(ex.category)}
                                        </p>
                                    </div>
                                    <ArrowRight size={16} className="text-zinc-300 group-hover:text-lime-500 group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                            {isLoadingMore && (
                                <div className="flex justify-center py-4">
                                    <Loader2 size={24} className="animate-spin text-lime-500" />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-zinc-400">
                            <Info size={32} className="mb-2 opacity-20" />
                            <p className="text-xs font-bold">{t('noResults')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
