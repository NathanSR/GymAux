'use client';

import { use } from 'react';
import HistoryClient from '@/components/history/HistoryClient';
import { useSession } from '@/hooks/useSession';
import { useDexieHistory } from '@/hooks/useDexieData';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function HistoryPage(props: Props) {
    const searchParams = use(props.searchParams);
    const dateQuery = typeof searchParams?.date === 'string' ? searchParams.date : undefined;
    const workoutIdQuery = typeof searchParams?.workoutId === 'string' ? searchParams.workoutId : undefined;

    const { activeUser, loading } = useSession();
    const historyList = useDexieHistory(activeUser?.id, 100);
    const isInitialLoading = (loading && !activeUser) || historyList === undefined;

    return (
        <HistoryClient 
            userId={activeUser?.id || ''}
            initialHistoryList={historyList || []}
            initialDate={dateQuery}
            initialWorkoutId={workoutIdQuery}
            isSessionLoading={isInitialLoading}
        />
    );
}