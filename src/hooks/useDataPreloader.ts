'use client';

import { useEffect } from 'react';
import { db } from '@/config/db';
import { WorkoutService } from '@/services/workoutService';
import { ScheduleService } from '@/services/scheduleService';
import { HistoryService } from '@/services/historyService';
import { ExerciseService } from '@/services/exerciseService';
import { SessionService } from '@/services/sessionService';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';

/**
 * Função para pré-carregar e salvar no Dexie todos os dados do usuário
 * a partir da nuvem para uso offline-first imediato.
 */
export async function preloadUserData(userId: string, options: { force?: boolean } = {}): Promise<void> {
    if (!userId || typeof window === 'undefined' || !navigator.onLine) return;

    // 1. Garante isolamento estrito antes de qualquer escrita no Dexie
    await authService.ensureUserIsolation(userId, options.force);

    const preloadKey = `gymaux_preloaded_${userId}`;
    const lastPreload = localStorage.getItem(preloadKey);
    const hoursAgo = lastPreload ? (Date.now() - parseInt(lastPreload, 10)) / 3600000 : Infinity;

    // Se não for forçado e já foi pré-carregado há menos de 1 hora,
    // verifica se o banco local realmente possui os treinos do usuário.
    // Se o banco estiver vazio, força a sincronização mesmo que a flag exista.
    if (!options.force && hoursAgo < 1) {
        try {
            const hasWorkouts = (await db.workouts.where('userId').equals(userId).count()) > 0;
            const hasSchedules = (await db.schedules.where('userId').equals(userId).count()) > 0;
            if (hasWorkouts || hasSchedules) {
                return;
            }
        } catch {
            // Em caso de falha de leitura do Dexie, continua o preload
        }
    }

    try {
        // 2. Garante o perfil no banco local
        await userService.getUserById(userId);

        // 3. Carrega em paralelo todos os dados essenciais da nuvem para o Dexie
        const results = await Promise.allSettled([
            WorkoutService.getWorkoutsByUserId(userId, '', { page: 1, limit: 100 }),
            ScheduleService.getActiveSchedule(userId),
            ScheduleService.getSchedulesByUserId(userId, '', { page: 1, limit: 100 }),
            HistoryService.getUserHistory(userId, 1, 50),
            ExerciseService.preloadUserExercises(userId),
            SessionService.getActiveSessionByUserId(userId),
        ]);

        const failedCount = results.filter(r => r.status === 'rejected').length;
        if (failedCount > 0) {
            console.warn(`[DataPreloader] Preload concluído com ${failedCount} avisos.`);
        } else {
            console.log('[DataPreloader] Todos os dados sincronizados com sucesso no Dexie (Local-First).');
        }

        localStorage.setItem(preloadKey, Date.now().toString());
    } catch (err) {
        console.warn('[DataPreloader] Erro transitório durante preload:', err);
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


