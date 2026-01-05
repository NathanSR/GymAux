"use client";

import { useState } from 'react';
import {
    Play,
    Calendar,
    Trophy,
    History as HistoryIcon,
    ChevronRight,
    Languages,
    Moon,
    Sun,
    Clock,
    Dumbbell,
    Settings,
    LogOut,
    User,
    CheckCircle2,
    Book,
    Bed,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSession } from '@/hooks/useSession';
import { useLiveQuery } from 'dexie-react-hooks';
import { useRouter } from '@/i18n/routing';
import { ScheduleService } from '@/services/scheduleService';
import { WorkoutService } from '@/services/workoutService';
import { HistoryService } from '@/services/historyService';
import moment from 'moment';
import { SessionService } from '@/services/sessionService';



export default function HomePage() {
    const t = useTranslations('Home');
    const router = useRouter();

    const theme = "dark"
    const locale = "pt";
    const today = moment().toDate();
    const dayOfWeek = moment().day();
    const startTodayDate = moment().startOf('day').toDate();
    const endTodayDate = moment().endOf('day').toDate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { activeUser, loading } = useSession();

    const activeSchedule = useLiveQuery(() =>
        ScheduleService.getActiveSchedule(activeUser?.id ?? -1),
        [activeUser?.id]
    );

    const todayWorkout = useLiveQuery(() =>
        WorkoutService.getWorkoutById(activeSchedule?.workouts?.[dayOfWeek] ?? -1),
        [activeSchedule?.id]
    );
    const estimatedTimeTodayWorkout = Math.round(todayWorkout?.exercises.reduce((acc: number, exercise) => (acc + ((exercise.sets * (exercise.reps * 2.5 + exercise.restTime)) / 60)), 0) || 0);

    const todayHistory = useLiveQuery(() =>
        HistoryService
            .getHistoryByRange(activeUser?.id ?? -1, startTodayDate, endTodayDate)
            .then(h => h.find(h => h.workoutId === todayWorkout?.id)),
        [activeUser?.id, todayWorkout?.id]) || null;

    const historyList = useLiveQuery(() =>
        HistoryService
            .getUserHistory(activeUser?.id ?? -1, 1, 4),
        [activeUser?.id, todayWorkout?.id]) || [];




    const handleLogout = () => {
        router.push('/');
    }

    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }).format(today);

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
        <div className={`${theme === 'dark' ? 'dark' : ''}`}>
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
                                        onClick={() => { setShowProfileMenu(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                    >
                                        {theme === 'dark' ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-500" />}
                                        {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
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
                                <Clock size={14} /> Est. {estimatedTimeTodayWorkout} min
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                disabled={!todayWorkout || todayHistory?.completed}
                                className={` w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 ${todayHistory?.completed || !todayWorkout
                                    ? 'bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                    : 'cursor-pointer bg-zinc-950 text-white hover:scale-[1.02]'
                                    }`}
                                onClick={() => SessionService.onPlayWorkout(todayWorkout, router, theme)}
                            >
                                {todayHistory?.completed ? <CheckCircle2 size={20} /> : todayWorkout ? <Play size={20} fill="currentColor" /> : <Bed size={20} fill="currentColor" />}
                                {!todayWorkout ? "DESCANSO" : todayHistory?.completed ? 'TREINO FINALIZADO' : 'INICIAR SESSÃO'}
                            </button>

                        </div>
                    </div>
                </section>

                {/* Atalhos */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <button
                        onClick={() => router.push('/exercises')}
                        className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[32px] flex flex-col items-center gap-3 active:scale-95 shadow-sm cursor-pointer"
                    >
                        <div className="bg-amber-500/10 p-4 rounded-2xl text-amber-500"><Book size={28} /></div>
                        <span className="text-sm font-black uppercase tracking-tighter">{t('exercises')}</span>
                    </button>
                    <button
                        onClick={() => router.push('/workouts')}
                        className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[32px] flex flex-col items-center gap-3 active:scale-95 shadow-sm cursor-pointer"
                    >
                        <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-500"><Dumbbell size={28} /></div>
                        <span className="text-sm font-black uppercase tracking-tighter">{t('workouts')}</span>
                    </button>
                    <button
                        onClick={() => router.push('/schedules')}
                        className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[32px] flex flex-col items-center gap-3 active:scale-95 shadow-sm cursor-pointer"
                    >
                        <div className="bg-cyan-500/10 p-4 rounded-2xl text-cyan-500"><Calendar size={28} /></div>
                        <span className="text-sm font-black uppercase tracking-tighter">{t('schedules')}</span>
                    </button>
                    <button
                        onClick={() => router.push('/histories')}
                        className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[32px] flex flex-col items-center gap-3 active:scale-95 shadow-sm cursor-pointer"
                    >
                        <div className="bg-cyan-500/10 p-4 rounded-2xl text-cyan-500"><HistoryIcon size={28} /></div>
                        <span className="text-sm font-black uppercase tracking-tighter">{t('histories')}</span>
                    </button>
                </div>

                {/* --- HISTÓRICO RÁPIDO (RECONSTITUÍDO) --- */}
                <section className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-lg flex items-center gap-2 uppercase italic tracking-tight">
                            <HistoryIcon size={20} className="text-lime-500" />
                            Histórico
                        </h3>
                        <button className="text-[10px] text-lime-600 dark:text-lime-400 font-black uppercase tracking-widest flex items-center gap-1">
                            Ver tudo <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {historyList.map((item) => {
                            const timeAgo = moment(item.endDate).fromNow();
                            const duration = moment.duration(moment(item.endDate).diff(moment(item.date)));
                            const minutes = Math.floor(duration.asMinutes());
                            return (
                                <div key={item.id} className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <div className="w-10 h-10 bg-lime-400/20 rounded-xl flex items-center justify-center text-lime-500">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black uppercase tracking-tight">{item.workoutName} Concluído</p>
                                        <p className="text-[10px] text-zinc-500 font-bold">{timeAgo} • {minutes} min</p>
                                    </div>
                                    {/* <div className="text-right">
                                        <p className="text-xs font-black">12.4t</p>
                                        <p className="text-[9px] text-zinc-500 uppercase">Volume</p>
                                    </div> */}
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}