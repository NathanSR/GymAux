import { db } from '@/config/db';
import { History } from '@/config/types';

export const HistoryService = {
    /**
     * Salva a conclusão de um treino no histórico.
     */
    async logWorkout(historyData: Omit<History, 'id'>) {
        // Validação básica de segurança
        if (historyData.executions.length === 0) {
            throw new Error("Não é possível salvar um treino sem exercícios executados.");
        }

        return await db.history.add({
            ...historyData,
            date: historyData.date || new Date()
        });
    },

    /**
     * Busca todo o histórico de um usuário específico, ordenado pela data mais recente.
     */
    async getUserHistory(userId: number) {
        return await db.history
            .where('userId')
            .equals(userId)
            .reverse() // Do mais novo para o mais antigo
            .sortBy('date');
    },

    /**
     * Busca o histórico de um treino específico para ver evolução.
     */
    async getWorkoutEvolution(userId: number, workoutId: number) {
        return await db.history
            .where({ userId, workoutId })
            .reverse()
            .sortBy('date');
    },

    /**
     * Busca a última execução de um exercício específico. 
     * Útil para sugerir cargas (carga do treino anterior).
     */
    async getLastExerciseExecution(userId: number, exerciseId: number) {
        const history = await db.history
            .where('userId')
            .equals(userId)
            .reverse()
            .sortBy('date');

        // Filtra manualmente nas execuções para encontrar o exercício (Dexie não indexa profundamente arrays de objetos)
        for (const log of history) {
            const exerciseLog = log.executions.find(e => e.exerciseId === exerciseId);
            if (exerciseLog) return exerciseLog;
        }

        return null;
    },

    /**
     * Calcula estatísticas básicas: Total de treinos realizados.
     */
    async getTotalWorkoutsCount(userId: number) {
        return await db.history.where('userId').equals(userId).count();
    },

    /**
     * Busca o histórico dentro de um intervalo de datas (para gráficos).
     */
    async getHistoryByRange(userId: number, startDate: Date, endDate: Date) {
        return await db.history
            .where('userId')
            .equals(userId)
            .filter(log => log.date >= startDate && log.date <= endDate)
            .toArray();
    },

    /**
     * Permite deletar um registro do histórico.
     */
    async deleteHistoryEntry(id: number) {
        return await db.history.delete(id);
    },

    /**
     * Permite adicionar ou editar uma nota/descrição a um treino já realizado.
     */
    async updateDescription(id: number, description: string) {
        return await db.history.update(id, { description });
    }
};