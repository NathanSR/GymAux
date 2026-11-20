'use client';

import { use } from 'react';
import CreateScheduleClient from '@/components/schedules/CreateScheduleClient';
import { useSession } from '@/hooks/useSession';
import { usePathname } from '@/i18n/routing';
import { resolveDynamicRouteId } from '@/utils/activeAuthUser';

export default function TrainerStudentNewSchedulePage({
    params
}: {
    params: Promise<{ studentId: string }>;
}) {
    const resolvedParams = use(params);
    const pathname = usePathname();
    const studentId = resolveDynamicRouteId(/\/trainer\/([^/?#]+)\/schedule/, pathname, resolvedParams?.studentId);
    const { activeUser } = useSession();

    return (
        <CreateScheduleClient
            userId={studentId}
            callerId={activeUser?.id}
            baseUrl={`/trainer/${studentId}/schedule`}
        />
    );
}
