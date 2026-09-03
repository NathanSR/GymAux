"use client";

import {
    Play,
    CheckCircle2,
    Calendar,
    ChevronRight,
    Clock,
    History as HistoryIcon,
    Trash2,
    Dumbbell,
    Layers,
    RotateCcw,
} from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { useSessionActions } from '@/hooks/useSessionActions';
import { History, Session } from '@/config/types';
import { formatDuration, getRelativeTime } from '@/utils/dateUtil';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/config/db';
import ConnectionConfirmationModal from '@/components/home/ConnectionConfirmationModal';
import { LocalizedExerciseName } from '@/components/ui/LocalizedExerciseName';

/**
 * Componente dedicado para Sessões em Aberto
 */
export function HomeOpenSessions({
    sessionList: initialSessionList,
    historyList: initialHistoryList = [],
    activeUserId,
}: {
    sessionList: Session[];
    historyList?: History[];
    activeUserId: string;
}) {
    const t = useTranslations('Home');
    const tw = useTranslations('WorkoutForm');
    const locale = useLocale();
    const { resumeWorkout, cancelSession } = useSessionActions();

    // Live query for local sessions to filter out locally finished ones
    const localSessions = useLiveQuery(async () => {
        if (!activeUserId) return [];
        return await db.sessions
            .where('userId')
            .equals(activeUserId)
            .toArray();
    }, [activeUserId]);

    // Live query for local history
    const recentLocalHistory = useLiveQuery(async () => {
        if (!activeUserId) return [];
        return await db.history
            .where('userId')
            .equals(activeUserId)
            .reverse()
            .limit(10)
            .toArray();
    }, [activeUserId]);

    const combinedHistory = [...(recentLocalHistory || [])];
    initialHistoryList.forEach(serverItem => {
        if (!combinedHistory.find(h => h.id === serverItem.id)) {
            combinedHistory.push(serverItem);
        }
    });

    const sessions: Session[] = [];

    if (localSessions !== undefined) {
        const validLocalSessions = localSessions.filter(s => !s.isFinishedLocally);
        sessions.push(...validLocalSessions);

        initialSessionList.forEach(serverSession => {
            const alreadyInList = sessions.find(s => s.id === serverSession.id);
            if (alreadyInList) return;

            const isFinishedLocally = localSessions.find(s => s.id === serverSession.id && s.isFinishedLocally);
            if (isFinishedLocally) return;

            const hasHistoryToday = combinedHistory.find(h => {
                if (h.workoutId !== serverSession.workoutId) return false;
                const hDate = new Date(h.endDate || h.date);
                const today = new Date();
                return (
                    hDate.getDate() === today.getDate() &&
                    hDate.getMonth() === today.getMonth() &&
                    hDate.getFullYear() === today.getFullYear()
                );
            });
            if (hasHistoryToday) return;

            sessions.push(serverSession);
        });
    }

    if (sessions.length === 0) return null;

    return (
        <section className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                    <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                        {t('openSessions')}
                    </h2>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-lime-500/20 text-[9px] font-black tracking-wider">
                    {sessions.length}
                </span>
            </div>

            <div className="space-y-2.5">
                {sessions.map((session) => {
                    const total = session.exercisesToDo.length;
                    const done = (session.exercisesDone || []).filter(g => g && g.exercises && g.exercises.length > 0).length;
                    const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

                    return (
                        <div
                            key={session.id}
                            className="p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/70 border border-zinc-200/90 dark:border-zinc-800/80 shadow-xs transition-all"
                        >
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-lime-500/10 dark:bg-lime-500/15 border border-lime-500/20 text-lime-500 flex items-center justify-center shrink-0">
                                    <RotateCcw size={18} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <p className="text-xs sm:text-sm font-black uppercase italic tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                                            {session.workoutName}
                                        </p>
                                        <span className="text-[10px] font-black text-lime-600 dark:text-lime-400 tabular-nums shrink-0">
                                            {progressPercent}%
                                        </span>
                                    </div>

                                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-lime-500 rounded-full transition-all duration-500"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        onClick={() => cancelSession(session.id!)}
                                        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-zinc-200/70 dark:bg-zinc-800/80 text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                        title={t('cancelCancel')}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => resumeWorkout(session.id!)}
                                        className="h-9 sm:h-10 px-3 sm:px-4 flex items-center justify-center gap-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer"
                                    >
                                        <Play size={14} fill="currentColor" />
                                        <span className="hidden sm:inline">{t('resume')}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-zinc-200/60 dark:border-zinc-800/60 text-[10px]">
                                <span className="text-zinc-400 dark:text-zinc-500 font-medium">
                                    {session.pausedAt ? `${t('pausedAt', { date: '' }).split(':')[0]}: ${session.pausedAt.toLocaleString(locale, { hour: '2-digit', minute: '2-digit' })}` : ''}
                                </span>

                                <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 truncate max-w-[180px] sm:max-w-none">
                                    <span className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-bold text-[9px]">
                                        {t('next')}:
                                    </span>
                                    <span className="font-bold text-lime-600 dark:text-lime-400 truncate">
                                        {(() => {
                                            const nextGroup = session.exercisesToDo[session.current?.groupIndex || 0];
                                            const nextExercise = nextGroup?.exercises?.[session.current?.exerciseIndex || 0];
                                            if (!nextExercise) return t('next');

                                            const currentVar = nextExercise.variation || 'none';
                                            const currentMode = nextExercise.executionMode || 'bilateral';
                                            const parts = [];
                                            if (currentVar !== 'none') {
                                                const isPredefined = ['none', 'barbell', 'dumbbell', 'cable', 'machine', 'smith'].includes(currentVar);
                                                parts.push(isPredefined ? tw(`variationOptions.${currentVar}`) : currentVar);
                                            }
                                            if (currentMode !== 'bilateral') {
                                                parts.push(tw(`executionModes.${currentMode}`));
                                            }
                                            const suffix = parts.length > 0 ? ` (${parts.join(' • ')})` : null;

                                            return (
                                                <LocalizedExerciseName
                                                    exerciseId={nextExercise.exerciseId}
                                                    fallbackName={nextExercise.exerciseName || t('next')}
                                                    suffix={suffix}
                                                />
                                            );
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/**
 * Componente dedicado para Histórico de Treinos
 */
export function HomeHistoryList({
    historyList: initialHistoryList,
    activeUserId,
}: {
    historyList: History[];
    activeUserId: string;
}) {
    const t = useTranslations('Home');
    const locale = useLocale();

    // Live query for local history
    const recentLocalHistory = useLiveQuery(async () => {
        if (!activeUserId) return [];
        return await db.history
            .where('userId')
            .equals(activeUserId)
            .reverse()
            .limit(10)
            .toArray();
    }, [activeUserId]);

    const combinedHistory = [...(recentLocalHistory || [])];
    initialHistoryList.forEach(serverItem => {
        if (!combinedHistory.find(h => h.id === serverItem.id)) {
            combinedHistory.push(serverItem);
        }
    });

    const historyList = combinedHistory
        .sort((a, b) => {
            const dateA = a.endDate ? new Date(a.endDate).getTime() : new Date(a.date).getTime();
            const dateB = b.endDate ? new Date(b.endDate).getTime() : new Date(b.date).getTime();
            return dateB - dateA;
        })
        .slice(0, 4);

    return (
        <section className="mb-6">
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                    <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                        {t('history')}
                    </h2>
                </div>

                <Link
                    href="/history"
                    className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 flex items-center gap-1 transition-colors group/btn py-1 px-2 -mr-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                >
                    <span>{t('viewAll')}</span>
                    <ChevronRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {historyList.length === 0 ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-zinc-100/60 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-2.5">
                        <HistoryIcon size={20} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                        {t('emptyHistory')}
                    </p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 max-w-xs font-medium">
                        {t('emptyHistorySub')}
                    </p>
                </div>
            ) : (
                <div className="space-y-2 sm:space-y-2.5">
                    {historyList.map((item) => {
                        const itemDate = item.endDate ? new Date(item.endDate) : new Date(item.date);
                        const timeAgo = itemDate ? getRelativeTime(itemDate, locale) : "";
                        const durationDisplay = formatDuration(item.duration || 0);

                        const executedExercisesCount =
                            item.executions?.reduce((acc, g) => acc + (g.exercises?.length || 0), 0) || 0;
                        const executedSetsCount =
                            item.executions?.reduce(
                                (acc, g) => acc + g.exercises.reduce((sAcc, e) => sAcc + (e.sets?.length || 0), 0),
                                0
                            ) || 0;

                        return (
                            <Link
                                key={item.id}
                                href={`/history?date=${itemDate.toISOString()}&workoutId=${item.workoutId}`}
                                className="group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/70 hover:bg-white dark:hover:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/80 hover:border-lime-500/40 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]"
                            >
                                {/* Ícone de Treino Concluído */}
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-lime-500/10 dark:bg-lime-500/15 border border-lime-500/20 flex items-center justify-center text-lime-600 dark:text-lime-400 shrink-0 group-hover:bg-lime-400 group-hover:text-zinc-950 transition-all duration-300">
                                    <CheckCircle2 size={18} className="sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                                </div>

                                {/* Dados do Treino */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <p className="text-xs sm:text-sm font-black uppercase italic tracking-tight text-zinc-900 dark:text-zinc-100 truncate group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                                            {item.workoutName}
                                        </p>
                                        <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 shrink-0">
                                            {timeAgo}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-[10px] font-bold">
                                        <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
                                            <Clock size={11} className="text-lime-500 shrink-0" />
                                            <span>{durationDisplay}</span>
                                        </div>

                                        {executedExercisesCount > 0 && (
                                            <>
                                                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                                <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                                                    <Dumbbell size={11} className="text-zinc-400 shrink-0" />
                                                    <span>{executedExercisesCount} {t('exercises').toLowerCase()}</span>
                                                </div>
                                            </>
                                        )}

                                        {executedSetsCount > 0 && (
                                            <>
                                                <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
                                                <div className="hidden sm:flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                                                    <Layers size={11} className="text-zinc-400 shrink-0" />
                                                    <span>{executedSetsCount} {t('sets').toLowerCase()}</span>
                                                </div>
                                            </>
                                        )}

                                        <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                        <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 font-medium">
                                            <Calendar size={11} className="shrink-0" />
                                            <span>{itemDate.toLocaleDateString(locale, { day: '2-digit', month: 'short' })}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Indicador de Ação */}
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0">
                                    <ChevronRight size={16} />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {activeUserId && <ConnectionConfirmationModal userId={activeUserId} />}
        </section>
    );
}

/**
 * Componente agrupador legado
 */
export function HomeLists({
    historyList,
    sessionList,
    activeUserId,
}: {
    historyList: History[];
    sessionList: Session[];
    activeUserId: string;
}) {
    return (
        <>
            <HomeOpenSessions
                sessionList={sessionList}
                historyList={historyList}
                activeUserId={activeUserId}
            />
            <HomeHistoryList
                historyList={historyList}
                activeUserId={activeUserId}
            />
        </>
    );
}
