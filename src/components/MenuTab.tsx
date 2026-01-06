import { useRouter } from "@/i18n/routing"
import { BookCheck, Calendar, Dumbbell, History, Play } from "lucide-react"

export const MenuTab = ({ onPlay, completed }: { onPlay: () => any, completed: boolean }) => {

    const router = useRouter()

    return <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 px-8 py-4 rounded-[32px] flex justify-between items-center shadow-2xl z-50">
        <BookCheck
            onClick={() => router.push('/exercises')}
            className="text-zinc-400 hover:text-lime-500 cursor-pointer"
            size={24}
        />
        <Dumbbell
            onClick={() => router.push('/workouts')}
            className="text-zinc-400 hover:text-lime-500 cursor-pointer"
            size={24}
        />
        <button
            disabled={completed}
            onClick={onPlay}
            className={` p-4 rounded-2xl mt-[-50px] shadow-xl  hover:scale-110 active:scale-95 transition-all  ${completed
                ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed shadow-zinc-500/40'
                : 'cursor-pointer bg-lime-950 dark:bg-lime-600 text-white dark:text-zinc-100 hover:scale-[1.02] shadow-lime-500/40'
                }`}
        >
            <Play size={24} />
        </button>
        <Calendar
            onClick={() => router.push('/schedules')}

            className="text-zinc-400 hover:text-lime-500 cursor-pointer"
            size={24}
        />
        <History
            onClick={() => router.push('/history')}
            className="text-zinc-400 hover:text-lime-500 cursor-pointer"
            size={24}
        />
    </nav>
}