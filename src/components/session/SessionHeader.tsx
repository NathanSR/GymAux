import { ChevronLeft, List } from 'lucide-react';
import { Session } from '@/config/types';

interface SessionHeaderProps {
    session: Session;
    currentGroupIndex: number;
    onExit: () => void;
    onOpenPreview: () => void;
}

export function SessionHeader({ session, currentGroupIndex, onExit, onOpenPreview }: SessionHeaderProps) {
    return (
        <header className="px-5 pt-10 pb-4 flex items-center justify-between z-10 sticky top-0 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5">
            <button
                onClick={onExit}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white active:scale-95 transition-all"
            >
                <ChevronLeft size={18} />
            </button>

            <div className="group cursor-default flex-1 px-3">
                <h1 className="font-black w-full text-center text-zinc-500 uppercase text-[9px] tracking-[0.2em] truncate mb-1.5 group-hover:text-zinc-300 transition-colors">
                    {session.workoutName}
                </h1>
                <div className="flex items-center justify-center gap-1 w-full max-w-[150px] mx-auto opacity-80">
                    {Array.from({ length: session.exercisesToDo.length }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < currentGroupIndex
                                ? 'bg-lime-400'
                                : i === currentGroupIndex
                                    ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-pulse'
                                    : 'bg-zinc-800'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <button
                onClick={onOpenPreview}
                className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 text-lime-400 hover:bg-lime-400/10 active:scale-95 transition-all"
            >
                <List size={18} />
            </button>
        </header>
    );
}
