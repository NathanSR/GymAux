'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { DialogOptions, DialogResult, DialogVariant } from '@/components/ui/dialog/dialog.types';
import { Dialog } from '@/components/ui/dialog/Dialog';

interface DialogContextType {
  showDialog: (options: DialogOptions) => Promise<DialogResult>;
  confirm: (options: DialogOptions) => Promise<DialogResult>;
  alert: (options: DialogOptions) => Promise<DialogResult>;
  success: (title: string, description?: string) => Promise<DialogResult>;
  error: (title: string, description?: string) => Promise<DialogResult>;
  info: (title: string, description?: string) => Promise<DialogResult>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({
    title: '',
    description: '',
    variant: 'info',
    mode: 'confirm',
  });

  const resolveRef = useRef<((value: DialogResult) => void) | null>(null);

  const showDialog = useCallback((opts: DialogOptions): Promise<DialogResult> => {
    return new Promise((resolve) => {
      // If a dialog is already open, resolve the previous one as false
      if (resolveRef.current) {
        resolveRef.current({ isConfirmed: false });
      }
      resolveRef.current = resolve;
      setOptions({
        mode: opts.mode || 'confirm',
        variant: opts.variant || (opts.danger ? 'danger' : 'info'),
        ...opts,
      });
      setIsOpen(true);
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (resolveRef.current) {
      resolveRef.current({ isConfirmed: false });
      resolveRef.current = null;
    }
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolveRef.current) {
      resolveRef.current({ isConfirmed: true });
      resolveRef.current = null;
    }
  }, []);

  const confirm = useCallback(
    (opts: DialogOptions) => showDialog({ mode: 'confirm', ...opts }),
    [showDialog]
  );

  const alert = useCallback(
    (opts: DialogOptions) => showDialog({ mode: 'alert', ...opts }),
    [showDialog]
  );

  const success = useCallback(
    (title: string, description?: string) =>
      showDialog({
        mode: 'alert',
        variant: 'success',
        title,
        description,
        confirmText: 'Entendido',
      }),
    [showDialog]
  );

  const error = useCallback(
    (title: string, description?: string) =>
      showDialog({
        mode: 'alert',
        variant: 'error',
        title,
        description,
        confirmText: 'Fechar',
      }),
    [showDialog]
  );

  const info = useCallback(
    (title: string, description?: string) =>
      showDialog({
        mode: 'alert',
        variant: 'info',
        title,
        description,
        confirmText: 'Entendido',
      }),
    [showDialog]
  );

  return (
    <DialogContext.Provider
      value={{
        showDialog,
        confirm,
        alert,
        success,
        error,
        info,
      }}
    >
      {children}
      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        {...options}
      />
    </DialogContext.Provider>
  );
}

export function useDialogContext(): DialogContextType {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
