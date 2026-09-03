'use client';

import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/config/db';
import { calculateMuscleRecovery, MuscleRecoverySummary } from '@/utils/muscleRecovery';

/**
 * Hook reativo Local-First para cálculo de Descanso Muscular.
 * Consulta o IndexedDB local (Dexie) sem realizar nenhuma requisição de rede síncrona.
 * Atualiza automaticamente via useLiveQuery ao concluir ou sincronizar treinos.
 */
export function useMuscleRecovery(userId?: string | null): {
    summary: MuscleRecoverySummary | null;
    isLoading: boolean;
} {
    const rawData = useLiveQuery(
        async () => {
            if (!userId) return null;

            // Busca histórico do usuário (últimos 30 treinos para garantir cobertura semanal)
            const allHistory = await db.history
                .where('userId')
                .equals(userId)
                .toArray();

            // Ordena pelo mais recente
            const sortedHistory = allHistory.sort((a, b) => {
                const dateA = a.endDate ? new Date(a.endDate).getTime() : new Date(a.date).getTime();
                const dateB = b.endDate ? new Date(b.endDate).getTime() : new Date(b.date).getTime();
                return dateB - dateA;
            }).slice(0, 30);

            // Busca biblioteca local de exercícios
            const allExercises = await db.exercises.toArray();

            return {
                history: sortedHistory,
                exercises: allExercises,
            };
        },
        [userId]
    );

    const summary = useMemo(() => {
        if (!rawData) return null;
        return calculateMuscleRecovery(rawData.history, rawData.exercises);
    }, [rawData]);

    return {
        summary,
        isLoading: rawData === undefined && Boolean(userId),
    };
}
