import { Exercise } from '@/config/types';
import { ExerciseService } from '@/services/exerciseService';
import {
    Search,
    Info,
    Loader2,
    Plus
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import QuickExerciseDrawer from './QuickExerciseDrawer';
import { ExerciseFilterPanel } from './ExerciseFilterPanel';
import { ExerciseCard } from './ExerciseCard';
import { matchesExerciseSearch } from '@/utils/exerciseLocalization';

export const ExerciseSelector = ({
    isOpen,
    onClose,
    onSelect,
    studentMode = false,
    trainerId
}: {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (exercise: Exercise) => void;
    studentMode?: boolean;
    trainerId?: string;
}) => {
    const locale = useLocale();
    const t = useTranslations('ExerciseSelector');
    const te = useTranslations('Exercises');
    const tt = useTranslations('Tags');
    const tf = useTranslations('ExerciseForm');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedEquipment, setSelectedEquipment] = useState('all');
    const [selectedLevel, setSelectedLevel] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [allExercises, setAllExercises] = useState<Exercise[]>([]);
    const hasLoadedRef = useRef(false);

    const fetchAllExercises = useCallback(async (silent = false) => {
        if (!silent && !hasLoadedRef.current) {
            setIsLoading(true);
        }
        try {
            const res = await ExerciseService.getAllExercises({
                pagination: { page: 1, limit: 10000 },
                locale,
                studentMode,
                trainerId,
            });
            setAllExercises(res.exercises);
            hasLoadedRef.current = true;
        } catch (error: any) {
            console.error('Error fetching exercises:', error?.message || error);
        } finally {
            setIsLoading(false);
        }
    }, [locale, studentMode, trainerId]);

    useEffect(() => {
        if (isOpen) {
            fetchAllExercises();
        }
    }, [isOpen, fetchAllExercises]);

    useEffect(() => {
        if (!isOpen) return;

        const onReconnect = () => {
            fetchAllExercises(true);
        };

        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchAllExercises(true);
            }
        };

        window.addEventListener('online', onReconnect);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            window.removeEventListener('online', onReconnect);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [isOpen, fetchAllExercises]);

    const filteredExercises = useMemo(() => {
        const trimmedSearch = searchTerm.trim();
        const isTagSearch = trimmedSearch.startsWith('#');
        const cleanQuery = (isTagSearch ? trimmedSearch.substring(1) : trimmedSearch).toLowerCase().trim();

        return allExercises.filter((ex) => {
            if (selectedCategory !== 'all' && ex.category !== selectedCategory) {
                return false;
            }
            if (selectedEquipment !== 'all' && ex.equipment !== selectedEquipment) {
                return false;
            }
            if (selectedLevel !== 'all' && ex.level !== selectedLevel) {
                return false;
            }
            if (cleanQuery.length > 0) {
                if (isTagSearch) {
                    const matchTranslatedTag = ex.tags?.some((tag) => {
                        const translatedTag = tt.has(tag) ? tt(tag).toLowerCase() : tag.toLowerCase();
                        return translatedTag.includes(cleanQuery);
                    });
                    if (matchTranslatedTag) return true;
                } else {
                    const translatedName = te.has(ex.name) ? te(ex.name).toLowerCase() : ex.name.toLowerCase();
                    if (translatedName.includes(cleanQuery)) return true;
                }
                return matchesExerciseSearch(ex, trimmedSearch, locale);
            }
            return true;
        });
    }, [allExercises, selectedCategory, selectedEquipment, selectedLevel, searchTerm, te, tt, locale]);

    const handleExerciseCreated = (exercise: Exercise) => {
        setAllExercises((prev) => [exercise, ...prev]);
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
                zIndex="z-[200]"
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
                            {!studentMode && (
                                <button
                                    onClick={() => setIsQuickAddOpen(true)}
                                    className="aspect-square w-[52px] flex items-center justify-center bg-lime-400 hover:bg-lime-500 text-zinc-950 rounded-2xl shadow-lg shadow-lime-500/20 active:scale-95 transition-all group"
                                    title={tf('quickAdd')}
                                >
                                    <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            )}
                        </div>

                        <ExerciseFilterPanel
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            selectedEquipment={selectedEquipment}
                            onEquipmentChange={setSelectedEquipment}
                            selectedLevel={selectedLevel}
                            onLevelChange={setSelectedLevel}
                            zIndex="z-[250]"
                        />
                    </div>

                    {/* Lista com Altura Fixa para evitar saltos */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2.5 min-h-[450px] sm:min-h-[500px]">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
                                <Loader2 size={40} className="animate-spin mb-4 text-lime-500 opacity-50" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">{t('loading')}</p>
                            </div>
                        ) : filteredExercises.length > 0 ? (
                            filteredExercises.map((ex) => (
                                <ExerciseCard
                                    key={ex.id}
                                    exercise={ex}
                                    onSelect={onSelect}
                                    compact
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-zinc-400 text-center px-10">
                                <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 opacity-50">
                                    <Info size={32} />
                                </div>
                                <h4 className="font-black uppercase tracking-tight text-zinc-900 dark:text-white mb-2">{t('emptyResultsTitle')}</h4>
                                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed" dangerouslySetInnerHTML={{ __html: t('emptyResultsDescription') }} />
                                {!studentMode && (
                                    <button
                                        onClick={() => setIsQuickAddOpen(true)}
                                        className="mt-8 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all active:scale-95"
                                    >
                                        {t('createNew')}
                                    </button>
                                )}
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

