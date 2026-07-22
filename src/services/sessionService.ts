import { createClient } from '@/lib/supabase/client';
import { Session, Workout, ExerciseGroup, ExecutedGroup } from '@/config/types';
import { db } from '@/config/db';
import { SyncManager } from './syncManager';
import { withTimeout } from '@/lib/utils/timeout';

const mapGroupFromSupabase = (g: any): ExerciseGroup => {
    if (!g) return null as any;
    return {
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
            variation: ex.variation || 'none',
            executionMode: ex.executionMode || 'bilateral',
        })),
        notes: g.notes,
    };
};

const mapExecutedGroupFromSupabase = (g: any): ExecutedGroup => {
    if (!g) return null as any;
    return {
        groupType: g.groupType || 'straight',
        exercises: (g.exercises || []).map((ex: any) => ({
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName,
            variation: ex.variation || 'none',
            executionMode: ex.executionMode || 'bilateral',
            sets: (ex.sets || []).map((s: any) => ({
                reps: s.reps,
                weight: s.weight,
                rpe: s.rpe,
                skipped: s.skipped,
                technique: s.technique,
                notes: s.notes,
                dropset: s.dropset,
            })),
        })),
    };
};

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

const toISOString = (d: Date | string | null | undefined): string | null => {
    if (!d) return null;
    if (d instanceof Date) return d.toISOString();
    return new Date(d).toISOString();
};

