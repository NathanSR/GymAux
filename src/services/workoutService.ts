import { createClient } from '@/lib/supabase/client';
import { Workout, ExerciseGroup } from '@/config/types';
import { db } from '@/config/db';
import { SyncManager } from './syncManager';
import { connectionService } from './connectionService';
import { withTimeout } from '@/lib/utils/timeout';
import { getEffectiveTime, sortByNewest } from '@/utils/dateUtil';
import { safeBulkPut } from '@/utils/cacheSyncUtil';
import { safeParseJson, safeParseArray, safeParseNumber, safeParseObject } from '@/utils/jsonUtil';

const mapGroupFromSupabase = (g: any): ExerciseGroup => {
    if (!g) {
        return {
            groupType: 'straight',
            rounds: 1,
            restBetweenRounds: 0,
            restAfterGroup: 60,
            exercises: [],
        };
    }

    const parsedGroup = safeParseObject(g);
    const exercisesList = safeParseArray(parsedGroup.exercises);

    return {
        id: parsedGroup.id || undefined,
        groupType: parsedGroup.groupType || 'straight',
        rounds: safeParseNumber(parsedGroup.rounds, 1),
        restBetweenRounds: safeParseNumber(parsedGroup.restBetweenRounds, 0),
        restAfterGroup: safeParseNumber(parsedGroup.restAfterGroup, 60),
        exercises: exercisesList.map((ex: any) => {
            const parsedEx = safeParseObject(ex);
            const setsList = safeParseArray(parsedEx.sets);

            return {
                exerciseId: safeParseNumber(parsedEx.exerciseId, 0),
                exerciseName: parsedEx.exerciseName || '',
                sets: setsList.map((s: any) => {
                    const parsedSet = safeParseObject(s);
                    const dropsetArray = safeParseArray(parsedSet.dropset);
                    return {
                        reps: safeParseNumber(parsedSet.reps, 10),
                        weight: parsedSet.weight !== undefined && parsedSet.weight !== null && parsedSet.weight !== '' ? safeParseNumber(parsedSet.weight, 0) : undefined,
                        restTime: safeParseNumber(parsedSet.restTime, 60),
                        technique: parsedSet.technique || 'normal',
                        notes: parsedSet.notes,
                        dropset: dropsetArray.length > 0 ? dropsetArray : undefined,
                    };
                }),
                restAfterExercise: safeParseNumber(parsedEx.restAfterExercise, 0),
                notes: parsedEx.notes,
                variation: parsedEx.variation || 'none',
                executionMode: parsedEx.executionMode || 'bilateral',
            };
        }),
        notes: parsedGroup.notes,
    };
};

