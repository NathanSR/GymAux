'use client';

import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/config/db';
import { WorkoutService } from '@/services/workoutService';
import { ScheduleService } from '@/services/scheduleService';
import { HistoryService } from '@/services/historyService';
import { ExerciseService } from '@/services/exerciseService';
import { SessionService } from '@/services/sessionService';
import { Workout, Schedule, History, Exercise, Session } from '@/config/types';
import { sortByNewest } from '@/utils/dateUtil';

/**
 * Retorna lista reativa de treinos do usuário via Dexie.
 * Retorna undefined enquanto a consulta ao IndexedDB estiver em andamento.
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
 * Retorna o cronograma ativo do usuário via Dexie.
 * Retorna undefined enquanto a consulta ao IndexedDB estiver em andamento.
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
 * Retorna histórico de treinos do usuário via Dexie.
 * Retorna undefined enquanto a consulta ao IndexedDB estiver em andamento.
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
 * Retorna sessão ativa do usuário via Dexie.
 * Retorna undefined enquanto a consulta ao IndexedDB estiver em andamento.
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
                return sessions.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
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
 * Retorna todos os exercícios disponíveis via Dexie.
 * Retorna undefined enquanto a consulta ao IndexedDB estiver em andamento.
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
        ExerciseService.getAllExercises({ pagination: { page: 1, limit: 200 } }).catch(err => {
            console.warn('[useDexieExercises] Background sync failed:', err);
        });
    }, []);

    return exercises;
}
