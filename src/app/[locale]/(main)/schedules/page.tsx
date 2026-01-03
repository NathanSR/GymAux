'use client'

import { useMemo, useState } from 'react';
import {
    Plus,
    Search,
    MoreVertical,
    Calendar,
    ChevronLeft,
    Edit,
    Clock,
    ClipboardList,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSession } from '@/hooks/useSession';
import { useRouter } from '@/i18n/routing';
import { ScheduleService } from '@/services/scheduleService';

export default function SchedulesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const { activeUser } = useSession();

    // Busca os cronogramas (schedules) do usuário
    const schedules = useLiveQuery(() =>
        ScheduleService.getSchedulesByUserId(activeUser?.id ?? -1),
        [activeUser?.id]) || [];

    // Filtro de Cronogramas
    const filteredSchedules = useMemo(() => {
        return schedules?.filter(item => {
            const name = item?.name || `Cronograma #${item.id}`;
            return name.toLowerCase().includes(searchQuery.toLowerCase());
        }) || [];
    }, [searchQuery, schedules]);

    const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-24 transition-colors">

            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => router.push('/home')}
                        className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="font-black text-lg uppercase tracking-tight">Cronogramas</h1>
                    <button
                        onClick={() => router.push('/schedules/new')}
                        className="p-2 rounded-xl bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/20 active:scale-90 transition-transform cursor-pointer"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou data..."
                        className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            {/* Lista de Cards */}
            <main className="px-6 space-y-6 pt-6">
                {filteredSchedules.map((schedule) => {
                    const activeDaysCount = schedule.workouts.filter(w => w !== null).length;

                    return (
                        <div
                            key={schedule.id}
                            className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-6 shadow-sm transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        {schedule.active ? (
                                            <span className="flex items-center gap-1 text-[10px] font-black uppercase text-lime-500 tracking-widest">
                                                <CheckCircle2 size={12} /> Ativo
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                                                <XCircle size={12} /> Inativo
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-black leading-tight">
                                        {schedule.name || `Cronograma #${schedule.id}`}
                                    </h3>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        className='w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-lime-500 transition-colors'
                                        onClick={() => router.push(`/schedules/${schedule.id}/edit`)}
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Info de Datas */}
                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="flex items-center gap-1.5 text-zinc-400 font-bold text-[10px] uppercase">
                                    <Calendar size={14} className="text-zinc-300" />
                                    {/* Início: {schedule.startDate.toLocaleDateString()} */}
                                </div>
                                {schedule.endDate && (
                                    <div className="flex items-center gap-1.5 text-zinc-400 font-bold text-[10px] uppercase">
                                        <Calendar size={14} className="text-zinc-300" />
                                        {/* Fim: {schedule.endDate.toLocaleDateString()} */}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-zinc-400 font-bold text-[10px] uppercase">
                                    <Clock size={14} className="text-zinc-300" />
                                    Último Treino: Dia {schedule.lastCompleted}
                                </div>
                            </div>

                            {/* Visualização da Semana */}
                            <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-4">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 flex justify-between">
                                    <span>Rotina Semanal</span>
                                    <span className="text-zinc-500">{activeDaysCount} dias de treino</span>
                                </p>
                                <div className="flex justify-between items-center">
                                    {dayLabels.map((label, index) => {
                                        const hasWorkout = schedule.workouts[index] !== null;
                                        const isLast = schedule.lastCompleted === index;

                                        return (
                                            <div key={index} className="flex flex-col items-center gap-2">
                                                <span className="text-[10px] font-bold text-zinc-400">{label}</span>
                                                <div
                                                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${hasWorkout
                                                        ? isLast
                                                            ? 'bg-lime-400 text-zinc-950 shadow-lg shadow-lime-500/40'
                                                            : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950'
                                                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 opacity-30'
                                                        }`}
                                                >
                                                    {hasWorkout && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredSchedules.length === 0 && (
                    <div className="py-20 text-center space-y-6">
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                            <ClipboardList size={32} />
                        </div>
                        <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Nenhum cronograma encontrado</p>
                    </div>
                )}
            </main>
        </div>
    );
}