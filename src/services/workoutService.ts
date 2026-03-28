import { createClient } from '@/lib/supabase/client';
import { Workout, ExerciseGroup } from '@/config/types';

const mapGroupFromSupabase = (g: any): ExerciseGroup => ({
    groupType: g.groupType || 'straight',
    rounds: g.rounds ?? 1,
    restBetweenRounds: g.restBetweenRounds ?? 0,
    restAfterGroup: g.restAfterGroup ?? 60,
    exercises: (g.exercises || []).map((ex: any) => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        sets: (ex.sets || []).map((s: any) => ({
            reps: s.reps ?? 10,
            weight: s.weight,
            restTime: s.restTime ?? 60,
            technique: s.technique || 'normal',
            notes: s.notes,
        })),
        restAfterExercise: ex.restAfterExercise ?? 0,
        notes: ex.notes,
    })),
    notes: g.notes,
});

const mapWorkoutFromSupabase = (workout: any): Workout => ({
    id: workout.id,
    userId: workout.user_id,
    name: workout.name,
    description: workout.description || undefined,
    createdAt: workout.created_at ? new Date(workout.created_at) : new Date(),
    exercises: (workout.exercises || []).map(mapGroupFromSupabase),
});

const serializeGroups = (groups: ExerciseGroup[]) =>
    groups.map(g => ({
        groupType: g.groupType,
        rounds: g.rounds,
        restBetweenRounds: g.restBetweenRounds,
        restAfterGroup: g.restAfterGroup,
        notes: g.notes,
        exercises: g.exercises.map(ex => ({
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            restAfterExercise: ex.restAfterExercise,
            notes: ex.notes,
            sets: ex.sets.map(s => ({
                reps: Math.max(0, s.reps),
                weight: s.weight,
                restTime: Math.max(0, s.restTime),
                technique: s.technique || 'normal',
                notes: s.notes,
            })),
        })),
    }));

export const WorkoutService = {
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

    async createWorkout(workoutData: Omit<Workout, 'id' | 'createdAt'>, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const formattedName = workoutData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("O nome do treino deve ter pelo menos 2 caracteres.");
        }

        if (!workoutData.exercises || workoutData.exercises.length === 0) {
            throw new Error("Um treino precisa ter pelo menos um grupo de exercício.");
        }

        // Validate each group has at least one exercise with at least one set
        for (const group of workoutData.exercises) {
            if (!group.exercises || group.exercises.length === 0) {
                throw new Error("Cada grupo precisa ter pelo menos um exercício.");
            }
            for (const ex of group.exercises) {
                if (!ex.sets || ex.sets.length === 0) {
                    throw new Error(`O exercício "${ex.exerciseName}" precisa ter pelo menos uma série.`);
                }
            }
        }

        const { data, error } = await supabase
            .from('workouts')
            .insert({
                user_id: workoutData.userId,
                name: formattedName,
                description: workoutData.description,
                exercises: serializeGroups(workoutData.exercises) as any,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapWorkoutFromSupabase(data);
    },

    async updateWorkout(id: string, workoutData: Partial<Workout>, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const updates: any = {};
        if (workoutData.name) updates.name = workoutData.name.trim();
        if (workoutData.description !== undefined) updates.description = workoutData.description;
        if (workoutData.userId) updates.user_id = workoutData.userId;
        if (workoutData.exercises) {
            updates.exercises = serializeGroups(workoutData.exercises);
        }

        const { data, error } = await supabase
            .from('workouts')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapWorkoutFromSupabase(data);
    },

    async addExerciseToWorkout(workoutId: string, newExercise: ExerciseGroup, supabaseInput?: any) {
        const workout = await this.getWorkoutById(workoutId, supabaseInput);
        if (!workout) throw new Error("Treino não encontrado.");

        const updatedExercises = [...(workout.exercises || []), newExercise];

        return await this.updateWorkout(workoutId, {
            exercises: updatedExercises
        }, supabaseInput);
    },

    async deleteWorkout(id: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            throw error;
        }
    }
};