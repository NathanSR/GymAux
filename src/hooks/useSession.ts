'use client';

import { useEffect, useState } from 'react';
import { User } from '@/config/types';
import { userService } from '@/services/userService';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export function useSession() {
    const [activeUser, setActiveUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadUser = async () => {
            try {
                // 1. Resolução imediata do Dexie (0ms de latência - crucial para modo offline e renderização instantânea)
                if (typeof window !== 'undefined') {
                    const cached = await (await import('@/config/db')).db.users.toCollection().first();
                    if (cached && isMounted) {
                        setActiveUser(cached);
                        setLoading(false);
                    }
                }

                // 2. Se offline, a hidratação local já é suficiente
                if (typeof window !== 'undefined' && !navigator.onLine) {
                    if (isMounted) setLoading(false);
                    return;
                }

                // 3. Se online, revalida com o Supabase Auth em background
                const userId = await userService.resolveCurrentUserId();

                if (!isMounted) return;

                if (userId) {
                    const profile = await userService.getUserById(userId);
                    if (!isMounted) return;
                    if (profile) {
                        setActiveUser(profile);
                    }
                } else if (!activeUser) {
                    if (isMounted) setActiveUser(null);
                }
            } catch (error: any) {
                console.warn('[useSession] Error loading session:', error?.message || error);
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
                return;
            }

            if (session?.user) {
                try {
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