const mapSessionToSupabase = (s: Session): any => ({
    id: s.id,
    user_id: s.userId,
    workout_id: s.workoutId,
    workout_name: s.workoutName,
    created_at: toISOString(s.createdAt) || new Date().toISOString(),
    exercises_to_do: s.exercisesToDo,
    exercises_done: s.exercisesDone,
    current_step: s.current,
    duration: s.duration,
    paused_at: toISOString(s.pausedAt),
    resumed_at: toISOString(s.resumedAt),
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

        // Always save locally first
        if (typeof window !== 'undefined') {
            await db.sessions.put(sessionPayload);
            await SyncManager.enqueue('CREATE', 'SESSION', sessionId, mapSessionToSupabase(sessionPayload), workout.userId);
            return sessionPayload;
        }

        const supabase = supabaseInput || createClient();
        const dbPayload = mapSessionToSupabase(sessionPayload);
        const { error } = await withTimeout(supabase.from('sessions').insert(dbPayload), 3000);
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
                await SyncManager.enqueue('UPDATE', 'SESSION', sessionId, {
                    id: sessionId,
                    paused_at: null,
                    resumed_at: toISOString(localSession.resumedAt)
                }, localSession.userId);
                return;
            }
        }

        const supabase = supabaseInput || createClient();
        const { error } = await withTimeout(
            supabase.from('sessions').update({
                paused_at: null,
                resumed_at: new Date().toISOString()
            }).eq('id', sessionId),
            3000
        );
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

                await SyncManager.enqueue('UPDATE', 'SESSION', sessionId, {
                    id: sessionId,
                    paused_at: now.toISOString(),
                    duration: localSession.duration
                }, localSession.userId);
                return;
            }
        }

        const session = await this.getSessionById(sessionId, supabaseInput);
        if (!session || !session.resumedAt || session.pausedAt) return;

        const supabase = supabaseInput || createClient();
        const now = new Date();
        const additionalDuration = now.getTime() - new Date(session.resumedAt).getTime();

        const { error } = await withTimeout(
            supabase.from('sessions').update({
                paused_at: now.toISOString(),
                duration: session.duration + additionalDuration
            }).eq('id', sessionId),
            3000
        );

        if (error) throw error;
    },

    async getActiveSessionByUserId(userId: string, supabaseInput?: any) {
        // Always check local first — sessions are critical for continuity
        if (typeof window !== 'undefined') {
            const sessions = await db.sessions
                .where('userId')
                .equals(userId)
                .and(s => !s.isFinishedLocally) // Ignore locally finished sessions
                .toArray();
            if (sessions.length > 0) {
                return sessions.reduce((a, b) => a.createdAt > b.createdAt ? a : b);
            }
        }

        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('sessions')
                    .select('*')
                    .eq('user_id', userId)
                    .maybeSingle(),
                3000
            );

            if (error) throw error;

            if (data) {
                const session = mapSessionFromSupabase(data);
                // Cache to Dexie for offline access
                if (typeof window !== 'undefined') {
                    await db.sessions.put(session).catch(() => {});
                }
                return session;
            }

            return null;
        } catch (error) {
            console.warn('[SessionService] getActiveSessionByUserId failed:', error);
            // Already checked local above, return null
            return null;
        }
    },

    async getSessionsByUserId(userId: string, supabaseInput?: any) {
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

            const sessions = (data || []).map(mapSessionFromSupabase);

            // Cache to Dexie
            if (typeof window !== 'undefined' && sessions.length > 0) {
                await db.sessions.bulkPut(sessions).catch(() => {});
            }

            return sessions;
        } catch (error) {
            console.warn('[SessionService] getSessionsByUserId failed, falling back to local DB:', error);
            if (typeof window !== 'undefined') {
                const localSessions = await db.sessions
                    .where('userId')
                    .equals(userId)
                    .and(s => !s.isFinishedLocally) // Filter out locally finished
                    .toArray();
                localSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                return localSessions;
            }
            return [];
        }
    },

    async getSessionById(sessionId: string, supabaseInput?: any) {
        // Local-first
        if (typeof window !== 'undefined') {
            const local = await db.sessions.get(sessionId);
            if (local) return local;
        }

        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('sessions')
                    .select('*')
                    .eq('id', sessionId)
                    .maybeSingle(),
                3000
            );

            if (error) throw error;

            if (data) {
                const session = mapSessionFromSupabase(data);
                // Cache for offline
                if (typeof window !== 'undefined') {
                    await db.sessions.put(session).catch(() => {});
                }
                return session;
            }
            return null;
        } catch (error) {
            console.warn('[SessionService] getSessionById failed:', error);
            return null;
        }
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
                if (updates.pausedAt !== undefined) dbUpdates.paused_at = toISOString(updates.pausedAt);
                if (updates.resumedAt !== undefined) dbUpdates.resumed_at = toISOString(updates.resumedAt);

                await SyncManager.enqueue('UPDATE', 'SESSION', sessionId, dbUpdates, localSession.userId);
                return;
            }
        }

        const supabase = supabaseInput || createClient();
        const dbUpdates: any = {};
        if (updates.exercisesDone) dbUpdates.exercises_done = updates.exercisesDone;
        if (updates.exercisesToDo) dbUpdates.exercises_to_do = updates.exercisesToDo;
        if (updates.current) dbUpdates.current_step = updates.current;
        if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
        if (updates.pausedAt !== undefined) dbUpdates.paused_at = toISOString(updates.pausedAt);
        if (updates.resumedAt !== undefined) dbUpdates.resumed_at = toISOString(updates.resumedAt);

        const { error } = await withTimeout(
            supabase.from('sessions').update(dbUpdates).eq('id', sessionId),
            3000
        );
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
            date: toISOString(session.createdAt) || new Date().toISOString(),
            end_date: new Date().toISOString(),
            duration: session.duration,
            weight: additionalData?.weight,
            description: additionalData?.description,
            using_creatine: additionalData?.usingCreatine,
            executions: session.exercisesDone as any
        };

        if (typeof window !== 'undefined') {
            // Save history locally for immediate access
            await db.history.put({
                id: historyId,
                userId: session.userId,
                workoutId: session.workoutId,
                workoutName: session.workoutName,
                date: new Date(session.createdAt),
                endDate: new Date(),
                duration: session.duration,
                weight: additionalData?.weight,
                description: additionalData?.description,
                usingCreatine: additionalData?.usingCreatine,
                executions: session.exercisesDone,
            }).catch(() => {});

            // CRITICAL: Do NOT delete from sessions immediately.
            // Mark as finished locally so it's ignored by lists, but remains
            // available for the current session view until SyncManager deletes it.
            await db.sessions.update(sessionId, { isFinishedLocally: true });

            // Await both enqueue calls so that Dexie write failures surface to the caller
            await SyncManager.enqueue('CREATE', 'HISTORY', historyId, newHistory, session.userId);
            await SyncManager.enqueue('DELETE', 'SESSION', sessionId, { id: sessionId }, session.userId);
            return historyId;
        }

        const supabase = supabaseInput || createClient();
        const { error: historyError } = await supabase.from('history').insert(newHistory).select().single();
        if (historyError) throw historyError;

        await this.deleteSession(sessionId, supabaseInput);
        return historyId;
    },

    async deleteSession(sessionId: string, supabaseInput?: any, userIdInput?: string) {
        if (typeof window !== 'undefined') {
            const local = await db.sessions.get(sessionId);
            const targetUserId = local?.userId || userIdInput || (await db.users.toCollection().first())?.id;
            if (local) {
                await db.sessions.update(sessionId, { isFinishedLocally: true });
            } else {
                await db.sessions.put({
                    id: sessionId,
                    userId: targetUserId || '',
                    isFinishedLocally: true
                } as any);
            }
            await SyncManager.enqueue('DELETE', 'SESSION', sessionId, { id: sessionId }, targetUserId);
            return;
        }

        const supabase = supabaseInput || createClient();
        const { error } = await withTimeout(
            supabase.from('sessions').delete().eq('id', sessionId),
            3000
        );
        if (error) throw error;
    }
};