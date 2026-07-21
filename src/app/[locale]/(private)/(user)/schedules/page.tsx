'use client';

import SchedulesClient from '@/components/schedules/SchedulesClient';
import { useSession } from '@/hooks/useSession';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/config/db';
import { useEffect } from 'react';
import { ScheduleService } from '@/services/scheduleService';
import { HeaderSkeleton, ScheduleListSkeleton } from '@/components/ui/Skeleton';

export default function SchedulesPage() {
    const { activeUser, loading } = useSession();

    const schedules = useLiveQuery(
        async () => {
            if (!activeUser?.id) return [];
            return await db.schedules
                .where('userId')
                .equals(activeUser.id)
                .toArray();
        },
        [activeUser?.id]
    );

    useEffect(() => {
        if (!activeUser?.id || typeof window === 'undefined' || !navigator.onLine) return;
        ScheduleService.getSchedulesByUserId(activeUser.id, '', { page: 1, limit: 100 }).catch(() => {});
    }, [activeUser?.id]);

    if (loading && !activeUser) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 space-y-6">
                <HeaderSkeleton />
                <ScheduleListSkeleton count={3} />
            </div>
        );
    }

    if (!activeUser) return null;

    return (
        <SchedulesClient 
            initialSchedules={schedules || []} 
            initialTotalCount={(schedules || []).length}
            userId={activeUser.id!}
        />
    );
}