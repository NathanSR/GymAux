'use client';

import EditProfileClient from '@/components/profile/EditProfileClient';
import { useSession } from '@/hooks/useSession';
import { FormSkeleton } from '@/components/ui/Skeleton';

export default function EditProfilePage() {
    const { activeUser, loading } = useSession();

    if (loading && !activeUser) {
        return <FormSkeleton />;
    }

    if (!activeUser) return null;

    return (
        <EditProfileClient initialUser={activeUser} />
    );
}