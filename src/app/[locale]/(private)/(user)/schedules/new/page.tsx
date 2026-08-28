'use client';

import CreateScheduleClient from '@/components/schedules/CreateScheduleClient';
import { useSession } from '@/hooks/useSession';

export default function CreateSchedulePage() {
    const { activeUser } = useSession();

    return (
        <CreateScheduleClient userId={activeUser?.id || ''} />
    );
}