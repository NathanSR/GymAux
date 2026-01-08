'use client'

import { useMemo, useState } from 'react';
import {
    Plus,
    Search,
    Calendar,
    ChevronLeft,
    Edit,
    Play,
    Info,
    Dumbbell
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSession } from '@/hooks/useSession';
import { useRouter } from '@/i18n/routing';
import { WorkoutService } from '@/services/workoutService';
import { SessionService } from '@/services/sessionService';
import { useTheme } from '@/context/ThemeContext';
import { useTranslations, useLocale } from 'next-intl';

export default function WorkoutsPage() {
    const { theme } = useTheme();
    const router = useRouter();
    const locale = useLocale();
    const [searchQuery, setSearchQuery] = useState('');
    const t = useTranslations('WorkoutList');

    const { activeUser } = useSession();

    const workouts = useLiveQuery(() =>
        WorkoutService.getWorkoutsByUserId(activeUser?.id ?? -1),
        [activeUser?.id]) || [];

    // Filtro de Treinos
    const filteredWorkouts = useMemo(() => {
        return workouts?.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        }) || [];
    }, [searchQuery, workouts]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-24 transition-colors">

            {/* Header Estilizado */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => router.push('/home')}
                        className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 cursor-pointer">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="font-black text-lg uppercase tracking-tight">{t('title')}</h1>
                    <button
                        onClick={() => router.push('/workouts/new')}
                        className="p-2 rounded-xl bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/20 active:scale-90 transition-transform cursor-pointer"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            {/* Grid de Treinos */}
            <main className="px-6 space-y-4 pt-4">
                {filteredWorkouts.length > 0 ? (
                    filteredWorkouts.map((workout) => (
                        <div
                            key={workout.id}
                            className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                        >
                            {/* Topo: Título e Info */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-lime-400/10 text-lime-600 dark:text-lime-400 text-[10px] font-black uppercase tracking-wider rounded-md">
                                            {t('exercisesCount', { count: workout?.exercises?.length || 0 })}
                                        </span>
                                        <span className="text-[10px] font-bold text-zinc-300 dark:text-zinc-600">•</span>
                                        <div className="flex items-center gap-1 text-zinc-400 font-bold text-[10px] uppercase">
                                            <Calendar size={10} />
                                            {new Intl.DateTimeFormat(locale).format(workout.createdAt)}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black leading-tight text-zinc-900 dark:text-zinc-100 italic uppercase tracking-tighter">
                                        {workout.name}
                                    </h3>
                                </div>

                                {/* Ícone Decorativo/Funcional */}
                                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400">
                                    <Dumbbell size={20} />
                                </div>
                            </div>

                            {/* Footer: Ações Horizontais (Melhor para o polegar no Mobile) */}
                            <div className="flex gap-3">
                                {/* Botão Principal: Play/Treinar */}
                                <button
                                    onClick={() => SessionService.onPlayWorkout(workout, router, theme)}
                                    className="flex-[2] flex items-center justify-center gap-3 bg-lime-400 hover:bg-lime-500 text-zinc-950 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all active:scale-95 shadow-lg shadow-lime-500/20"
                                >
                                    <Play size={16} fill="currentColor" />
                                    {t('train')}
                                </button>

                                {/* Botão Secundário: Editar */}
                                <button
                                    onClick={() => router.push(`/workouts/${workout.id}/edit`)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-300 py-4 rounded-2xl font-bold text-xs uppercase transition-all active:scale-95 border border-zinc-200/50 dark:border-zinc-700/50"
                                >
                                    <Edit size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                        <Info size={40} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium">{t('noResults')}</p>
                    </div>
                )}
            </main>
        </div>
    );
}