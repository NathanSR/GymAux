'use client';

import { use, useMemo } from 'react';
import HistoryClient from '@/components/history/HistoryClient';
import { useSession } from '@/hooks/useSession';
import { useDexieHistory } from '@/hooks/useDexieData';
import { HeaderSkeleton, ListSkeleton } from '@/components/ui/Skeleton';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function HistoryPage(props: Props) {
    const searchParams = use(props.searchParams);
    const dateQuery = typeof searchParams?.date === 'string' ? searchParams.date : undefined;
    const workoutIdQuery = typeof searchParams?.workoutId === 'string' ? searchParams.workoutId : undefined;

    const { activeUser, loading } = useSession();
    const historyList = useDexieHistory(activeUser?.id, 100);

    if (loading && !activeUser) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 pt-6 space-y-8">
                <HeaderSkeleton />
                <ListSkeleton count={5} />
            </div>
        );
    }

    if (!activeUser) return null;

    return (
        <HistoryClient 
            userId={activeUser.id!}
            initialHistoryList={historyList}
            initialDate={dateQuery}
            initialWorkoutId={workoutIdQuery}
        />
    );
}