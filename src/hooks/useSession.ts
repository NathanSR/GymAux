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
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    const user = await userService.getUserById(session.user.id);
                    setActiveUser(user);
                } else {
                    setActiveUser(null);
                }
            } catch (error) {
                console.error("Error loading session:", error);
                setActiveUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();

        // const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        //     if (session?.user) {
        //         const user = await userService.getUserById(session.user.id);
        //         setActiveUser(user);
        //     } else {
        //         setActiveUser(null);
        //     }
        //     setLoading(false);
        // });

        // return () => {
        //     subscription.unsubscribe();
        // };
    }, []);

    return { activeUser, loading };
}

