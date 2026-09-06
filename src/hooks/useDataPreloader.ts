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
export async function preloadUserData(userId: string, options: { force?: boolean } = {}): Promise<{ success: boolean; hasUser: boolean }> {
    if (!userId || typeof window === 'undefined' || !navigator.onLine) {
        return { success: false, hasUser: false };
    }

    // 1. Garante isolamento estrito antes de qualquer escrita no Dexie
    await authService.ensureUserIsolation(userId, options.force);

    const preloadKey = `gymaux_preloaded_${userId}`;
    const lastPreload = localStorage.getItem(preloadKey);
    const hoursAgo = lastPreload ? (Date.now() - parseInt(lastPreload, 10)) / 3600000 : Infinity;

    // Se não for forçado e já foi pré-carregado recentemente,
    // verifica se o banco local possui TANTO usuário QUANTO treinos/cronogramas.
    // Se faltar algum ou se o banco estiver vazio, força a sincronização.
    if (!options.force && hoursAgo < 1) {
        try {
            const hasUserLocal = (await db.users.where('id').equals(userId).count()) > 0;
            const workoutCount = await db.workouts.where('userId').equals(userId).count();
            const scheduleCount = await db.schedules.where('userId').equals(userId).count();
            if (hasUserLocal && (workoutCount > 0 || scheduleCount > 0)) {
                return { success: true, hasUser: true };
            }
        } catch {
            // Em caso de falha de leitura do Dexie, continua o preload
        }
    }

    try {
        // Estágio 1: Dados Vitais Imediatos (Perfil + Treinos + Cronogramas)
        // Carregados primeiro para alimentar a Home, Lista de Treinos e Cronogramas
        const [profileResult, workoutsResult, activeScheduleResult, schedulesResult] = await Promise.allSettled([
            userService.getUserById(userId, undefined, { throwOnError: options.force }),
            WorkoutService.getWorkoutsByUserId(userId, '', { page: 1, limit: 100 }),
            ScheduleService.getActiveSchedule(userId),
            ScheduleService.getSchedulesByUserId(userId, '', { page: 1, limit: 100 }),
        ]);

        let userInDexie = await db.users.get(userId);
        if (!userInDexie && profileResult.status === 'fulfilled' && profileResult.value) {
            await db.users.put(profileResult.value);
            userInDexie = profileResult.value;
        }

        // Retry preventivo caso o perfil tenha falhado na primeira tentativa (ex: rede oscilando)
        if (!userInDexie) {
            console.warn('[DataPreloader] Usuário não encontrado no Dexie após Estágio 1. Tentando re-fetch direto...');
            try {
                const retryUser = await userService.getUserById(userId);
                if (retryUser) {
                    await db.users.put(retryUser);
                    userInDexie = retryUser;
                }
            } catch (rErr) {
                console.warn('[DataPreloader] Falha no retry de busca de usuário:', rErr);
            }
        }

        const hasUser = Boolean(userInDexie);
        console.log(`[DataPreloader] Estágio 1 concluído. Perfil presente no Dexie: ${hasUser ? 'SIM' : 'NÃO'}`);

        // Estágio 2: Dados Complementares (Histórico + Exercícios Customizados + Sessões)
        const stage2Results = await Promise.allSettled([
            HistoryService.getUserHistory(userId, 1, 50),
            ExerciseService.preloadUserExercises(userId),
            SessionService.getActiveSessionByUserId(userId),
        ]);

        const stage2Rejections = stage2Results.filter(r => r.status === 'rejected');
        if (stage2Rejections.length > 0) {
            console.warn(`[DataPreloader] Estágio 2 teve ${stage2Rejections.length} rejeição(ões).`);
        }

        // Apenas registra o timestamp no localStorage se o usuário foi de fato salvo no Dexie
        if (hasUser) {
            localStorage.setItem(preloadKey, Date.now().toString());
            return { success: true, hasUser: true };
        } else {
            console.error('[DataPreloader] Sincronização incompleta: perfil do usuário não pôde ser gravado localmente.');
            return { success: false, hasUser: false };
        }
    } catch (err) {
        console.warn('[DataPreloader] Erro durante preload:', err);
        const hasUser = Boolean(await db.users.get(userId).catch(() => null));
        return { success: false, hasUser };
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
