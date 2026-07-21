'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
  className = ''
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalIdRef = React.useRef<string>(`modal-${Math.random().toString(36).substring(2, 9)}`);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isPushedRef = React.useRef(false);
  const isPopStateTriggeredRef = React.useRef(false);
  const onCloseRef = React.useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    const modalId = modalIdRef.current;
    isPopStateTriggeredRef.current = false;

    if (typeof window !== 'undefined' && !isPushedRef.current) {
      window.history.pushState({ ...window.history.state, __modalId: modalId }, '');
      isPushedRef.current = true;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const dialogs = document.querySelectorAll('[role="dialog"]:not([data-state="closed"])');
        const isTopmost = dialogs.length === 0 || dialogs[dialogs.length - 1] === containerRef.current;
        if (!isTopmost) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onCloseRef.current();
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      // Se a navegação retornou para o histórico DESTE modal, ele deve PERMANECER aberto!
      if (e.state && e.state.__modalId === modalId) {
        return;
      }
      isPopStateTriggeredRef.current = true;
      isPushedRef.current = false;
      onCloseRef.current();
    };

    window.addEventListener('keydown', handleEscape, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleEscape, true);
      window.removeEventListener('popstate', handlePopState);

      if (typeof window !== 'undefined' && isPushedRef.current && !isPopStateTriggeredRef.current) {
        isPushedRef.current = false;
        window.history.back();
      }
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div ref={containerRef} role="dialog" aria-modal="true" data-overlay="true" data-state={isOpen ? 'open' : 'closed'} className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "bg-white dark:bg-zinc-900 text-foreground w-full rounded-[40px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] relative z-10 flex flex-col border border-white/20 dark:border-white/10",
              maxWidth,
              className
            )}
          >
            {title && (
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between gap-3 min-w-0">
                <h2 className="text-xl font-bold truncate min-w-0 flex-1">{title}</h2>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="overflow-y-auto max-h-[85vh] flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
