import { createClient } from '@/lib/supabase/client';
import { User } from '@/config/types';
import { db } from '@/config/db';
import { withTimeout } from '@/lib/utils/timeout';
import { authService } from './authService';
import { SyncManager } from './syncManager';

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

    // Revalidação em segundo plano sem bloquear a interface
    async revalidateUserInBackground(id: string, supabaseInput?: any) {
        if (typeof window === 'undefined' || !navigator.onLine) return;
        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle(),
                3500
            );

            if (!error && data) {
                const user = mapProfileToUser(data);
                await authService.ensureUserIsolation(user.id);
                await db.users.put(user).catch(() => {});
            }
        } catch {
            // Revalidação em segundo plano silenciosa
        }
    },

    // Buscar por ID — Stale-While-Revalidate (0ms Local-First)
    async getUserById(id: string, supabaseInput?: any): Promise<User | null> {
        // 1. Tenta recuperar do Dexie local imediatamente (0ms)
        if (typeof window !== 'undefined') {
            const local = await db.users.get(id);
            if (local) {
                // Dispara sincronização em segundo plano se houver conexão
                this.revalidateUserInBackground(id, supabaseInput);
                return local;
            }
        }

        // 2. Se não estiver no cache local (primeiro acesso), busca na nuvem
        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle(),
                3500
            );

            if (error) throw error;

            if (data) {
                const user = mapProfileToUser(data);
                if (typeof window !== 'undefined') {
                    await authService.ensureUserIsolation(user.id);
                    await db.users.put(user).catch(() => {});
                }
                return user;
            }

            return null;
        } catch (error) {
            console.warn('[userService] getUserById cloud fetch failed, checking local DB:', error);
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

    // Atualizar com regras de negócio — 100% Local-First
    async updateUser(id: string, updateData: Partial<Omit<User, 'id' | 'createdAt'>>, supabaseInput?: any) {
        if (updateData.name !== undefined) {
            const formattedName = updateData.name.trim();
            if (formattedName.length < 2) {
                throw new Error("Name too short");
            }
            updateData.name = formattedName;
        }

        // Local-first update
        if (typeof window !== 'undefined') {
            const local = await db.users.get(id);
            const updated: User = local 
                ? { ...local, ...updateData } 
                : { id, name: updateData.name || '', weight: updateData.weight || 0, height: updateData.height || 0, role: updateData.role || 'user', createdAt: new Date(), ...updateData };
            
            await db.users.put(updated);
            await SyncManager.enqueue('UPDATE', 'USER', id, updateData, id);
            return updated;
        }

        const supabase = supabaseInput || createClient();
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
     * Returns the cached auth user ID even when offline with fail-fast timeouts.
     * This is the SINGLE SOURCE OF TRUTH for "who is the current user".
     */
    async resolveCurrentUserId(): Promise<string | null> {
        // 1. Se estiver offline no navegador, consulta Dexie e storage local
        if (typeof window !== 'undefined' && !navigator.onLine) {
            try {
                const cached = await db.users.toCollection().first();
                if (cached?.id) return cached.id;
            } catch {
                // Ignore Dexie errors
            }

            try {
                const supabase = createClient();
                const { data } = await supabase.auth.getSession();
                if (data?.session?.user?.id) return data.session.user.id;
            } catch {
                // Ignore
            }
        }

        // 2. Se online, tenta Supabase com fail-fast de 800ms
        try {
            const supabase = createClient();
            const { data } = await withTimeout(supabase.auth.getUser(), 800);
            if (data?.user?.id) return data.user.id;
        } catch {
            // Auth call failed or timed out
        }

        // 3. Fallback: check Supabase session (instantânea a partir de cookies/storage)
        try {
            const supabase = createClient();
            const { data } = await withTimeout(supabase.auth.getSession(), 500);
            if (data?.session?.user?.id) return data.session.user.id;
        } catch {
            // Session call also failed
        }

        // 4. Último recurso: Dexie
        if (typeof window !== 'undefined') {
            const cached = await db.users.toCollection().first();
            if (cached?.id) return cached.id;
        }

        return null;
    },
};