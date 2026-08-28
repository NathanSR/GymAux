"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ToastData, toastManager } from "@/utils/toast";
import { ToastItem } from "./ToastItem";

export const ToastContainer: React.FC = () => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    useEffect(() => {
        const unsubscribe = toastManager.subscribe((newToasts) => {
            setToasts(newToasts);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    if (toasts.length === 0) return null;

    return (
        <aside
            aria-live="polite"
            aria-atomic="true"
            className="fixed top-[calc(0.85rem+env(safe-area-inset-top,0px))] left-1/2 -translate-x-1/2 z-[9999] pointer-events-none flex flex-col items-center gap-2 w-[92%] max-w-sm sm:max-w-md transition-all"
        >
            <AnimatePresence mode="popLayout" initial={false}>
                {toasts.map((toastItem) => (
                    <ToastItem key={toastItem.id} toastData={toastItem} />
                ))}
            </AnimatePresence>
        </aside>
    );
};

export default ToastContainer;
