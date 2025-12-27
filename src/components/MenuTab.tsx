import { Calendar, Dumbbell, History, Play, PlusCircle } from "lucide-react"

export const MenuTab = ({ user, todayWorkout }: { user: any, todayWorkout: any }) => {

    return <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 px-8 py-4 rounded-[32px] flex justify-between items-center shadow-2xl z-50">
        <Dumbbell className="text-zinc-400 hover:text-lime-500 cursor-pointer" size={24} />
        <PlusCircle className="text-zinc-400 hover:text-lime-500 cursor-pointer" size={24} />
        <div
            className={`bg-lime-400 p-4 rounded-2xl mt-[-50px] shadow-xl shadow-lime-500/40 hover:scale-110 active:scale-95 transition-all cursor-pointer ${!todayWorkout ? 'opacity-50 grayscale' : ''}`}
        >
            <Play className="text-zinc-950" fill="currentColor" size={24} />
        </div>
        <Calendar className="text-zinc-400 hover:text-lime-500 cursor-pointer" size={24} />
        <div className="w-6 h-6 rounded-lg border-2 border-zinc-400 flex items-center justify-center text-[10px] font-bold cursor-pointer">
            {user?.name?.charAt(0)}
        </div>
    </nav>
}