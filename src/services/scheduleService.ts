import { createClient } from '../lib/supabase/client';
import { Schedule } from '@/config/types';
import { getDatabase } from '@/config/rxDatabase';
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
        if (typeof window === 'undefined') {
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

                return {
                    schedules: (data || []).map(mapScheduleFromSupabase),
                    totalCount: count || 0
                };
            } catch (err) {
                console.error('[ScheduleService] Server-side getSchedulesByUserId failed:', err);
                return { schedules: [], totalCount: 0 };
            }
        }

        try {
            const db = await getDatabase();
            
            const selector: any = { userId };
            if (searchQuery.trim()) {
                selector.name = { $regex: new RegExp(searchQuery.trim(), 'i') };
            }

            const docs = await db.schedules.find({ selector }).exec();
            
            let schedules = docs.map(doc => {
                const json = doc.toJSON();
                return {
                    ...json,
                    startDate: new Date(json.startDate),
                    endDate: json.endDate ? new Date(json.endDate) : undefined
                } as Schedule;
            });

            // Ordenar por data de início decrescente
            schedules.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

            const totalCount = schedules.length;

            const from = (pagination.page - 1) * pagination.limit;
            const to = from + pagination.limit;
            const paginatedSchedules = schedules.slice(from, to);

            return {
                schedules: paginatedSchedules,
                totalCount
            };
        } catch (error) {
            console.error('[ScheduleService] getSchedulesByUserId failed:', error);
            return { schedules: [], totalCount: 0 };
        }
    },

    /**
     * Busca o cronograma que está marcado como ativo para o usuário.
     */
    async getActiveSchedule(userId: string, supabaseInput?: any) {
        if (typeof window === 'undefined') {
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
                return data ? mapScheduleFromSupabase(data) : null;
            } catch (err) {
                console.error('[ScheduleService] Server-side getActiveSchedule failed:', err);
                return null;
            }
        }

        try {
            const db = await getDatabase();
            const doc = await db.schedules.findOne({
                selector: { userId, active: true }
            }).exec();

            if (doc) {
                const json = doc.toJSON();
                return {
                    ...json,
                    startDate: new Date(json.startDate),
                    endDate: json.endDate ? new Date(json.endDate) : undefined
                } as Schedule;
            }
            return null;
        } catch (error) {
            console.error('[ScheduleService] getActiveSchedule failed:', error);
            return null;
        }
    },

    async getScheduleById(id: string, supabaseInput?: any) {
        if (typeof window === 'undefined') {
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
                return data ? mapScheduleFromSupabase(data) : null;
            } catch (err) {
                console.error('[ScheduleService] Server-side getScheduleById failed:', err);
                return null;
            }
        }

        try {
            const db = await getDatabase();
            const doc = await db.schedules.findOne(id).exec();
            if (doc) {
                const json = doc.toJSON();
                return {
                    ...json,
                    startDate: new Date(json.startDate),
                    endDate: json.endDate ? new Date(json.endDate) : undefined
                } as Schedule;
            }
            return null;
        } catch (error) {
            console.error('[ScheduleService] getScheduleById failed:', error);
            return null;
        }
    },

    /**
     * Cria um novo cronograma.
     */
    async createSchedule(scheduleData: Omit<Schedule, 'id'>, callerId: string, supabaseInput?: any) {
        const formattedName = scheduleData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("O nome do cronograma é muito curto.");
        }

        if (scheduleData.workouts.length !== 7) {
            throw new Error("O cronograma deve conter exatamente 7 dias (domingo a sábado).");
        }

        const supabase = supabaseInput || createClient();
        const id = crypto.randomUUID();

        const newSchedule: Schedule = {
            ...scheduleData,
            id,
            name: formattedName,
            createdBy: callerId,
            createdByType: scheduleData.userId === callerId ? 'user' : 'trainer',
            startDate: typeof scheduleData.startDate === 'string' ? new Date(scheduleData.startDate) : scheduleData.startDate,
            endDate: scheduleData.endDate ? (typeof scheduleData.endDate === 'string' ? new Date(scheduleData.endDate) : scheduleData.endDate) : undefined,
        } as Schedule;

        if (typeof window === 'undefined') {
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
        }

        const db = await getDatabase();

        // Se estiver ativando este cronograma, desativar os outros ativos localmente
        if (scheduleData.active) {
            const activeSchedules = await db.schedules.find({
                selector: { userId: scheduleData.userId, active: true }
            }).exec();

            for (const s of activeSchedules) {
                await s.incrementalPatch({
                    active: false,
                    updated_at: new Date().toISOString()
                });
            }
        }

        const localSchedule = {
            id,
            name: formattedName,
            userId: scheduleData.userId,
            createdBy: callerId,
            createdByType: scheduleData.userId === callerId ? 'user' : 'trainer',
            workouts: scheduleData.workouts,
            startDate: scheduleData.startDate instanceof Date ? scheduleData.startDate.toISOString() : String(scheduleData.startDate),
            endDate: scheduleData.endDate ? (scheduleData.endDate instanceof Date ? scheduleData.endDate.toISOString() : String(scheduleData.endDate)) : null,
            active: scheduleData.active,
            lastCompleted: scheduleData.lastCompleted || null,
            updated_at: new Date().toISOString()
        };

        const inserted = await db.schedules.insert(localSchedule);
        const json = inserted.toJSON();

        return {
            ...json,
            startDate: new Date(json.startDate),
            endDate: json.endDate ? new Date(json.endDate) : undefined
        } as Schedule;
    },

    /**
     * Atualiza um cronograma existente.
     */
    async updateSchedule(id: string, scheduleData: Partial<Schedule>, callerId: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();

        const updates: any = {};
        if (scheduleData.name) updates.name = scheduleData.name.trim();
        if (scheduleData.userId) updates.user_id = scheduleData.userId;
        if (scheduleData.workouts) updates.workouts = scheduleData.workouts;
        if (scheduleData.startDate) {
            updates.start_date = scheduleData.startDate instanceof Date ? scheduleData.startDate.toISOString() : String(scheduleData.startDate);
        }
        if (scheduleData.endDate !== undefined) {
            updates.end_date = scheduleData.endDate instanceof Date ? scheduleData.endDate.toISOString() : (scheduleData.endDate ? String(scheduleData.endDate) : null);
        }
        if (scheduleData.active !== undefined) updates.active = scheduleData.active;
        if (scheduleData.lastCompleted !== undefined) updates.last_completed = scheduleData.lastCompleted;

        if (typeof window === 'undefined') {
            if (updates.active === true) {
                const userId = scheduleData.userId || callerId;
                await withTimeout(
                    supabase
                        .from('schedules')
                        .update({ active: false })
                        .eq('user_id', userId)
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
        }

        const db = await getDatabase();
        const doc = await db.schedules.findOne(id).exec();
        
        if (!doc) throw new Error("Schedule não encontrado.");

        const current = doc.toJSON();

        // Se estiver ativando este cronograma, desativar os outros
        if (scheduleData.active === true) {
            const userId = scheduleData.userId || current.userId;
            const otherActive = await db.schedules.find({
                selector: {
                    userId,
                    active: true,
                    id: { $ne: id }
                }
            }).exec();

            for (const s of otherActive) {
                await s.incrementalPatch({
                    active: false,
                    updated_at: new Date().toISOString()
                });
            }
        }

        const cleanUpdates: any = {
            updated_at: new Date().toISOString()
        };
        if (scheduleData.name) cleanUpdates.name = scheduleData.name.trim();
        if (scheduleData.userId) cleanUpdates.userId = scheduleData.userId;
        if (scheduleData.workouts) cleanUpdates.workouts = scheduleData.workouts;
        if (scheduleData.startDate) {
            cleanUpdates.startDate = scheduleData.startDate instanceof Date ? scheduleData.startDate.toISOString() : String(scheduleData.startDate);
        }
        if (scheduleData.endDate !== undefined) {
            cleanUpdates.endDate = scheduleData.endDate instanceof Date ? scheduleData.endDate.toISOString() : (scheduleData.endDate ? String(scheduleData.endDate) : null);
        }
        if (scheduleData.active !== undefined) cleanUpdates.active = scheduleData.active;
        if (scheduleData.lastCompleted !== undefined) cleanUpdates.lastCompleted = scheduleData.lastCompleted;

        const updated = await doc.incrementalPatch(cleanUpdates);
        const json = updated.toJSON();

        return {
            ...json,
            startDate: new Date(json.startDate),
            endDate: json.endDate ? new Date(json.endDate) : undefined
        } as Schedule;
    },

    /**
     * Remove um cronograma.
     */
    async deleteSchedule(id: string, callerId: string, supabaseInput?: any) {
        if (typeof window === 'undefined') {
            const supabase = supabaseInput || createClient();
            const { error } = await withTimeout(
                supabase.from('schedules').delete().eq('id', id),
                3000
            );
            if (error) throw error;
            return;
        }

        const db = await getDatabase();
        const doc = await db.schedules.findOne(id).exec();
        if (doc) {
            await doc.remove();
        }
    }
};