'use client';

import { useEffect } from 'react';
import { WorkoutService } from '@/services/workoutService';
import { ScheduleService } from '@/services/scheduleService';
import { HistoryService } from '@/services/historyService';
import { ExerciseService } from '@/services/exerciseService';
import { SessionService } from '@/services/sessionService';
import { userService } from '@/services/userService';
import { taxonomyService } from '@/services/taxonomyService';

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
            userService.getUserById(userId),
            WorkoutService.getWorkoutsByUserId(userId, '', { page: 1, limit: 200 }),
            ScheduleService.getSchedulesByUserId(userId, '', { page: 1, limit: 100 }),
            ScheduleService.getActiveSchedule(userId),
            HistoryService.getUserHistory(userId, 1, 100),
            ExerciseService.getAllExercises({ pagination: { page: 1, limit: 1000 } }),
            SessionService.getSessionsByUserId(userId),
            taxonomyService.getCategories(),
            taxonomyService.getEquipment(),
        ]).then(() => {
            localStorage.setItem(preloadKey, Date.now().toString());
            console.log('[DataPreloader] All user data successfully preloaded into Dexie for offline use');
        }).catch((err) => {
            console.warn('[DataPreloader] Preload encountered transient error:', err);
        });
    }, [userId]);
}
