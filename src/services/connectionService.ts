import { SupabaseClient } from '@supabase/supabase-js';
import { db } from '@/config/db';
import { Connection } from '@/config/types';
import { Student } from '@/components/trainers/StudentCard';
import { withTimeout } from '@/lib/utils/timeout';

export type ConnectionStatus = 'pending' | 'active' | 'revoked';

export interface ConnectionLocal {
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
        const { data, error } = await withTimeout(
            supabase
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
                .single(),
            3000
        );

        if (error) throw error;
        return data as Connection;
    },

    async getPendingConnectionForStudent(studentId: string, supabase: SupabaseClient) {
        const { data, error } = await withTimeout(
            supabase
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
                .maybeSingle(),
            3000
        );

        if (error) throw error;
        return data as (Connection & { trainer: { name: string } }) | null;
    },

    async respondToConnection(connectionId: string, status: 'active' | 'revoked', supabase: SupabaseClient) {
        const { data, error } = await withTimeout(
            supabase
                .from('connections')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', connectionId)
                .select()
                .single(),
            3000
        );

        if (error) throw error;
        return data as Connection;
    },

    async getActiveStudents(trainerId: string, supabase: SupabaseClient, pagination?: { page: number, limit: number }) {
        try {
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

            const { data, error, count } = await withTimeout(query, 3000);

            if (error) throw error;

            if (typeof window !== 'undefined' && data) {
                // Sync to local DB
                const connections = data.map((conn: any) => ({
                    id: conn.id,
                    trainer_id: conn.trainer_id,
                    student_id: conn.student_id,
                    status: conn.status,
                    permissions: conn.permissions,
                    created_at: conn.created_at,
                    updated_at: conn.updated_at
                }));
                await db.connections.bulkPut(connections);
            }

            return {
                students: (data || []).map((conn: any) => ({
                    id: conn.student.id,
                    name: conn.student.name,
                    avatar: conn.student.avatar
                })) as Student[],
                totalCount: count || 0
            };
        } catch (error) {
            console.warn('[connectionService] getActiveStudents failed, falling back to local DB:', error);
            if (typeof window !== 'undefined') {
                const localConnections = await db.connections
                    .where('trainer_id')
                    .equals(trainerId)
                    .and(c => c.status === 'active')
                    .toArray();

                // We don't have the student profile names here unless we cache them too.
                // For now, return what we have or empty. 
                // In a real scenario, we should cache students/profiles too.
                return {
                    students: [], // Fallback for student listing is harder without profile cache
                    totalCount: localConnections.length
                };
            }
            throw error;
        }
    },

    async checkPermission(trainerId: string, studentId: string, permission: keyof Connection['permissions'], supabase: SupabaseClient): Promise<boolean> {
        if (trainerId === studentId) return true;

        if (typeof window !== 'undefined') {
            const local = await db.connections
                .where('trainer_id')
                .equals(trainerId)
                .filter(c => c.student_id === studentId && c.status === 'active')
                .first();

            if (local) {
                return !!local.permissions[permission];
            }
        }

        try {
            const { data, error } = await withTimeout(
                supabase
                    .from('connections')
                    .select('status, permissions')
                    .eq('trainer_id', trainerId)
                    .eq('student_id', studentId)
                    .eq('status', 'active')
                    .maybeSingle(),
                3000
            );

            if (error) throw error;
            if (!data) return false;

            if (typeof window !== 'undefined') {
                await db.connections.put({
                    trainer_id: trainerId,
                    student_id: studentId,
                    ...data
                } as any);
            }

            return !!data.permissions[permission];
        } catch (error) {
            console.warn('[connectionService] checkPermission failed, assuming false or relying on local:', error);
            return false;
        }
    }
};
