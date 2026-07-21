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
        const loadUser = async () => {
            try {
                // Use resilient resolver instead of direct auth call
                const userId = await userService.resolveCurrentUserId();

                if (userId) {
                    const profile = await userService.getUserById(userId);
                    if (profile) {
                        setActiveUser(profile);
                    } else if (typeof window !== 'undefined') {
                        const cached = await (await import('@/config/db')).db.users.get(userId);
                        if (cached) setActiveUser(cached);
                        else setActiveUser(null);
                    }
                } else if (typeof window !== 'undefined') {
                    const cached = await (await import('@/config/db')).db.users.toCollection().first();
                    if (cached) setActiveUser(cached);
                    else setActiveUser(null);
                } else {
                    setActiveUser(null);
                }
            } catch (error: any) {
                console.warn('[useSession] Error loading session:', error?.message || error);
                // Don't wipe user on transient errors
                if (!activeUser) setActiveUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setActiveUser(null);
                setLoading(false);
                return;
            }

            if (session?.user) {
                try {
                    const user = await userService.getUserById(session.user.id);
                    setActiveUser(user);
                } catch (err) {
                    console.warn('[useSession] onAuthStateChange getUserById failed:', err);
                    // Keep existing user — don't wipe on transient errors
                }
            } else {
                setActiveUser(null);
            }
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return { activeUser, loading };
}
