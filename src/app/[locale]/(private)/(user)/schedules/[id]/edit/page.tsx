'use client';

import { use, useEffect, useState } from 'react';
import EditScheduleClient from '@/components/schedules/EditScheduleClient';
import { ScheduleService } from '@/services/scheduleService';
import { useSession } from '@/hooks/useSession';
import { useRouter, usePathname } from '@/i18n/routing';
import { FormSkeleton } from '@/components/ui/Skeleton';

interface EditSchedulePageProps {
    params: Promise<{ id: string }>;
}

export default function EditSchedulePage({ params }: EditSchedulePageProps) {
    const resolvedParams = use(params);
    const pathname = usePathname();
    const router = useRouter();
    const { activeUser, loading: sessionLoading } = useSession();

    const rawId = (resolvedParams?.id && resolvedParams.id !== 'template' && resolvedParams.id !== 'shell')
        ? resolvedParams.id
        : (pathname.match(/\/schedules\/([^/]+)\/edit/)?.[1] || resolvedParams?.id);

    const [formattedData, setFormattedData] = useState<any>(null);
    const [fetchingSchedule, setFetchingSchedule] = useState(true);

    useEffect(() => {
        let isMounted = true;
        if (!rawId || rawId === 'template' || rawId === 'shell') {
            return;
        }

        setFetchingSchedule(true);

        ScheduleService.getScheduleById(rawId).then(data => {
            if (!isMounted) return;
            if (!data) {
                router.push('/schedules');
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
                    endDate: endDateStr
                });
            }
        }).catch(() => {
            if (isMounted) router.push('/schedules');
        }).finally(() => {
            if (isMounted) setFetchingSchedule(false);
        });

        return () => {
            isMounted = false;
        };
    }, [rawId, router]);

    const isFetching = (sessionLoading || fetchingSchedule) && !formattedData;

    return (
        <EditScheduleClient 
            initialData={formattedData} 
            scheduleId={rawId} 
            callerId={activeUser?.id || ''} 
            isFetching={isFetching}
        />
    );
}