'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AlertOctagon, RefreshCw, Home, ChevronRight, ChevronDown, Activity } from 'lucide-react';
import { useErrorRedirect } from '@/hooks/useErrorRedirect';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const t = useTranslations('Error');
  const safeHref = useErrorRedirect();
  const [showDetails, setShowDetails] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    console.error('Unhandled layout error:', error);
  }, [error]);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      reset();
      setIsResetting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-radial from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950 transition-colors duration-300">

      {/* Decorative High-Tech Background Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-30">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-lime-400/20 blur-[120px]" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-lime-400/10 blur-[120px]" />
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
            GymAux Systems
          </span>
        </div>

        {/* Pulsing Alert Icon Container */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-red-500/10 dark:bg-red-500/5 blur-md"
            />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/50 dark:border-zinc-700/30 text-red-500 dark:text-red-400">
              <AlertOctagon className="w-10 h-10" />
            </div>
          </div>
        </div>

        {/* Text Area */}
        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-wide leading-tight mb-4">
          {t('title')}
        </h1>
        <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium mb-8">
          {t('description')}
        </p>

        {/* Interactive Collapse for Tech Details */}
        <div className="mb-8 text-left">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors mx-auto cursor-pointer"
          >
            {showDetails ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            {t('code')} {error.digest ?? 'FATAL_ROUTE_SEGMENT'}
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-100 dark:border-zinc-900 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap break-all max-h-40 overflow-y-auto leading-relaxed shadow-inner">
                  {error.message || 'No additional debug information available.'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-lime-400 dark:hover:bg-lime-300 dark:text-zinc-950 font-bold text-sm tracking-wide transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            {t('retry')}
          </button>

          <Link
            href={safeHref}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 dark:text-zinc-300 font-bold text-sm tracking-wide border border-zinc-200/50 dark:border-zinc-700/50 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Home className="w-4 h-4" />
            {t('backToHome')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
