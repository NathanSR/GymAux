'use client';

import { use } from 'react';
import SchedulesClient from '@/components/schedules/SchedulesClient';
import { useDexieSchedules } from '@/hooks/useDexieData';
import { usePathname } from '@/i18n/routing';
import { resolveDynamicRouteId } from '@/utils/activeAuthUser';

export default function TrainerStudentSchedulePage({
    params
}: {
    params: Promise<{ studentId: string }>;
}) {
    const resolvedParams = use(params);
    const pathname = usePathname();
    const studentId = resolveDynamicRouteId(/\/trainer\/([^/?#]+)\/schedule/, pathname, resolvedParams?.studentId);
    const schedules = useDexieSchedules(studentId);
    const isInitialLoading = schedules === undefined;

    return (
        <SchedulesClient
            initialSchedules={schedules || []}
            initialTotalCount={(schedules || []).length}
            userId={studentId}
            baseUrl={`/trainer/${studentId}/schedule`}
            isSessionLoading={isInitialLoading}
        />
    );
}
