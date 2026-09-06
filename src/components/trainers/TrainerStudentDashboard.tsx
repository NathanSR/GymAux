'use client';

import { useState } from 'react';
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
    ChevronRight,
    Sparkles,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { User, Session, History, Workout } from '@/config/types';
import { formatDuration, getRelativeTime } from '@/utils/dateUtil';
import { HomeOpenSessions, HomeHistoryList } from '@/components/home/HomeLists';
import { MuscleRecoveryWidget } from '@/components/home/MuscleRecoveryWidget';
import { WorkoutGeneratorModal } from '@/components/workouts/WorkoutGeneratorModal';

interface TrainerStudentDashboardProps {
    studentId: string;
    student: User;
    activeSession: Session | null;
    allSessions?: Session[];
    recentHistory: History[];
    workouts: Workout[];
    trainerId?: string;
}

export default function TrainerStudentDashboard({
    studentId,
    student,
    activeSession,
    allSessions = [],
    recentHistory,
    workouts,
    trainerId,
}: TrainerStudentDashboardProps) {
    const t = useTranslations('Trainer');
    const tg = useTranslations('WorkoutGenerator');
    const locale = useLocale();
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

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
            color: 'text-blue-500 dark:text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/20'
        },
        {
            label: t('completedSessions'),
            value: recentHistory.length,
            icon: CheckCircle2,
            color: 'text-lime-500 dark:text-lime-400',
            bg: 'bg-lime-500/10 border-lime-500/20'
        },
        {
            label: t('totalVolume'),
            value: totalVolume ? `${(totalVolume / 1000).toFixed(1)}t` : '0kg',
            icon: TrendingUp,
            color: 'text-orange-500 dark:text-orange-400',
            bg: 'bg-orange-500/10 border-orange-500/20'
        }
    ];

    const studentFirstName = student?.name ? student.name.split(' ')[0] : 'Aluno';

    return (
        <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 pb-12 transition-colors duration-300 font-sans space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="p-5 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-3xl relative overflow-hidden group hover:border-lime-500/40 dark:hover:border-lime-400/40 transition-all shadow-xs"
                    >
                        <div className={`absolute -top-4 -right-4 p-8 ${stat.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity`} />
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
                                    {stat.label}
                                </p>
                                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 italic tracking-tighter">
                                    {stat.value}
                                </h3>
                            </div>
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} border transition-transform group-hover:scale-110 duration-300 shadow-xs`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Live Monitoring Banner if student is actively training */}
            {activeSession && (
                <motion.section
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-lime-400 via-lime-500 to-emerald-500 p-6 sm:p-8 rounded-[32px] text-zinc-950 relative overflow-hidden shadow-xl shadow-lime-500/10 group"
                >
                    <div className="absolute top-1/2 -right-12 -translate-y-1/2 opacity-10 group-hover:scale-105 transition-transform duration-700 pointer-events-none">
                        <Activity className="w-48 h-48 sm:w-64 sm:h-64 animate-pulse" />
                    </div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3 bg-zinc-950/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm border border-zinc-950/10">
                                <span className="h-2 w-2 rounded-full bg-zinc-950 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{t('liveSession')}</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black uppercase italic mb-1.5 leading-none tracking-tight">
                                {activeSession.workoutName}
                            </h2>
                            <p className="text-zinc-950/70 font-bold uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {t('lastActive')}: {getRelativeTime(new Date(activeSession.createdAt), locale)}
                            </p>
                        </div>

                        <Link
                            href={`/trainer/${studentId}/session`}
                            className="px-6 py-3.5 bg-zinc-950 text-white rounded-2xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-zinc-900 active:scale-95 transition-all shadow-lg self-start sm:self-auto shrink-0"
                        >
                            <Play className="w-3.5 h-3.5 fill-lime-400 text-lime-400" />
                            <span>{t('viewDetails')}</span>
                        </Link>
                    </div>
                </motion.section>
            )}

            {/* Montador Inteligente CTA (Reutilizado com IA & Bio) */}
            <section>
                <div className="flex items-center gap-2 mb-3 px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                    <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                        {tg('title')}
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={() => setIsGeneratorOpen(true)}
                    className="w-full p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-lime-500/15 via-emerald-500/10 to-transparent border border-lime-500/30 hover:border-lime-500/60 dark:hover:border-lime-400/50 flex items-center justify-between gap-4 text-left transition-all active:scale-[0.99] group shadow-xs hover:shadow-md cursor-pointer"
                >
                    <div className="flex items-center gap-3.5 sm:gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-lime-400 text-zinc-950 flex items-center justify-center font-black shadow-lg shadow-lime-500/20 group-hover:scale-105 transition-transform shrink-0">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm sm:text-base font-black uppercase italic tracking-tight text-zinc-900 dark:text-white">
                                    Montar Treino para {studentFirstName}
                                </span>
                                <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-lime-500/20 text-lime-600 dark:text-lime-400 border border-lime-500/30">
                                    IA & Bio
                                </span>
                            </div>
                            <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1 line-clamp-1">
                                {tg('ctaHomeDesc')}
                            </p>
                        </div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-zinc-200/60 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-500 group-hover:bg-lime-400 group-hover:text-zinc-950 transition-colors shrink-0">
                        <Sparkles size={16} />
                    </div>
                </button>
            </section>

            {/* Sessões em Aberto do Aluno (Reutilizado com readOnly) */}
            <HomeOpenSessions
                sessionList={allSessions.length > 0 ? allSessions : (activeSession ? [activeSession] : [])}
                historyList={recentHistory}
                activeUserId={studentId}
                readOnly={true}
                baseSessionUrl={`/trainer/${studentId}/session`}
            />

            {/* Recuperação Muscular do Aluno (Reutilizado) */}
            <MuscleRecoveryWidget userId={studentId} />

            {/* Navigation Grid (Workouts & Schedule) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Link href={`/trainer/${studentId}/workouts`} className="group">
                    <motion.div
                        whileHover={{ y: -3 }}
                        className="p-5 sm:p-6 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-3xl flex items-center justify-between cursor-pointer hover:border-lime-500/40 dark:hover:border-lime-400/40 transition-all shadow-xs hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 sm:p-4 bg-lime-500/10 text-lime-600 dark:text-lime-400 rounded-2xl border border-lime-500/20 group-hover:bg-lime-400 group-hover:text-zinc-950 transition-all duration-300 shrink-0">
                                <Dumbbell size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl sm:text-2xl font-black uppercase italic text-zinc-900 dark:text-zinc-100 tracking-tight">
                                    {t('workouts')}
                                </h4>
                                <p className="text-zinc-400 dark:text-zinc-500 text-xs font-bold mt-0.5">
                                    {t('activeWorkouts', { count: workouts.length })}
                                </p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-lime-400 group-hover:text-zinc-950 transition-all shrink-0">
                            <ArrowRight size={18} />
                        </div>
                    </motion.div>
                </Link>

                <Link href={`/trainer/${studentId}/schedule`} className="group">
                    <motion.div
                        whileHover={{ y: -3 }}
                        className="p-5 sm:p-6 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800/80 rounded-3xl flex items-center justify-between cursor-pointer hover:border-blue-500/40 dark:hover:border-blue-400/40 transition-all shadow-xs hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 sm:p-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-500/20 group-hover:bg-blue-400 group-hover:text-zinc-950 transition-all duration-300 shrink-0">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl sm:text-2xl font-black uppercase italic text-zinc-900 dark:text-zinc-100 tracking-tight">
                                    {t('schedule')}
                                </h4>
                                <p className="text-zinc-400 dark:text-zinc-500 text-xs font-bold mt-0.5">
                                    {t('scheduleManagement')}
                                </p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-blue-400 group-hover:text-zinc-950 transition-all shrink-0">
                            <ArrowRight size={18} />
                        </div>
                    </motion.div>
                </Link>
            </div>

            {/* Histórico Recente do Aluno (Reutilizado com link para /trainer/[studentId]/history) */}
            <HomeHistoryList
                historyList={recentHistory}
                activeUserId={studentId}
                baseHistoryUrl={`/trainer/${studentId}/history`}
            />

            {/* Modal do Montador Inteligente de Treinos para o Aluno */}
            {studentId && (
                <WorkoutGeneratorModal
                    isOpen={isGeneratorOpen}
                    onClose={() => setIsGeneratorOpen(false)}
                    userId={studentId}
                    callerId={trainerId}
                    studentMode={true}
                    onWorkoutCreated={() => {
                        setIsGeneratorOpen(false);
                    }}
                />
            )}
        </div>
    );
}
