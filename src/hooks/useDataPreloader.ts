'use client';

import { useEffect } from 'react';
import { WorkoutService } from '@/services/workoutService';
import { ScheduleService } from '@/services/scheduleService';
import { HistoryService } from '@/services/historyService';
import { ExerciseService } from '@/services/exerciseService';
import { SessionService } from '@/services/sessionService';
import { userService } from '@/services/userService';

/**
 * Função para pré-carregar e salvar no Dexie todos os dados do usuário
 * a partir da nuvem para uso offline-first imediato.
 */
export async function preloadUserData(userId: string, options: { force?: boolean } = {}): Promise<void> {
    if (!userId || typeof window === 'undefined' || !navigator.onLine) return;

    const preloadKey = `gymaux_preloaded_${userId}`;
    const lastPreload = localStorage.getItem(preloadKey);
    const hoursAgo = lastPreload ? (Date.now() - parseInt(lastPreload, 10)) / 3600000 : Infinity;

    // Se não for forçado e já foi pré-carregado há menos de 1 hora, ignora
    if (!options.force && hoursAgo < 1) return;

    try {
        await Promise.allSettled([
            userService.getUserById(userId),
            WorkoutService.getWorkoutsByUserId(userId, '', { page: 1, limit: 100 }),
            ScheduleService.getActiveSchedule(userId),
            ScheduleService.getSchedulesByUserId(userId, '', { page: 1, limit: 100 }),
            HistoryService.getUserHistory(userId, 1, 50),
            ExerciseService.getAllExercises({ pagination: { page: 1, limit: 500 } }),
            SessionService.getActiveSessionByUserId(userId),
        ]);

        localStorage.setItem(preloadKey, Date.now().toString());
        console.log('[DataPreloader] All user data successfully preloaded into Dexie for offline use');
    } catch (err) {
        console.warn('[DataPreloader] Preload encountered transient error:', err);
    }
}

/**
 * Hook para pré-carregar e guardar no Dexie todos os dados do usuário
 * assim que ele se conectar online pela primeira vez.
 */
export function useDataPreloader(userId?: string | null) {
    useEffect(() => {
        if (!userId) return;
        preloadUserData(userId);
    }, [userId]);
}

