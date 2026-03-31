import ExercisesClient from '@/components/exercises/ExercisesClient';
import { ExerciseService } from '@/services/exerciseService';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { HeaderSkeleton, ListSkeleton, Skeleton } from '@/components/ui/Skeleton';

/**
 * Optimized Exercise Library Page
 * 
 * Uses Streaming with Suspense to allow the page shell to render instantly
 * while exercises are being fetched from Supabase.
 */
export default async function ExerciseLibraryPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Suspense fallback={<div className="px-6 pt-6 space-y-8"><HeaderSkeleton /><ListSkeleton count={4} /></div>}>
        <ExercisesDataFetcher />
      </Suspense>
    </div>
  );
}

/**
 * ExercisesDataFetcher
 * Handles the async data fetching and passes it to the Client Component.
 */
async function ExercisesDataFetcher() {
  const supabase = await createClient();
  const te = await getTranslations('Exercises');
  const tt = await getTranslations('Tags');

  const { exercises: initialExercises, totalCount: initialTotalCount } = await ExerciseService.getAllExercises({
    supabase,
    pagination: { page: 1, limit: 20 },
    translations: { te, tt }
  });

  return (
    <ExercisesClient 
      initialExercises={initialExercises} 
      initialTotalCount={initialTotalCount} 
    />
  );
}