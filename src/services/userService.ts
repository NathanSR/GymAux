import { createClient } from '../lib/supabase/client';
import { User } from '@/config/types';
import { getDatabase } from '@/config/rxDatabase';
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

const mapUserToRxDB = (user: User) => ({
    id: user.id,
    gymauxId: user.gymauxId || '',
    name: user.name,
    avatar: user.avatar || '',
    weight: user.weight,
    height: user.height,
    goal: user.goal || '',
    role: user.role,
    email: user.email || '',
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : String(user.createdAt),
    updated_at: new Date().toISOString()
});

const mapRxDBToUser = (json: any): User => ({
    id: json.id,
    gymauxId: json.gymauxId || undefined,
    name: json.name,
    avatar: json.avatar || undefined,
    weight: json.weight || 0,
    height: json.height || 0,
    goal: json.goal || undefined,
    role: json.role || 'user',
    email: json.email || undefined,
    createdAt: new Date(json.createdAt)
});

export const userService = {

    // Buscar por ID — com fallback local
    async getUserById(id: string, supabaseInput?: any): Promise<User | null> {
        if (typeof window === 'undefined') {
            try {
                const supabase = supabaseInput || createClient();
                const { data, error } = await withTimeout(
                    supabase.from('profiles').select('*').eq('id', id).maybeSingle(),
                    3000
                );
                if (error) throw error;
                return data ? mapProfileToUser(data) : null;
            } catch (err) {
                console.error('[userService] Server-side getUserById failed:', err);
                return null;
            }
        }

        try {
            const db = await getDatabase();
            const localDoc = await db.users.findOne(id).exec();
            if (localDoc) {
                return mapRxDBToUser(localDoc.toJSON());
            }

            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase.from('profiles').select('*').eq('id', id).maybeSingle(),
                3000
            );

            if (error) throw error;

            if (data) {
                const user = mapProfileToUser(data);
                await db.users.insert(mapUserToRxDB(user)).catch(() => {});
                return user;
            }
            return null;
        } catch (error) {
            console.warn('[userService] getUserById failed, falling back to local DB:', error);
            try {
                const db = await getDatabase();
                const localDoc = await db.users.findOne(id).exec();
                if (localDoc) return mapRxDBToUser(localDoc.toJSON());
            } catch {}
            return null;
        }
    },

    // Buscar por GymAux ID
    async getUserByGymauxId(gymauxId: string, supabaseInput?: any) {
        if (typeof window === 'undefined') {
            try {
                const supabase = supabaseInput || createClient();
                const { data, error } = await withTimeout(
                    supabase.from('profiles').select('*').eq('gymaux_id', gymauxId).maybeSingle(),
                    3000
                );
                if (error) throw error;
                return data ? mapProfileToUser(data) : null;
            } catch (err) {
                console.error('[userService] Server-side getUserByGymauxId failed:', err);
                return null;
            }
        }

        try {
            const db = await getDatabase();
            const localDoc = await db.users.findOne({ selector: { gymauxId } }).exec();
            if (localDoc) {
                return mapRxDBToUser(localDoc.toJSON());
            }

            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase.from('profiles').select('*').eq('gymaux_id', gymauxId).maybeSingle(),
                3000
            );

            if (error) throw error;

            if (data) {
                const user = mapProfileToUser(data);
                await db.users.insert(mapUserToRxDB(user)).catch(() => {});
                return user;
            }
            return null;
        } catch (error) {
            console.warn('[userService] getUserByGymauxId failed, falling back to local DB:', error);
            try {
                const db = await getDatabase();
                const localDoc = await db.users.findOne({ selector: { gymauxId } }).exec();
                if (localDoc) return mapRxDBToUser(localDoc.toJSON());
            } catch {}
            return null;
        }
    },

    // Buscar por Email
    async getUserByEmail(email: string, supabaseInput?: any) {
        const normalizedEmail = email.toLowerCase().trim();
        if (typeof window === 'undefined') {
            try {
                const supabase = supabaseInput || createClient();
                const { data, error } = await withTimeout(
                    supabase.from('profiles').select('*').eq('email', normalizedEmail).maybeSingle(),
                    3000
                );
                if (error) throw error;
                return data ? mapProfileToUser(data) : null;
            } catch (err) {
                console.error('[userService] Server-side getUserByEmail failed:', err);
                return null;
            }
        }

        try {
            const db = await getDatabase();
            const localDoc = await db.users.findOne({ selector: { email: normalizedEmail } }).exec();
            if (localDoc) {
                return mapRxDBToUser(localDoc.toJSON());
            }

            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase.from('profiles').select('*').eq('email', normalizedEmail).maybeSingle(),
                3000
            );

            if (error) throw error;

            if (data) {
                const user = mapProfileToUser(data);
                await db.users.insert(mapUserToRxDB(user)).catch(() => {});
                return user;
            }
            return null;
        } catch (error) {
            console.warn('[userService] getUserByEmail failed, falling back to local DB:', error);
            try {
                const db = await getDatabase();
                const localDoc = await db.users.findOne({ selector: { email: normalizedEmail } }).exec();
                if (localDoc) return mapRxDBToUser(localDoc.toJSON());
            } catch {}
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
        
        // Atualizar cache local se estiver no cliente
        if (user && typeof window !== 'undefined') {
            try {
                const db = await getDatabase();
                const localDoc = await db.users.findOne(id).exec();
                if (localDoc) {
                    await localDoc.incrementalPatch(mapUserToRxDB(user));
                } else {
                    await db.users.insert(mapUserToRxDB(user)).catch(() => {});
                }
            } catch {}
        }
        return user;
    },

    /**
     * Resolve o ID do usuário autenticado atual.
     * Retorna o ID mesmo se offline.
     */
    async resolveCurrentUserId(): Promise<string | null> {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.id) return user.id;
        } catch {
            // Falha na chamada (offline, token expirado, etc.)
        }

        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) return session.user.id;
        } catch {
            // Falha também na sessão
        }

        // Último recurso: retorna o primeiro usuário no cache RxDB
        if (typeof window !== 'undefined') {
            try {
                const db = await getDatabase();
                const firstUserDoc = await db.users.findOne().exec();
                if (firstUserDoc) return firstUserDoc.primary;
            } catch {}
        }

        return null;
    },
};