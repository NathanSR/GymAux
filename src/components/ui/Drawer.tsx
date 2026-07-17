'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { X, ChevronDown, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils/cn';

export type DrawerSide = 'top' | 'bottom' | 'left' | 'right';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  side?: DrawerSide;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  showClose?: boolean;
  showHandle?: boolean;
  maxHeight?: string;
  enableDrag?: boolean;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export function useDrawerState(initialOpen = false, initialExpanded = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setIsExpanded(false);
  }, []);
  const expand = useCallback(() => setIsExpanded(true), []);
  const collapse = useCallback(() => setIsExpanded(false), []);
  const toggleExpand = useCallback(() => setIsExpanded(prev => !prev), []);

  return {
    isOpen,
    isExpanded,
    open,
    close,
    expand,
    collapse,
    toggleExpand,
    setIsOpen,
    setIsExpanded
  };
}

const variants: Record<DrawerSide, { initial: any; animate: any; exit: any; className: string }> = {
  top: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
    className: 'top-0 left-0 right-0 w-full h-fit max-h-[90vh] rounded-b-[36px]',
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    className: 'bottom-0 left-0 right-0 w-full h-fit max-h-[92vh] rounded-t-[36px] sm:rounded-t-[40px]',
  },
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    className: 'top-0 left-0 bottom-0 h-full w-full sm:max-w-md rounded-r-[36px]',
  },
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    className: 'top-0 right-0 bottom-0 h-full w-full sm:max-w-md rounded-l-[36px]',
  },
};

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  headerRight,
  side = 'bottom',
  className = '',
  bodyClassName = '',
  headerClassName = '',
  showClose = true,
  showHandle = true,
  enableDrag = true,
  isExpanded: controlledExpanded,
  onExpandedChange,
}: DrawerProps) {
  const t = useTranslations('Drawer');
  const [internalExpanded, setInternalExpanded] = useState(false);
  const dragControls = useDragControls();

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const setIsExpanded = useCallback(
    (expanded: boolean) => {
      if (onExpandedChange) {
        onExpandedChange(expanded);
      } else {
        setInternalExpanded(expanded);
      }
    },
    [onExpandedChange]
  );

  // Reset internal expansion when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setInternalExpanded(false);
    }
  }, [isOpen]);

  // Handle ESC key and scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isExpanded) {
          setIsExpanded(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isExpanded, onClose, setIsExpanded]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (side !== 'bottom' || !enableDrag) return;

    // Dragged UP -> Expand to 100% height
    if (info.offset.y < -50 || info.velocity.y < -200) {
      if (!isExpanded) {
        setIsExpanded(true);
      }
    }
    // Dragged DOWN -> Collapse if expanded, Close if already collapsed
    else if (info.offset.y > 60 || info.velocity.y > 300) {
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        onClose();
      }
    }
  };

  const sideVariant = variants[side];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            initial={sideVariant.initial}
            animate={sideVariant.animate}
            exit={sideVariant.exit}
            drag={side === 'bottom' && enableDrag ? 'y' : false}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.15, bottom: 0.15 }}
            onDragEnd={handleDragEnd}
            transition={{ type: 'spring', damping: 28, stiffness: 280, mass: 0.8 }}
            className={cn(
              'fixed bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-2xl z-10 flex flex-col border-t sm:border border-zinc-200 dark:border-zinc-800/80 overflow-hidden transition-[height,max-height,border-radius,top] duration-300 ease-out',
              isExpanded && side === 'bottom'
                ? 'top-0 bottom-0 left-0 right-0 w-full h-full max-h-none rounded-none'
                : sideVariant.className,
              className
            )}
          >
            {/* Drag Handle Bar (Top Bar) */}
            {side === 'bottom' && showHandle && (
              <div
                onPointerDown={(e) => enableDrag && dragControls.start(e)}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? t('collapse') : t('expand')}
                className="w-full flex flex-col items-center justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none select-none hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-colors group shrink-0"
              >
                <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-600 rounded-full transition-all group-hover:scale-x-110" />
              </div>
            )}

            {/* Header */}
            {(title || showClose || headerRight || isExpanded) && (
              <div
                onPointerDown={(e) => side === 'bottom' && enableDrag && dragControls.start(e)}
                className={cn(
                  'px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between shrink-0 select-none',
                  headerClassName
                )}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {isExpanded && side === 'bottom' && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors shrink-0"
                      aria-label={t('back')}
                      title={t('back')}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  {typeof title === 'string' ? (
                    <div className="min-w-0">
                      <h2 className="text-lg md:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                        {title}
                      </h2>
                      {subtitle && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate mt-0.5">
                          {subtitle}
                        </p>
                      )}
                    </div>
                  ) : (
                    title || <div />
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {headerRight}

                  {side === 'bottom' && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors hidden sm:flex"
                      aria-label={isExpanded ? t('collapse') : t('expand')}
                      title={isExpanded ? t('collapse') : t('expand')}
                    >
                      {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                  )}

                  {showClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500/50"
                      aria-label={t('close')}
                      title={t('close')}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Body */}
            <div className={cn('overflow-y-auto flex-1 custom-scrollbar p-6', bodyClassName)}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
