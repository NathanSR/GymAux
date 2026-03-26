import { createClient } from '@/lib/supabase/client';
import { History } from '@/config/types';
import { userService } from './userService';

const mapHistoryFromSupabase = (h: any): History => ({
    id: h.id,
    userId: h.user_id,
    workoutId: h.workout_id,
    workoutName: h.workout_name,
    date: new Date(h.date),
    endDate: h.end_date ? new Date(h.end_date) : undefined,
    duration: h.duration ?? undefined,
    weight: h.weight ?? undefined,
    description: h.description || undefined,
    usingCreatine: h.using_creatine ?? undefined,
    executions: (h.executions || []).map((ex: any) => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        sets: (ex.sets || []).map((s: any) => ({
            reps: s.reps,
            weight: s.weight,
            rpe: s.rpe,
        })),
    })),
});

export const HistoryService = {
    /**
     * Salva a conclusão de um treino no histórico.
     */
    async createWorkout(historyData: Omit<History, 'id'>, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('history')
            .insert({
                user_id: historyData.userId,
                workout_id: historyData.workoutId,
                workout_name: historyData.workoutName,
                date: (historyData.date || new Date()).toISOString(),
                end_date: historyData.endDate?.toISOString(),
                duration: historyData.duration,
                weight: historyData.weight,
                description: historyData.description,
                using_creatine: historyData.usingCreatine,
                executions: historyData.executions as any,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapHistoryFromSupabase(data);
    },

    /**
     * Busca todo o histórico de um usuário específico, ordenado pela data mais recente.
     */
    async getUserHistory(userId: string, page: number = 1, limit: number = 12, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error } = await supabase
            .from('history')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .range(from, to);

        if (error) {
            console.error('Error fetching user history:', error);
            return [];
        }

        return (data || []).map(mapHistoryFromSupabase);
    },

    /**
     * Busca o histórico de um treino específico para ver evolução.
     */
    async getWorkoutEvolution(userId: string, workoutId: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .eq('user_id', userId)
            .eq('workout_id', workoutId)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching workout evolution:', error);
            return [];
        }

        return (data || []).map(mapHistoryFromSupabase);
    },

    /**
     * Busca a última execução de um exercício específico. 
     */
    async getLastExerciseExecution(userId: string, exerciseId: number, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        // No Supabase, podemos tentar filtrar no JSONB, mas pela simplicidade (e limitação de volume inicial), 
        // buscamos os últimos e filtramos no JS.
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(20); // Busca nos últimos 20 treinos

        if (error) {
            console.error('Error fetching last exercise execution:', error);
            return null;
        }

        const history = (data || []).map(mapHistoryFromSupabase);

        for (const log of history) {
            const exerciseLog = log.executions?.find((e: any) => e.exerciseId === exerciseId);
            if (exerciseLog) return exerciseLog;
        }

        return null;
    },

    /**
     * Busca o histórico pendente de um exercício.
     */
    async getPendingHistory(userId: string, supabaseInput?: any) {
        const history = await this.getUserHistory(userId, 1, 1, supabaseInput);
        return history[0] || null;
    },

    /**
     * Busca o último histórico.
     */
    async getLastHistory(userId: string, supabaseInput?: any) {
        const history = await this.getUserHistory(userId, 1, 1, supabaseInput);
        return history[0] || null;
    },

    /**
     * Calcula estatísticas básicas.
     */
    async getTotalWorkoutsCount(userId: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { count, error } = await supabase
            .from('history')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) {
            console.error('Error counting workouts:', error);
            return 0;
        }

        return count || 0;
    },

    /**
     * Busca o histórico dentro de um intervalo de datas.
     */
    async getHistoryByRange(userId: string, startDate: Date, endDate: Date, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .eq('user_id', userId)
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString());

        if (error) {
            console.error('Error fetching history by range:', error);
            return [];
        }

        return (data || []).map(mapHistoryFromSupabase);
    },

    /**
     * Permite deletar um registro do histórico.
     */
    async deleteHistoryEntry(id: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { error } = await supabase
            .from('history')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }
    },

    /**
     * Permite adicionar ou editar uma nota/descrição a um treino já realizado.
     */
    async updateDescription(id: string, description: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('history')
            .update({ description })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapHistoryFromSupabase(data);
    },

    /**
     * Atualiza um histórico existente.
     */
    async updateHistory(id: string, historyData: Partial<History>, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const updates: any = {};
        if (historyData.weight) updates.weight = historyData.weight;
        if (historyData.description !== undefined) updates.description = historyData.description;
        if (historyData.usingCreatine !== undefined) updates.using_creatine = historyData.usingCreatine;
        if (historyData.duration) updates.duration = historyData.duration;
        if (historyData.endDate) updates.end_date = historyData.endDate.toISOString();
        if (historyData.executions) updates.executions = historyData.executions as any;

        // Regra: Atualizar peso do usuário se fornecido
        if (historyData.weight && historyData.weight > 0) {
            const entry = await this.getHistoryById(id, supabaseInput);
            if (entry) {
                await userService.updateUser(entry.userId, { weight: historyData.weight }, supabaseInput);
            }
        }

        const { data, error } = await supabase
            .from('history')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapHistoryFromSupabase(data);
    },

    async getHistoryById(id: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) return null;
        return data ? mapHistoryFromSupabase(data) : null;
    }
};