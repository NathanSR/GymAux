import { Exercise } from '@/config/types';
import { ExerciseService } from '@/services/exerciseService';
import {
    Search,
    Dumbbell,
    X,
    ArrowRight
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

export const ExerciseSelector = ({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (exercise: Exercise) => void }) => {
    const t = useTranslations();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [exercises, setExercises] = useState<Exercise[]>([]);

    useEffect(() => {
        ExerciseService.getAllExercises().then(setExercises);
    }, []);

    const categories = useMemo(() => {
        const cats = new Set(exercises.map(ex => ex.category));
        return ['all', ...Array.from(cats)];
    }, [exercises]);

    const filteredExercises = exercises.filter(ex => {
        const name = t(`Exercises.${ex.name}`).toLowerCase();
        const matchesSearch = name.includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white dark:bg-zinc-950 w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[80vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl border dark:border-zinc-800">
                <div className="p-6 border-b dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold dark:text-white">{t('WorkoutForm.addExercise')}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
                        <X size={24} className="text-zinc-500" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar exercício..."
                            className="w-full pl-10 pr-4 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl outline-none focus:ring-2 focus:ring-lime-500 transition-all dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-lime-600 text-white'
                                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500'
                                    }`}
                            >
                                {cat === 'all' ? 'Todos' : t(`Categories.${cat}`)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filteredExercises.map(ex => (
                        <button
                            key={ex.id}
                            onClick={() => onSelect(ex)}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 hover:bg-lime-50 dark:hover:bg-lime-900/10 border border-transparent hover:border-lime-200 transition-all text-left group"
                        >
                            <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-lime-100 dark:group-hover:bg-lime-900/30 transition-colors">
                                <Dumbbell className="text-zinc-500 dark:text-zinc-400 group-hover:text-lime-500" size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold dark:text-white">{t(`Exercises.${ex.name}`)}</p>
                                <p className="text-xs text-zinc-500 uppercase tracking-tight">{t(`Categories.${ex.category}`)}</p>
                            </div>
                            <ArrowRight size={16} className="text-zinc-300 group-hover:text-lime-500 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};