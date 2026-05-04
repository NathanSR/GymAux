import { Link } from "@/i18n/routing";
import { memo } from "react";
import { motion } from "framer-motion";
import { User, ChevronRight } from "lucide-react";
import Image from "next/image";

export interface Student {
    id: string;
    name: string;
    avatar: string | null;
}

export const StudentCard = memo(({ student }: { student: Student }) => (
    <Link href={`/trainer/${student.id}`}>
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2 }}
            className="p-4 bg-white dark:bg-zinc-900/30 backdrop-blur-sm border border-zinc-200 dark:border-white/5 rounded-[28px] flex items-center gap-4 hover:border-lime-500/30 dark:hover:border-lime-400/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-all group shadow-sm dark:shadow-none"
        >
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-zinc-200 dark:border-white/5 group-hover:border-lime-500/20 dark:group-hover:border-lime-400/20 transition-colors">
                {student.avatar ? (
                    <Image src={student.avatar} alt={student.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                        <User className="w-7 h-7 text-zinc-400 dark:text-zinc-600 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors duration-300" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-black italic uppercase tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-lime-600 dark:group-hover:text-white transition-colors truncate">{student.name}</h3>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono tracking-tight opacity-60">#{student.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center border border-zinc-200 dark:border-white/5 group-hover:bg-lime-400 transition-all duration-300 shadow-sm dark:shadow-lg">
                <ChevronRight className="w-5 h-5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-all" />
            </div>
        </motion.div>
    </Link>
));
StudentCard.displayName = 'StudentCard';