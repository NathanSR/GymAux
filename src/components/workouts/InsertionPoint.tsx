'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface InsertionPointProps {
    onClick: () => void;
    isVisible?: boolean;
    className?: string;
}

export function InsertionPoint({ onClick, isVisible = true, className = '' }: InsertionPointProps) {
    if (!isVisible) return null;

    return (
        <div className={`h-8 flex items-center justify-center group pointer-events-none ${className}`}>
            <motion.button
                type="button"
                initial={{ opacity: 0.25, scale: 0.9 }}
                animate={{ opacity: 0.25, scale: 1 }}
                whileHover={{
                    opacity: 1,
                    scale: 1.1,
                    backgroundColor: "rgba(132, 204, 22, 0.15)",
                    borderColor: "rgba(132, 204, 22, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                className="pointer-events-auto w-7 h-7 rounded-full bg-zinc-100/50 dark:bg-zinc-800/30 border border-zinc-500/50 dark:border-zinc-500/50 flex items-center justify-center text-zinc-500 hover:text-lime-500 transition-all duration-300 shadow-xs cursor-pointer"
            >
                <Plus size={16} strokeWidth={2} />
            </motion.button>
        </div>
    );
}
