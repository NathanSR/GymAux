'use client';

export interface CalendarDaySkeletonItem {
    day: number;
}

interface HistoryCalendarSkeletonProps {
    totalCells?: number;
    calendarDays?: (CalendarDaySkeletonItem | null)[];
}

export function HistoryCalendarSkeleton({
    totalCells = 35,
    calendarDays,
}: HistoryCalendarSkeletonProps) {
    const items = calendarDays && calendarDays.length > 0
        ? calendarDays
        : Array.from({ length: totalCells }).map((_, i) => ({ day: i + 1 }));

    return (
        <div className="grid grid-cols-7 animate-pulse" aria-label="Carregando dados do calendário">
            {items.map((item, idx) => (
                <div
                    key={idx}
                    className={`aspect-square border-b border-r border-zinc-100 dark:border-zinc-800/50 p-1 flex flex-col items-center justify-center relative transition-colors ${
                        !item ? 'bg-zinc-50/20 dark:bg-zinc-950/20' : 'bg-zinc-100/70 dark:bg-zinc-800/40'
                    }`}
                >
                    {item && (
                        <>
                            <span className="text-[11px] font-black mb-1 text-zinc-400 dark:text-zinc-500 select-none">
                                {item.day}
                            </span>
                            <div className="w-3.5 h-3.5 bg-zinc-200/80 dark:bg-zinc-700/60 rounded-lg animate-pulse" />
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
