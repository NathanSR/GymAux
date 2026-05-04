'use client'

import { memo } from "react";
import { motion } from "framer-motion";

export const QuickActionCard = memo(({ onClick, icon: Icon, label, t }: { onClick: () => void, icon: any, label: string, t: any }) => (
    <motion.button
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200 dark:border-white/5 rounded-[32px] hover:border-lime-500 dark:hover:border-lime-400/30 transition-all group overflow-hidden relative shadow-sm dark:shadow-none"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-4 bg-lime-400/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-8 h-8 text-lime-600 dark:text-lime-400" />
        </div>
        <span className="font-bold uppercase italic tracking-tighter text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{label}</span>
    </motion.button>
));
QuickActionCard.displayName = 'QuickActionCard';