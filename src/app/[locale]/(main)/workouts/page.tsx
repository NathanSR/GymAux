'use client'

import React, { useMemo, useState } from 'react';
import {
    Plus,
    Search,
    ChevronRight,
    Play,
    MoreVertical,
    Clock,
    Dumbbell,
    Calendar,
    LayoutGrid,
    ChevronLeft,
    Edit
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/config/db';
import { useSession } from '@/hooks/useSession';
import { useRouter } from '@/i18n/routing';




export default function WorkoutsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const { activeUser } = useSession();

    const workouts = useLiveQuery(() =>
        db.workouts.where('userId').equals(activeUser?.id ?? -1).toArray(),
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
                        onClick={() => router.back()}
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
                        className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[36px] p-6 shadow-sm overflow-hidden active:scale-[0.98] transition-all"
                    >
                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full bg-lime-400`} />
                                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                                        {workout.exercises.length} Exercícios
                                    </span>
                                </div>
                                <h3 className="text-lg font-black leading-tight max-w-[200px]">
                                    {workout.name}
                                </h3>
                                <div className="flex items-center gap-3 pt-2">
                                    <div className="flex items-center gap-1 text-zinc-400 font-bold text-[10px] uppercase">
                                        <Calendar size={12} />
                                        {workout.createdAt.toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <button
                                className='flex gap-2 text-lime-500 text-sm items-center cursor-pointer'
                                onClick={() => router.push(`/workouts/${workout.id}/edit`)}
                            >
                                <Edit size={24} className="text-lime-300 dark:text-lime-700" />
                                Editar
                            </button>
                        </div>

                        {/* Ações de Edição */}
                        <div className="mt-6 pt-4 border-t border-zinc-50 dark:border-zinc-800 flex justify-between items-center text-zinc-400">
                            <button className="text-[10px] font-black uppercase tracking-widest hover:text-lime-500 transition-colors">
                                Ver detalhes
                            </button>
                            <button
                                onClick={() => console.log('Edit', workout.id)}
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                            >
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State Simplificado */}
                {filteredWorkouts.length === 0 && (
                    <div className="py-20 text-center space-y-4 opacity-40">
                        <LayoutGrid size={48} className="mx-auto" />
                        <p className="font-bold text-sm">Nenhum treino criado ainda.</p>
                    </div>
                )}
            </main>
        </div>
    );
}