"use client";

import { useRouter, usePathname, Link } from "@/i18n/routing";
import { BookCheck, Calendar, Dumbbell, History, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface NavItemConfig {
    href: string;
    icon: typeof Home;
    labelKey: "exercises" | "workouts" | "home" | "schedules" | "history";
    matches: (path: string) => boolean;
}

const NAV_ITEMS: NavItemConfig[] = [
    {
        href: "/exercises",
        icon: BookCheck,
        labelKey: "exercises",
        matches: (path) => path.startsWith("/exercises")
    },
    {
        href: "/workouts",
        icon: Dumbbell,
        labelKey: "workouts",
        matches: (path) => path.startsWith("/workouts")
    },
    {
        href: "/home",
        icon: Home,
        labelKey: "home",
        matches: (path) => path === "/home" || path === "/" || path === ""
    },
    {
        href: "/schedules",
        icon: Calendar,
        labelKey: "schedules",
        matches: (path) => path.startsWith("/schedules")
    },
    {
        href: "/history",
        icon: History,
        labelKey: "history",
        matches: (path) => path.startsWith("/history")
    }
];

export const MenuTab = () => {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations("MenuTab");

    const handlePrefetch = (route: string) => {
        router.prefetch(route);
    };

    return (
        <nav
            aria-label={t("ariaLabel")}
            className="fixed bottom-[calc(0.85rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 w-[92%] max-w-sm sm:max-w-md bg-white/85 dark:bg-zinc-950/85 backdrop-blur-2xl border border-zinc-200/70 dark:border-zinc-800/80 p-1.5 rounded-full flex justify-between items-center shadow-xl shadow-black/10 dark:shadow-black/50 z-40 select-none transition-all duration-300"
        >
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.matches(pathname);
                const label = t(item.labelKey);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        title={label}
                        aria-label={label}
                        onMouseEnter={() => handlePrefetch(item.href)}
                        onTouchStart={() => handlePrefetch(item.href)}
                        className="relative flex-1 flex flex-col items-center justify-center h-11 py-1 px-1 rounded-full outline-none transition-all"
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeUserTab"
                                className="absolute inset-0 bg-lime-500/15 dark:bg-lime-400/15 border border-lime-500/30 dark:border-lime-400/25 rounded-full"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}

                        <Icon
                            size={21}
                            strokeWidth={isActive ? 2.5 : 2}
                            className={`relative z-10 transition-all duration-200 active:scale-90 ${isActive
                                ? "text-lime-600 dark:text-lime-400 scale-110"
                                : "text-zinc-400 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                                }`}
                        />
                    </Link>
                );
            })}
        </nav>
    );
};

export default MenuTab;