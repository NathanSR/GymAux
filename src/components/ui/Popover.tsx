'use client';

import React, { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export type PopoverSide = 'bottom' | 'top' | 'left' | 'right';
export type PopoverAlign = 'start' | 'center' | 'end';

export interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  side?: PopoverSide;
  align?: PopoverAlign;
  sideOffset?: number;
  showBackdrop?: boolean;
  backdropClassName?: string;
  className?: string;
  closeOnClickOutside?: boolean;
}

export function usePopoverState(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  };
}

export function Popover({
  isOpen,
  onClose,
  triggerRef,
  children,
  side = 'bottom',
  align = 'end',
  sideOffset = 12,
  showBackdrop = true,
  backdropClassName = '',
  className = '',
  closeOnClickOutside = true
}: PopoverProps) {
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    transformOrigin: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Recalculate position relative to triggerRef
  const updatePosition = useCallback(() => {
    if (!triggerRef?.current) {
      // Fallback if no triggerRef provided: default top right floating
      setCoords({
        top: 80,
        right: 16,
        transformOrigin: 'top right'
      });
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newCoords: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
      transformOrigin: string;
    } = { transformOrigin: 'top right' };

    if (side === 'bottom') {
      newCoords.top = rect.bottom + sideOffset;
      if (align === 'end') {
        newCoords.right = viewportWidth - rect.right;
        newCoords.transformOrigin = 'top right';
      } else if (align === 'start') {
        newCoords.left = rect.left;
        newCoords.transformOrigin = 'top left';
      } else {
        newCoords.left = rect.left + rect.width / 2;
        newCoords.transformOrigin = 'top center';
      }
    } else if (side === 'top') {
      newCoords.bottom = viewportHeight - rect.top + sideOffset;
      if (align === 'end') {
        newCoords.right = viewportWidth - rect.right;
        newCoords.transformOrigin = 'bottom right';
      } else if (align === 'start') {
        newCoords.left = rect.left;
        newCoords.transformOrigin = 'bottom left';
      } else {
        newCoords.left = rect.left + rect.width / 2;
        newCoords.transformOrigin = 'bottom center';
      }
    } else if (side === 'left') {
      newCoords.right = viewportWidth - rect.left + sideOffset;
      if (align === 'end') {
        newCoords.bottom = viewportHeight - rect.bottom;
        newCoords.transformOrigin = 'bottom right';
      } else if (align === 'start') {
        newCoords.top = rect.top;
        newCoords.transformOrigin = 'top right';
      } else {
        newCoords.top = rect.top + rect.height / 2;
        newCoords.transformOrigin = 'center right';
      }
    } else if (side === 'right') {
      newCoords.left = rect.right + sideOffset;
      if (align === 'end') {
        newCoords.bottom = viewportHeight - rect.bottom;
        newCoords.transformOrigin = 'bottom right';
      } else if (align === 'start') {
        newCoords.top = rect.top;
        newCoords.transformOrigin = 'top left';
      } else {
        newCoords.top = rect.top + rect.height / 2;
        newCoords.transformOrigin = 'center left';
      }
    }

    setCoords(newCoords);
  }, [triggerRef, side, align, sideOffset]);

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleResizeOrScroll = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleResizeOrScroll, { passive: true });
    window.addEventListener('scroll', handleResizeOrScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, { capture: true });
    };
  }, [isOpen, updatePosition]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

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

    window.addEventListener('keydown', handleEscape, true);

    return () => {
      window.removeEventListener('keydown', handleEscape, true);
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="false"
          data-overlay="true"
          data-state={isOpen ? 'open' : 'closed'}
          className="fixed inset-0 z-[150] pointer-events-none"
        >
          {/* Backdrop */}
          {showBackdrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => {
                if (closeOnClickOutside) {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }
              }}
              className={cn(
                'fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] pointer-events-auto',
                backdropClassName
              )}
            />
          )}

          {/* Popover Content Card */}
          {coords && (
            <motion.div
              ref={popoverContentRef}
              initial={{ opacity: 0, scale: 0.95, y: side === 'bottom' ? 8 : -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: side === 'bottom' ? 8 : -8 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              style={{
                position: 'fixed',
                top: coords.top !== undefined ? `${coords.top}px` : undefined,
                bottom: coords.bottom !== undefined ? `${coords.bottom}px` : undefined,
                left: coords.left !== undefined ? `${coords.left}px` : undefined,
                right: coords.right !== undefined ? `${coords.right}px` : undefined,
                transformOrigin: coords.transformOrigin
              }}
              className={cn(
                'pointer-events-auto z-[151] bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[28px] shadow-2xl overflow-hidden p-2',
                className
              )}
            >
              {children}
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default Popover;
