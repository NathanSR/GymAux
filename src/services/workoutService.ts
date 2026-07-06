import { createClient } from '../lib/supabase/client';
import { Workout, ExerciseGroup } from '@/config/types';
import { getDatabase } from '@/config/rxDatabase';
import { withTimeout } from '@/lib/utils/timeout';

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
    createdBy: workout.created_by,
    createdByType: workout.created_by_type,
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
        if (typeof window === 'undefined') {
            try {
                const supabase = supabaseInput || createClient();
                const { data, error } = await withTimeout(
                    supabase.from('workouts').select('*'),
                    3000
                );
                if (error) throw error;
                return (data || []).map(mapWorkoutFromSupabase);
            } catch (err) {
                console.error('[WorkoutService] Server-side getAllWorkouts failed:', err);
                return [];
            }
        }

        try {
            const db = await getDatabase();
            const docs = await db.workouts.find().exec();
            return docs.map(doc => doc.toJSON() as Workout);
        } catch (error) {
            console.error('[WorkoutService] getAllWorkouts failed:', error);
            return [];
        }
    },

    async getWorkoutsByUserId(userId: string, searchQuery = '', pagination?: { page: number; limit: number }, supabaseInput?: any) {
        if (typeof window === 'undefined') {
            try {
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

                const { data, count, error } = await withTimeout(query, 3000);

                if (error) throw error;

                const workouts = (data || []).map(mapWorkoutFromSupabase);
                const totalCount = count || 0;

                if (pagination) {
                    return {
                        workouts,
                        totalCount
                    };
                }
                return workouts;
            } catch (err) {
                console.error('[WorkoutService] Server-side getWorkoutsByUserId failed:', err);
                return pagination ? { workouts: [], totalCount: 0 } : [];
            }
        }

        try {
            const db = await getDatabase();
            
            const selector: any = { userId };
            if (searchQuery.trim()) {
                selector.name = { $regex: new RegExp(searchQuery.trim(), 'i') };
            }

            let query = db.workouts.find({ selector });
            const docs = await query.exec();
            
            let workouts = docs.map(doc => doc.toJSON() as Workout);
            
            // Ordenar por data de criação decrescente
            workouts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            const totalCount = workouts.length;

            if (pagination) {
                const from = (pagination.page - 1) * pagination.limit;
                const to = from + pagination.limit;
                workouts = workouts.slice(from, to);
                return {
                    workouts,
                    totalCount
                };
            }

            return workouts;
        } catch (error) {
            console.error('[WorkoutService] getWorkoutsByUserId failed:', error);
            return pagination ? { workouts: [], totalCount: 0 } : [];
        }
    },

    async getWorkoutById(id: string, supabaseInput?: any) {
        if (typeof window === 'undefined') {
            try {
                const supabase = supabaseInput || createClient();
                const { data, error } = await withTimeout(
                    supabase.from('workouts').select('*').eq('id', id).maybeSingle(),
                    3000
                );
                if (error) throw error;
                return data ? mapWorkoutFromSupabase(data) : null;
            } catch (err) {
                console.error('[WorkoutService] Server-side getWorkoutById failed:', err);
                return null;
            }
        }

        try {
            const db = await getDatabase();
            const doc = await db.workouts.findOne(id).exec();
            if (doc) return doc.toJSON() as Workout;
            return null;
        } catch (error) {
            console.error('[WorkoutService] getWorkoutById failed:', error);
            return null;
        }
    },

    async createWorkout(workoutData: Omit<Workout, 'id' | 'createdAt'> & { callerId: string }, supabaseInput?: any) {
        const formattedName = workoutData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("O nome do treino deve ter pelo menos 2 caracteres.");
        }

        if (!workoutData.exercises || workoutData.exercises.length === 0) {
            throw new Error("Um treino precisa ter pelo menos um grupo de exercício.");
        }

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

        const id = crypto.randomUUID();
        const apiPayload = {
            id,
            user_id: workoutData.userId,
            created_by: workoutData.callerId,
            created_by_type: workoutData.userId === workoutData.callerId ? 'user' : 'trainer',
            name: formattedName,
            description: workoutData.description,
            exercises: serializeGroups(workoutData.exercises) as any,
        };

        if (typeof window === 'undefined') {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase.from('workouts').insert(apiPayload).select().single(),
                3000
            );
            if (error) throw error;
            return mapWorkoutFromSupabase(data);
        }

        const db = await getDatabase();

        const localWorkout = {
            id,
            userId: workoutData.userId,
            createdBy: workoutData.callerId,
            createdByType: workoutData.userId === workoutData.callerId ? 'user' : 'trainer',
            name: formattedName,
            description: workoutData.description || '',
            createdAt: new Date().toISOString(),
            exercises: serializeGroups(workoutData.exercises),
            updated_at: new Date().toISOString()
        };

        const inserted = await db.workouts.insert(localWorkout);
        return inserted.toJSON() as Workout;
    },

    async updateWorkout(id: string, workoutData: Partial<Workout> & { callerId: string }, supabaseInput?: any) {
        const updates: any = {};
        if (workoutData.name) updates.name = workoutData.name.trim();
        if (workoutData.description !== undefined) updates.description = workoutData.description;
        if (workoutData.userId) updates.user_id = workoutData.userId;
        if (workoutData.exercises) {
            updates.exercises = serializeGroups(workoutData.exercises);
        }

        if (typeof window === 'undefined') {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase.from('workouts').update(updates).eq('id', id).select().single(),
                3000
            );
            if (error) throw error;
            return mapWorkoutFromSupabase(data);
        }

        const db = await getDatabase();
        const doc = await db.workouts.findOne(id).exec();
        
        if (!doc) throw new Error("Workout não encontrado.");

        const cleanUpdates: any = {
            updated_at: new Date().toISOString()
        };
        if (workoutData.name) cleanUpdates.name = workoutData.name.trim();
        if (workoutData.description !== undefined) cleanUpdates.description = workoutData.description;
        if (workoutData.userId) cleanUpdates.userId = workoutData.userId;
        if (workoutData.exercises) {
            cleanUpdates.exercises = serializeGroups(workoutData.exercises);
        }

        const updated = await doc.incrementalPatch(cleanUpdates);
        return updated.toJSON() as Workout;
    },

    async addExerciseToWorkout(workoutId: string, newExercise: ExerciseGroup, callerId: string, supabaseInput?: any) {
        const workout = await this.getWorkoutById(workoutId, supabaseInput);
        if (!workout) throw new Error("Treino não encontrado.");

        const updatedExercises = [...(workout.exercises || []), newExercise];
        return await this.updateWorkout(workoutId, {
            exercises: updatedExercises,
            callerId,
        }, supabaseInput);
    },

    async deleteWorkout(id: string, callerId: string, supabaseInput?: any) {
        if (typeof window === 'undefined') {
            const supabase = supabaseInput || createClient();
            const { error } = await withTimeout(
                supabase.from('workouts').delete().eq('id', id),
                3000
            );
            if (error) throw error;
            return;
        }

        const db = await getDatabase();
        const doc = await db.workouts.findOne(id).exec();
        if (doc) {
            await doc.remove();
        }
    }
};