'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useOverlayStack } from '@/hooks/useOverlayStack';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
  zIndex?: string | number;
}

function getZIndexValue(zIndex?: string | number): number {
  if (typeof zIndex === 'number') return zIndex;
  if (!zIndex) return 150;
  const match = String(zIndex).match(/\d+/);
  return match ? parseInt(match[0], 10) : 150;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
  className = '',
  zIndex = 'z-[150]'
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalIdRef = React.useRef<string>(`modal-${Math.random().toString(36).substring(2, 9)}`);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useOverlayStack({
    id: modalIdRef.current,
    isOpen,
    onClose,
    type: 'modal',
    pushHistory: true
  });

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          data-overlay="true"
          data-state={isOpen ? 'open' : 'closed'}
          style={{ zIndex: getZIndexValue(zIndex) }}
          className={cn("fixed inset-0 flex items-center justify-center p-4", typeof zIndex === 'string' ? zIndex : `z-[${zIndex}]`)}
        >
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
                  className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 shrink-0 cursor-pointer"
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
