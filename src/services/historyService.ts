import { createClient } from '@/lib/supabase/client';
import { History, ExecutedGroup } from '@/config/types';
import { db } from '@/config/db';
import { withTimeout } from '@/lib/utils/timeout';
import { safeBulkPut } from '@/utils/cacheSyncUtil';
import { safeParseJson, safeParseArray, safeParseNumber, safeParseObject } from '@/utils/jsonUtil';

const mapExecutedGroupFromSupabase = (g: any): ExecutedGroup => {
    if (!g) return null as any;
    const parsedGroup = safeParseObject(g);
    const exercisesList = safeParseArray(parsedGroup.exercises);

    return {
        groupType: parsedGroup.groupType || 'straight',
        exercises: exercisesList.map((ex: any) => {
            const parsedEx = safeParseObject(ex);
            const setsList = safeParseArray(parsedEx.sets);

            return {
                exerciseId: safeParseNumber(parsedEx.exerciseId, 0),
                exerciseName: parsedEx.exerciseName || '',
                variation: parsedEx.variation || 'none',
                executionMode: parsedEx.executionMode || 'bilateral',
                sets: setsList.map((s: any) => {
                    const parsedSet = safeParseObject(s);
                    return {
                        reps: safeParseNumber(parsedSet.reps, 0),
                        weight: parsedSet.weight !== undefined && parsedSet.weight !== null && parsedSet.weight !== '' ? safeParseNumber(parsedSet.weight, 0) : undefined,
                        rpe: parsedSet.rpe !== undefined && parsedSet.rpe !== null ? safeParseNumber(parsedSet.rpe, 0) : undefined,
                        skipped: Boolean(parsedSet.skipped),
                        technique: parsedSet.technique,
                        notes: parsedSet.notes,
                        dropset: safeParseArray(parsedSet.dropset),
                    };
                }),
            };
        }),
    };
};

const mapHistoryFromSupabase = (h: any): History => {
    if (!h) return null as any;
    const rawExecutions = safeParseArray(h.executions);

    return {
        id: h.id || crypto.randomUUID(),
        userId: h.user_id || h.userId || '',
        workoutId: h.workout_id || h.workoutId || '',
        workoutName: h.workout_name || h.workoutName || 'Treino sem nome',
        date: new Date(h.date || new Date()),
        endDate: h.end_date ? new Date(h.end_date) : (h.endDate ? new Date(h.endDate) : undefined),
        duration: h.duration !== undefined && h.duration !== null ? safeParseNumber(h.duration, 0) : undefined,
        weight: h.weight !== undefined && h.weight !== null ? safeParseNumber(h.weight, 0) : undefined,
        description: h.description || undefined,
        usingCreatine: h.using_creatine ?? undefined,
        executions: rawExecutions.map(mapExecutedGroupFromSupabase).filter(Boolean),
    };
};

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

            const history = (data || []).map((h: any) => {
                const mapped = mapHistoryFromSupabase(h);
                if (!mapped.userId && userId) mapped.userId = userId;
                return mapped;
            });

            // Cache to Dexie for offline access
            if (typeof window !== 'undefined' && history.length > 0) {
                const validHistory = history.filter((h: History) => Boolean(h.id && h.userId));
                if (validHistory.length > 0) {
                    await safeBulkPut(db.history, validHistory, 'HISTORY');
                }
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
                allLocal.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

            const history = (data || []).map((h: any) => {
                const mapped = mapHistoryFromSupabase(h);
                if (!mapped.userId && userId) mapped.userId = userId;
                return mapped;
            });

            // Cache to Dexie
            if (typeof window !== 'undefined' && history.length > 0) {
                const validHistory = history.filter((h: History) => Boolean(h.id && h.userId));
                if (validHistory.length > 0) {
                    await safeBulkPut(db.history, validHistory, 'HISTORY');
                }
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
                    const d = new Date(h.date).getTime();
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