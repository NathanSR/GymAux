"use client";

import { useState, useMemo } from 'react';
import {
    ChevronLeft,
    Search,
    Dumbbell,
    Info,
    PlayCircle,
    Plus,
    Edit
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRouter } from '@/i18n/routing';
import { ExerciseService } from '@/services/exerciseService';



export default function ExerciseLibraryPage() {
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const t = useTranslations('ExerciseList');

    const categories = ["all", "chest", "back", "legs", "shoulders", "arms", "core", "cardio"];

    const exercises = useLiveQuery(() => ExerciseService.getAllExercises(), []);

    // Filtro de Exercícios
    const filteredExercises = useMemo(() => {
        return exercises?.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
            return matchesSearch && matchesCategory;
        }) || [];
    }, [searchQuery, selectedCategory, exercises]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300 font-sans pb-10">

            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => router.push('/home')}
                        className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 cursor-pointer">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="font-black text-lg uppercase tracking-tight">Biblioteca</h1>
                    <button
                        onClick={() => router.push('/exercises/new')}
                        className="p-2 rounded-xl bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/20 active:scale-90 transition-transform cursor-pointer"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <main className="p-6">
                {/* Seletor de Categorias Horizontal */}
                <section className="mb-8 overflow-x-auto no-scrollbar flex gap-2 pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat
                                ? 'bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/20'
                                : 'bg-white dark:bg-zinc-900 text-zinc-400 border border-zinc-100 dark:border-zinc-800'
                                }`}
                        >
                            {t(cat)}
                        </button>
                    ))}
                </section>

                {/* Listagem de Exercícios */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredExercises.length > 0 ? (
                        filteredExercises.map(exercise => (
                            <div
                                key={exercise.id}
                                className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-5 shadow-sm hover:shadow-xl hover:border-lime-500/30 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
                            >
                                <div className="flex gap-4">
                                    {/* Placeholder para Media/Miniatura */}
                                    <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center shrink-0 overflow-hidden relative group">
                                        <Dumbbell size={24} className="text-zinc-300 dark:text-zinc-800" />
                                        {exercise.mediaUrl && (
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <PlayCircle size={20} className="text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-black uppercase text-lime-600 dark:text-lime-400 tracking-widest mb-1 block">
                                                {t(exercise.category)}
                                            </span>
                                            <button
                                                className='flex gap-2 text-lime-500 text-sm items-center cursor-pointer'
                                                onClick={() => router.push(`/exercises/${exercise.id}/edit`)}
                                            >
                                                <Edit size={24} className="text-lime-300 dark:text-lime-700" />
                                                Editar
                                            </button>
                                        </div>
                                        <h3 className="font-black text-base truncate mb-1">{exercise.name}</h3>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 leading-relaxed">
                                            {exercise.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-800/50">
                                    {exercise.tags.map(tag => (
                                        <span key={tag} className="bg-zinc-100 dark:bg-zinc-950 px-2.5 py-1 rounded-lg text-[9px] font-bold text-zinc-400 uppercase tracking-tight">
                                            #{tag}
                                        </span>
                                    ))}
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
        </div>
    );
}