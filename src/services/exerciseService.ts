import { db } from '@/config/db';
import { Exercise } from '@/config/types';

export const ExerciseService = {
    // Buscar todos
    async getAllExercises(t?: () => any) {
        return await db.exercises.toArray();
    },

    // Buscar por ID
    async getExerciseById(id: number) {
        return await db.exercises.get(id);
    },

    // Criar novo com regras de negócio
    async createExercise(exerciseData: Omit<Exercise, 'id' | 'createdAt'>) {
        // Exemplo de regra de negócio: Garantir que o nome esteja capitalizado
        const formattedName = exerciseData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("Name too short");
        }

        return await db.exercises.add({
            ...exerciseData,
            name: formattedName,
            description: exerciseData.description.trim(),
            mediaUrl: exerciseData.mediaUrl?.trim() || undefined,
            category: exerciseData.category,
            tags: exerciseData.tags,
        });
    },

    async updateExercise(id: number, updateData: Partial<Omit<Exercise, 'id' | 'createdAt'>>) {
        // Exemplo de regra de negócio: Não permitir atualização para nome vazio
        if (updateData.name !== undefined) {
            const formattedName = updateData.name.trim();

            if (formattedName.length < 2) {
                throw new Error("Name too short");
            }
        }

        return await db.exercises.update(id, updateData);
    },

    // Deletar exercicio
    async deleteExerciseById(id: number) {
        return await db.exercises.delete(id);
    }
};