'use client';

/**
 * Skeleton Components
 * 
 * Reusable, high-performance phantom UI elements indicating loading states 
 * for specific areas of the application. Fully supports light and dark themes.
 */

export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-zinc-200/80 dark:bg-zinc-800/70 rounded-2xl ${className}`} />
);

export const CardSkeleton = () => (
  <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] space-y-4 shadow-sm">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-48" />
      </div>
      <Skeleton className="w-12 h-12 rounded-2xl" />
    </div>
    <div className="flex gap-3 pt-2">
      <Skeleton className="h-14 flex-[2] rounded-2xl" />
      <Skeleton className="h-14 flex-1 rounded-2xl" />
    </div>
  </div>
);

export const ListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4 w-full">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const ExerciseCardSkeleton = () => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-5 shadow-sm space-y-4">
    <div className="flex gap-4 items-center">
      <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
    <div className="flex gap-2 pt-1">
      <Skeleton className="h-11 flex-1 rounded-2xl" />
      <Skeleton className="h-11 w-11 rounded-2xl" />
    </div>
  </div>
);

export const ExerciseListSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="space-y-4 w-full">
    {Array.from({ length: count }).map((_, i) => (
      <ExerciseCardSkeleton key={i} />
    ))}
  </div>
);

export const ScheduleCardSkeleton = () => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-6 shadow-sm space-y-5">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-7 w-40" />
      </div>
      <Skeleton className="w-10 h-10 rounded-full" />
    </div>
    <div className="flex items-center gap-2">
      <Skeleton className="w-4 h-4 rounded-full" />
      <Skeleton className="h-3 w-36" />
    </div>
    <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-4 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex justify-between items-center pt-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ScheduleListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4 w-full">
    {Array.from({ length: count }).map((_, i) => (
      <ScheduleCardSkeleton key={i} />
    ))}
  </div>
);

export const HeaderSkeleton = () => (
  <div className="mb-6 flex justify-between items-center w-full">
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-9 w-56" />
    </div>
    <Skeleton className="w-12 h-12 rounded-2xl" />
  </div>
);

export const BannerSkeleton = () => (
  <div className="relative rounded-[32px] p-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 overflow-hidden shadow-none mb-8">
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="w-6 h-6 rounded-full" />
      </div>
      <Skeleton className="h-12 w-2/3" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-14 w-full rounded-2xl" />
    </div>
  </div>
);

export const FormSkeleton = () => (
  <div className="min-h-screen bg-white dark:bg-zinc-950 p-6 space-y-8 font-sans transition-colors duration-300">
    <HeaderSkeleton />
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-36 rounded-full" />
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
      <div className="pt-4">
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  </div>
);

export const SessionSkeleton = () => (
  <div className="min-h-screen bg-white dark:bg-zinc-950 p-6 space-y-6 font-sans transition-colors duration-300">
    <div className="flex justify-between items-center mb-4">
      <Skeleton className="w-10 h-10 rounded-2xl" />
      <Skeleton className="h-6 w-32 rounded-full" />
      <Skeleton className="w-10 h-10 rounded-2xl" />
    </div>
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-6 space-y-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-7 w-48" />
        </div>
        <Skeleton className="w-14 h-14 rounded-2xl" />
      </div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
        ))}
      </div>
    </div>
    <Skeleton className="h-16 w-full rounded-2xl" />
  </div>
);

export const MyIdSkeleton = () => (
  <div className="min-h-screen bg-white dark:bg-zinc-950 p-6 flex flex-col items-center justify-between font-sans transition-colors duration-300">
    <div className="flex justify-between items-center w-full mb-8">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <Skeleton className="h-6 w-28 rounded-full" />
      <div className="w-12 h-12" />
    </div>
    <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-8 flex flex-col items-center shadow-2xl space-y-6">
      <Skeleton className="w-20 h-20 rounded-[24px]" />
      <div className="space-y-2 text-center w-full flex flex-col items-center">
        <Skeleton className="h-3 w-16 rounded-full" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="w-48 h-48 rounded-[28px]" />
      <Skeleton className="h-14 w-full rounded-[20px]" />
    </div>
    <div className="w-full" />
  </div>
);
