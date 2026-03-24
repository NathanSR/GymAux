import { createClient } from '@/lib/supabase/client';
import { Schedule } from '@/config/types';

const mapScheduleFromSupabase = (s: any): Schedule => ({
    id: s.id,
    name: s.name,
    userId: s.user_id,
    workouts: s.workouts as (string | null)[],
    startDate: new Date(s.start_date),
    endDate: s.end_date ? new Date(s.end_date) : undefined,
    active: s.active,
    lastCompleted: s.last_completed ?? undefined,
});

export const ScheduleService = {
    /**
     * Busca todos os cronogramas do banco.
     */
    async getAllSchedules(supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('schedules')
            .select('*');

        if (error) {
            console.error('Error fetching all schedules:', error);
            return [];
        }

        return (data || []).map(mapScheduleFromSupabase);
    },

    /**
     * Busca cronogramas de um usuário específico de forma paginada e com busca.
     */
    async getSchedulesByUserId(userId: string, searchQuery = '', pagination: { page: number; limit: number }, supabaseInput?: any) {
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

        const { data, count, error } = await query.range(from, to);

        if (error) {
            console.error('Error fetching schedules by user ID:', error);
            return { schedules: [], totalCount: 0 };
        }

        return {
            schedules: (data || []).map(mapScheduleFromSupabase),
            totalCount: count || 0
        };
    },

    /**
     * Busca o cronograma que está marcado como ativo para o usuário.
     */
    async getActiveSchedule(userId: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('schedules')
            .select('*')
            .eq('user_id', userId)
            .eq('active', true)
            .maybeSingle();

        if (error) {
            console.error('Error fetching active schedule:', error);
            return null;
        }

        return data ? mapScheduleFromSupabase(data) : null;
    },

    async getScheduleById(id: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('schedules')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            console.error('Error fetching schedule by ID:', error);
            return null;
        }

        return data ? mapScheduleFromSupabase(data) : null;
    },

    /**
     * Cria um novo cronograma.
     * Inclui regra para garantir que apenas um cronograma esteja ativo por vez.
     */
    async createSchedule(scheduleData: Omit<Schedule, 'id'>, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const formattedName = scheduleData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("O nome do cronograma é muito curto.");
        }

        if (scheduleData.workouts.length !== 7) {
            throw new Error("O cronograma deve conter exatamente 7 dias (domingo a sábado).");
        }

        // Se for ativo, desativa os outros primeiro
        if (scheduleData.active) {
            await supabase
                .from('schedules')
                .update({ active: false })
                .eq('user_id', scheduleData.userId);
        }

        const { data, error } = await supabase
            .from('schedules')
            .insert({
                name: formattedName,
                user_id: scheduleData.userId,
                workouts: scheduleData.workouts as any,
                start_date: scheduleData.startDate.toISOString(),
                end_date: scheduleData.endDate?.toISOString(),
                active: scheduleData.active,
                last_completed: scheduleData.lastCompleted ?? -1,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapScheduleFromSupabase(data);
    },

    /**
     * Atualiza o progresso do cronograma (qual foi o último treino concluído).
     */
    async updateProgress(id: string, workoutIndex: number, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        if (workoutIndex < 0 || workoutIndex > 6) {
            throw new Error("Índice de dia inválido (deve ser entre 0 e 6).");
        }

        const { data, error } = await supabase
            .from('schedules')
            .update({ last_completed: workoutIndex })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapScheduleFromSupabase(data);
    },

    /**
     * Atualiza um cronograma existente.
     */
    async updateSchedule(id: string, scheduleData: Partial<Schedule>, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const updates: any = {};
        if (scheduleData.name) updates.name = scheduleData.name.trim();
        if (scheduleData.userId) updates.user_id = scheduleData.userId;
        if (scheduleData.workouts) updates.workouts = scheduleData.workouts;
        if (scheduleData.startDate) updates.start_date = scheduleData.startDate.toISOString();
        if (scheduleData.endDate) updates.end_date = scheduleData.endDate.toISOString();
        if (scheduleData.active !== undefined) updates.active = scheduleData.active;
        if (scheduleData.lastCompleted !== undefined) updates.last_completed = scheduleData.lastCompleted;

        const { data, error } = await supabase
            .from('schedules')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapScheduleFromSupabase(data);
    },

    /**
     * Ativa um cronograma específico e desativa todos os outros do mesmo usuário.
     */
    async setActiveSchedule(id: string, userId: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        // Desativa todos
        await supabase
            .from('schedules')
            .update({ active: false })
            .eq('user_id', userId);

        // Ativa o selecionado
        const { data, error } = await supabase
            .from('schedules')
            .update({ active: true })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapScheduleFromSupabase(data);
    },

    /**
     * Remove um cronograma.
     */
    async deleteSchedule(id: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { error } = await supabase
            .from('schedules')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }
    }
};