'use client';

import CreateScheduleClient from '@/components/schedules/CreateScheduleClient';
import { useSession } from '@/hooks/useSession';
import { FormSkeleton } from '@/components/ui/Skeleton';

export default function CreateSchedulePage() {
    const { activeUser, loading } = useSession();

    if (loading && !activeUser) {
        return <FormSkeleton />;
    }

    if (!activeUser) return null;

    return (
        <CreateScheduleClient userId={activeUser.id!} />
    );
}