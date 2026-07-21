'use client';

import { use, useEffect, useState } from 'react';
import EditScheduleClient from '@/components/schedules/EditScheduleClient';
import { ScheduleService } from '@/services/scheduleService';
import { useSession } from '@/hooks/useSession';
import { useRouter } from '@/i18n/routing';
import { FormSkeleton } from '@/components/ui/Skeleton';

interface EditSchedulePageProps {
    params: Promise<{ id: string }>;
}

export default function EditSchedulePage({ params }: EditSchedulePageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { activeUser, loading: sessionLoading } = useSession();

    const [formattedData, setFormattedData] = useState<any>(null);
    const [fetchingSchedule, setFetchingSchedule] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setFetchingSchedule(true);

        ScheduleService.getScheduleById(id).then(data => {
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
    }, [id, router]);

    if ((sessionLoading || fetchingSchedule) && !formattedData) {
        return <FormSkeleton />;
    }

    if (!activeUser || !formattedData) return null;

    return (
        <EditScheduleClient initialData={formattedData} scheduleId={id} callerId={activeUser.id!} />
    );
}