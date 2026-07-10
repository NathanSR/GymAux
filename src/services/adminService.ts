import { createClient } from '@/lib/supabase/client';
import { User, Exercise } from '@/config/types';

const mapProfileToUser = (profile: any): User => ({
    id: profile.id,
    gymauxId: profile.gymaux_id || undefined,
    name: profile.name,
    avatar: profile.avatar || undefined,
    weight: profile.weight || 0,
    height: profile.height || 0,
    goal: profile.goal || undefined,
    role: profile.role || 'user',
    email: profile.email || undefined,
    createdAt: profile.created_at ? new Date(profile.created_at) : new Date(),
});

const mapExerciseFromSupabaseAdmin = (ex: any): Exercise & { createdByName?: string } => {
    const tags = ex.tags || [];
    return {
        id: ex.id,
        created_by: ex.created_by,
        created_by_type: ex.created_by_type || "system",
        name: ex.name,
        description: ex.description || undefined,
        category: ex.category as any,
        tags: tags,
        howTo: ex.how_to || undefined,
        mediaUrl: ex.media_url || undefined,
        level: ex.level as any,
        visibility: ex.visibility || (ex.created_by_type === 'system' || (ex.id && ex.id < 1000) ? 'public' : (ex.is_public ? 'public' : 'private')),
        shared_with: ex.shared_with || [],
        equipment: ex.equipment || 'none',
        executionMode: ex.execution_mode || 'bilateral',
        mechanics: ex.mechanics || 'compound',
        parentId: ex.parent_id || undefined,
        createdByName: ex.profiles?.name || 'Sistema'
    };
};

export const adminService = {
    // Buscar todos os usuários do sistema
    async getAllUsers(supabaseInput?: any): Promise<User[]> {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[adminService] Error fetching all users:', error);
            throw error;
        }
        return (data || []).map(mapProfileToUser);
    },

    // Buscar estatísticas gerais do painel
    async getAdminStats(supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        
        try {
            const [usersCount, workoutsCount, sessionsCount] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('workouts').select('*', { count: 'exact', head: true }),
                supabase.from('sessions').select('*', { count: 'exact', head: true })
            ]);

            return {
                totalUsers: usersCount.count || 0,
                totalWorkouts: workoutsCount.count || 0,
                totalActiveSessions: sessionsCount.count || 0
            };
        } catch (error) {
            console.error('[adminService] Error fetching stats:', error);
            return {
                totalUsers: 0,
                totalWorkouts: 0,
                totalActiveSessions: 0
            };
        }
    },

    // Buscar todos os treinos com os dados de perfil do usuário correspondente
    async getAllWorkoutsWithUsers(supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('workouts')
            .select('*, profiles(name, avatar)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[adminService] Error fetching all workouts:', error);
            throw error;
        }

        return (data || []).map((workout: any) => ({
            id: workout.id,
            userId: workout.user_id,
            name: workout.name,
            description: workout.description,
            createdAt: workout.created_at ? new Date(workout.created_at) : new Date(),
            exercises: workout.exercises || [],
            user: workout.profiles ? {
                name: workout.profiles.name,
                avatar: workout.profiles.avatar
            } : null
        }));
    },

    // Buscar todos os exercícios com suporte a filtros e paginação para o admin
    async getAllExercisesAdmin(
        params?: {
            search?: string;
            category?: string;
            equipment?: string;
            origin?: 'all' | 'system' | 'user';
            page?: number;
            limit?: number;
            supabaseInput?: any;
        }
    ): Promise<{ exercises: (Exercise & { createdByName?: string })[]; totalCount: number }> {
        const {
            search = '',
            category = 'all',
            equipment = 'all',
            origin = 'all',
            page = 1,
            limit = 20,
            supabaseInput
        } = params || {};

        const supabase = supabaseInput || createClient();
        
        let query = supabase
            .from('exercises')
            .select('*, profiles:created_by(name)', { count: 'exact' });

        // Filtro por origem
        if (origin === 'system') {
            query = query.eq('created_by_type', 'system');
        } else if (origin === 'user') {
            query = query.eq('created_by_type', 'user');
        }

        // Filtro por categoria
        if (category !== 'all') {
            query = query.eq('category', category);
        }

        // Filtro por equipamento
        if (equipment !== 'all') {
            query = query.eq('equipment', equipment);
        }

        // Filtro por busca de texto (nome ou descrição)
        if (search.trim()) {
            query = query.or(`name.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`);
        }

        // Paginação
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query
            .order('name', { ascending: true })
            .range(from, to);

        if (error) {
            console.error('[adminService] Error fetching exercises:', error);
            throw error;
        }

        return {
            exercises: (data || []).map(mapExerciseFromSupabaseAdmin),
            totalCount: count || 0
        };
    },

    // Criar exercício como administrador
    async createExerciseAdmin(exerciseData: Omit<Exercise, 'id'>, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const apiPayload = {
            name: exerciseData.name.trim(),
            description: exerciseData.description?.trim() || null,
            how_to: exerciseData.howTo?.trim() || null,
            media_url: exerciseData.mediaUrl?.trim() || null,
            category: exerciseData.category,
            tags: exerciseData.tags || [],
            level: exerciseData.level || 'beginner',
            created_by: exerciseData.created_by || null,
            created_by_type: exerciseData.created_by_type || 'system',
            visibility: exerciseData.visibility || 'public',
            shared_with: exerciseData.shared_with || [],
            equipment: exerciseData.equipment || 'none',
            execution_mode: exerciseData.executionMode || 'bilateral',
            mechanics: exerciseData.mechanics || 'compound'
        };

        const { data, error } = await supabase
            .from('exercises')
            .insert(apiPayload)
            .select()
            .single();

        if (error) {
            console.error('[adminService] Error creating exercise:', error);
            throw error;
        }

        return mapExerciseFromSupabaseAdmin(data);
    },

    // Atualizar exercício como administrador (ignorando a restrição id < 1000)
    async updateExerciseAdmin(id: number, updateData: Partial<Omit<Exercise, 'id'>>, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const apiPayload: any = {
            name: updateData.name?.trim(),
            description: updateData.description !== undefined ? (updateData.description?.trim() || null) : undefined,
            how_to: updateData.howTo !== undefined ? (updateData.howTo?.trim() || null) : undefined,
            media_url: updateData.mediaUrl !== undefined ? (updateData.mediaUrl?.trim() || null) : undefined,
            category: updateData.category,
            tags: updateData.tags,
            level: updateData.level,
            created_by: updateData.created_by,
            created_by_type: updateData.created_by_type,
            visibility: updateData.visibility,
            shared_with: updateData.shared_with,
            equipment: updateData.equipment,
            execution_mode: updateData.executionMode,
            mechanics: updateData.mechanics
        };

        // Remove chaves undefined para não sobrescrever com null no update
        Object.keys(apiPayload).forEach(key => apiPayload[key] === undefined && delete apiPayload[key]);

        const { data, error } = await supabase
            .from('exercises')
            .update(apiPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[adminService] Error updating exercise:', error);
            throw error;
        }

        return mapExerciseFromSupabaseAdmin(data);
    },

    // Deletar exercício como administrador
    async deleteExerciseAdmin(id: number, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { error } = await supabase
            .from('exercises')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('[adminService] Error deleting exercise:', error);
            throw error;
        }
    }
};
