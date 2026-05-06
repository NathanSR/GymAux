import { createClient } from '@/lib/supabase/client';
import { History, ExecutedGroup } from '@/config/types';
import { userService } from './userService';
import { db } from '@/config/db';
import { SyncManager } from './syncManager';

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
    executions: (h.executions || []).map(mapExecutedGroupFromSupabase),
});

export const HistoryService = {
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
            console.error('Error fetching user history:', error?.message || error);
            return [];
        }

        return (data || []).map(mapHistoryFromSupabase);
    },

    async getHistoryByRange(userId: string, startDate: Date, endDate: Date, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('history')
            .select('*')
            .eq('user_id', userId)
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString());

        if (error) return [];
        return (data || []).map(mapHistoryFromSupabase);
    },

    async getHistoryById(id: string, supabaseInput?: any) {
        if (typeof window !== 'undefined') {
            const local = await db.history.get(id);
            if (local) return local;
        }

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