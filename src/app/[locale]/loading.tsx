'use client';

import { motion } from 'framer-motion';

/**
 * Global Loading UI
 * 
 * Used by Next.js during route transitions when Suspense is triggered.
 * Designed with a premium, minimalist gym-tech aesthetic.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm transition-colors">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Bar Loader for a tech-savvvy feel */}
        <div className="flex gap-1.5 h-8 items-end">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ height: 12 }}
              animate={{ height: [12, 32, 12] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
              className="w-2 rounded-full bg-lime-400"
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            GymAux
          </span>
          <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-zinc-400 dark:text-zinc-500 mt-1">
            Carregando ambiente...
          </span>
        </motion.div>
      </div>
    </div>
  );
}