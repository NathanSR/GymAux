import { createClient } from '@/lib/supabase/client';
import { User } from '@/config/types';

const mapProfileToUser = (profile: any): User => ({
    id: profile.id,
    name: profile.name,
    avatar: profile.avatar || undefined,
    weight: profile.weight || 0,
    height: profile.height || 0,
    goal: profile.goal || undefined,
    createdAt: profile.created_at ? new Date(profile.created_at) : new Date(),
});

export const userService = {
    // Buscar todos
    async getAllUsers() {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('profiles')
            .select('*');

        if (error) {
            console.error('Error fetching users:', error);
            return [];
        }

        return (data || []).map(mapProfileToUser);
    },

    // Buscar por ID
    async getUserById(id: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            console.error('Error fetching user by ID:', error);
            return null;
        }

        return data ? mapProfileToUser(data) : null;
    },

    // Criar novo profile
    async createUser(userData: Omit<User, 'id' | 'createdAt'>) {
        const supabase = createClient();
        const formattedName = userData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("Name too short");
        }

        const { data, error } = await supabase
            .from('profiles')
            .insert({
                name: formattedName,
                avatar: userData.avatar,
                weight: userData.weight,
                height: userData.height,
                goal: userData.goal,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapProfileToUser(data);
    },

    // Atualizar com regras de negócio
    async updateUser(id: string, updateData: Partial<Omit<User, 'id' | 'createdAt'>>) {
        const supabase = createClient();
        if (updateData.name !== undefined) {
            const formattedName = updateData.name.trim();
            if (formattedName.length < 2) {
                throw new Error("Name too short");
            }
            updateData.name = formattedName;
        }

        const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data ? mapProfileToUser(data) : null;
    },

    // Deletar usuário e seus treinos
    async deleteUser(id: string) {
        const supabase = createClient();
        const { error: historyError } = await supabase.from('history').delete().eq('user_id', id);
        const { error: workoutError } = await supabase.from('workouts').delete().eq('user_id', id);
        const { error: profileError } = await supabase.from('profiles').delete().eq('id', id);

        if (historyError || workoutError || profileError) {
            console.error('Error deleting user data:', { historyError, workoutError, profileError });
            throw new Error("Erro ao deletar usuário");
        }
    }
};