const mapWorkoutFromSupabase = (workout: any): Workout => {
    if (!workout) return null as any;
    const exercisesList = safeParseArray(workout.exercises);

    return {
        id: workout.id || crypto.randomUUID(),
        userId: workout.user_id || workout.userId || '',
        createdBy: workout.created_by || workout.createdBy,
        createdByType: workout.created_by_type || workout.createdByType,
        name: workout.name || 'Treino sem nome',
        description: workout.description || undefined,
        createdAt: workout.created_at ? new Date(workout.created_at) : (workout.createdAt ? new Date(workout.createdAt) : new Date()),
        updatedAt: workout.updated_at ? new Date(workout.updated_at) : (workout.updatedAt ? new Date(workout.updatedAt) : undefined),
        exercises: exercisesList.map(mapGroupFromSupabase).filter(Boolean),
    };
};

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
            variation: ex.variation || 'none',
            executionMode: ex.executionMode || 'bilateral',
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
    // Revalidação em segundo plano sem travar a UI
    async revalidateAllWorkoutsInBackground(supabaseInput?: any) {
        if (typeof window === 'undefined' || !navigator.onLine) return;
        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase.from('workouts').select('*'),
                3500
            );
            if (!error && data && data.length > 0) {
                const workouts: Workout[] = sortByNewest<Workout>((data || []).map(mapWorkoutFromSupabase));
                const validWorkouts = workouts.filter((w: Workout) => Boolean(w.id && w.userId));
                if (validWorkouts.length > 0) {
                    await safeBulkPut(db.workouts, validWorkouts, 'WORKOUT');
                }
            }
        } catch {
            // Silencioso em background
        }
    },

    async getAllWorkouts(supabaseInput?: any) {
        // 1. Tenta recuperar do Dexie imediatamente (0ms)
        if (typeof window !== 'undefined') {
            const local = await db.workouts.toArray();
            if (local && local.length > 0) {
                this.revalidateAllWorkoutsInBackground(supabaseInput);
                return sortByNewest<Workout>(local);
            }
        }

        // 2. Busca na nuvem se não houver no cache local
        let workouts: Workout[] = [];
        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('workouts')
                    .select('*'),
                3500
            );

            if (error) throw error;
            workouts = sortByNewest<Workout>((data || []).map(mapWorkoutFromSupabase));

            if (typeof window !== 'undefined' && workouts.length > 0) {
                const validWorkouts = workouts.filter((w: Workout) => Boolean(w.id && w.userId));
                if (validWorkouts.length > 0) {
                    await safeBulkPut(db.workouts, validWorkouts, 'WORKOUT');
                }
            }
        } catch (error) {
            console.warn('[WorkoutService] getAllWorkouts failed, falling back to local DB:', error);
            if (typeof window !== 'undefined') {
                workouts = sortByNewest<Workout>(await db.workouts.toArray());
            }
        }
        return workouts;
    },

    async getWorkoutsByUserId(userId: string, searchQuery = '', pagination?: { page: number; limit: number }, supabaseInput?: any) {
        let workouts: Workout[] = [];
        let totalCount = 0;

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

            workouts = sortByNewest((data || []).map((w: any) => {
                const mapped = mapWorkoutFromSupabase(w);
                if (!mapped.userId && userId) mapped.userId = userId;
                return mapped;
            }));
            totalCount = count || 0;

            if (typeof window !== 'undefined' && workouts.length > 0) {
                const validWorkouts = workouts.filter((w: Workout) => Boolean(w.id && w.userId));
                if (validWorkouts.length > 0) {
                    await safeBulkPut(db.workouts, validWorkouts, 'WORKOUT');
                }
            }
        } catch (error) {
            console.warn('[WorkoutService] getWorkoutsByUserId failed, falling back to local DB:', error);
            if (typeof window !== 'undefined') {
                let localQuery = db.workouts.where('userId').equals(userId);
                
                const allLocal = await localQuery.toArray();
                let filtered = allLocal;

                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase().trim();
                    filtered = allLocal.filter(w => w.name.toLowerCase().includes(q));
                }

                filtered = sortByNewest(filtered);
                
                totalCount = filtered.length;

                if (pagination) {
                    const from = (pagination.page - 1) * pagination.limit;
                    const to = from + pagination.limit;
                    workouts = filtered.slice(from, to);
                } else {
                    workouts = filtered;
                }
            }
        }

        if (pagination) {
            return {
                workouts,
                totalCount
            };
        }

        return workouts;
    },

    async getWorkoutById(id: string, supabaseInput?: any) {
        // Local-first
        if (typeof window !== 'undefined') {
            const local = await db.workouts.get(id);
            if (local) return local;
        }

        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('workouts')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle(),
                3000
            );

            if (error) throw error;

            if (data) {
                const workout = mapWorkoutFromSupabase(data);
                // Cache for offline
                if (typeof window !== 'undefined') {
                    await db.workouts.put(workout).catch(() => {});
                }
                return workout;
            }
            return null;
        } catch (error) {
            console.warn('[WorkoutService] getWorkoutById failed:', error);
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
        const supabase = supabaseInput || createClient();

        // Permission check (non-blocking if offline)
        if (workoutData.userId !== workoutData.callerId) {
            try {
                const hasPermission = await connectionService.checkPermission(
                    workoutData.callerId,
                    workoutData.userId,
                    'manage_workouts',
                    supabase
                );
                if (!hasPermission) {
                    throw new Error("Unauthorized to create workouts for this student");
                }
            } catch (error: any) {
                if (error?.message?.includes('Unauthorized')) throw error;
                // Network failure — let RLS handle it on sync
            }
        }

        const now = new Date();
        const apiPayload = {
            id,
            user_id: workoutData.userId,
            created_by: workoutData.callerId,
            created_by_type: workoutData.userId === workoutData.callerId ? 'user' : 'trainer',
            name: formattedName,
            description: workoutData.description,
            exercises: serializeGroups(workoutData.exercises) as any,
            created_at: now.toISOString(),
        };

        // Local-first
        if (typeof window !== 'undefined') {
            const createdWorkout = { ...mapWorkoutFromSupabase(apiPayload), createdAt: now, updatedAt: now };
            await db.workouts.put(createdWorkout);
            await SyncManager.enqueue('CREATE', 'WORKOUT', id, apiPayload, workoutData.callerId);
            return createdWorkout;
        }

        const { data, error } = await withTimeout(
            supabase.from('workouts').insert(apiPayload).select().single(),
            3000
        );
        if (error) throw error;
        return mapWorkoutFromSupabase(data);
    },

    async updateWorkout(id: string, workoutData: Partial<Workout> & { callerId: string }, supabaseInput?: any) {
        const now = new Date();
        const updates: any = {};
        if (workoutData.name) updates.name = workoutData.name.trim();
        if (workoutData.description !== undefined) updates.description = workoutData.description;
        if (workoutData.userId) updates.user_id = workoutData.userId;
        if (workoutData.exercises) {
            updates.exercises = serializeGroups(workoutData.exercises);
        }

        // Local-first
        if (typeof window !== 'undefined') {
            const local = await db.workouts.get(id);
            if (local) {
                const updated = { ...local, ...workoutData, updatedAt: now };
                await db.workouts.put(updated);
                await SyncManager.enqueue('UPDATE', 'WORKOUT', id, { id, ...updates }, workoutData.callerId);
                return updated;
            }

            // Not in local cache — try to fetch and cache first, then update
            try {
                const supabase = supabaseInput || createClient();
                const { data: fetchedData } = await withTimeout(
                    supabase.from('workouts').select('*').eq('id', id).maybeSingle(),
                    3000
                );
                if (fetchedData) {
                    const workout = mapWorkoutFromSupabase(fetchedData);
                    const updated = { ...workout, ...workoutData, updatedAt: now };
                    await db.workouts.put(updated);
                    await SyncManager.enqueue('UPDATE', 'WORKOUT', id, { id, ...updates }, workoutData.callerId);
                    return updated;
                }
            } catch {
                // Can't fetch — enqueue anyway with what we have
                await SyncManager.enqueue('UPDATE', 'WORKOUT', id, { id, ...updates }, workoutData.callerId);
                return { id, ...workoutData, updatedAt: now } as Workout;
            }
        }

        // Server-only path
        const supabase = supabaseInput || createClient();

        const { data: existingWorkout, error: fetchError } = await withTimeout(
            supabase
                .from('workouts')
                .select('user_id')
                .eq('id', id)
                .single(),
            3000
        );

        if (fetchError || !existingWorkout) throw new Error("Workout not found");

        if (existingWorkout.user_id !== workoutData.callerId) {
            const hasPermission = await connectionService.checkPermission(
                workoutData.callerId,
                existingWorkout.user_id,
                'manage_workouts',
                supabase
            );

            if (!hasPermission) {
                throw new Error("Unauthorized to manage this student's workouts");
            }
        }

        const { data, error } = await withTimeout(
            supabase
                .from('workouts')
                .update(updates)
                .eq('id', id)
                .select()
                .single(),
            3000
        );

        if (error) throw error;
        return mapWorkoutFromSupabase(data);
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
        // Local-first
        if (typeof window !== 'undefined') {
            await db.workouts.delete(id);
            await SyncManager.enqueue('DELETE', 'WORKOUT', id, { id }, callerId);
            return;
        }

        // Server-only path
        const supabase = supabaseInput || createClient();

        const { data: existingWorkout, error: fetchError } = await withTimeout(
            supabase
                .from('workouts')
                .select('user_id')
                .eq('id', id)
                .single(),
            3000
        );

        if (fetchError || !existingWorkout) throw new Error("Workout not found");

        if (existingWorkout.user_id !== callerId) {
            const hasPermission = await connectionService.checkPermission(
                callerId,
                existingWorkout.user_id,
                'manage_workouts',
                supabase
            );

            if (!hasPermission) {
                throw new Error("Unauthorized to manage this student's workouts");
            }
        }

        const { error } = await withTimeout(
            supabase.from('workouts').delete().eq('id', id),
            3000
        );
        if (error) throw error;
    }
};