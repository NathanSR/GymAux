import { createClient } from '@/lib/supabase/client';
import { User } from '@/config/types';
import { withTimeout } from '@/lib/utils/timeout';

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

export const userService = {

    // Buscar por ID
    async getUserById(id: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await withTimeout(
            supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .maybeSingle(),
            3000
        );

        if (error) {
            console.error('Error fetching user by ID:', error?.message || error);
            return null;
        }

        return data ? mapProfileToUser(data) : null;
    },

    // Buscar por GymAux ID
    async getUserByGymauxId(gymauxId: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await withTimeout(
            supabase
                .from('profiles')
                .select('*')
                .eq('gymaux_id', gymauxId)
                .maybeSingle(),
            3000
        );

        if (error) {
            console.error('Error fetching user by GymAux ID:', error?.message || error);
            return null;
        }

        return data ? mapProfileToUser(data) : null;
    },

    // Buscar por Email
    async getUserByEmail(email: string, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const { data, error } = await withTimeout(
            supabase
                .from('profiles')
                .select('*')
                .eq('email', email.toLowerCase().trim())
                .maybeSingle(),
            3000
        );

        if (error) {
            console.error('Error fetching user by Email:', error?.message || error);
            return null;
        }

        return data ? mapProfileToUser(data) : null;
    },

    // Atualizar com regras de negócio
    async updateUser(id: string, updateData: Partial<Omit<User, 'id' | 'createdAt'>>, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        if (updateData.name !== undefined) {
            const formattedName = updateData.name.trim();
            if (formattedName.length < 2) {
                throw new Error("Name too short");
            }
            updateData.name = formattedName;
        }

        const { data, error } = await withTimeout(
            supabase
                .from('profiles')
                .update(updateData)
                .eq('id', id)
                .select()
                .single(),
            3000
        );

        if (error) {
            throw error;
        }

        return data ? mapProfileToUser(data) : null;
    },

};