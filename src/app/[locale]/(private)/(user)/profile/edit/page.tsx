'use client';

import EditProfileClient from '@/components/profile/EditProfileClient';
import { useSession } from '@/hooks/useSession';

export default function EditProfilePage() {
    const { activeUser, loading } = useSession();

    if (loading && !activeUser) {
        return (
            <div className="min-h-screen bg-zinc-950 p-6 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!activeUser) return null;

    return (
        <EditProfileClient initialUser={activeUser} />
    );
}