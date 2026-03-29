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

    async getActiveStudents(trainerId: string, supabase: SupabaseClient) {
        const { data, error } = await supabase
            .from('connections')
            .select(`
                *,
                student:profiles!connections_student_id_fkey (
                    id,
                    name,
                    avatar
                )
            `)
            .eq('trainer_id', trainerId)
            .eq('status', 'active');

        if (error) throw error;
        return data as (Connection & { student: { id: string; name: string; avatar: string | null } })[];
    }
};
