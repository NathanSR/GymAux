import { db } from '@/config/db';
import { Schedule } from '@/config/types';

export const ScheduleService = {
    /**
     * Busca todos os cronogramas do banco.
     */
    async getAllSchedules() {
        return await db.schedules.toArray();
    },

    /**
     * Busca cronogramas de um usuário específico.
     */
    async getSchedulesByUserId(userId: number) {
        return await db.schedules.where('userId').equals(userId).toArray();
    },

    /**
     * Busca o cronograma que está marcado como ativo para o usuário.
     */
    async getActiveSchedule(userId: number) {
        return await db.schedules
            .where({ userId, active: true }) // No Dexie, booleanos costumam ser mapeados como 1/0 em índices
            .first();
    },

    async getScheduleById(id: number) {
        return await db.schedules.get(id);
    },

    /**
     * Cria um novo cronograma.
     * Inclui regra para garantir que apenas um cronograma esteja ativo por vez.
     */
    async createSchedule(scheduleData: Omit<Schedule, 'id'>) {
        const formattedName = scheduleData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("O nome do cronograma é muito curto.");
        }

        // Validação: O array de treinos deve ter exatamente 7 posições
        if (scheduleData.workouts.length !== 7) {
            throw new Error("O cronograma deve conter exatamente 7 dias (domingo a sábado).");
        }

        const activeSchedule = await this.getActiveSchedule(scheduleData.userId);
        if (scheduleData.active && activeSchedule) {
            throw new Error("Já existe um cronograma ativo para este usuário.");
        }

        return await db.transaction('rw', db.schedules, async () => {
            // Se o novo cronograma for marcado como ativo, desativa os outros do usuário
            if (scheduleData.active) {
                await db.schedules
                    .where('userId')
                    .equals(scheduleData.userId)
                    .modify({ active: false });
            }

            return await db.schedules.add({
                ...scheduleData,
                name: formattedName,
                lastCompleted: scheduleData.lastCompleted ?? -1 // -1 indica que nenhum foi feito ainda
            });
        });
    },

    /**
     * Atualiza o progresso do cronograma (qual foi o último treino concluído).
     */
    async updateProgress(id: number, workoutIndex: number) {
        if (workoutIndex < 0 || workoutIndex > 6) {
            throw new Error("Índice de dia inválido (deve ser entre 0 e 6).");
        }

        return await db.schedules.update(id, {
            lastCompleted: workoutIndex
        });
    },

    /**
         * Atualiza um cronograma existente.
         */
    async updateSchedule(id: number, scheduleData: Partial<Schedule>) {
        const schedule = await db.schedules.get(id);
        if (!schedule) throw new Error("Cronograma não encontrado.");

        return await db.schedules.update(id, {
            ...scheduleData,
            // Mantém a data de criação original, apenas atualiza o que foi enviado
        });
    },

    /**
     * Ativa um cronograma específico e desativa todos os outros do mesmo usuário.
     */
    async setActiveSchedule(id: number, userId: number) {
        return await db.transaction('rw', db.schedules, async () => {
            // Desativa todos
            await db.schedules
                .where('userId')
                .equals(userId)
                .modify({ active: false });

            // Ativa o selecionado
            return await db.schedules.update(id, { active: true });
        });
    },

    /**
     * Remove um cronograma.
     */
    async deleteSchedule(id: number) {
        const exists = await db.schedules.get(id);
        if (!exists) throw new Error("Cronograma não encontrado.");

        return await db.schedules.delete(id);
    }
};