import { createClient } from '@/lib/supabase/client';
import { History, ExecutedGroup } from '@/config/types';
import { db } from '@/config/db';
import { withTimeout } from '@/lib/utils/timeout';

const mapExecutedGroupFromSupabase = (g: any): ExecutedGroup => ({
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

            const history = (data || []).map(mapHistoryFromSupabase);

            // Cache to Dexie for offline access
            if (typeof window !== 'undefined' && history.length > 0) {
                await db.history.bulkPut(history).catch(() => {});
            }

            return history;
        } catch (error) {
            console.warn('[HistoryService] getUserHistory failed, falling back to local DB:', error);
            if (typeof window !== 'undefined') {
                const allLocal = await db.history
                    .where('userId')
                    .equals(userId)
                    .toArray();

                // Sort by date descending
                allLocal.sort((a, b) => b.date.getTime() - a.date.getTime());

                // Paginate
                const from = (page - 1) * limit;
                const to = from + limit;
                return allLocal.slice(from, to);
            }
            return [];
        }
    },

    async getHistoryByRange(userId: string, startDate: Date, endDate: Date, supabaseInput?: any) {
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

            const history = (data || []).map(mapHistoryFromSupabase);

            // Cache to Dexie
            if (typeof window !== 'undefined' && history.length > 0) {
                await db.history.bulkPut(history).catch(() => {});
            }

            return history;
        } catch (error) {
            console.warn('[HistoryService] getHistoryByRange failed, falling back to local DB:', error);
            if (typeof window !== 'undefined') {
                const allLocal = await db.history
                    .where('userId')
                    .equals(userId)
                    .toArray();

                return allLocal.filter(h => {
                    const d = h.date.getTime();
                    return d >= startDate.getTime() && d <= endDate.getTime();
                });
            }
            return [];
        }
    },

    async getHistoryById(id: string, supabaseInput?: any) {
        // Local-first
        if (typeof window !== 'undefined') {
            const local = await db.history.get(id);
            if (local) return local;
        }

        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('history')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle(),
                3000
            );

            if (error) throw error;

            if (data) {
                const history = mapHistoryFromSupabase(data);
                // Cache for offline
                if (typeof window !== 'undefined') {
                    await db.history.put(history).catch(() => {});
                }
                return history;
            }
            return null;
        } catch (error) {
            console.warn('[HistoryService] getHistoryById failed:', error);
            return null;
        }
    }
};