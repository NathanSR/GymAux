import { ChevronLeft, List, Timer } from 'lucide-react';
import { Session } from '@/config/types';

interface SessionHeaderProps {
    session: Session;
    currentGroupIndex: number;
    onExit: () => void;
    onOpenPreview: () => void;
    onOpenTimer?: () => void;
}

export function SessionHeader({ session, currentGroupIndex, onExit, onOpenPreview, onOpenTimer }: SessionHeaderProps) {
    return (
        <header className="px-5 pt-8 pb-2.5 flex items-center justify-between z-10 sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/80 transition-colors duration-300">
            <button
                onClick={onExit}
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white active:scale-95 transition-all"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="group cursor-default flex-1 px-4 flex flex-col items-center min-w-0">
                <h1 className="font-black w-full text-center text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-[0.15em] truncate mb-1 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">
                    {session.workoutName}
                </h1>
                <div className="flex items-center justify-center gap-1.5 w-full max-w-[280px] mx-auto opacity-90">
                    {Array.from({ length: session.exercisesToDo.length }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < currentGroupIndex
                                ? 'bg-lime-500 dark:bg-lime-400 shadow-[0_0_6px_rgba(163,230,71,0.2)]'
                                : i === currentGroupIndex
                                    ? 'bg-zinc-900 dark:bg-white shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-pulse'
                                    : 'bg-zinc-200 dark:bg-zinc-800'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-1.5">
                {onOpenTimer && (
                    <button
                        type="button"
                        onClick={onOpenTimer}
                        className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-lime-600 dark:text-lime-400 hover:bg-lime-400/10 active:scale-95 transition-all"
                        title="Cronômetro / Temporizador"
                    >
                        <Timer size={20} />
                    </button>
                )}
                <button
                    onClick={onOpenPreview}
                    className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-lime-600 dark:text-lime-400 hover:bg-lime-400/10 active:scale-95 transition-all"
                >
                    <List size={20} />
                </button>
            </div>
        </header>
    );
}
