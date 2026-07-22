import { createClient } from '@/lib/supabase/client';
import { Schedule } from '@/config/types';
import { db } from '@/config/db';
import { SyncManager } from './syncManager';
import { connectionService } from './connectionService';
import { withTimeout } from '@/lib/utils/timeout';
import { getEffectiveTime, sortByNewest } from '@/utils/dateUtil';

const mapScheduleFromSupabase = (s: any): Schedule => ({
    id: s.id,
    name: s.name,
    userId: s.user_id || s.userId,
    createdBy: s.created_by || s.createdBy,
    createdByType: s.created_by_type || s.createdByType,
    workouts: s.workouts as (string | null)[],
    startDate: new Date(s.start_date || s.startDate),
    endDate: s.end_date ? new Date(s.end_date) : (s.endDate ? new Date(s.endDate) : undefined),
    active: s.active,
    lastCompleted: s.last_completed ?? s.lastCompleted ?? undefined,
    createdAt: s.created_at ? new Date(s.created_at) : (s.createdAt ? new Date(s.createdAt) : undefined),
    updatedAt: s.updated_at ? new Date(s.updated_at) : (s.updatedAt ? new Date(s.updatedAt) : undefined),
});

const mapScheduleToSupabase = (s: Schedule) => ({
    id: s.id,
    name: s.name,
    user_id: s.userId,
    created_by: s.createdBy,
    created_by_type: s.createdByType,
    workouts: s.workouts,
    start_date: s.startDate instanceof Date ? s.startDate.toISOString() : s.startDate,
    end_date: s.endDate ? (s.endDate instanceof Date ? s.endDate.toISOString() : s.endDate) : undefined,
    active: s.active,
    last_completed: s.lastCompleted ?? -1,
    created_at: s.createdAt ? (s.createdAt instanceof Date ? s.createdAt.toISOString() : s.createdAt) : undefined,
    updated_at: s.updatedAt ? (s.updatedAt instanceof Date ? s.updatedAt.toISOString() : s.updatedAt) : undefined,
});

