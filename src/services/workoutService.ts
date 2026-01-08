import { db } from '@/config/db';
import { Workout } from '@/config/types';

export const WorkoutService = {
    /**
     * Busca todos os treinos cadastrados no banco.
     */
    async getAllWorkouts() {
        return await db.workouts.toArray();
    },

    /**
     * Busca os treinos de um usuário específico.
     */
    async getWorkoutsByUserId(userId: number) {
        return await db.workouts.where('userId').equals(userId).toArray();
    },

    /**
     * Busca um treino pelo seu ID único.
     */
    async getWorkoutById(id: number) {
        return await db.workouts.get(id);
    },

    /**
     * Cria um novo treino com validações e formatações.
     * @param workoutData Dados do treino sem ID e sem data de criação automática.
     */
    async createWorkout(workoutData: Omit<Workout, 'id' | 'createdAt'>) {
        // Regra de Negócio: Limpeza e formatação do nome
        const formattedName = workoutData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("O nome do treino deve ter pelo menos 2 caracteres.");
        }

        // Regra de Negócio: Validar se há pelo menos um exercício
        if (!workoutData.exercises || workoutData.exercises.length === 0) {
            throw new Error("Um treino precisa ter pelo menos um exercício vinculado.");
        }

        // Persistência no Dexie
        return await db.workouts.add({
            ...workoutData,
            name: formattedName,
            createdAt: new Date(), // Data de criação automática
            exercises: workoutData.exercises.map(ex => ({
                ...ex,
                sets: Math.max(1, ex.sets), // Garante que sets seja pelo menos 1
                restTime: Math.max(0, ex.restTime) // Garante que descanso não seja negativo
            }))
        });
    },

    /**
     * Atualiza um treino existente.
     */
    async updateWorkout(id: number, workoutData: Partial<Workout>) {
        const workout = await db.workouts.get(id);
        if (!workout) throw new Error("Treino não encontrado.");

        return await db.workouts.update(id, {
            ...workoutData,
            // Mantém a data de criação original, apenas atualiza o que foi enviado
        });
    },

    async addExerciseToWorkout(workoutId: number, newExercise: Workout['exercises'][0]) {
        // 1. Busca o treino atual
        const workout = await db.workouts.get(workoutId);
        if (!workout) throw new Error("Treino não encontrado.");

        // 2. Cria o novo array mantendo os existentes e adicionando o novo
        const updatedExercises = [...(workout.exercises || []), newExercise];

        // 3. Atualiza apenas o campo exercises no banco
        return await db.workouts.update(workoutId, {
            exercises: updatedExercises
        });
    },

    /**
     * Deleta um treino específico.
     * Nota: Como exercícios estão aninhados no array do Workout, 
     * a deleção do Workout já remove os vínculos automaticamente.
     */
    async deleteWorkout(id: number) {
        const workout = await db.workouts.get(id);
        if (!workout) throw new Error("Treino não encontrado.");

        return await db.transaction('rw', db.workouts, async () => {
            // Se houvesse tabelas relacionadas externas (como logs de execução), 
            // faríamos a limpeza aqui antes de deletar o treino.
            await db.workouts.delete(id);
        });
    }
};