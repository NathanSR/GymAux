'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CloudOff, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface OfflineSignOutModalProps {
    isOpen: boolean;
    pendingCount: number;
    onCancel: () => void;
    onConfirmDiscard: () => void;
    onRetrySync?: () => void;
    isOnline?: boolean;
}

export const OfflineSignOutModal: React.FC<OfflineSignOutModalProps> = ({
    isOpen,
    pendingCount,
    onCancel,
    onConfirmDiscard,
    onRetrySync,
    isOnline = false
}) => {
    const t = useTranslations('ProfileMenu');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99998] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 text-white"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="offline-signout-title"
                aria-describedby="offline-signout-desc"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 12 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 12 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-md bg-zinc-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl shadow-black/80 overflow-hidden"
                >
                    {/* Glowing Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div className="flex-1 pr-2">
                            <h3 id="offline-signout-title" className="text-lg font-bold text-zinc-100 leading-snug">
                                {t('offlineWarningTitle')}
                            </h3>
                            <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                <CloudOff className="w-3.5 h-3.5" />
                                {pendingCount} {pendingCount === 1 ? 'registro pendente' : 'registros pendentes'}
                            </span>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Description */}
                    <p id="offline-signout-desc" className="text-sm text-zinc-300 leading-relaxed mb-6">
                        {t('offlineWarningDesc', { count: pendingCount })}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2.5">
                        {/* Primary Recommended Action: Stay signed in */}
                        <button
                            onClick={onCancel}
                            className="w-full py-3 px-4 rounded-2xl bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-lime-400/20 active:scale-[0.98]"
                        >
                            {t('stayLoggedIn')}
                        </button>

                        {/* Optional retry if network is available */}
                        {isOnline && onRetrySync && (
                            <button
                                onClick={onRetrySync}
                                className="w-full py-2.5 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4 text-lime-400" />
                                {t('retrySync')}
                            </button>
                        )}

                        {/* Danger Action: Force discard */}
                        <button
                            onClick={onConfirmDiscard}
                            className="w-full py-2 px-4 rounded-2xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-semibold text-xs transition-colors"
                        >
                            {t('discardAndSignOut')}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
