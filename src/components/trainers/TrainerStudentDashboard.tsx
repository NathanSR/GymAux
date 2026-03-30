'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import {
    Activity,
    Calendar,
    Dumbbell,
    History as HistoryIcon,
    ArrowRight,
    TrendingUp,
    Clock,
    Play,
    CheckCircle2,
    ChevronRight
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { User, Session, History, Workout } from '@/config/types';
import { formatDuration, getRelativeTime } from '@/utils/dateUtil';

interface TrainerStudentDashboardProps {
    studentId: string;
    student: User;
    activeSession: Session | null;
    recentHistory: History[];
    workouts: Workout[];
}

export default function TrainerStudentDashboard({
    studentId,
    student,
    activeSession,
    recentHistory,
    workouts
}: TrainerStudentDashboardProps) {
    const t = useTranslations('Trainer');
    const locale = useLocale();

    const totalVolume = recentHistory.reduce((acc, h) => {
        return acc + (h.executions?.reduce((gAcc, g) => {
            return gAcc + (g.exercises?.reduce((eAcc, e) => {
                return eAcc + (e.sets?.reduce((sAcc, s) => sAcc + (s.weight || 0) * (s.reps || 0), 0) || 0);
            }, 0) || 0);
        }, 0) || 0);
    }, 0);

    const stats = [
        {
            label: t('lastActive'),
            value: recentHistory[0] ? getRelativeTime(recentHistory[0].date, locale) : '--',
            icon: Activity,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        },
        {
            label: t('completedSessions'),
            value: recentHistory.length,
            icon: CheckCircle2,
            color: 'text-lime-400',
            bg: 'bg-lime-400/10'
        },
        {
            label: t('totalVolume'),
            value: totalVolume ? `${(totalVolume / 1000).toFixed(1)}t` : '0kg',
            icon: TrendingUp,
            color: 'text-orange-400',
            bg: 'bg-orange-400/10'
        }
    ];

    return (
        <div className="p-4 md:p-6 space-y-10 max-w-5xl mx-auto pb-20">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-[32px] relative overflow-hidden group hover:border-zinc-700 transition-all"
                    >
                        <div className={`absolute -top-4 -right-4 p-8 ${stat.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity`} />
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
                                <h3 className="text-2xl md:text-3xl font-black text-zinc-100 italic tracking-tighter">
                                    {stat.value}
                                </h3>
                            </div>
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Live Monitoring Section */}
            {activeSession ? (
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-lime-400 to-lime-500 p-8 md:p-10 rounded-[40px] text-zinc-950 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(163,230,53,0.3)] group"
                >
                    <div className="absolute top-1/2 -right-20 -translate-y-1/2 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                        <Activity className="w-64 h-64 md:w-80 md:h-80 animate-pulse" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-6 bg-zinc-950/10 w-fit px-4 py-1.5 rounded-full backdrop-blur-sm border border-zinc-950/5">
                                <span className="h-2 w-2 rounded-full bg-zinc-950 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{t('liveSession')}</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-2 leading-none tracking-tighter">
                                {activeSession.workoutName}
                            </h2>
                            <p className="text-zinc-900/60 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {t('lastActive')}: {getRelativeTime(activeSession.createdAt, locale)}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Link
                                href={`/trainer/${studentId}/session`}
                                className="px-10 py-5 bg-zinc-950 text-white rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl hover:bg-zinc-900 group/btn"
                            >
                                <Play className="w-4 h-4 fill-lime-400 text-lime-400 group-hover/btn:translate-x-1 transition-transform" />
                                {t('viewDetails')}
                            </Link>
                        </div>
                    </div>
                </motion.section>
            ) : (
                <div className="p-8 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-[40px] flex flex-col items-center justify-center text-center gap-3 grayscale opacity-40">
                    <HistoryIcon className="w-10 h-10 text-zinc-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('noActiveSession')}</p>
                </div>
            )}

            {/* Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Workouts Card */}
                <Link href={`/trainer/${studentId}/workouts`} className="group">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-4 md:p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-[40px] flex items-center justify-between cursor-pointer hover:border-lime-400/50 transition-all overflow-hidden relative"
                    >
                        <div className="absolute -right-10 -bottom-10 p-16 bg-lime-400/5 rounded-full blur-3xl group-hover:bg-lime-400/10 transition-colors" />
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="p-5 bg-zinc-800/80 rounded-[28px] border border-zinc-700/50 group-hover:border-lime-400/30 group-hover:bg-zinc-800 transition-all shadow-inner">
                                <Dumbbell className="w-10 h-10 text-lime-400" />
                            </div>
                            <div>
                                <h4 className="text-2xl md:text-3xl font-black uppercase italic text-zinc-100 tracking-tighter">{t('workouts')}</h4>
                                <p className="text-lime-400/60 text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-2">
                                    {t('activeWorkouts', { count: workouts.length })}
                                </p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-800 text-zinc-500 group-hover:bg-lime-400 group-hover:text-zinc-950 transition-all relative z-10 shadow-lg">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                    </motion.div>
                </Link>

                {/* Schedule Card */}
                <Link href={`/trainer/${studentId}/schedule`} className="group">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="p-4 md:p-8 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-[40px] flex items-center justify-between cursor-pointer hover:border-lime-400/50 transition-all overflow-hidden relative"
                    >
                        <div className="absolute -right-10 -bottom-10 p-16 bg-blue-400/5 rounded-full blur-3xl group-hover:bg-blue-400/10 transition-colors" />
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="p-5 bg-zinc-800/80 rounded-[28px] border border-zinc-700/50 group-hover:border-blue-400/30 group-hover:bg-zinc-800 transition-all shadow-inner">
                                <Calendar className="w-10 h-10 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-2xl md:text-3xl font-black uppercase italic text-zinc-100 tracking-tighter">{t('schedule')}</h4>
                                <p className="text-blue-400/60 text-[10px] font-black uppercase tracking-[0.2em] leading-none mt-2">
                                    {t('scheduleManagement')}
                                </p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-800 text-zinc-500 group-hover:bg-blue-400 group-hover:text-zinc-950 transition-all relative z-10 shadow-lg">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                    </motion.div>
                </Link>
            </div>

            {/* Recent History List */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm">
                            <HistoryIcon className="w-6 h-6 text-lime-400" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black uppercase italic text-zinc-100 tracking-tighter">
                            {t('history')}
                        </h3>
                    </div>
                    <Link
                        href={`/trainer/${studentId}/history`}
                        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 hover:text-lime-400 transition-all"
                    >
                        {t('viewDetails')}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {recentHistory.length > 0 ? recentHistory.slice(0, 4).map((item, idx) => (
                        <Link
                            key={item.id}
                            href={`/trainer/${studentId}/history?date=${new Date(item.date).toISOString().split('T')[0]}&workoutId=${item.id}`}
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/60 rounded-[32px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-lime-400/30 hover:bg-zinc-900/60 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-zinc-800 rounded-3xl group-hover:bg-lime-400/10 transition-colors border border-zinc-700/50 group-hover:border-lime-400/20">
                                        <Clock className="w-6 h-6 text-lime-400" />
                                    </div>
                                    <div>
                                        <h5 className="font-black text-xl text-zinc-100 uppercase italic tracking-tight group-hover:text-lime-400 transition-colors">{item.workoutName}</h5>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                            {new Date(item.date).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                            {formatDuration(item.duration || 0)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 self-end sm:self-auto pr-4">
                                    <div className="text-right">
                                        <div className="flex items-baseline justify-end gap-1">
                                            <p className="text-2xl font-black text-lime-400 italic leading-none">{item.weight || 0}</p>
                                            <span className="text-[10px] font-black text-lime-400/50 pb-0.5">KG</span>
                                        </div>
                                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1">{t('historyWeight')}</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-zinc-800/50 text-zinc-700 group-hover:bg-lime-400/10 group-hover:text-lime-400 transition-all">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    )) : (
                        <div className="p-16 text-center rounded-[40px] border-2 border-dashed border-zinc-800/50 bg-zinc-900/10 backdrop-blur-sm grayscale">
                            <HistoryIcon className="w-12 h-12 text-zinc-800 mx-auto mb-4 opacity-50" />
                            <p className="text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px]">
                                {t('noRecentHistory')}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

