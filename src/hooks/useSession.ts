'use client';

import { useEffect, useState } from 'react';
import { User } from '@/config/types';
import { userService } from '@/services/userService';
import { createClient } from '@/lib/supabase/client';
import { db } from '@/config/db';

import { authService } from '@/services/authService';

const supabase = createClient();

export function useSession() {
    const [activeUser, setActiveUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        // 1. Carregamento imediato do cache local Dexie (0ms)
        if (typeof window !== 'undefined') {
            db.users.toCollection().first().then((cached) => {
                if (isMounted && cached) {
                    setActiveUser(cached);
                    setLoading(false);
                }
            }).catch(() => {});
        }

        // 2. Validação e resolução completa em background
        const loadUser = async () => {
            try {
                const userId = await userService.resolveCurrentUserId();

                if (!isMounted) return;

                if (userId) {
                    const profile = await userService.getUserById(userId);
                    if (!isMounted) return;
                    if (profile) {
                        setActiveUser(profile);
                    } else if (typeof window !== 'undefined') {
                        const cached = await db.users.get(userId);
                        if (isMounted && cached) setActiveUser(cached);
                    }
                } else if (typeof window !== 'undefined') {
                    const cached = await db.users.toCollection().first();
                    if (isMounted) setActiveUser(cached || null);
                } else {
                    if (isMounted) setActiveUser(null);
                }
            } catch (error: any) {
                console.warn('[useSession] Error loading session:', error?.message || error);
                if (isMounted && !activeUser) setActiveUser(null);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isMounted) return;

            if (event === 'SIGNED_OUT') {
                setActiveUser(null);
                setLoading(false);
                await authService.clearUserData().catch(() => {});
                return;
            }

            if (session?.user) {
                try {
                    await authService.ensureUserIsolation(session.user.id);
                    const user = await userService.getUserById(session.user.id);
                    if (isMounted && user) {
                        setActiveUser(user);
                    }
                } catch (err) {
                    console.warn('[useSession] onAuthStateChange getUserById failed:', err);
                }
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return { activeUser, loading };
}
