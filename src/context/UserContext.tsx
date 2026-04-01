"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/config/types';
import { userService } from '@/services/userService';
import { createClient } from '@/lib/supabase/client';

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode; initialUser?: User | null }> = ({ children, initialUser }) => {
    const [user, setUser] = useState<User | null>(initialUser || null);
    const [loading, setLoading] = useState(!initialUser);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const fetchUser = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const profile = await userService.getUserById(authUser.id);
                setUser(profile);
            } else {
                setUser(null);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch user profile');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial session check and auth state listener
    useEffect(() => {
        if (!user) {
            fetchUser();
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null);
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session?.user && user?.id !== session.user.id) {
                    fetchUser();
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [user, fetchUser, supabase]);

    return (
        <UserContext.Provider value={{
            user,
            loading,
            error,
            fetchUser,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
