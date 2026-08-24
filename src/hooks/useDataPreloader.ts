'use client';

import { useEffect } from 'react';
import { WorkoutService } from '@/services/workoutService';
import { ScheduleService } from '@/services/scheduleService';
import { HistoryService } from '@/services/historyService';
import { ExerciseService } from '@/services/exerciseService';
import { SessionService } from '@/services/sessionService';

/**
 * Hook para pré-carregar e guardar no Dexie todos os dados do usuário
 * assim que ele se conectar online pela primeira vez.
 */
export function useDataPreloader(userId?: string | null) {
    useEffect(() => {
        if (!userId || typeof window === 'undefined' || !navigator.onLine) return;

        const preloadKey = `gymaux_preloaded_${userId}`;
        const lastPreload = localStorage.getItem(preloadKey);
        const hoursAgo = lastPreload ? (Date.now() - parseInt(lastPreload, 10)) / 3600000 : Infinity;

        // Limita a 1 pré-carregamento por hora para não sobrecarregar
        if (hoursAgo < 1) return;

        Promise.allSettled([
            WorkoutService.getWorkoutsByUserId(userId, '', { page: 1, limit: 100 }),
            ScheduleService.getSchedulesByUserId(userId, '', { page: 1, limit: 100 }),
            HistoryService.getUserHistory(userId, 1, 50),
            ExerciseService.getAllExercises({ pagination: { page: 1, limit: 500 } }),
            SessionService.getActiveSessionByUserId(userId),
        ]).then(() => {
            localStorage.setItem(preloadKey, Date.now().toString());
            console.log('[DataPreloader] All user data successfully preloaded into Dexie for offline use');
        }).catch((err) => {
            console.warn('[DataPreloader] Preload encountered transient error:', err);
        });
    }, [userId]);
}
