import { createClient } from '../lib/supabase/client';
import { History, ExecutedGroup } from '@/config/types';
import { getDatabase } from '@/config/rxDatabase';
import { withTimeout } from '@/lib/utils/timeout';

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
        if (typeof window === 'undefined') {
            try {
                const supabase = supabaseInput || createClient();
                const from = (page - 1) * limit;
                const to = from + limit - 1;

                const { data, error } = await withTimeout(
                    supabase
                        .from('history')
                        .select('*')
                        .eq('user_id', userId)
                        .order('date', { ascending: false })
                        .range(from, to),
                    3000
                );

                if (error) throw error;
                return (data || []).map(mapHistoryFromSupabase);
            } catch (err) {
                console.error('[HistoryService] Server-side getUserHistory failed:', err);
                return [];
            }
        }

        try {
            const db = await getDatabase();
            const docs = await db.history.find({ selector: { userId } }).exec();
            
            const history = docs.map(doc => {
                const json = doc.toJSON();
                return {
                    ...json,
                    date: new Date(json.date),
                    endDate: json.endDate ? new Date(json.endDate) : undefined
                } as History;
            });

            // Ordenar por data decrescente
            history.sort((a, b) => b.date.getTime() - a.date.getTime());

            // Paginação
            const from = (page - 1) * limit;
            const to = from + limit;
            return history.slice(from, to);
        } catch (error) {
            console.error('[HistoryService] getUserHistory failed:', error);
            return [];
        }
    },

    async getHistoryByRange(userId: string, startDate: Date, endDate: Date, supabaseInput?: any) {
        if (typeof window === 'undefined') {
            try {
                const supabase = supabaseInput || createClient();
                const { data, error } = await withTimeout(
                    supabase
                        .from('history')
                        .select('*')
                        .eq('user_id', userId)
                        .gte('date', startDate.toISOString())
                        .lte('date', endDate.toISOString()),
                    3000
                );

                if (error) throw error;
                return (data || []).map(mapHistoryFromSupabase);
            } catch (err) {
                console.error('[HistoryService] Server-side getHistoryByRange failed:', err);
                return [];
            }
        }

        try {
            const db = await getDatabase();
            const docs = await db.history.find({ selector: { userId } }).exec();

            const history = docs.map(doc => {
                const json = doc.toJSON();
                return {
                    ...json,
                    date: new Date(json.date),
                    endDate: json.endDate ? new Date(json.endDate) : undefined
                } as History;
            });

            return history.filter(h => {
                const time = h.date.getTime();
                return time >= startDate.getTime() && time <= endDate.getTime();
            });
        } catch (error) {
            console.error('[HistoryService] getHistoryByRange failed:', error);
            return [];
        }
    },

    async getHistoryById(id: string, supabaseInput?: any) {
        if (typeof window === 'undefined') {
            try {
                const supabase = supabaseInput || createClient();
                const { data, error } = await withTimeout(
                    supabase.from('history').select('*').eq('id', id).maybeSingle(),
                    3000
                );
                if (error) throw error;
                return data ? mapHistoryFromSupabase(data) : null;
            } catch (err) {
                console.error('[HistoryService] Server-side getHistoryById failed:', err);
                return null;
            }
        }

        try {
            const db = await getDatabase();
            const doc = await db.history.findOne(id).exec();
            if (doc) {
                const json = doc.toJSON();
                return {
                    ...json,
                    date: new Date(json.date),
                    endDate: json.endDate ? new Date(json.endDate) : undefined
                } as History;
            }
            return null;
        } catch (error) {
            console.error('[HistoryService] getHistoryById failed:', error);
            return null;
        }
    }
};