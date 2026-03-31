import HistoryClient from '@/components/history/HistoryClient';
import { createClient } from '@/lib/supabase/server';
import { HistoryService } from '@/services/historyService';
import { Suspense } from 'react';
import { HeaderSkeleton, ListSkeleton, Skeleton } from '@/components/ui/Skeleton';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Optimized History Page
 * 
 * Uses Streaming with Suspense to allow navigation to be fast 
 * while the history list loads in the background.
 */
export default async function HistoryPage(props: Props) {
  const searchParams = await props.searchParams;
  const dateQuery = typeof searchParams?.date === 'string' ? searchParams.date : undefined;
  const workoutIdQuery = typeof searchParams?.workoutId === 'string' ? searchParams.workoutId : undefined;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Suspense fallback={<div className="px-6 pt-6 space-y-8"><HeaderSkeleton /><ListSkeleton count={5} /></div>}>
        <HistoryDataFetcher dateQuery={dateQuery} workoutIdQuery={workoutIdQuery} />
      </Suspense>
    </div>
  );
}

/**
 * HistoryDataFetcher
 */
async function HistoryDataFetcher({ dateQuery, workoutIdQuery }: { dateQuery?: string, workoutIdQuery?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

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