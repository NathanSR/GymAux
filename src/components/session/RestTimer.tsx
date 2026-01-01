import { useEffect, useState } from "react";

export const RestTimer = ({ seconds, onFinish }: { seconds: number, onFinish: () => void }) => {
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        if (timeLeft <= 0) {
            onFinish();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onFinish]);

    return (
        <div className="inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-xl p-8">
            <div className="relative flex items-center justify-center mb-12">
                <svg className="w-72 h-72 -rotate-90">
                    <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-zinc-800" />
                    <circle
                        cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={816} strokeDashoffset={816 - (816 * timeLeft) / seconds}
                        className="text-lime-400 transition-all duration-1000 ease-linear"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-7xl font-black text-white tabular-nums">{timeLeft}</span>
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Segundos</span>
                </div>
            </div>
            <h3 className="text-xl font-black text-white uppercase mb-8 tracking-tight">Hora de Descansar</h3>
            <button
                onClick={onFinish}
                className="w-full max-w-xs py-5 bg-zinc-800 text-white rounded-[24px] font-black uppercase text-xs tracking-[0.2em] active:scale-95 transition-all"
            >
                Pular Descanso
            </button>
        </div>
    );
};