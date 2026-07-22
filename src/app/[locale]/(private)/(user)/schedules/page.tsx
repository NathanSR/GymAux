'use client';

import SchedulesClient from '@/components/schedules/SchedulesClient';
import { useSession } from '@/hooks/useSession';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/config/db';
import { useEffect } from 'react';
import { ScheduleService } from '@/services/scheduleService';
import { sortByNewest } from '@/utils/dateUtil';

export default function SchedulesPage() {
    const { activeUser, loading } = useSession();

    const schedules = useLiveQuery(
        async () => {
            if (!activeUser?.id) return [];
            const all = await db.schedules
                .where('userId')
                .equals(activeUser.id)
                .toArray();
            return sortByNewest(all);
        },
        [activeUser?.id]
    );

    useEffect(() => {
        if (!activeUser?.id || typeof window === 'undefined' || !navigator.onLine) return;
        ScheduleService.getSchedulesByUserId(activeUser.id, '', { page: 1, limit: 100 }).catch(() => {});
    }, [activeUser?.id]);

    return (
        <SchedulesClient 
            initialSchedules={schedules || []} 
            initialTotalCount={(schedules || []).length}
            userId={activeUser?.id || ''}
            isSessionLoading={loading && !activeUser}
        />
    );
}