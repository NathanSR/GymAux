import { SupabaseClient } from '@supabase/supabase-js';
import { Connection } from '@/config/types';
import { getDatabase } from '@/config/rxDatabase';
import { userService } from './userService';

export interface Student {
    id: string;
    name: string;
    avatar: string | null;
}

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
        const id = crypto.randomUUID();
        const connectionPayload: any = {
            id,
            trainer_id: trainerId,
            student_id: studentId,
            status: 'pending',
            permissions: {
                view_history: true,
                view_sessions: false,
                manage_workouts: true,
                manage_schedules: true
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const db = await getDatabase();
        const inserted = await db.connections.insert(connectionPayload);
        return inserted.toJSON() as Connection;
    },

    async getPendingConnectionForStudent(studentId: string, supabase: SupabaseClient) {
        // As conexões pendentes são melhores buscadas em tempo real na rede
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
        const db = await getDatabase();
        const doc = await db.connections.findOne(connectionId).exec();
        
        if (doc) {
            const updated = await doc.incrementalPatch({
                status,
                updated_at: new Date().toISOString()
            });
            return updated.toJSON() as Connection;
        }

        // Se não achar localmente (raro), faz o update na rede
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
        try {
            const db = await getDatabase();
            const docs = await db.connections.find({
                selector: {
                    trainer_id: trainerId,
                    status: 'active'
                }
            }).exec();

            const connections = docs.map(doc => doc.toJSON());
            const students: Student[] = [];

            for (const conn of connections) {
                const profile = await userService.getUserById(conn.student_id, supabase);
                if (profile) {
                    students.push({
                        id: profile.id!,
                        name: profile.name,
                        avatar: profile.avatar || null
                    });
                }
            }

            const totalCount = students.length;
            let paginatedStudents = students;

            if (pagination) {
                const from = (pagination.page - 1) * pagination.limit;
                const to = from + pagination.limit;
                paginatedStudents = students.slice(from, to);
            }

            return {
                students: paginatedStudents,
                totalCount
            };
        } catch (error) {
            console.error('[connectionService] getActiveStudents failed:', error);
            return { students: [], totalCount: 0 };
        }
    },

    async checkPermission(trainerId: string, studentId: string, permission: keyof Connection['permissions'], supabase: SupabaseClient): Promise<boolean> {
        if (trainerId === studentId) return true;

        try {
            const db = await getDatabase();
            const doc = await db.connections.findOne({
                selector: {
                    trainer_id: trainerId,
                    student_id: studentId,
                    status: 'active'
                }
            }).exec();

            if (doc) {
                const json = doc.toJSON();
                return !!json.permissions[permission];
            }

            // Fallback na rede caso não esteja replicado ainda
            const { data, error } = await supabase
                .from('connections')
                .select('status, permissions')
                .eq('trainer_id', trainerId)
                .eq('student_id', studentId)
                .eq('status', 'active')
                .maybeSingle();

            if (error) throw error;
            if (!data) return false;

            return !!data.permissions[permission];
        } catch (error) {
            console.warn('[connectionService] checkPermission failed, assuming false:', error);
            return false;
        }
    }
};
