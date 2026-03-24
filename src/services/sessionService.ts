import { createClient } from '@/lib/supabase/client';
import { Session, History, Workout } from '@/config/types';

const mapSessionFromSupabase = (s: any): Session => ({
    id: s.id,
    userId: s.user_id,
    workoutId: s.workout_id,
    workoutName: s.workout_name,
    createdAt: new Date(s.created_at),
    exercisesToDo: s.exercises_to_do || [],
    exercisesDone: s.exercises_done || [],
    current: s.current_step || {
        exerciseIndex: 0,
        setIndex: 0,
        step: 'executing'
    },
    duration: s.duration || 0,
    pausedAt: s.paused_at ? new Date(s.paused_at) : null,
    resumedAt: s.resumed_at ? new Date(s.resumed_at) : null,
});

export const SessionService = {

    /**
    * 1. INICIAR SESSÃO
    */
    async startSession(workout: Workout): Promise<Session> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('sessions')
            .insert({
                user_id: workout.userId,
                workout_id: workout.id,
                workout_name: workout.name,
                exercises_to_do: workout.exercises as any,
                exercises_done: [] as any,
                current_step: {
                    exerciseIndex: 0,
                    setIndex: 0,
                    step: 'executing'
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

    async resumeSession(sessionId: string) {
        const supabase = createClient();
        const { error } = await supabase
            .from('sessions')
            .update({
                paused_at: null,
                resumed_at: new Date().toISOString()
            })
            .eq('id', sessionId);

        if (error) throw error;
    },

    async pauseSession(sessionId: string) {
        const supabase = createClient();
        const session = await this.getSessionById(sessionId);
        if (!session || !session.resumedAt || session.pausedAt) return;

        const now = new Date();
        const lastReference = session.resumedAt;
        const additionalDuration = now.getTime() - lastReference.getTime();

        const { error } = await supabase
            .from('sessions')
            .update({
                paused_at: now.toISOString(),
                duration: session.duration + additionalDuration
            })
            .eq('id', sessionId);

        if (error) throw error;
    },

    async getSessionsByUserId(userId: string) {
        const supabase = createClient();
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

    async getSessionById(sessionId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', sessionId)
            .maybeSingle();

        if (error) return null;
        return data ? mapSessionFromSupabase(data) : null;
    },

    /**
   * 3. SINCRONIZAR PROGRESSO
   */
    async syncSessionProgress(sessionId: string, updates: Partial<Session>): Promise<void> {
        const supabase = createClient();
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
            .eq('id', sessionId);

        if (error) throw error;
    },

    /**
     * 4. FINALIZAR SESSÃO E GERAR HISTÓRICO
     */
    async finishSession(sessionId: string, additionalData?: { weight?: number, description?: string, usingCreatine?: boolean }) {
        const supabase = createClient();
        const session = await this.getSessionById(sessionId);
        if (!session) throw new Error("Sessão não encontrada");

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

        await this.deleteSession(sessionId);

        return historyData.id as string;
    },

    async deleteSession(sessionId: string) {
        const supabase = createClient();
        const { error } = await supabase
            .from('sessions')
            .delete()
            .eq('id', sessionId);

        if (error) throw error;
    }
};