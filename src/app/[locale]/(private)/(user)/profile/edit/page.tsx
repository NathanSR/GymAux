'use client';

import EditProfileClient from '@/components/profile/EditProfileClient';
import { useSession } from '@/hooks/useSession';
import { FormSkeleton } from '@/components/ui/Skeleton';

export default function EditProfilePage() {
    const { activeUser, loading } = useSession();

    return (
        <EditProfileClient 
            initialUser={activeUser} 
            isFetching={loading && !activeUser} 
        />
    );
}