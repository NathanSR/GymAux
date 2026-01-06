import { Loader2 } from "lucide-react";


export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-colors">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-lime-400" size={40} />
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Carregando...</p>
            </div>
        </div>
    );
}