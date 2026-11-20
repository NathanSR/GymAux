'use client';

import { useEffect, useState } from 'react';
import { User } from '@/config/types';
import { userService } from '@/services/userService';
import { createClient } from '@/lib/supabase/client';
import { db } from '@/config/db';
import { authService } from '@/services/authService';
import { getStoredActiveAuthUserId, setStoredActiveAuthUserId } from '@/utils/activeAuthUser';

interface SessionSnapshot {
    activeUser: User | null;
    loading: boolean;
}

type Listener = (snapshot: SessionSnapshot) => void;

/**
 * Store singleton de sessão para evitar múltiplas subscriptions simultâneas
 * no Supabase (`onAuthStateChange`) e leituras redundantes no Dexie a cada página.
 */
class AuthSessionStore {
    private snapshot: SessionSnapshot = { activeUser: null, loading: true };
    private listeners = new Set<Listener>();
    private initialized = false;

    public getSnapshot(): SessionSnapshot {
        return this.snapshot;
    }

    private setSnapshot(next: Partial<SessionSnapshot>) {
        this.snapshot = { ...this.snapshot, ...next };
        this.listeners.forEach(l => l(this.snapshot));
    }

    public subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        if (!this.initialized && typeof window !== 'undefined') {
            this.init();
        }
        listener(this.snapshot);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private init() {
        this.initialized = true;
        const supabase = createClient();

        // 1. Leitura imediata (0ms) pelo ID dedicado da conta autenticada (NUNCA db.users.first()!)
        const storedId = getStoredActiveAuthUserId();
        if (storedId) {
            db.users.get(storedId).then((cached) => {
                if (cached) {
                    this.setSnapshot({ activeUser: cached, loading: false });
                }
            }).catch(() => { });
        }

        // 2. Resolução completa e revalidação segura em background
        const loadUser = async () => {
            try {
                const userId = await userService.resolveCurrentUserId();
                if (userId) {
                    setStoredActiveAuthUserId(userId);
                    const profile = await userService.getUserById(userId);
                    if (profile) {
                        this.setSnapshot({ activeUser: profile, loading: false });
                        return;
                    }
                    const cached = await db.users.get(userId);
                    if (cached) {
                        this.setSnapshot({ activeUser: cached, loading: false });
                        return;
                    }
                }
                this.setSnapshot({ activeUser: this.snapshot.activeUser, loading: false });
            } catch (error: any) {
                console.warn('[useSession] Error loading session:', error?.message || error);
                this.setSnapshot({ loading: false });
            }
        };

        loadUser();

        // 3. Única subscription global de auth state
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                this.setSnapshot({ activeUser: null, loading: false });
                await authService.clearUserData().catch(() => { });
                return;
            }

            if (session?.user?.id) {
                try {
                    await authService.ensureUserIsolation(session.user.id);
                    setStoredActiveAuthUserId(session.user.id);
                    const user = await userService.getUserById(session.user.id);
                    if (user) {
                        this.setSnapshot({ activeUser: user, loading: false });
                    }
                } catch (err) {
                    console.warn('[useSession] onAuthStateChange getUserById failed:', err);
                }
            }
        });
    }
}

const sessionStore = new AuthSessionStore();

export function useSession() {
    const [state, setState] = useState<SessionSnapshot>(() => sessionStore.getSnapshot());

    useEffect(() => {
        return sessionStore.subscribe(setState);
    }, []);

    return state;
}
