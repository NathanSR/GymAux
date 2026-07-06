import { createClient } from '../lib/supabase/client';
import { Session, Workout, ExerciseGroup, ExecutedGroup } from '@/config/types';
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
    resumedAt: s.resumedAt?.toISOString() || null,
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

        if (typeof window === 'undefined') {
            const supabase = supabaseInput || createClient();
            const dbPayload = mapSessionToSupabase(sessionPayload);
            const { error } = await withTimeout(supabase.from('sessions').insert(dbPayload), 3000);
            if (error) throw error;
            return sessionPayload;
        }

        const db = await getDatabase();
        const inserted = await db.sessions.insert({
            ...sessionPayload,
            createdAt: sessionPayload.createdAt.toISOString(),
            resumedAt: sessionPayload.resumedAt ? sessionPayload.resumedAt.toISOString() : null,
            pausedAt: null,
            isFinishedLocally: false,
            updated_at: new Date().toISOString()
        });
        
        const json = inserted.toJSON();
        return {
            ...json,
            createdAt: new Date(json.createdAt),
            pausedAt: json.pausedAt ? new Date(json.pausedAt) : null,
            resumedAt: json.resumedAt ? new Date(json.resumedAt) : null
        } as Session;
    },

    async resumeSession(sessionId: string, supabaseInput?: any) {
        if (typeof window === 'undefined') {
            const supabase = supabaseInput || createClient();
            const { error } = await withTimeout(
                supabase.from('sessions').update({
                    paused_at: null,
                    resumed_at: new Date().toISOString()
                }).eq('id', sessionId),
                3000
            );
            if (error) throw error;
            return;
        }

        const db = await getDatabase();
        const doc = await db.sessions.findOne(sessionId).exec();
        if (doc) {
            await doc.incrementalPatch({
                pausedAt: null,
                resumedAt: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }
    },

    async pauseSession(sessionId: string, supabaseInput?: any) {
        if (typeof window === 'undefined') {
            const session = await this.getSessionById(sessionId, supabaseInput);
            if (!session || !session.resumedAt || session.pausedAt) return;

            const supabase = supabaseInput || createClient();
            const now = new Date();
            const additionalDuration = now.getTime() - session.resumedAt.getTime();

            const { error } = await withTimeout(
                supabase.from('sessions').update({
                    paused_at: now.toISOString(),
                    duration: session.duration + additionalDuration
                }).eq('id', sessionId),
                3000
            );
            if (error) throw error;
            return;
        }

        const db = await getDatabase();
        const doc = await db.sessions.findOne(sessionId).exec();
        if (doc) {
            const json = doc.toJSON();
            if (json.resumedAt && !json.pausedAt) {
                const now = new Date();
                const additionalDuration = now.getTime() - new Date(json.resumedAt).getTime();
                const newDuration = (json.duration || 0) + additionalDuration;
                await doc.incrementalPatch({
                    duration: newDuration,
                    pausedAt: now.toISOString(),
                    updated_at: new Date().toISOString()
                });
            }
        }
    },

    async getActiveSessionByUserId(userId: string, supabaseInput?: any) {
        if (typeof window === 'undefined') {
            try {
                const supabase = supabaseInput || createClient();
                const { data, error } = await withTimeout(
                    supabase.from('sessions').select('*').eq('user_id', userId).maybeSingle(),
                    3000
                );
                if (error) throw error;
                return data ? mapSessionFromSupabase(data) : null;
            } catch (err) {
                console.error('[SessionService] Server-side getActiveSessionByUserId failed:', err);
                return null;
            }
        }

        try {
            const db = await getDatabase();
            const docs = await db.sessions.find({
                selector: {
                    userId,
                    isFinishedLocally: { $ne: true }
                }
            }).exec();

            if (docs.length > 0) {
                const sorted = docs.map(doc => doc.toJSON()).sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                const session = sorted[0];
                return {
                    ...session,
                    createdAt: new Date(session.createdAt),
                    pausedAt: session.pausedAt ? new Date(session.pausedAt) : null,
                    resumedAt: session.resumedAt ? new Date(session.resumedAt) : null
                } as Session;
            }
            return null;
        } catch (error) {
            console.error('[SessionService] getActiveSessionByUserId failed:', error);
            return null;
        }
    },

    async getSessionsByUserId(userId: string, supabaseInput?: any) {
        if (typeof window === 'undefined') {
            try {
                const supabase = supabaseInput || createClient();
                const { data, error } = await withTimeout(
                    supabase
                        .from('sessions')
                        .select('*')
                        .eq('user_id', userId)
                        .order('created_at', { ascending: false }),
                    3000
                );
                if (error) throw error;
                return (data || []).map(mapSessionFromSupabase);
            } catch (err) {
                console.error('[SessionService] Server-side getSessionsByUserId failed:', err);
                return [];
            }
        }

        try {
            const db = await getDatabase();
            const docs = await db.sessions.find({
                selector: {
                    userId,
                    isFinishedLocally: { $ne: true }
                }
            }).exec();

            const sessions = docs.map(doc => {
                const session = doc.toJSON();
                return {
                    ...session,
                    createdAt: new Date(session.createdAt),
                    pausedAt: session.pausedAt ? new Date(session.pausedAt) : null,
                    resumedAt: session.resumedAt ? new Date(session.resumedAt) : null
                } as Session;
            });

            sessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            return sessions;
        } catch (error) {
            console.error('[SessionService] getSessionsByUserId failed:', error);
            return [];
        }
    },

    async getSessionById(sessionId: string, supabaseInput?: any) {
        if (typeof window === 'undefined') {
            try {
                const supabase = supabaseInput || createClient();
                const { data, error } = await withTimeout(
                    supabase.from('sessions').select('*').eq('id', sessionId).maybeSingle(),
                    3000
                );
                if (error) throw error;
                return data ? mapSessionFromSupabase(data) : null;
            } catch (err) {
                console.error('[SessionService] Server-side getSessionById failed:', err);
                return null;
            }
        }

        try {
            const db = await getDatabase();
            const doc = await db.sessions.findOne(sessionId).exec();
            if (doc) {
                const session = doc.toJSON();
                return {
                    ...session,
                    createdAt: new Date(session.createdAt),
                    pausedAt: session.pausedAt ? new Date(session.pausedAt) : null,
                    resumedAt: session.resumedAt ? new Date(session.resumedAt) : null
                } as Session;
            }
            return null;
        } catch (error) {
            console.error('[SessionService] getSessionById failed:', error);
            return null;
        }
    },

    async syncSessionProgress(sessionId: string, updates: Partial<Session>, supabaseInput?: any): Promise<void> {
        const dbUpdates: any = {};
        if (updates.exercisesDone) dbUpdates.exercises_done = updates.exercisesDone;
        if (updates.exercisesToDo) dbUpdates.exercises_to_do = updates.exercisesToDo;
        if (updates.current) dbUpdates.current_step = updates.current;
        if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
        if (updates.pausedAt !== undefined) dbUpdates.paused_at = updates.pausedAt?.toISOString() || null;
        if (updates.resumedAt !== undefined) dbUpdates.resumed_at = updates.resumedAt?.toISOString() || null;

        if (typeof window === 'undefined') {
            const supabase = supabaseInput || createClient();
            const { error } = await withTimeout(
                supabase.from('sessions').update(dbUpdates).eq('id', sessionId),
                3000
            );
            if (error) throw error;
            return;
        }

        const db = await getDatabase();
        const doc = await db.sessions.findOne(sessionId).exec();
        if (doc) {
            const cleanUpdates: any = {
                updated_at: new Date().toISOString()
            };
            if (updates.exercisesDone) cleanUpdates.exercisesDone = updates.exercisesDone;
            if (updates.exercisesToDo) cleanUpdates.exercisesToDo = updates.exercisesToDo;
            if (updates.current) cleanUpdates.current = updates.current;
            if (updates.duration !== undefined) cleanUpdates.duration = updates.duration;
            if (updates.pausedAt !== undefined) cleanUpdates.pausedAt = updates.pausedAt ? updates.pausedAt.toISOString() : null;
            if (updates.resumedAt !== undefined) cleanUpdates.resumedAt = updates.resumedAt ? updates.resumedAt.toISOString() : null;
            if (updates.isFinishedLocally !== undefined) cleanUpdates.isFinishedLocally = updates.isFinishedLocally;

            await doc.incrementalPatch(cleanUpdates);
        }
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
            weight: additionalData?.weight || 0,
            description: additionalData?.description || '',
            using_creatine: additionalData?.usingCreatine || false,
            executions: session.exercisesDone as any
        };

        if (typeof window === 'undefined') {
            const supabase = supabaseInput || createClient();
            const { error: historyError } = await supabase.from('history').insert(newHistory).select().single();
            if (historyError) throw historyError;

            await this.deleteSession(sessionId, supabaseInput);
            return historyId;
        }

        const db = await getDatabase();

        // 1. Inserir histórico
        await db.history.insert({
            id: historyId,
            userId: session.userId,
            workoutId: session.workoutId,
            workoutName: session.workoutName,
            date: session.createdAt.toISOString(),
            endDate: new Date().toISOString(),
            duration: session.duration,
            weight: additionalData?.weight || 0,
            description: additionalData?.description || '',
            usingCreatine: additionalData?.usingCreatine || false,
            executions: session.exercisesDone,
            updated_at: new Date().toISOString()
        });

        // 2. Marcar e deletar a sessão
        const sessionDoc = await db.sessions.findOne(sessionId).exec();
        if (sessionDoc) {
            await sessionDoc.incrementalPatch({
                isFinishedLocally: true,
                updated_at: new Date().toISOString()
            });
            await sessionDoc.remove();
        }

        return historyId;
    },

    async deleteSession(sessionId: string, supabaseInput?: any) {
        if (typeof window === 'undefined') {
            const supabase = supabaseInput || createClient();
            const { error } = await withTimeout(
                supabase.from('sessions').delete().eq('id', sessionId),
                3000
            );
            if (error) throw error;
            return;
        }

        const db = await getDatabase();
        const doc = await db.sessions.findOne(sessionId).exec();
        if (doc) {
            await doc.remove();
        }
    }
};