import { createClient } from '@/lib/supabase/client';
import { Schedule } from '@/config/types';
import { db } from '@/config/db';
import { SyncManager } from './syncManager';
import { connectionService } from './connectionService';
import { withTimeout } from '@/lib/utils/timeout';

const mapScheduleFromSupabase = (s: any): Schedule => ({
    id: s.id,
    name: s.name,
    userId: s.user_id,
    createdBy: s.created_by,
    createdByType: s.created_by_type,
    workouts: s.workouts as (string | null)[],
    startDate: new Date(s.start_date),
    endDate: s.end_date ? new Date(s.end_date) : undefined,
    active: s.active,
    lastCompleted: s.last_completed ?? undefined,
});

const mapScheduleToSupabase = (s: Schedule) => ({
    id: s.id,
    name: s.name,
    user_id: s.userId,
    created_by: s.createdBy,
    created_by_type: s.createdByType,
    workouts: s.workouts,
    start_date: s.startDate instanceof Date ? s.startDate.toISOString() : s.startDate,
    end_date: s.endDate instanceof Date ? s.endDate.toISOString() : s.endDate,
    active: s.active,
    last_completed: s.lastCompleted ?? -1,
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
                .order('created_at', { ascending: false });

            if (searchQuery.trim()) {
                query = query.ilike('name', `%${searchQuery.trim()}%`);
            }

            const from = (pagination.page - 1) * pagination.limit;
            const to = from + pagination.limit - 1;

            const { data, count, error } = await withTimeout(query.range(from, to), 3000);

            if (error) throw error;

            schedules = (data || []).map(mapScheduleFromSupabase);
            totalCount = count || 0;

            if (typeof window !== 'undefined' && schedules.length > 0) {
                await db.schedules.bulkPut(schedules);
            }
        } catch (error) {
            console.warn('[ScheduleService] getSchedulesByUserId failed, falling back to local DB:', error);
            if (typeof window !== 'undefined') {
                const allLocal = await db.schedules.where('userId').equals(userId).toArray();
                let filtered = allLocal;
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase().trim();
                    filtered = allLocal.filter(s => s.name.toLowerCase().includes(q));
                }
                filtered.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
                totalCount = filtered.length;
                const from = (pagination.page - 1) * pagination.limit;
                const to = from + pagination.limit;
                schedules = filtered.slice(from, to);
            }
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
                    .maybeSingle(),
                3000
            );

            if (error) throw error;

            const schedule = data ? mapScheduleFromSupabase(data) : null;
            if (typeof window !== 'undefined' && schedule) {
                await db.schedules.put(schedule);
            }
            return schedule;
        } catch (error) {
            console.warn('[ScheduleService] getActiveSchedule failed, falling back to local DB:', error);
            if (typeof window !== 'undefined') {
                return await db.schedules.where({ userId, active: 1 }).first() || null;
            }
            return null;
        }
    },

    async getScheduleById(id: string, supabaseInput?: any) {
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
                await db.schedules.put(schedule);
            }
            return schedule;
        } catch (error) {
            console.error('Error fetching schedule by ID:', error);
            return null;
        }
    },

    /**
     * Cria um novo cronograma.
     * Inclui regra para garantir que apenas um cronograma esteja ativo por vez.
     */
    async createSchedule(scheduleData: Omit<Schedule, 'id'>, callerId: string, supabaseInput?: any) {
        const id = crypto.randomUUID();
        const newSchedule: Schedule = {
            ...scheduleData,
            id,
            startDate: typeof scheduleData.startDate === 'string' ? new Date(scheduleData.startDate) : scheduleData.startDate,
            endDate: scheduleData.endDate ? (typeof scheduleData.endDate === 'string' ? new Date(scheduleData.endDate) : scheduleData.endDate) : undefined,
        } as Schedule;

        if (typeof window !== 'undefined') {
            await db.schedules.put(newSchedule);
            await SyncManager.enqueue('CREATE', 'SCHEDULE', id, mapScheduleToSupabase(newSchedule));
        }

        try {
            const supabase = supabaseInput || createClient();
            const formattedName = scheduleData.name.trim();

            if (formattedName.length < 2) {
                throw new Error("O nome do cronograma é muito curto.");
            }

            if (scheduleData.workouts.length !== 7) {
                throw new Error("O cronograma deve conter exatamente 7 dias (domingo a sábado).");
            }

            if (scheduleData.userId !== callerId) {
                const hasPermission = await connectionService.checkPermission(callerId, scheduleData.userId, 'manage_schedules', supabase);

                if (!hasPermission) {
                    throw new Error("Unauthorized to create schedules for this student");
                }
            }

            // Se for ativo, desativa os outros primeiro
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
                    .insert({
                        id,
                        name: formattedName,
                        user_id: scheduleData.userId,
                        created_by: callerId,
                        created_by_type: scheduleData.userId === callerId ? 'user' : 'trainer',
                        workouts: scheduleData.workouts as any,
                        start_date: typeof scheduleData.startDate === 'string' ? scheduleData.startDate : scheduleData.startDate.toISOString(),
                        end_date: scheduleData.endDate ? (typeof scheduleData.endDate === 'string' ? scheduleData.endDate : scheduleData.endDate.toISOString()) : undefined,
                        active: scheduleData.active,
                        last_completed: scheduleData.lastCompleted ?? -1,
                    })
                    .select()
                    .single(),
                3000
            );

            if (error) throw error;
            return mapScheduleFromSupabase(data);
        } catch (error) {
            console.warn('[ScheduleService] createSchedule failed online, will retry later:', error);
            return newSchedule;
        }
    },

    /**
     * Atualiza um cronograma existente.
     */
    async updateSchedule(id: string, scheduleData: Partial<Schedule>, callerId: string, supabaseInput?: any) {
        if (typeof window !== 'undefined') {
            const current = await db.schedules.get(id);
            if (current) {
                const updated = { ...current, ...scheduleData };
                await db.schedules.put(updated);
                await SyncManager.enqueue('UPDATE', 'SCHEDULE', id, mapScheduleToSupabase(updated));
            }
        }

        try {
            const supabase = supabaseInput || createClient();

            const updates: any = {};
            if (scheduleData.name) updates.name = scheduleData.name.trim();
            if (scheduleData.userId) updates.user_id = scheduleData.userId;
            if (scheduleData.workouts) updates.workouts = scheduleData.workouts;
            if (scheduleData.startDate) updates.start_date = typeof scheduleData.startDate === 'string' ? scheduleData.startDate : (scheduleData.startDate as Date).toISOString();
            if (scheduleData.endDate) updates.end_date = typeof scheduleData.endDate === 'string' ? scheduleData.endDate : (scheduleData.endDate as Date).toISOString();
            if (scheduleData.active !== undefined) updates.active = scheduleData.active;
            if (scheduleData.lastCompleted !== undefined) updates.last_completed = scheduleData.lastCompleted;

            // Fetch to check ownership vs trainer
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

            // Se estiver ativando este cronograma, desativa os outros primeiro
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
        } catch (error) {
            console.warn('[ScheduleService] updateSchedule failed online, will retry later:', error);
            if (typeof window !== 'undefined') {
                return await db.schedules.get(id);
            }
            return null;
        }
    },

    /**
     * Remove um cronograma.
     */
    async deleteSchedule(id: string, callerId: string, supabaseInput?: any) {
        if (typeof window !== 'undefined') {
            await db.schedules.delete(id);
            await SyncManager.enqueue('DELETE', 'SCHEDULE', id, { id });
        }

        try {
            const supabase = supabaseInput || createClient();

            // Fetch to check ownership vs trainer
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
        } catch (error) {
            console.warn('[ScheduleService] deleteSchedule failed online, will retry later:', error);
        }
    }
};