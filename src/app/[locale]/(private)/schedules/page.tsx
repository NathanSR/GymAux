'use client'

import { useMemo, useState } from 'react';
import {
    Plus,
    Search,
    MoreVertical,
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
import { useTranslations } from 'next-intl';
import moment from 'moment';

export default function SchedulesPage() {
    const router = useRouter();
    const t = useTranslations('ScheduleList');
    const [searchQuery, setSearchQuery] = useState('');

    const { activeUser } = useSession();

    // Busca os cronogramas (schedules) do usuário
    const schedules = useLiveQuery(() =>
        ScheduleService.getSchedulesByUserId(activeUser?.id ?? -1),
        [activeUser?.id]) || [];

    // Filtro de Cronogramas
    const filteredSchedules = useMemo(() => {
        return schedules?.filter(item => {
            const name = item?.name || t('defaultName', { id: item.id as number });
            return name.toLowerCase().includes(searchQuery.toLowerCase());
        }) || [];
    }, [searchQuery, schedules, t]);

    // Busca o array de labels traduzido (ex: ['D', 'S', 'T'...])
    const dayLabels = t.raw('dayLabels') as string[];

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
                    <h1 className="font-black text-lg uppercase tracking-tight">{t('title')}</h1>
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
                        placeholder={t('searchPlaceholder')}
                        className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 transition-all dark:text-white placeholder:text-zinc-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            {/* Lista de Cards */}
            <main className="px-6 space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {filteredSchedules.map((schedule) => {
                    const activeDaysCount = schedule.workouts.filter((w: any) => w !== null).length;

                    return (
                        <div
                            key={schedule.id}
                            className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-6 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        {schedule.active ? (
                                            <span className="flex items-center gap-1 text-[10px] font-black uppercase text-lime-500 tracking-widest">
                                                <CheckCircle2 size={12} /> {t('active')}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                                                <XCircle size={12} /> {t('inactive')}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-black leading-tight uppercase tracking-tight">
                                        {schedule.name || t('defaultName', { id: schedule.id as number })}
                                    </h3>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        className='w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-lime-500 hover:scale-105 transition-colors cursor-pointer'
                                        onClick={() => router.push(`/schedules/${schedule.id}/edit`)}
                                    >
                                        <Edit size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Info de Datas */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <Clock size={14} className="text-zinc-300" />
                                <div className="flex items-center gap-1 text-zinc-400 font-bold text-[10px]">
                                    <div>{moment(schedule.startDate).format('DD/MM/YYYY')}</div>
                                    <span>-</span>
                                    <div>{schedule.endDate ? moment(schedule.endDate).format('DD/MM/YYYY') : "..."}</div>
                                </div>
                            </div>

                            {/* Visualização da Semana */}
                            <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-4">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 flex justify-between">
                                    <span>{t('weeklyRoutine')}</span>
                                    <span className="text-zinc-500 lowercase font-bold">
                                        {t('trainingDays', { count: activeDaysCount })}
                                    </span>
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
                        <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">
                            {t('noSchedules')}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}