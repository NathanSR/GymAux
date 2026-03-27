"use client";

import { useRouter, usePathname, Link } from "@/i18n/routing";
import { BookCheck, Calendar, Dumbbell, History, Play } from "lucide-react";
import { motion } from "framer-motion";

interface MenuTabProps {
    onPlay: () => void;
    completed: boolean;
}

export const MenuTab = ({ onPlay, completed }: MenuTabProps) => {
    const router = useRouter();
    const pathname = usePathname();

    // Função para prefetch manual em eventos de toque/mouse
    const handlePrefetch = (route: string) => {
        router.prefetch(route);
    };

    const NavItem = ({ href, icon: Icon }: { href: string; icon: any }) => {
        const isActive = pathname === href;

        return (
            <Link
                href={href}
                onMouseEnter={() => handlePrefetch(href)}
                onTouchStart={() => handlePrefetch(href)}
                className="relative p-2 transition-colors duration-300 outline-none"
            >
                <Icon
                    size={24}
                    className={`relative z-10 transition-transform active:scale-90 ${isActive
                        ? "text-lime-600 dark:text-lime-400"
                        : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                        }`}
                />
                {isActive && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-lime-500/10 dark:bg-lime-400/10 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
            </Link>
        );
    };

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/50 px-6 py-3 rounded-[32px] flex justify-between items-center shadow-2xl z-50 shadow-black/10">

            <NavItem href="/exercises" icon={BookCheck} />
            <NavItem href="/workouts" icon={Dumbbell} />

            {/* Botão de Ação Central (Play) */}
            <motion.button
                whileHover={!completed ? { scale: 1.1, y: -5 } : {}}
                whileTap={!completed ? { scale: 0.9 } : {}}
                disabled={completed}
                onClick={onPlay}
                className={`relative p-4 rounded-2xl -mt-12 shadow-xl transition-colors duration-500 ${completed
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                    : "bg-zinc-950 dark:bg-lime-500 text-white dark:text-zinc-950 shadow-lime-500/30 cursor-pointer"
                    }`}
            >
                <Play size={28} fill="currentColor" />
                {!completed && (
                    <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-lime-500 rounded-2xl -z-10"
                    />
                )}
            </motion.button>

            <NavItem href="/schedules" icon={Calendar} />
            <NavItem href="/history" icon={History} />
        </nav>
    );
};