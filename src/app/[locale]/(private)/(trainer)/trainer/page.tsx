'use client';

import TrainerClient from '@/components/trainers/TrainerClient';
import { useSession } from '@/hooks/useSession';
import { useDexieActiveStudents } from '@/hooks/useDexieData';
import { ListSkeleton } from '@/components/ui/Skeleton';

export default function TrainerDashboardPage() {
    const { activeUser, loading } = useSession();
    const students = useDexieActiveStudents(activeUser?.id);

    if (loading && !activeUser) {
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 p-6 max-w-4xl mx-auto">
                <ListSkeleton count={4} />
            </div>
        );
    }

    return (
        <TrainerClient
            trainerId={activeUser?.id || ''}
            initialStudents={students || []}
        />
    );
}
