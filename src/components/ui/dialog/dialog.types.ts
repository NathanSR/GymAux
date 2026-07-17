import React from 'react';

export type DialogVariant = 'danger' | 'delete' | 'warning' | 'info' | 'success' | 'error' | 'question';

export type DialogMode = 'confirm' | 'alert';

export interface DialogOptions {
  title: string;
  description?: React.ReactNode | string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  mode?: DialogMode;
  isLoading?: boolean;
  danger?: boolean;
}

export interface DialogResult {
  isConfirmed: boolean;
}

export interface DialogProps extends DialogOptions {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}
