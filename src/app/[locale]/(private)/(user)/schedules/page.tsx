'use client';

import SchedulesClient from '@/components/schedules/SchedulesClient';
import { useSession } from '@/hooks/useSession';
import { useDexieSchedules } from '@/hooks/useDexieData';

export default function SchedulesPage() {
    const { activeUser, loading } = useSession();
    const schedules = useDexieSchedules(activeUser?.id);
    const isInitialLoading = (loading && !activeUser) && (schedules === undefined || schedules.length === 0);

    return (
        <SchedulesClient
            initialSchedules={schedules || []}
            initialTotalCount={(schedules || []).length}
            userId={activeUser?.id || ''}
            isSessionLoading={isInitialLoading}
        />
    );
}
