import HistoryClient from '@/components/history/HistoryClient';
import { createClient } from '@/lib/supabase/server';
import { HistoryService } from '@/services/historyService';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HistoryPage(props: Props) {
    const searchParams = await props.searchParams;
    const dateQuery = typeof searchParams?.date === 'string' ? searchParams.date : undefined;
    const workoutIdQuery = typeof searchParams?.workoutId === 'string' ? searchParams.workoutId : undefined;

    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Busca inicial no servidor (mês atual)
    const now = dateQuery ? new Date(dateQuery) : new Date();
    const startMonthDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const initialHistoryList = await HistoryService.getHistoryByRange(user.id, startMonthDate, endMonthDate, supabase);

    return (
        <HistoryClient 
            userId={user.id}
            initialHistoryList={initialHistoryList}
            initialDate={dateQuery}
            initialWorkoutId={workoutIdQuery}
        />
    );
}