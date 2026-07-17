'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronsRight, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SlideToConfirmProps {
    onConfirm: () => void;
    text: string;
    completedText?: string;
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
    completedIcon?: React.ReactNode;
    threshold?: number; // 0.5 to 0.95, default 0.8 (80%)
    resetDelay?: number; // ms to reset after confirm, 0 for no auto-reset
}

export function SlideToConfirm({
    onConfirm,
    text,
    completedText = 'CONCLUÍDO!',
    disabled = false,
    className = '',
    icon = <ChevronsRight size={20} />,
    completedIcon = <Check size={20} strokeWidth={3} />,
    threshold = 0.8,
    resetDelay = 1200
}: SlideToConfirmProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);

    const [maxDrag, setMaxDrag] = useState<number>(0);
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

    const x = useMotionValue(0);

    // Calculate maximum draggable distance
    const updateBounds = useCallback(() => {
        if (containerRef.current && handleRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const handleWidth = handleRef.current.offsetWidth;
            // Accounting for padding (p-1.5 = 6px on left & right)
            const padding = 12;
            const availableDrag = Math.max(0, containerWidth - handleWidth - padding);
            setMaxDrag(availableDrag);
        }
    }, []);

    useEffect(() => {
        updateBounds();
        window.addEventListener('resize', updateBounds);
        return () => window.removeEventListener('resize', updateBounds);
    }, [updateBounds]);

    // Handle reset if component stays mounted
    const reset = useCallback(() => {
        setIsConfirmed(false);
        animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }, [x]);

    const handleDragEnd = () => {
        if (disabled || isConfirmed) return;

        const currentX = x.get();
        if (maxDrag > 0 && currentX >= maxDrag * threshold) {
            // Confirm action
            setIsConfirmed(true);
            animate(x, maxDrag, { type: 'spring', stiffness: 500, damping: 30 });

            // Trigger haptic feedback if available
            if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                try {
                    navigator.vibrate(40);
                } catch {
                    // Ignore if vibration is restricted
                }
            }

            onConfirm();

            if (resetDelay > 0) {
                setTimeout(() => {
                    reset();
                }, resetDelay);
            }
        } else {
            // Snap back to start
            animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
        }
    };

    // Derived animated values
    const progressWidth = useTransform(x, (val) => {
        const handleWidth = handleRef.current?.offsetWidth || 48;
        return `${val + handleWidth}px`;
    });

    const textOpacity = useTransform(x, [0, maxDrag * 0.6], [1, 0]);
    const textTranslateX = useTransform(x, [0, maxDrag], [0, 15]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full h-[58px] p-1.5 rounded-[24px] overflow-hidden select-none touch-none flex items-center transition-all duration-300",
                "bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300/80 dark:border-zinc-800/80 shadow-inner",
                disabled && "opacity-50 pointer-events-none",
                className
            )}
        >
            {/* Filled background track that expands as user drags */}
            <motion.div
                style={{ width: isConfirmed ? '100%' : progressWidth }}
                className={cn(
                    "absolute left-0 top-0 bottom-0 rounded-[24px] transition-colors duration-300",
                    isConfirmed ? "bg-lime-400" : "bg-lime-400/30 dark:bg-lime-400/20"
                )}
            />

            {/* Shimmer / Guide Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-12">
                <motion.span
                    style={{
                        opacity: isConfirmed ? 0 : textOpacity,
                        x: textTranslateX
                    }}
                    className="font-black uppercase text-[10px] sm:text-[11px] tracking-[0.25em] text-zinc-600 dark:text-zinc-300 truncate transition-colors"
                >
                    {text}
                </motion.span>
                {isConfirmed && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-black uppercase text-[11px] tracking-[0.25em] text-zinc-950 z-10"
                    >
                        {completedText}
                    </motion.span>
                )}
            </div>

            {/* Draggable Handle Button */}
            <motion.div
                ref={handleRef}
                drag={disabled || isConfirmed ? false : "x"}
                dragConstraints={{ left: 0, right: maxDrag }}
                dragElastic={0.05}
                dragMomentum={false}
                dragSnapToOrigin={false}
                onDragEnd={handleDragEnd}
                style={{ x: isConfirmed ? maxDrag : x }}
                whileTap={{ scale: disabled ? 1 : 0.96 }}
                className={cn(
                    "relative z-10 w-12 h-12 rounded-[18px] flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors shadow-lg",
                    isConfirmed
                        ? "bg-zinc-950 text-lime-400 border border-lime-400/40"
                        : "bg-lime-400 text-zinc-950 hover:bg-lime-300 border-b-4 border-lime-600"
                )}
            >
                {isConfirmed ? completedIcon : (
                    <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="flex items-center justify-center"
                    >
                        {icon}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
