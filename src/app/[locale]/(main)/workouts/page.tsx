'use client'

import { useMemo, useState } from 'react';
import {
    Plus,
    Search,
    MoreVertical,
    Calendar,
    LayoutGrid,
    ChevronLeft,
    Edit,
    Play
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSession } from '@/hooks/useSession';
import { useRouter } from '@/i18n/routing';
import { WorkoutService } from '@/services/workoutService';
import Swal from 'sweetalert2';
import { SessionService } from '@/services/sessionService';
import { useTheme } from '@/context/ThemeContext';


export default function WorkoutsPage() {
    const { theme } = useTheme();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

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
                    <h1 className="font-black text-lg uppercase tracking-tight">Meus Treinos</h1>
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
                        placeholder="Buscar..."
                        className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            {/* Grid de Treinos */}
            <main className="px-6 space-y-4">
                {filteredWorkouts.map((workout) => (
                    <div
                        key={workout.id}
                        className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-6 shadow-sm transition-all"
                    >
                        <div className="flex flex-row justify-between items-center gap-4">

                            {/* Lado Esquerdo: Informações do Treino */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-lime-400" />
                                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                                        {workout?.exercises?.length || 0} Exercícios
                                    </span>
                                </div>

                                <h3 className="text-xl font-black leading-tight text-zinc-900 dark:text-zinc-100">
                                    {workout.name}
                                </h3>

                                <div className="flex items-center gap-1 text-zinc-400 font-bold text-[10px] uppercase">
                                    <Calendar size={12} />
                                    {workout.createdAt.toLocaleDateString()}
                                </div>
                            </div>

                            {/* Lado Direito: Ações em Coluna */}
                            <div className="flex flex-col gap-2 min-w-[120px]">
                                {/* Botão Play - Ação Primária */}
                                <button
                                    onClick={() => SessionService.onPlayWorkout(workout, router, theme)}
                                    className="flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-500 text-zinc-950 py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-sm shadow-lime-400/20"
                                >
                                    <Play size={16} fill="currentColor" />
                                    Treinar
                                </button>

                                {/* Botão Editar - Ação Secundária */}
                                <button
                                    onClick={() => router.push(`/workouts/${workout.id}/edit`)}
                                    className="flex items-center justify-center gap-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer border border-zinc-200 dark:border-zinc-700"
                                >
                                    <Edit size={16} />
                                    Editar
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}