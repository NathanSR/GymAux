'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../Modal';
import { cn } from '@/utils/cn';
import { DialogProps } from './dialog.types';
import { getDialogIcon, getDialogIconBg, getConfirmButtonStyles } from './dialog.variants';

export function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'info',
  mode = 'confirm',
  isLoading = false,
}: DialogProps) {
  const isAlertMode = mode === 'alert';

  const handleConfirmAction = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="max-w-md"
    >
      <div className="p-6 sm:p-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 280 }}
          className={cn(
            "w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-sm",
            getDialogIconBg(variant)
          )}
        >
          {getDialogIcon(variant)}
        </motion.div>

        <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-2.5 tracking-tight">
          {title}
        </h3>

        {description && (
          <div className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed font-normal">
            {description}
          </div>
        )}

        <div className={cn(
          "flex gap-3 w-full",
          isAlertMode ? "justify-center" : "flex-col-reverse sm:flex-row"
        )}>
          {!isAlertMode && (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:flex-1 rounded-2xl h-[52px] sm:h-12 px-5 text-base font-bold bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirmAction}
            disabled={isLoading}
            className={cn(
              "w-full sm:flex-1 rounded-2xl h-[52px] sm:h-12 px-5 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center justify-center",
              getConfirmButtonStyles(variant)
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>{confirmText}...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
