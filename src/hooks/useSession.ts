'use client';

import { useEffect, useState } from 'react';
import { User } from '@/config/types';
import { userService } from '@/services/userService';

export function useSession() {
    const [activeUser, setActiveUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const id = localStorage.getItem('activeUserId');
            if (id) {
                const user = await userService.getUserById(Number(id));
                if (user) setActiveUser(user);
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    return { activeUser, loading };
}