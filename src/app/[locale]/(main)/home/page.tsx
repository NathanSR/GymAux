"use client";

import { useState, useMemo } from 'react';
import {
    Play,
    Calendar,
    PlusCircle,
    Trophy,
    History as HistoryIcon,
    AlertCircle,
    ChevronRight,
    Languages,
    Moon,
    Sun,
    Clock,
    Dumbbell,
    Hand,
    Settings,
    LogOut,
    User,
    CheckCircle2,
    Shuffle,
    FastForward,
    ArrowRightCircle
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSession } from '@/hooks/useSession';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRouter } from '@/i18n/routing';
import { MenuTab } from '@/components/MenuTab';
import { ScheduleService } from '@/services/scheduleService';
import { WorkoutService } from '@/services/workoutService';
import { HistoryService } from '@/services/historyService';
import { History } from '@/config/types';
import moment from 'moment';



export default function HomePage() {
    const t = useTranslations('Home');
    const router = useRouter();

    // Simulação de hooks que falhariam sem a instalação local
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);

    const { activeUser, loading } = useSession();

    const activeSchedule = useLiveQuery(() =>
        ScheduleService.getActiveSchedule(activeUser?.id ?? -1),
        [activeUser?.id]);

    const workouts = useLiveQuery(() =>
        WorkoutService.getWorkoutsByUserId(activeUser?.id ?? -1),
        [activeUser?.id]) || [];

    const todayHistory = useLiveQuery(() =>
        HistoryService
            .getHistoryByRange(activeUser?.id ?? -1, moment().startOf('day').toDate(), moment().endOf('day').toDate())
            .then(h => h.at(-1)),
        [activeUser?.id]) || null;

    const locale = "pt";

    const today = new Date();
    const dayOfWeek = today.getDay();

    const handleLogout = () => {
        router.push('/');
    }

    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }).format(today);

    // 2. Identifica o treino de hoje usando a interface Schedule
    const todayWorkout = useMemo(() => {
        const id = selectedWorkoutId || activeSchedule?.workouts[dayOfWeek];
        return workouts.find(w => w.id === id);
    }, [dayOfWeek, activeSchedule, workouts, selectedWorkoutId]);

    const tomorrowWorkout = useMemo(() => {
        const id = selectedWorkoutId || activeSchedule?.workouts[dayOfWeek + 1];
        return workouts.find(w => w.id === id);
    }, [dayOfWeek, activeSchedule, workouts, selectedWorkoutId]);

    // 3. Lógica de Alerta de Ontem
    // const missedWorkout = useMemo(() => {
    //     const yesterdayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    //     const yesterdayId = activeSchedule?.workouts[yesterdayIdx] || null;
    //     return yesterdayId ? workouts!.find(w => w.id === yesterdayId) : null;
    // }, [dayOfWeek, activeSchedule, workouts]);

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className={`${isDarkMode ? 'dark' : ''}`}>
            <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-6 pb-32 transition-colors duration-300 font-sans">

                {/* --- HEADER COM MENU DE PERFIL --- */}
                <header className="mb-8 flex justify-between items-center relative">
                    <div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                            {formattedDate}
                        </p>
                        <h1 className="text-2xl font-black tracking-tight">
                            Olá, {activeUser?.name || 'Atleta'} 👋
                        </h1>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 overflow-hidden active:scale-90 transition-transform shadow-sm"
                        >
                            <User size={24} />
                        </button>

                        {showProfileMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] shadow-2xl z-20 p-2 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                                        <p className="text-xs font-black uppercase text-zinc-400 tracking-widest">Configurações</p>
                                    </div>

                                    <button
                                        onClick={() => { setIsDarkMode(!isDarkMode); setShowProfileMenu(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                    >
                                        {isDarkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-500" />}
                                        {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                                    </button>

                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                                        <Languages size={18} className="text-blue-500" />
                                        Idioma: {locale.toUpperCase()}
                                    </button>

                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                                        <Settings size={18} className="text-zinc-500" />
                                        Perfil
                                    </button>

                                    <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-1" />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                                    >
                                        <LogOut size={18} />
                                        Sair da Conta
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Alerta de Treino Perdido */}
                {/* {missedWorkout && (
                    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-[24px] mb-8 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                        <div className="bg-orange-500 p-2 rounded-xl text-white">
                            <AlertCircle size={20} />
                        </div>
                        <div className="flex-1 text-sm">
                            <p className="font-bold text-orange-600 dark:text-orange-500">{t('missedTitle')}</p>
                            <p className="text-orange-800/70 dark:text-orange-200/50">{t('missedDesc', { name: missedWorkout.name })}</p>
                        </div>
                    </div>
                )} */}

                {/* --- CARD DE TREINO DO DIA (MELHORADO) --- */}
                <section className="relative group mb-8">
                    <div className={`absolute -inset-1 rounded-[40px] blur opacity-20 transition duration-1000 ${todayHistory?.completed ? 'bg-zinc-500' : 'bg-lime-400'}`}></div>

                    <div className={`relative rounded-[32px] p-8 shadow-xl transition-all duration-500 ${todayHistory?.completed
                        ? 'bg-zinc-200 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400'
                        : 'bg-gradient-to-br from-lime-400 to-lime-600 text-zinc-950'
                        }`}>
                        <div className="flex justify-between items-start mb-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${todayHistory?.completed ? 'bg-gradient-to-br from-lime-400 to-lime-600 text-zinc-950' : 'bg-black/10'}`}>
                                {todayHistory?.completed ? 'Concluído Hoje' : 'Treino do Dia'}
                            </span>
                            {todayHistory?.completed ? <CheckCircle2 size={22} className='text-lime-400' /> : <Trophy size={22} className="opacity-40" />}
                        </div>

                        <h2 className={`text-3xl font-black mb-2 leading-tight uppercase italic ${todayHistory?.completed ? 'opacity-50' : ''}`}>
                            {todayWorkout ? todayWorkout.name : 'Descanso Merecido'}
                        </h2>

                        <div className="flex items-center gap-6 mb-8 text-[10px] font-black uppercase tracking-wider opacity-70">
                            <div className="flex items-center gap-1.5">
                                <Dumbbell size={14} /> {todayWorkout?.exercises?.length || 0} Exercícios
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={14} /> Est. 50 min
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                disabled={!todayWorkout || todayHistory?.completed}
                                className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 ${todayHistory?.completed
                                    ? 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                    : 'bg-zinc-950 text-white hover:scale-[1.02]'
                                    }`}
                                onClick={() => router.push(`/session/${todayWorkout?.id}`)}
                            >
                                <Play size={20} fill="currentColor" />
                                {todayHistory?.completed ? 'TREINO FINALIZADO' : 'INICIAR SESSÃO'}
                            </button>

                            {!todayHistory?.completed && (
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    <button
                                        onClick={() => setSelectedWorkoutId(workouts.find(w => w.id !== todayWorkout?.id)?.id as number)}
                                        className="py-3 bg-white/20 dark:bg-black/20 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 backdrop-blur-sm border border-black/5"
                                    >
                                        <Shuffle size={14} /> Outro Treino
                                    </button>
                                    <button className="py-3 bg-white/20 dark:bg-black/20 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 backdrop-blur-sm border border-black/5">
                                        Pular Dia
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* --- SEÇÃO DE ANTECIPAÇÃO (APARECE QUANDO CONCLUÍDO) --- */}
                {todayHistory?.completed && tomorrowWorkout && (
                    <section className="animate-in fade-in slide-in-from-top-4 duration-500 mb-8">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                                    <FastForward size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Próximo Treino</p>
                                    <h4 className="text-sm font-black truncate max-w-[150px] dark:text-zinc-200">
                                        {tomorrowWorkout.name}
                                    </h4>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push(`/session/${tomorrowWorkout?.id}`)}
                                className="bg-lime-500 hover:bg-lime-400 text-zinc-950 px-4 py-3 rounded-xl font-black text-[11px] uppercase flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                            >
                                Antecipar
                                <ArrowRightCircle size={16} />
                            </button>
                        </div>
                    </section>
                )}

                {/* Atalhos */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <button
                        onClick={() => router.push('/exercises')}
                        className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[32px] flex flex-col items-center gap-3 active:scale-95 shadow-sm cursor-pointer"
                    >
                        <div className="bg-amber-500/10 p-4 rounded-2xl text-amber-500"><Hand size={28} /></div>
                        <span className="text-sm font-black uppercase tracking-tighter">{t('exercises')}</span>
                    </button>
                    <button
                        onClick={() => router.push('/workouts')}
                        className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[32px] flex flex-col items-center gap-3 active:scale-95 shadow-sm cursor-pointer"
                    >
                        <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-500"><PlusCircle size={28} /></div>
                        <span className="text-sm font-black uppercase tracking-tighter">{t('newWorkout')}</span>
                    </button>
                    <button
                        onClick={() => router.push('/schedules')}
                        className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[32px] flex flex-col items-center gap-3 active:scale-95 shadow-sm cursor-pointer"
                    >
                        <div className="bg-cyan-500/10 p-4 rounded-2xl text-cyan-500"><Calendar size={28} /></div>
                        <span className="text-sm font-black uppercase tracking-tighter">{t('newSchedule')}</span>
                    </button>
                </div>

                {/* --- HISTÓRICO RÁPIDO (RECONSTITUÍDO) --- */}
                <section className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-lg flex items-center gap-2 uppercase italic tracking-tight">
                            <HistoryIcon size={20} className="text-lime-500" />
                            Atividade
                        </h3>
                        <button className="text-[10px] text-lime-600 dark:text-lime-400 font-black uppercase tracking-widest flex items-center gap-1">
                            Ver tudo <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2].map((item) => (
                            <div key={item} className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                <div className="w-10 h-10 bg-lime-400/20 rounded-xl flex items-center justify-center text-lime-500">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black uppercase tracking-tight">Treino A Concluído</p>
                                    <p className="text-[10px] text-zinc-500 font-bold">Ontem • 48 min</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black">12.4t</p>
                                    <p className="text-[9px] text-zinc-500 uppercase">Volume</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}