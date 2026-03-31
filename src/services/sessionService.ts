import { createClient } from '@/lib/supabase/client';
import { Session, Workout, ExerciseGroup, ExecutedGroup } from '@/config/types';
import { db } from '@/config/db';
import { SyncManager } from './syncManager';

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
    createdAt: new Date(s.created_at || new Date()),
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

const mapSessionToSupabase = (s: Session): any => ({
    id: s.id,
    user_id: s.userId,
    workout_id: s.workoutId,
    workout_name: s.workoutName,
    created_at: s.createdAt.toISOString(),
    exercises_to_do: s.exercisesToDo,
    exercises_done: s.exercisesDone,
    current_step: s.current,
    duration: s.duration,
    paused_at: s.pausedAt?.toISOString() || null,
    resumed_at: s.resumedAt?.toISOString() || null,
});

export const SessionService = {

    async startSession(workout: Workout, supabaseInput?: any): Promise<Session> {
        const sessionId = crypto.randomUUID();
        const now = new Date();

        const sessionPayload: Session = {
            id: sessionId,
            userId: workout.userId,
            workoutId: workout.id!,
            workoutName: workout.name,
            createdAt: now,
            exercisesToDo: workout.exercises,
            exercisesDone: [],
            current: {
                step: 'executing',
                groupIndex: 0,
                exerciseIndex: 0,
                setIndex: 0,
                roundIndex: 0,
            },
            duration: 0,
            pausedAt: null,
            resumedAt: now
        };

        if (typeof window !== 'undefined') {
            await db.sessions.put(sessionPayload);
            SyncManager.enqueue('CREATE', 'SESSION', sessionId, mapSessionToSupabase(sessionPayload));
            return sessionPayload;
        }

        const supabase = supabaseInput || createClient();
        const dbPayload = mapSessionToSupabase(sessionPayload);
        const { error } = await supabase.from('sessions').insert(dbPayload);
        if (error) throw error;
        return sessionPayload;
    },

    async resumeSession(sessionId: string, supabaseInput?: any) {
        if (typeof window !== 'undefined') {
            const localSession = await db.sessions.get(sessionId);
            if (localSession) {
                localSession.pausedAt = null;
                localSession.resumedAt = new Date();
                await db.sessions.put(localSession);
                SyncManager.enqueue('UPDATE', 'SESSION', sessionId, { 
                    id: sessionId, 
                    paused_at: null, 
                    resumed_at: localSession.resumedAt.toISOString() 
                });
                return;
            }
        }

        const supabase = supabaseInput || createClient();
        const { error } = await supabase.from('sessions').update({
            paused_at: null,
            resumed_at: new Date().toISOString()
        }).eq('id', sessionId);
        if (error) throw error;
    },

    async pauseSession(sessionId: string, supabaseInput?: any) {
        if (typeof window !== 'undefined') {
            const localSession = await db.sessions.get(sessionId);
            if (localSession && localSession.resumedAt && !localSession.pausedAt) {
                const now = new Date();
                localSession.duration += now.getTime() - new Date(localSession.resumedAt).getTime();
                localSession.pausedAt = now;
                await db.sessions.put(localSession);
                
                SyncManager.enqueue('UPDATE', 'SESSION', sessionId, {
                    id: sessionId,
                    paused_at: now.toISOString(),
                    duration: localSession.duration
                });
                return;
            }
        }

        const session = await this.getSessionById(sessionId, supabaseInput);
        if (!session || !session.resumedAt || session.pausedAt) return;

        const supabase = supabaseInput || createClient();
        const now = new Date();
        const additionalDuration = now.getTime() - session.resumedAt.getTime();

        const { error } = await supabase.from('sessions').update({
            paused_at: now.toISOString(),
            duration: session.duration + additionalDuration
        }).eq('id', sessionId);

        if (error) throw error;
    },

    async getActiveSessionByUserId(userId: string, supabaseInput?: any) {
        if (typeof window !== 'undefined') {
            const sessions = await db.sessions.where('userId').equals(userId).toArray();
            if (sessions.length > 0) {
                // Assuming the most recent one is active if we don't have a status field directly
                // Though 'getActiveSessionByUserId' in this app typically implies 1 active session.
                return sessions.reduce((a, b) => a.createdAt > b.createdAt ? a : b);
            }
        }

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
        if (typeof window !== 'undefined') {
            const local = await db.sessions.get(sessionId);
            if (local) return local;
        }

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
        if (typeof window !== 'undefined') {
            const localSession = await db.sessions.get(sessionId);
            if (localSession) {
                const updatedSession = { ...localSession, ...updates };
                await db.sessions.put(updatedSession);

                const dbUpdates: any = { id: sessionId };
                if (updates.exercisesDone) dbUpdates.exercises_done = updates.exercisesDone;
                if (updates.exercisesToDo) dbUpdates.exercises_to_do = updates.exercisesToDo;
                if (updates.current) dbUpdates.current_step = updates.current;
                if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
                if (updates.pausedAt !== undefined) dbUpdates.paused_at = updates.pausedAt?.toISOString() || null;
                if (updates.resumedAt !== undefined) dbUpdates.resumed_at = updates.resumedAt?.toISOString() || null;

                SyncManager.enqueue('UPDATE', 'SESSION', sessionId, dbUpdates);
                return;
            }
        }

        const supabase = supabaseInput || createClient();
        const dbUpdates: any = {};
        if (updates.exercisesDone) dbUpdates.exercises_done = updates.exercisesDone;
        if (updates.exercisesToDo) dbUpdates.exercises_to_do = updates.exercisesToDo;
        if (updates.current) dbUpdates.current_step = updates.current;
        if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
        if (updates.pausedAt !== undefined) dbUpdates.paused_at = updates.pausedAt?.toISOString() || null;
        if (updates.resumedAt !== undefined) dbUpdates.resumed_at = updates.resumedAt?.toISOString() || null;

        const { error } = await supabase.from('sessions').update(dbUpdates).eq('id', sessionId);
        if (error) throw error;
    },

    async finishSession(sessionId: string, additionalData?: { weight?: number, description?: string, usingCreatine?: boolean }, supabaseInput?: any) {
        const session = await this.getSessionById(sessionId, supabaseInput);
        if (!session) throw new Error("Sessão não encontrada");

        const historyId = crypto.randomUUID();
        const newHistory = {
            id: historyId,
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
        };

        if (typeof window !== 'undefined') {
            await db.sessions.delete(sessionId);
            // Salva history no Dexie para manter offline (opcional, vamos confiar no syncQueue/Workbox)
            SyncManager.enqueue('CREATE', 'HISTORY', historyId, newHistory);
            SyncManager.enqueue('DELETE', 'SESSION', sessionId, { id: sessionId });
            return historyId;
        }

        const supabase = supabaseInput || createClient();
        const { error: historyError } = await supabase.from('history').insert(newHistory).select().single();
        if (historyError) throw historyError;

        await this.deleteSession(sessionId, supabaseInput);
        return historyId;
    },

    async deleteSession(sessionId: string, supabaseInput?: any) {
        if (typeof window !== 'undefined') {
            await db.sessions.delete(sessionId);
            SyncManager.enqueue('DELETE', 'SESSION', sessionId, { id: sessionId });
            return;
        }

        const supabase = supabaseInput || createClient();
        const { error } = await supabase.from('sessions').delete().eq('id', sessionId);
        if (error) throw error;
    }
};