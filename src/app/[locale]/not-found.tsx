'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Compass, Home, Search, Activity } from 'lucide-react';
import { useErrorRedirect } from '@/hooks/useErrorRedirect';

export default function NotFound() {
  const t = useTranslations('NotFound');
  const safeHref = useErrorRedirect();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-radial from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950 transition-colors duration-300">

      {/* Sonar / Radar decorative background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2.2, opacity: [0, 0.15, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: (ring - 1) * 1.3,
              ease: "easeOut"
            }}
            className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border border-lime-400/40 dark:border-lime-400/20"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-lg bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/50 rounded-3xl p-8 md:p-10 shadow-2xl text-center relative overflow-hidden"
      >
        {/* Gym Tech Top Logo / Accent */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Activity className="w-4 h-4 text-lime-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">
            GymAux GPS
          </span>
        </div>

        {/* Custom Sonar Radar Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/30">
            {/* Spinning Radar Line */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-1 rounded-full border-t border-r border-transparent border-t-lime-400 border-r-lime-400/30 origin-center"
            />

            <Compass className="w-10 h-10 text-lime-500 dark:text-lime-400" />

            {/* Pulsing indicator when target is not found */}
            <span className="absolute top-2 right-2 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500" />
            </span>
          </div>
        </div>

        {/* Text Area */}
        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-wide leading-tight mb-4">
          {t('title')}
        </h1>
        <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium mb-8 max-w-sm mx-auto">
          {t('description')}
        </p>

        {/* Quick action search clue */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-8 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-900 max-w-xs mx-auto">
          <Search className="w-3.5 h-3.5" />
          <span>ROUTE_NOT_FOUND_404</span>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Link
            href={safeHref}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-lime-400 dark:hover:bg-lime-300 dark:text-zinc-950 font-bold text-sm tracking-wide transition-all shadow-lg active:scale-[0.98] cursor-pointer"
          >
            <Home className="w-4 h-4" />
            {t('backToHome')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
