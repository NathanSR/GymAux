"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/config/types';
import { userService } from '@/services/userService';
import { createClient } from '@/lib/supabase/client';

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    fetchUser: (userId: string, force?: boolean) => Promise<void>;
    updateUserState: (updates: Partial<User>) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const fetchUser = useCallback(async (userId: string, force = false) => {
        if (user && user.id === userId && !force) return;

        setLoading(true);
        setError(null);
        try {
            const profile = await userService.getUserById(userId);
            setUser(profile);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch user profile');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const updateUserState = useCallback((updates: Partial<User>) => {
        setUser((prev: User | null) => prev ? { ...prev, ...updates } as User : null);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    // Initial session check
    useEffect(() => {
        const checkSession = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                await fetchUser(authUser.id);
            } else {
                setLoading(false);
            }
        };
        checkSession();
    }, [fetchUser, supabase.auth]);

    return (
        <UserContext.Provider value={{
            user,
            loading,
            error,
            fetchUser,
            updateUserState,
            logout
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
