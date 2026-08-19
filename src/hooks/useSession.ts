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
                // Use resilient resolver instead of direct auth call
                const userId = await userService.resolveCurrentUserId();

                if (!isMounted) return;

                if (userId) {
                    const profile = await userService.getUserById(userId);
                    if (!isMounted) return;
                    if (profile) {
                        setActiveUser(profile);
                    } else if (typeof window !== 'undefined') {
                        const cached = await (await import('@/config/db')).db.users.get(userId);
                        if (isMounted) setActiveUser(cached || null);
                    }
                } else if (typeof window !== 'undefined') {
                    const cached = await (await import('@/config/db')).db.users.toCollection().first();
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
