import HistoryClient from '@/components/history/HistoryClient';
import { createClient } from '@/lib/supabase/server';
import { HistoryService } from '@/services/historyService';

export default async function HistoryPage() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Busca inicial no servidor (mês atual)
    const now = new Date();
    const startMonthDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const initialHistoryList = await HistoryService.getHistoryByRange(user.id, startMonthDate, endMonthDate, supabase);

    return (
        <HistoryClient 
            userId={user.id}
            initialHistoryList={initialHistoryList}
        />
    );
}