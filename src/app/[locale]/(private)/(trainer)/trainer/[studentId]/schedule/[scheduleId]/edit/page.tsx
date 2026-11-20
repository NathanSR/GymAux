'use client';

import { use, useEffect, useState } from 'react';
import EditScheduleClient from '@/components/schedules/EditScheduleClient';
import { ScheduleService } from '@/services/scheduleService';
import { useSession } from '@/hooks/useSession';
import { useRouter, usePathname } from '@/i18n/routing';
import { resolveDynamicRouteId, isShellSentinel } from '@/utils/activeAuthUser';

export default function TrainerStudentEditSchedulePage({
    params
}: {
    params: Promise<{ studentId: string; scheduleId: string }>;
}) {
    const resolvedParams = use(params);
    const pathname = usePathname();
    const router = useRouter();
    const { activeUser, loading: sessionLoading } = useSession();

    const studentId = resolveDynamicRouteId(/\/trainer\/([^/?#]+)\/schedule/, pathname, resolvedParams?.studentId);
    const scheduleId = resolveDynamicRouteId(/\/schedule\/([^/?#]+)\/edit/, pathname, resolvedParams?.scheduleId);

    const [formattedData, setFormattedData] = useState<any>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        let isMounted = true;
        if (!scheduleId || isShellSentinel(scheduleId)) return;

        setFetching(true);
        ScheduleService.getScheduleById(scheduleId)
            .then(data => {
                if (!isMounted) return;
                if (!data) {
                    router.replace(`/trainer/${studentId}/schedule`);
                } else {
                    const startDateStr = data.startDate instanceof Date
                        ? data.startDate.toISOString().split('T')[0]
                        : new Date(data.startDate).toISOString().split('T')[0];

                    const endDateStr = data.endDate
                        ? (data.endDate instanceof Date ? data.endDate.toISOString().split('T')[0] : new Date(data.endDate).toISOString().split('T')[0])
                        : undefined;

                    setFormattedData({
                        ...data,
                        startDate: startDateStr,
                        endDate: endDateStr,
                    });
                }
            })
            .catch(() => {
                if (isMounted) router.replace(`/trainer/${studentId}/schedule`);
            })
            .finally(() => {
                if (isMounted) setFetching(false);
            });

        return () => {
            isMounted = false;
        };
    }, [scheduleId, studentId, router]);

    return (
        <EditScheduleClient
            initialData={formattedData}
            scheduleId={scheduleId}
            callerId={activeUser?.id || ''}
            baseUrl={`/trainer/${studentId}/schedule`}
            isFetching={(sessionLoading || fetching) && !formattedData}
        />
    );
}
