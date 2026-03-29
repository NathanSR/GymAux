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
    CheckCircle2
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

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] relative overflow-hidden group"
                >
                    <div className="absolute top-4 right-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Activity className="w-12 h-12 text-lime-400" />
                    </div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{t('lastActive')}</p>
                    <h3 className="text-2xl font-black text-zinc-100 italic">
                        {recentHistory[0] ? getRelativeTime(recentHistory[0].date, locale) : '--'}
                    </h3>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] relative overflow-hidden group"
                >
                    <div className="absolute top-4 right-4 opacity-10 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-12 h-12 text-lime-400" />
                    </div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{t('completedSessions')}</p>
                    <h3 className="text-2xl font-black text-zinc-100 italic">{recentHistory.length}</h3>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] relative overflow-hidden group"
                >
                    <div className="absolute top-4 right-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-12 h-12 text-lime-400" />
                    </div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{t('totalVolume')}</p>
                    <h3 className="text-2xl font-black text-zinc-100 italic">
                        {totalVolume ? `${(totalVolume / 1000).toFixed(1)}t` : '0kg'}
                    </h3>
                </motion.div>
            </div>

            {/* Live Monitoring Section */}
            {activeSession && (
                <section className="bg-lime-400 p-8 rounded-[40px] text-zinc-950 relative overflow-hidden shadow-[0_20px_50px_rgba(163,230,53,0.15)]">
                    <div className="absolute -top-12 -right-12 p-8 opacity-10">
                        <Activity className="w-48 h-48 animate-pulse" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-2 w-2 rounded-full bg-zinc-950 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('liveSession')}</span>
                        </div>
                        <h2 className="text-4xl font-black uppercase italic mb-8 leading-none tracking-tighter">
                            {activeSession.workoutName}
                        </h2>
                        <div className="flex gap-4">
                            <Link 
                                href={`/trainer/${studentId}/session`}
                                className="px-8 py-4 bg-zinc-950 text-white rounded-[20px] font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
                            >
                                <Activity className="w-5 h-5 text-lime-400" />
                                {t('viewDetails')}
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Workouts Card */}
                <Link href={`/trainer/${studentId}/workouts`}>
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="p-8 bg-zinc-900 border border-zinc-800 rounded-[40px] flex items-center justify-between group cursor-pointer hover:border-lime-400/50 transition-all border-b-4 border-b-lime-400/10"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-5 bg-zinc-800 rounded-[28px] border border-zinc-700/50 group-hover:border-lime-400/30 group-hover:bg-zinc-800/80 transition-all">
                                <Dumbbell className="w-10 h-10 text-lime-400" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black uppercase italic text-zinc-100 tracking-tight">{t('workouts')}</h4>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none mt-1">{workouts.length} TREINOS ATIVOS</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-800 text-zinc-600 group-hover:bg-lime-400 group-hover:text-zinc-950 transition-all">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                    </motion.div>
                </Link>

                {/* Schedule Card */}
                <Link href={`/trainer/${studentId}/schedule`}>
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="p-8 bg-zinc-900 border border-zinc-800 rounded-[40px] flex items-center justify-between group cursor-pointer hover:border-lime-400/50 transition-all border-b-4 border-b-lime-400/10"
                    >
                        <div className="flex items-center gap-6">
                            <div className="p-5 bg-zinc-800 rounded-[28px] border border-zinc-700/50 group-hover:border-lime-400/30 group-hover:bg-zinc-800/80 transition-all">
                                <Calendar className="w-10 h-10 text-lime-400" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black uppercase italic text-zinc-100 tracking-tight">{t('schedule')}</h4>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none mt-1">GESTÃO DE AGENDA</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-800 text-zinc-600 group-hover:bg-lime-400 group-hover:text-zinc-950 transition-all">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                    </motion.div>
                </Link>
            </div>

            {/* Recent History List */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-2xl font-black uppercase italic text-zinc-100 tracking-tight flex items-center gap-3">
                        <HistoryIcon className="w-6 h-6 text-lime-400" />
                        {t('history')}
                    </h3>
                    <Link 
                        href={`/trainer/${studentId}/history`}
                        className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-lime-400 transition-colors border-b border-zinc-800 pb-1"
                    >
                        {t('viewDetails')}
                    </Link>
                </div>

                <div className="space-y-4">
                    {recentHistory.length > 0 ? recentHistory.slice(0, 3).map((item, idx) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] flex items-center justify-between group hover:border-lime-400/20 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-zinc-800 rounded-3xl group-hover:bg-lime-400/10 transition-colors">
                                    <Clock className="w-6 h-6 text-lime-400" />
                                </div>
                                <div>
                                    <h5 className="font-black text-xl text-zinc-200 uppercase italic leading-none mb-1">{item.workoutName}</h5>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                        {new Date(item.date).toLocaleDateString()} • {formatDuration(item.duration || 0)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-lime-400 italic leading-none">{item.weight || 0}<span className="text-sm">kg</span></p>
                                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-tighter">PESO REGISTRADO</p>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="p-12 text-center rounded-[32px] border-2 border-dashed border-zinc-800 text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
                            Nenhum histórico recente
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

