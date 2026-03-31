'use client';

import { motion } from 'framer-motion';

/**
 * Skeleton Components
 * 
 * Reusable phantom UI elements to indicate loading state 
 * for specific areas of the application.
 */

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-2xl ${className}`} />
);

export const CardSkeleton = () => (
  <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-48" />
      </div>
      <Skeleton className="w-12 h-12 rounded-2xl" />
    </div>
    <div className="flex gap-3">
      <Skeleton className="h-12 flex-[2] rounded-2xl" />
      <Skeleton className="h-12 flex-1 rounded-2xl" />
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

export const HeaderSkeleton = () => (
  <div className="mb-8 flex justify-between items-center w-full">
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-56" />
    </div>
    <Skeleton className="w-12 h-12 rounded-2xl" />
  </div>
);

export const BannerSkeleton = () => (
  <div className="relative rounded-[32px] p-8 bg-zinc-100 dark:bg-zinc-900 overflow-hidden shadow-none mb-8">
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