export const ScheduleService = {

    /**
     * Busca cronogramas de um usuário específico de forma paginada e com busca.
     */
    async getSchedulesByUserId(userId: string, searchQuery = '', pagination: { page: number; limit: number }, supabaseInput?: any) {
        let schedules: Schedule[] = [];
        let totalCount = 0;

        try {
            const supabase = supabaseInput || createClient();
            let query = supabase
                .from('schedules')
                .select('*', { count: 'exact' })
                .eq('user_id', userId)
                .order('updated_at', { ascending: false, nullsFirst: false })
                .order('created_at', { ascending: false });

            if (searchQuery.trim()) {
                query = query.ilike('name', `%${searchQuery.trim()}%`);
            }

            const from = (pagination.page - 1) * pagination.limit;
            const to = from + pagination.limit - 1;

            const { data, count, error } = await withTimeout(query.range(from, to), 3000);

            if (error) throw error;

            schedules = sortByNewest((data || []).map(mapScheduleFromSupabase));
            totalCount = count || 0;

            if (typeof window !== 'undefined' && schedules.length > 0) {
                await db.schedules.bulkPut(schedules).catch(() => {});
            }
        } catch (error) {
            console.warn('[ScheduleService] getSchedulesByUserId failed, falling back to local DB:', error);
        }

        if (typeof window !== 'undefined') {
            const allLocal = await db.schedules.where('userId').equals(userId).toArray();
            let filtered = allLocal;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                filtered = allLocal.filter(s => s.name.toLowerCase().includes(q));
            }
            filtered = sortByNewest(filtered);
            totalCount = filtered.length;
            const from = (pagination.page - 1) * pagination.limit;
            const to = from + pagination.limit;
            schedules = filtered.slice(from, to);
        }

        return {
            schedules,
            totalCount
        };
    },

    /**
     * Busca o cronograma que está marcado como ativo para o usuário.
     */
    async getActiveSchedule(userId: string, supabaseInput?: any) {
        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('schedules')
                    .select('*')
                    .eq('user_id', userId)
                    .eq('active', true)
                    .order('created_at', { ascending: false })
                    .limit(1),
                3000
            );

            if (error) throw error;

            const schedule = data && data.length > 0 ? mapScheduleFromSupabase(data[0]) : null;
            if (typeof window !== 'undefined' && schedule) {
                await db.schedules.put(schedule).catch(() => {});
            }
            return schedule;
        } catch (error) {
            console.warn('[ScheduleService] getActiveSchedule failed, falling back to local DB:', error);
            if (typeof window !== 'undefined') {
                // active is stored as boolean in Dexie — use filter
                const local = await db.schedules
                    .where('userId')
                    .equals(userId)
                    .filter(s => s.active === true)
                    .first();
                return local || null;
            }
            return null;
        }
    },

    async getScheduleById(id: string, supabaseInput?: any) {
        // Local-first
        if (typeof window !== 'undefined') {
            const local = await db.schedules.get(id);
            if (local) return local;
        }

        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('schedules')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle(),
                3000
            );

            if (error) throw error;
            const schedule = data ? mapScheduleFromSupabase(data) : null;
            if (typeof window !== 'undefined' && schedule) {
                await db.schedules.put(schedule).catch(() => {});
            }
            return schedule;
        } catch (error) {
            console.error('[ScheduleService] getScheduleById failed:', error);
            return null;
        }
    },

    /**
     * Cria um novo cronograma.
     * Offline-first: saves locally, enqueues sync, returns immediately.
     */
    async createSchedule(scheduleData: Omit<Schedule, 'id'>, callerId: string, supabaseInput?: any) {
        const formattedName = scheduleData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("O nome do cronograma é muito curto.");
        }

        if (scheduleData.workouts.length !== 7) {
            throw new Error("O cronograma deve conter exatamente 7 dias (domingo a sábado).");
        }

        const id = crypto.randomUUID();
        const now = new Date();
        const newSchedule: Schedule = {
            ...scheduleData,
            id,
            name: formattedName,
            createdBy: callerId,
            createdByType: scheduleData.userId === callerId ? 'user' : 'trainer',
            startDate: typeof scheduleData.startDate === 'string' ? new Date(scheduleData.startDate) : scheduleData.startDate,
            endDate: scheduleData.endDate ? (typeof scheduleData.endDate === 'string' ? new Date(scheduleData.endDate) : scheduleData.endDate) : undefined,
            createdAt: now,
            updatedAt: now,
        } as Schedule;

        // Permission check (non-blocking if offline — will be enforced by RLS on sync)
        if (scheduleData.userId !== callerId) {
            try {
                const supabase = supabaseInput || createClient();
                const hasPermission = await connectionService.checkPermission(callerId, scheduleData.userId, 'manage_schedules', supabase);
                if (!hasPermission) {
                    throw new Error("Unauthorized to create schedules for this student");
                }
            } catch (error: any) {
                if (error?.message?.includes('Unauthorized')) throw error;
                // Network failure — let RLS handle it on sync
            }
        }

        // If activating this schedule, deactivate others locally & enqueue sync
        if (scheduleData.active && typeof window !== 'undefined') {
            const activeSchedules = await db.schedules
                .where('userId')
                .equals(scheduleData.userId)
                .filter(s => s.active === true)
                .toArray();

            for (const s of activeSchedules) {
                await db.schedules.update(s.id!, { active: false });
                await SyncManager.enqueue('UPDATE', 'SCHEDULE', s.id!, {
                    id: s.id,
                    active: false,
                });
            }
        }

        // Save locally first
        if (typeof window !== 'undefined') {
            await db.schedules.put(newSchedule);
            await SyncManager.enqueue('CREATE', 'SCHEDULE', id, mapScheduleToSupabase(newSchedule));
            return newSchedule;
        }

        // Server-only path (no window)
        const supabase = supabaseInput || createClient();

        if (scheduleData.active) {
            await withTimeout(
                supabase
                    .from('schedules')
                    .update({ active: false })
                    .eq('user_id', scheduleData.userId),
                3000
            );
        }

        const { data, error } = await withTimeout(
            supabase
                .from('schedules')
                .insert(mapScheduleToSupabase(newSchedule))
                .select()
                .single(),
            3000
        );

        if (error) throw error;
        return mapScheduleFromSupabase(data);
    },

    /**
     * Atualiza um cronograma existente.
     * Offline-first: saves locally, enqueues sync.
     */
    async updateSchedule(id: string, scheduleData: Partial<Schedule>, callerId: string, supabaseInput?: any) {
        // Build updates for Supabase format
        const now = new Date();
        const updates: any = {
            updated_at: now.toISOString(),
        };
        if (scheduleData.name) updates.name = scheduleData.name.trim();
        if (scheduleData.userId) updates.user_id = scheduleData.userId;
        if (scheduleData.workouts) updates.workouts = scheduleData.workouts;
        if (scheduleData.startDate) updates.start_date = typeof scheduleData.startDate === 'string' ? scheduleData.startDate : (scheduleData.startDate as Date).toISOString();
        if (scheduleData.endDate) updates.end_date = typeof scheduleData.endDate === 'string' ? scheduleData.endDate : (scheduleData.endDate as Date).toISOString();
        if (scheduleData.active !== undefined) updates.active = scheduleData.active;
        if (scheduleData.lastCompleted !== undefined) updates.last_completed = scheduleData.lastCompleted;

        // Local-first write
        if (typeof window !== 'undefined') {
            const current = await db.schedules.get(id);
            if (current) {
                // If activating, deactivate others locally
                if (scheduleData.active === true) {
                    const userId = scheduleData.userId || current.userId;
                    const otherActive = await db.schedules
                        .where('userId')
                        .equals(userId)
                        .filter(s => s.active === true && s.id !== id)
                        .toArray();

                    for (const s of otherActive) {
                        await db.schedules.update(s.id!, { active: false });
                        // Enqueue deactivation for sync
                        await SyncManager.enqueue('UPDATE', 'SCHEDULE', s.id!, {
                            id: s.id,
                            active: false,
                        });
                    }
                }

                const updated = { ...current, ...scheduleData, updatedAt: now };
                await db.schedules.put(updated);
                await SyncManager.enqueue('UPDATE', 'SCHEDULE', id, { id, ...updates });
                return updated;
            }
        }

        // Fallback: direct Supabase (server-side or no local data)
        const supabase = supabaseInput || createClient();

        const { data: existingSchedule, error: fetchError } = await withTimeout(
            supabase
                .from('schedules')
                .select('user_id')
                .eq('id', id)
                .single(),
            3000
        );

        if (fetchError || !existingSchedule) throw new Error("Schedule not found");

        if (existingSchedule.user_id !== callerId) {
            const hasPermission = await connectionService.checkPermission(callerId, existingSchedule.user_id, 'manage_schedules', supabase);
            if (!hasPermission) {
                throw new Error("Unauthorized to manage this student's schedule");
            }
        }

        if (updates.active === true) {
            await withTimeout(
                supabase
                    .from('schedules')
                    .update({ active: false })
                    .eq('user_id', existingSchedule.user_id)
                    .neq('id', id),
                3000
            );
        }

        const { data, error } = await withTimeout(
            supabase
                .from('schedules')
                .update(updates)
                .eq('id', id)
                .select()
                .single(),
            3000
        );

        if (error) throw error;
        return mapScheduleFromSupabase(data);
    },

    /**
     * Remove um cronograma.
     * Offline-first: deletes locally, enqueues sync.
     */
    async deleteSchedule(id: string, callerId: string, supabaseInput?: any) {
        // Local-first delete
        if (typeof window !== 'undefined') {
            await db.schedules.delete(id);
            await SyncManager.enqueue('DELETE', 'SCHEDULE', id, { id });
            return;
        }

        // Server-only path
        const supabase = supabaseInput || createClient();

        const { data: existingSchedule, error: fetchError } = await withTimeout(
            supabase
                .from('schedules')
                .select('user_id')
                .eq('id', id)
                .single(),
            3000
        );

        if (fetchError || !existingSchedule) throw new Error("Schedule not found");

        if (existingSchedule.user_id !== callerId) {
            const hasPermission = await connectionService.checkPermission(callerId, existingSchedule.user_id, 'manage_schedules', supabase);
            if (!hasPermission) {
                throw new Error("Unauthorized to manage this student's schedule");
            }
        }

        const { error } = await withTimeout(
            supabase
                .from('schedules')
                .delete()
                .eq('id', id),
            3000
        );

        if (error) throw error;
    }
};