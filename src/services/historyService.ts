import { db } from '@/config/db';
import { History } from '@/config/types';

export const HistoryService = {
    /**
     * Salva a conclusão de um treino no histórico.
     */
    async createWorkout(historyData: Omit<History, 'id'>) {
        // Validação básica de segurança
        // if (historyData.executions!.length === 0) {
        //     throw new Error("Não é possível salvar um treino sem exercícios executados.");
        // }

        const dataToSave = {
            ...historyData,
            date: historyData.date || new Date(),
            completed: historyData.completed || false
        };

        const id = await db.history.add(dataToSave);

        return { ...dataToSave, id } as History;
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
            // .and(log => log.completed === false)
            .reverse()
            .sortBy('date');

        // Filtra manualmente nas execuções para encontrar o exercício (Dexie não indexa profundamente arrays de objetos)
        for (const log of history) {
            const exerciseLog = log.executions!.find(e => e.exerciseId === exerciseId);
            if (exerciseLog) return exerciseLog;
        }

        return null;
    },

    /**
     * Busca o histórico pendente de um exercício.
     */
    async getPendingHistory(userId: number) {
        const history = await db.history
            .where('userId')
            .equals(userId)
            .and(log => log.completed === false)
            .reverse()
            .sortBy('date');

        return history[0];
    },

    /**
     * Busca o histórico pendente de um exercício.
     */
    async getLastHistory(userId: number) {
        const history = await db.history
            .where('userId')
            .equals(userId)
            .reverse()
            .sortBy('date');

        if (history.length === 0) return null;

        return history[0] as History;
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
    },

    /**
     * Atualiza um histórico existente.
     */
    async updateHistory(id: number, historyData: Partial<History>) {
        const history = await db.history.get(id);
        if (!history)
            throw new Error("Histórico não encontrado.");

        if (historyData.weight && historyData.weight > 0)
            await db.users.update(history.userId, { weight: historyData.weight });

        return await db.history.update(id, {
            ...historyData,
            // Mantém a data de criação original, apenas atualiza o que foi enviado
        });
    },
};