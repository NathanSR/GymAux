'use client';

import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/config/db';
import { WorkoutService } from '@/services/workoutService';
import { ScheduleService } from '@/services/scheduleService';
import { HistoryService } from '@/services/historyService';
import { ExerciseService } from '@/services/exerciseService';
import { SessionService } from '@/services/sessionService';
import { connectionService } from '@/services/connectionService';
import { createClient } from '@/lib/supabase/client';
import { Workout, Schedule, History, Exercise, Session } from '@/config/types';
import { Student } from '@/components/trainers/StudentCard';
import { sortByNewest } from '@/utils/dateUtil';

/**
 * Retorna lista reativa de treinos do usuário via Dexie (0ms).
 * Atualiza o Dexie em segundo plano se houver conexão.
 */
export function useDexieWorkouts(userId?: string | null): Workout[] | undefined {
    const workouts = useLiveQuery(
        async () => {
            if (!userId) return [];
            const all = await db.workouts
                .where('userId')
                .equals(userId)
                .toArray();
            return sortByNewest(all);
        },
        [userId]
    );

    useEffect(() => {
        if (!userId || typeof window === 'undefined' || !navigator.onLine) return;
        WorkoutService.getWorkoutsByUserId(userId, '', { page: 1, limit: 100 }).catch(err => {
            console.warn('[useDexieWorkouts] Background sync failed:', err);
        });
    }, [userId]);

    return workouts;
}

/**
 * Retorna lista reativa de cronogramas do usuário via Dexie (0ms).
 * Atualiza o Dexie em segundo plano se houver conexão.
 */
export function useDexieSchedules(userId?: string | null): Schedule[] | undefined {
    const schedules = useLiveQuery(
        async () => {
            if (!userId) return [];
            const all = await db.schedules
                .where('userId')
                .equals(userId)
                .toArray();
            return sortByNewest(all);
        },
        [userId]
    );

    useEffect(() => {
        if (!userId || typeof window === 'undefined' || !navigator.onLine) return;
        ScheduleService.getSchedulesByUserId(userId, '', { page: 1, limit: 100 }).catch(err => {
            console.warn('[useDexieSchedules] Background sync failed:', err);
        });
    }, [userId]);

    return schedules;
}

/**
 * Retorna o cronograma ativo do usuário via Dexie (0ms).
 */
export function useDexieActiveSchedule(userId?: string | null): Schedule | null | undefined {
    const schedule = useLiveQuery(
        async () => {
            if (!userId) return null;
            return (
                await db.schedules
                    .where('userId')
                    .equals(userId)
                    .filter(s => s.active === true)
                    .first()
            ) || null;
        },
        [userId]
    );

    useEffect(() => {
        if (!userId || typeof window === 'undefined' || !navigator.onLine) return;
        ScheduleService.getActiveSchedule(userId).catch(err => {
            console.warn('[useDexieActiveSchedule] Background sync failed:', err);
        });
    }, [userId]);

    return schedule;
}

/**
 * Retorna histórico de treinos do usuário via Dexie (0ms).
 */
export function useDexieHistory(userId?: string | null, limit = 20): History[] | undefined {
    const history = useLiveQuery(
        async () => {
            if (!userId) return [];
            const all = await db.history
                .where('userId')
                .equals(userId)
                .toArray();
            return all.sort((a, b) => {
                const dateA = a.endDate ? new Date(a.endDate).getTime() : new Date(a.date).getTime();
                const dateB = b.endDate ? new Date(b.endDate).getTime() : new Date(b.date).getTime();
                return dateB - dateA;
            }).slice(0, limit);
        },
        [userId, limit]
    );

    useEffect(() => {
        if (!userId || typeof window === 'undefined' || !navigator.onLine) return;
        HistoryService.getUserHistory(userId, 1, limit).catch(err => {
            console.warn('[useDexieHistory] Background sync failed:', err);
        });
    }, [userId, limit]);

    return history;
}

/**
 * Retorna sessão ativa do usuário via Dexie (0ms).
 */
export function useDexieActiveSession(userId?: string | null): Session | null | undefined {
    const session = useLiveQuery(
        async () => {
            if (!userId) return null;
            const sessions = await db.sessions
                .where('userId')
                .equals(userId)
                .and(s => !s.isFinishedLocally)
                .toArray();

            if (sessions.length > 0) {
                return sessions.reduce((a, b) => (new Date(a.createdAt) > new Date(b.createdAt) ? a : b));
            }
            return null;
        },
        [userId]
    );

    useEffect(() => {
        if (!userId || typeof window === 'undefined' || !navigator.onLine) return;
        SessionService.getActiveSessionByUserId(userId).catch(err => {
            console.warn('[useDexieActiveSession] Background sync failed:', err);
        });
    }, [userId]);

    return session;
}

/**
 * Retorna todas as sessões abertas de um usuário via Dexie (0ms).
 */
export function useDexieSessions(userId?: string | null): Session[] | undefined {
    const sessions = useLiveQuery(
        async () => {
            if (!userId) return [];
            const list = await db.sessions
                .where('userId')
                .equals(userId)
                .and(s => !s.isFinishedLocally)
                .toArray();
            return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        },
        [userId]
    );

    useEffect(() => {
        if (!userId || typeof window === 'undefined' || !navigator.onLine) return;
        SessionService.getSessionsByUserId(userId).catch(err => {
            console.warn('[useDexieSessions] Background sync failed:', err);
        });
    }, [userId]);

    return sessions;
}

/**
 * Retorna alunos ativos de um treinador via Dexie (0ms) com revalidação em background.
 */
export function useDexieActiveStudents(trainerId?: string | null): Student[] | undefined {
    const students = useLiveQuery(
        async () => {
            if (!trainerId) return [];
            const conns = await db.connections
                .where('trainer_id')
                .equals(trainerId)
                .and(c => c.status === 'active')
                .toArray();

            const list: Student[] = [];
            for (const conn of conns) {
                const profile = await db.users.get(conn.student_id);
                if (profile) {
                    list.push({
                        id: profile.id || conn.student_id,
                        name: profile.name,
                        avatar: profile.avatar || null,
                    });
                }
            }
            return list;
        },
        [trainerId]
    );

    useEffect(() => {
        if (!trainerId || typeof window === 'undefined' || !navigator.onLine) return;
        const supabase = createClient();
        connectionService.getActiveStudents(trainerId, supabase, { page: 1, limit: 50 }).catch(err => {
            console.warn('[useDexieActiveStudents] Background sync failed:', err);
        });
    }, [trainerId]);

    return students;
}

/**
 * Retorna todos os exercícios disponíveis via Dexie (0ms) e revalida silenciosamente no Dexie.
 */
export function useDexieExercises(): Exercise[] | undefined {
    const exercises = useLiveQuery(
        async () => {
            return await db.exercises.toArray();
        },
        []
    );

    useEffect(() => {
        if (typeof window === 'undefined' || !navigator.onLine) return;
        ExerciseService.revalidateExercisesInBackground().catch(err => {
            console.warn('[useDexieExercises] Background sync failed:', err);
        });
    }, []);

    return exercises;
}
