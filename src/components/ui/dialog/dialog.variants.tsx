import React from 'react';
import { AlertTriangle, Info, Trash2, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { DialogVariant } from './dialog.types';

export function getDialogIcon(variant: DialogVariant = 'info') {
  switch (variant) {
    case 'danger':
    case 'delete':
      return <Trash2 className="w-7 h-7 text-destructive dark:text-red-400" />;
    case 'warning':
      return <AlertTriangle className="w-7 h-7 text-amber-500 dark:text-amber-400" />;
    case 'success':
      return <CheckCircle2 className="w-7 h-7 text-emerald-500 dark:text-emerald-400" />;
    case 'error':
      return <XCircle className="w-7 h-7 text-red-500 dark:text-red-400" />;
    case 'question':
      return <HelpCircle className="w-7 h-7 text-sky-500 dark:text-sky-400" />;
    case 'info':
    default:
      return <Info className="w-7 h-7 text-lime-600 dark:text-lime-400" />;
  }
}

export function getDialogIconBg(variant: DialogVariant = 'info') {
  switch (variant) {
    case 'danger':
    case 'delete':
      return 'bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 dark:border-red-500/30';
    case 'warning':
      return 'bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 dark:border-amber-500/30';
    case 'success':
      return 'bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-500/30';
    case 'error':
      return 'bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 dark:border-red-500/30';
    case 'question':
      return 'bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/20 dark:border-sky-500/30';
    case 'info':
    default:
      return 'bg-lime-400/10 dark:bg-lime-400/20 border border-lime-400/20 dark:border-lime-400/30';
  }
}

export function getConfirmButtonStyles(variant: DialogVariant = 'info') {
  switch (variant) {
    case 'danger':
    case 'delete':
    case 'error':
      return 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25 active:bg-red-800';
    case 'warning':
      return 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25 active:bg-amber-700';
    case 'success':
      return 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 active:bg-emerald-700';
    case 'question':
      return 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/25 active:bg-sky-700';
    case 'info':
    default:
      return 'bg-lime-400 hover:bg-lime-500 text-zinc-950 font-bold shadow-lg shadow-lime-400/25 active:bg-lime-600';
  }
}
