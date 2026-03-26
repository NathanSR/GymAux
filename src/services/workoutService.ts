import { createClient } from '@/lib/supabase/client';
import { Workout } from '@/config/types';

const mapWorkoutFromSupabase = (workout: any): Workout => ({
    id: workout.id,
    userId: workout.user_id,
    name: workout.name,
    description: workout.description || undefined,
    createdAt: workout.created_at ? new Date(workout.created_at) : new Date(),
    exercises: (workout.exercises || []).map((ex: any) => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        sets: ex.sets,
        reps: ex.reps,
        restTime: ex.restTime,
    }))
});

export const WorkoutService = {
    /**
     * Busca todos os treinos cadastrados no banco.
     */
    async getAllWorkouts(supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('workouts')
            .select('*');

        if (error) {
            console.error('Error fetching all workouts:', error);
            return [];
        }

        return (data || []).map(mapWorkoutFromSupabase);
    },

    /**
     * Busca os treinos de um usuário específico com filtros e paginação.
     */
    async getWorkoutsByUserId(userId: string, searchQuery = '', pagination?: { page: number; limit: number }, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        let query = supabase
            .from('workouts')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (searchQuery.trim()) {
            query = query.ilike('name', `%${searchQuery.trim()}%`);
        }

        if (pagination) {
            const from = (pagination.page - 1) * pagination.limit;
            const to = from + pagination.limit - 1;
            query = query.range(from, to);
        }

        const { data, count, error } = await query;

        if (error) {
            console.error('Error fetching workouts by user ID:', error);
            if (pagination) return { workouts: [], totalCount: 0 };
            return [];
        }

        if (pagination) {
            return {
                workouts: (data || []).map(mapWorkoutFromSupabase),
                totalCount: count || 0
            };
        }

        return (data || []).map(mapWorkoutFromSupabase);
    },

    /**
     * Busca um treino pelo seu ID único.
     */
    async getWorkoutById(id: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('workouts')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            console.error('Error fetching workout by ID:', error);
            return null;
        }

        return data ? mapWorkoutFromSupabase(data) : null;
    },

    /**
     * Cria um novo treino com validações e formatações.
     */
    async createWorkout(workoutData: Omit<Workout, 'id' | 'createdAt'>, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const formattedName = workoutData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("O nome do treino deve ter pelo menos 2 caracteres.");
        }

        if (!workoutData.exercises || workoutData.exercises.length === 0) {
            throw new Error("Um treino precisa ter pelo menos um exercício vinculado.");
        }

        const exercises = workoutData.exercises.map(ex => ({
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            sets: Math.max(1, ex.sets),
            reps: ex.reps,
            restTime: Math.max(0, ex.restTime)
        }));

        const { data, error } = await supabase
            .from('workouts')
            .insert({
                user_id: workoutData.userId,
                name: formattedName,
                description: workoutData.description,
                exercises: exercises as any,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapWorkoutFromSupabase(data);
    },

    /**
     * Atualiza um treino existente.
     */
    async updateWorkout(id: string, workoutData: Partial<Workout>, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const updates: any = {};
        if (workoutData.name) updates.name = workoutData.name.trim();
        if (workoutData.description !== undefined) updates.description = workoutData.description;
        if (workoutData.userId) updates.user_id = workoutData.userId;
        if (workoutData.exercises) {
            updates.exercises = workoutData.exercises.map(ex => ({
                exerciseId: ex.exerciseId,
                exerciseName: ex.exerciseName,
                sets: Math.max(1, ex.sets),
                reps: ex.reps,
                restTime: Math.max(0, ex.restTime)
            }));
        }

        const { data, error } = await supabase
            .from('workouts')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapWorkoutFromSupabase(data);
    },

    async addExerciseToWorkout(workoutId: string, newExercise: Workout['exercises'][0], supabaseInput?: any) {
        const workout = await this.getWorkoutById(workoutId, supabaseInput);
        if (!workout) throw new Error("Treino não encontrado.");

        const updatedExercises = [...(workout.exercises || []), newExercise];

        return await this.updateWorkout(workoutId, {
            exercises: updatedExercises
        }, supabaseInput);
    },

    /**
     * Deleta um treino específico.
     */
    async deleteWorkout(id: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }
    }
};