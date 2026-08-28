'use client';

import { History } from "@/config/types";
import { ChevronLeft, ChevronRight, Dumbbell } from "lucide-react";
import { HistoryCalendarSkeleton } from "./HistoryCalendarSkeleton";

export interface CalendarDayItem {
    day: number;
    date: string;
    workouts: History[];
}

interface HistoryCalendarProps {
    currentDate: Date;
    onMonthChange: (offset: number) => void;
    calendarDays: (CalendarDayItem | null)[];
    loading: boolean;
    onSelectDay: (workouts: History[]) => void;
    dayLabels: string[];
    locale: string;
}

export function HistoryCalendar({
    currentDate,
    onMonthChange,
    calendarDays,
    loading,
    onSelectDay,
    dayLabels,
    locale,
}: HistoryCalendarProps) {
    const monthName = currentDate.toLocaleString(locale, { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <div className="space-y-4 max-w-lg mx-auto">
            {/* Header com troca de mês */}
            <div className="flex items-center bg-white dark:bg-zinc-900 rounded-[24px] shadow-sm border border-zinc-100 dark:border-zinc-800 p-2 transition-colors">
                <button
                    type="button"
                    onClick={() => onMonthChange(-1)}
                    disabled={loading}
                    className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors disabled:opacity-50 cursor-pointer active:scale-95 text-zinc-700 dark:text-zinc-300"
                    aria-label="Mês anterior"
                >
                    <ChevronLeft size={18} />
                </button>

                <span className="flex-1 font-black uppercase text-[10px] tracking-[0.2em] text-center italic text-lime-500 select-none">
                    {monthName} {year}
                </span>

                <button
                    type="button"
                    onClick={() => onMonthChange(1)}
                    disabled={loading}
                    className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors disabled:opacity-50 cursor-pointer active:scale-95 text-zinc-700 dark:text-zinc-300"
                    aria-label="Próximo mês"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Grid do Calendário */}
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm transition-all">
                {/* Labels dos dias da semana */}
                <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    {dayLabels.map((d, i) => (
                        <div key={i} className="py-4 text-center text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest select-none">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Render direto dos dias em 0ms */}
                <div className="grid grid-cols-7">
                    {calendarDays.map((item, idx) => {
                        const hasWorkout = !!item?.workouts.length;
                        return (
                            <div
                                key={idx}
                                onClick={() => hasWorkout && onSelectDay(item.workouts)}
                                className={`aspect-square border-b border-r border-zinc-100 dark:border-zinc-800/50 p-1 flex flex-col items-center justify-center relative transition-all ${
                                    !item
                                        ? 'bg-zinc-50/20 dark:bg-zinc-950/20'
                                        : hasWorkout
                                        ? 'hover:bg-lime-400/10 cursor-pointer group active:scale-95 bg-white dark:bg-zinc-900'
                                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40 bg-white dark:bg-zinc-900'
                                }`}
                            >
                                {item && (
                                    <>
                                        <span
                                            className={`text-[11px] font-black mb-1 transition-colors select-none ${
                                                hasWorkout ? 'text-lime-500 group-hover:scale-110' : 'text-zinc-300 dark:text-zinc-700'
                                            }`}
                                        >
                                            {item.day}
                                        </span>
                                        {hasWorkout && (
                                            <div className="flex -space-x-1">
                                                {item.workouts.slice(0, 2).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-lime-400 p-1 rounded-lg border-2 border-white dark:border-zinc-900 shadow-sm shadow-lime-500/20 group-hover:scale-110 transition-transform"
                                                    >
                                                        <Dumbbell size={8} className="text-zinc-950" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
