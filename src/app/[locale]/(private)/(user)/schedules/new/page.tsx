'use client';

import CreateScheduleClient from '@/components/schedules/CreateScheduleClient';
import { useSession } from '@/hooks/useSession';

export default function CreateSchedulePage() {
    const { activeUser, loading } = useSession();

    if (loading && !activeUser) {
        return (
            <div className="min-h-screen bg-zinc-950 p-6 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!activeUser) return null;

    return (
        <CreateScheduleClient userId={activeUser.id!} />
    );
}