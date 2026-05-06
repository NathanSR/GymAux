import { CATEGORIES } from '@/config/constants';
import { Exercise } from '@/config/types';
import { ExerciseService } from '@/services/exerciseService';
import {
    Search,
    Dumbbell,
    ArrowRight,
    Info,
    Loader2,
    Plus
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Modal } from '@/components/ui/Modal';
import QuickExerciseDrawer from './QuickExerciseDrawer';

export const ExerciseSelector = ({ isOpen, onClose, onSelect }: {
    isOpen: boolean,
    onClose: () => void,
    onSelect: (exercise: Exercise) => void
}) => {
    const t = useTranslations('ExerciseSelector');
    const te = useTranslations('Exercises');
    const tc = useTranslations('Categories');
    const tf = useTranslations('ExerciseForm');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [initialData, setInitialData] = useState<Exercise[]>([]);

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

    const fetchFirstPage = useCallback(async () => {
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
    }, [debouncedSearchTerm, selectedCategory, te]);

    useEffect(() => {
        if (isOpen) {
            fetchFirstPage();
        }
    }, [isOpen, fetchFirstPage]);

    useEffect(() => {
        if (!isOpen) return;

        const onReconnect = () => {
            fetchFirstPage();
        };

        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchFirstPage();
            }
        };

        window.addEventListener('online', onReconnect);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            window.removeEventListener('online', onReconnect);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [isOpen, fetchFirstPage]);

    const { visibleData: exercises, isLoadingMore, lastItemRef } = useInfiniteScroll(initialData, {
        pageSize: 10,
        fetchData: fetchMoreExercises,
        keyExtractor: (item) => item.id as number
    });

    const categories = useMemo(() => {
        return ['all', ...CATEGORIES];
    }, []);

    const handleExerciseCreated = (exercise: Exercise) => {
        onSelect(exercise);
        setIsQuickAddOpen(false);
        onClose();
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={t('title')}
                maxWidth="max-w-xl"
                className="!rounded-[40px]"
            >
                <div className="flex flex-col h-full max-h-[80vh]">
                    {/* Filtros e Busca */}
                    <div className="p-6 space-y-4 bg-white dark:bg-zinc-950 sticky top-0 z-10 border-b dark:border-zinc-900/50">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl outline-none focus:ring-2 focus:ring-lime-500 transition-all dark:text-white font-bold text-sm border border-transparent focus:border-lime-500/50"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setIsQuickAddOpen(true)}
                                className="aspect-square w-[52px] flex items-center justify-center bg-lime-400 hover:bg-lime-500 text-zinc-950 rounded-2xl shadow-lg shadow-lime-500/20 active:scale-95 transition-all group"
                                title={tf('quickAdd')}
                            >
                                <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer border ${selectedCategory === cat
                                        ? 'bg-lime-400 text-zinc-950 border-lime-400 shadow-lg shadow-lime-500/10'
                                        : 'bg-zinc-100 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 border-transparent hover:border-zinc-200 dark:hover:border-zinc-800'
                                        }`}
                                >
                                    {tc(cat)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Lista com Altura Fixa para evitar saltos */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-[450px] sm:min-h-[500px]">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
                                <Loader2 size={40} className="animate-spin mb-4 text-lime-500 opacity-50" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">{t('loading')}</p>
                            </div>
                        ) : exercises.length > 0 ? (
                            <>
                                {exercises.map((ex, index) => (
                                    <button
                                        key={ex.id}
                                        ref={index === exercises.length - 1 ? lastItemRef : null}
                                        onClick={() => onSelect(ex)}
                                        className="w-full flex items-center gap-4 p-4 rounded-[24px] bg-zinc-50 dark:bg-zinc-900/30 hover:bg-white dark:hover:bg-zinc-900 border border-zinc-100/50 dark:border-zinc-800/50 hover:border-lime-200 dark:hover:border-lime-500/30 hover:shadow-xl hover:shadow-lime-500/5 transition-all text-left group cursor-pointer active:scale-[0.98]"
                                    >
                                        <div className="w-14 h-14 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center group-hover:bg-lime-400 transition-colors shadow-inner">
                                            <Dumbbell className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-950 transition-colors" size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-zinc-900 dark:text-white uppercase text-[13px] leading-tight tracking-tight">
                                                {te.has(ex.name) ? te(ex.name) : ex.name}
                                            </p>
                                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                                                {tc(ex.category)}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all">
                                            <ArrowRight size={18} className="text-lime-500" />
                                        </div>
                                    </button>
                                ))}
                                {isLoadingMore && (
                                    <div className="flex justify-center py-8">
                                        <Loader2 size={24} className="animate-spin text-lime-500" />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-zinc-400 text-center px-10">
                                <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 opacity-50">
                                    <Info size={32} />
                                </div>
                                <h4 className="font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-2">{t('emptyResultsTitle')}</h4>
                                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed" dangerouslySetInnerHTML={{ __html: t('emptyResultsDescription') }} />
                                <button
                                    onClick={() => setIsQuickAddOpen(true)}
                                    className="mt-8 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all active:scale-95"
                                >
                                    {t('createNew')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            <QuickExerciseDrawer
                isOpen={isQuickAddOpen}
                onClose={() => setIsQuickAddOpen(false)}
                onExerciseCreated={handleExerciseCreated}
            />
        </>
    );
};

