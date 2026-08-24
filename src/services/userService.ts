import { createClient } from '@/lib/supabase/client';
import { User } from '@/config/types';
import { db } from '@/config/db';
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

    // Buscar por ID — com fallback local
    async getUserById(id: string, supabaseInput?: any): Promise<User | null> {
        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle(),
                3000
            );

            if (error) throw error;

            if (data) {
                const user = mapProfileToUser(data);
                // Cache to Dexie for offline access
                if (typeof window !== 'undefined') {
                    await db.users.put(user).catch(() => {/* ignore Dexie errors on cache */});
                }
                return user;
            }

            // Supabase returned null — try local cache before giving up
            if (typeof window !== 'undefined') {
                const local = await db.users.get(id);
                if (local) return local;
            }
            return null;
        } catch (error) {
            console.warn('[userService] getUserById failed, falling back to local DB:', error);
            // Offline or network failure — resolve from Dexie
            if (typeof window !== 'undefined') {
                const local = await db.users.get(id);
                if (local) return local;
            }
            return null;
        }
    },

    // Buscar por GymAux ID
    async getUserByGymauxId(gymauxId: string, supabaseInput?: any) {
        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('profiles')
                    .select('*')
                    .eq('gymaux_id', gymauxId)
                    .maybeSingle(),
                3000
            );

            if (error) throw error;

            if (data) {
                const user = mapProfileToUser(data);
                if (typeof window !== 'undefined') {
                    await db.users.put(user).catch(() => {});
                }
                return user;
            }

            // Try local by scanning (gymauxId not indexed, but small table)
            if (typeof window !== 'undefined') {
                const local = await db.users.filter(u => u.gymauxId === gymauxId).first();
                if (local) return local;
            }
            return null;
        } catch (error) {
            console.warn('[userService] getUserByGymauxId failed, falling back to local DB:', error);
            if (typeof window !== 'undefined') {
                const local = await db.users.filter(u => u.gymauxId === gymauxId).first();
                if (local) return local;
            }
            return null;
        }
    },

    // Buscar por Email
    async getUserByEmail(email: string, supabaseInput?: any) {
        const normalizedEmail = email.toLowerCase().trim();
        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('profiles')
                    .select('*')
                    .eq('email', normalizedEmail)
                    .maybeSingle(),
                3000
            );

            if (error) throw error;

            if (data) {
                const user = mapProfileToUser(data);
                if (typeof window !== 'undefined') {
                    await db.users.put(user).catch(() => {});
                }
                return user;
            }

            if (typeof window !== 'undefined') {
                const local = await db.users.filter(u => u.email === normalizedEmail).first();
                if (local) return local;
            }
            return null;
        } catch (error) {
            console.warn('[userService] getUserByEmail failed, falling back to local DB:', error);
            if (typeof window !== 'undefined') {
                const local = await db.users.filter(u => u.email === normalizedEmail).first();
                if (local) return local;
            }
            return null;
        }
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

        const user = data ? mapProfileToUser(data) : null;
        // Update local cache
        if (user && typeof window !== 'undefined') {
            await db.users.put(user).catch(() => {});
        }
        return user;
    },

    /**
     * Resolve the current authenticated user ID.
     * Returns the cached auth user ID even when offline.
     * This is the SINGLE SOURCE OF TRUTH for "who is the current user".
     */
    async resolveCurrentUserId(): Promise<string | null> {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.id) return user.id;
        } catch {
            // Auth call failed (offline, token stale, etc.)
        }

        // Fallback: check Supabase session (works even if getUser() times out)
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) return session.user.id;
        } catch {
            // Session call also failed
        }

        // Last resort: return the first cached user from Dexie
        if (typeof window !== 'undefined') {
            const cached = await db.users.toCollection().first();
            if (cached?.id) return cached.id;
        }

        return null;
    },
};