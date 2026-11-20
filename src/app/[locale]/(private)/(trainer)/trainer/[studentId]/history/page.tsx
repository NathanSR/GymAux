'use client';

import { use } from 'react';
import HistoryClient from '@/components/history/HistoryClient';
import { useDexieHistory } from '@/hooks/useDexieData';
import { usePathname } from '@/i18n/routing';
import { resolveDynamicRouteId } from '@/utils/activeAuthUser';

export default function TrainerStudentHistoryPage({
    params,
    searchParams
}: {
    params: Promise<{ studentId: string }>;
    searchParams: Promise<{ date?: string; workoutId?: string }>;
}) {
    const resolvedParams = use(params);
    const resolvedSearch = use(searchParams);
    const pathname = usePathname();
    const studentId = resolveDynamicRouteId(/\/trainer\/([^/?#]+)\/history/, pathname, resolvedParams?.studentId);

    const historyList = useDexieHistory(studentId, 100);
    const isInitialLoading = historyList === undefined;

    return (
        <HistoryClient
            userId={studentId}
            initialHistoryList={historyList || []}
            initialDate={resolvedSearch?.date}
            initialWorkoutId={resolvedSearch?.workoutId}
            baseUrl={`/trainer/${studentId}/history`}
            isSessionLoading={isInitialLoading}
        />
    );
}
