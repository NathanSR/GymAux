import { SupabaseClient } from '@supabase/supabase-js';

export type ConnectionStatus = 'pending' | 'active' | 'revoked';

export interface Connection {
    id: string;
    trainer_id: string;
    student_id: string;
    status: ConnectionStatus;
    permissions: {
        view_history: boolean;
        view_sessions: boolean;
        manage_workouts: boolean;
        manage_schedules: boolean;
    };
    created_at: string;
    updated_at: string;
    trainer?: {
        name: string;
    };
    student?: {
        name: string;
    };
}

export const connectionService = {
    async createConnection(trainerId: string, studentId: string, supabase: SupabaseClient) {
        const { data, error } = await supabase
            .from('connections')
            .insert({
                trainer_id: trainerId,
                student_id: studentId,
                status: 'pending',
                permissions: {
                    view_history: true,
                    view_sessions: false,
                    manage_workouts: true,
                    manage_schedules: true
                }
            })
            .select()
            .single();

        if (error) throw error;
        return data as Connection;
    },

    async getPendingConnectionForStudent(studentId: string, supabase: SupabaseClient) {
        const { data, error } = await supabase
            .from('connections')
            .select(`
                *,
                trainer:profiles!connections_trainer_id_fkey (
                    name
                )
            `)
            .eq('student_id', studentId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;
        return data as (Connection & { trainer: { name: string } }) | null;
    },

    async respondToConnection(connectionId: string, status: 'active' | 'revoked', supabase: SupabaseClient) {
        const { data, error } = await supabase
            .from('connections')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', connectionId)
            .select()
            .single();

        if (error) throw error;
        return data as Connection;
    },

    async getActiveStudents(trainerId: string, supabase: SupabaseClient, pagination?: { page: number, limit: number }) {
        let query = supabase
            .from('connections')
            .select(`
                *,
                student:profiles!connections_student_id_fkey (
                    id,
                    name,
                    avatar
                )
            `, { count: 'exact' })
            .eq('trainer_id', trainerId)
            .eq('status', 'active');

        if (pagination) {
            const from = (pagination.page - 1) * pagination.limit;
            const to = from + pagination.limit - 1;
            query = query.range(from, to);
        }

        const { data, error, count } = await query;

        if (error) throw error;
        return {
            students: (data || []).map((conn: any) => ({
                id: conn.student.id,
                name: conn.student.name,
                avatar: conn.student.avatar
            })) as Student[],
            totalCount: count || 0
        };
    }
};
