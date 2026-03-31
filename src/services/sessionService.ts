import { createClient } from '@/lib/supabase/client';
import { Session, Workout, ExerciseGroup, ExecutedGroup } from '@/config/types';

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

const mapExecutedGroupFromSupabase = (g: any): ExecutedGroup => ({
    groupType: g.groupType || 'straight',
    exercises: (g.exercises || []).map((ex: any) => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        sets: (ex.sets || []).map((s: any) => ({
            reps: s.reps,
            weight: s.weight,
            rpe: s.rpe,
            skipped: s.skipped,
            technique: s.technique,
            notes: s.notes,
        })),
    })),
});

const mapSessionFromSupabase = (s: any): Session => ({
    id: s.id,
    userId: s.user_id,
    workoutId: s.workout_id,
    workoutName: s.workout_name,
    createdAt: new Date(s.created_at),
    exercisesToDo: (s.exercises_to_do || []).map(mapGroupFromSupabase),
    exercisesDone: (s.exercises_done || []).map(mapExecutedGroupFromSupabase),
    current: s.current_step || {
        step: 'executing',
        groupIndex: 0,
        exerciseIndex: 0,
        setIndex: 0,
        roundIndex: 0,
    },
    duration: s.duration || 0,
    pausedAt: s.paused_at ? new Date(s.paused_at) : null,
    resumedAt: s.resumed_at ? new Date(s.resumed_at) : null,
});

export const SessionService = {

    async startSession(workout: Workout, supabaseInput?: any): Promise<Session> {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('sessions')
            .insert({
                user_id: workout.userId,
                workout_id: workout.id,
                workout_name: workout.name,
                exercises_to_do: workout.exercises as any,
                exercises_done: [] as any,
                current_step: {
                    step: 'executing',
                    groupIndex: 0,
                    exerciseIndex: 0,
                    setIndex: 0,
                    roundIndex: 0,
                } as any,
                duration: 0,
                paused_at: null,
                resumed_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapSessionFromSupabase(data);
    },

    async resumeSession(sessionId: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from('sessions')
            .update({
                paused_at: null,
                resumed_at: new Date().toISOString()
            })
            .eq('id', sessionId)
            .eq('user_id', user.id);

        if (error) throw error;
    },

    async pauseSession(sessionId: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const session = await this.getSessionById(sessionId, supabaseInput);
        if (!session || !session.resumedAt || session.pausedAt || session.userId !== user.id) return;

        const now = new Date();
        const lastReference = session.resumedAt;
        const additionalDuration = now.getTime() - lastReference.getTime();

        const { error } = await supabase
            .from('sessions')
            .update({
                paused_at: now.toISOString(),
                duration: session.duration + additionalDuration
            })
            .eq('id', sessionId)
            .eq('user_id', user.id);

        if (error) throw error;
    },

    async getActiveSessionByUserId(userId: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            console.error('Error fetching active session:', error);
            return null;
        }

        return data ? mapSessionFromSupabase(data) : null;
    },

    async getSessionsByUserId(userId: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching sessions:', error);
            return [];
        }

        return (data || []).map(mapSessionFromSupabase);
    },

    async getSessionById(sessionId: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', sessionId)
            .maybeSingle();

        if (error) return null;
        return data ? mapSessionFromSupabase(data) : null;
    },

    async syncSessionProgress(sessionId: string, updates: Partial<Session>, supabaseInput?: any): Promise<void> {
        const supabase = supabaseInput || createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const dbUpdates: any = {};
        if (updates.exercisesDone) dbUpdates.exercises_done = updates.exercisesDone;
        if (updates.exercisesToDo) dbUpdates.exercises_to_do = updates.exercisesToDo;
        if (updates.current) dbUpdates.current_step = updates.current;
        if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
        if (updates.pausedAt !== undefined) dbUpdates.paused_at = updates.pausedAt?.toISOString() || null;
        if (updates.resumedAt !== undefined) dbUpdates.resumed_at = updates.resumedAt?.toISOString() || null;

        const { error } = await supabase
            .from('sessions')
            .update(dbUpdates)
            .eq('id', sessionId)
            .eq('user_id', user.id);

        if (error) throw error;
    },

    async finishSession(sessionId: string, additionalData?: { weight?: number, description?: string, usingCreatine?: boolean }, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const session = await this.getSessionById(sessionId, supabaseInput);
        if (!session) throw new Error("Sessão não encontrada");
        if (session.userId !== user.id) throw new Error("Sessão não pertence ao usuário ativo");

        const { data: historyData, error: historyError } = await supabase
            .from('history')
            .insert({
                user_id: session.userId,
                workout_id: session.workoutId,
                workout_name: session.workoutName,
                date: session.createdAt.toISOString(),
                end_date: new Date().toISOString(),
                duration: session.duration,
                weight: additionalData?.weight,
                description: additionalData?.description,
                using_creatine: additionalData?.usingCreatine,
                executions: session.exercisesDone as any
            })
            .select()
            .single();

        if (historyError) throw historyError;

        await this.deleteSession(sessionId, supabaseInput);

        return historyData.id as string;
    },

    async deleteSession(sessionId: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
            .from('sessions')
            .delete()
            .eq('id', sessionId)
            .eq('user_id', user.id);

        if (error) throw error;
    }
};