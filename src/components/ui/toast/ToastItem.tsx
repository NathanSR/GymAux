"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Info,
    Loader2,
    X,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { ToastData, ToastType, toast } from "@/utils/toast";

interface ToastItemProps {
    toastData: ToastData;
}

const TOAST_THEMES: Record<
    ToastType,
    {
        icon: typeof CheckCircle2;
        iconColor: string;
        borderColor: string;
        glowColor: string;
    }
> = {
    success: {
        icon: CheckCircle2,
        iconColor: "text-lime-500 dark:text-lime-400",
        borderColor: "border-lime-500/30 dark:border-lime-400/30",
        glowColor: "shadow-lime-500/10"
    },
    error: {
        icon: AlertCircle,
        iconColor: "text-rose-500 dark:text-rose-400",
        borderColor: "border-rose-500/30 dark:border-rose-400/30",
        glowColor: "shadow-rose-500/10"
    },
    warning: {
        icon: AlertTriangle,
        iconColor: "text-amber-500 dark:text-amber-400",
        borderColor: "border-amber-500/30 dark:border-amber-400/30",
        glowColor: "shadow-amber-500/10"
    },
    info: {
        icon: Info,
        iconColor: "text-sky-500 dark:text-sky-400",
        borderColor: "border-sky-500/30 dark:border-sky-400/30",
        glowColor: "shadow-sky-500/10"
    },
    loading: {
        icon: Loader2,
        iconColor: "text-lime-400",
        borderColor: "border-lime-500/40 dark:border-lime-400/30",
        glowColor: "shadow-lime-500/15"
    }
};

export const ToastItem: React.FC<ToastItemProps> = ({ toastData }) => {
    const { id, type, content, title, isLoading, isCollapsed, onClick } = toastData;
    const theme = TOAST_THEMES[type] || TOAST_THEMES.info;
    const Icon = theme.icon;

    // Collapsed state for loading toasts
    if (isLoading && isCollapsed) {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.85, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                className="pointer-events-auto"
            >
                <button
                    onClick={() => toast.toggleCollapse(id)}
                    className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-950/90 dark:bg-zinc-900/90 border border-lime-500/40 text-white backdrop-blur-2xl shadow-xl shadow-lime-500/15 cursor-pointer active:scale-95 transition-all duration-200"
                    title="Toque para expandir detalhes"
                    aria-label="Expandir detalhes do carregamento"
                >
                    <div className="relative flex items-center justify-center">
                        <Loader2 size={15} className="animate-spin text-lime-400" />
                        <span className="absolute inset-0 rounded-full animate-ping bg-lime-400/20" />
                    </div>
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-white tracking-wide transition-colors">
                        Processando...
                    </span>
                    <ChevronDown size={14} className="text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.92, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: -15 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={`pointer-events-auto w-full max-w-sm sm:max-w-md rounded-2xl bg-zinc-950/92 dark:bg-zinc-900/92 border ${theme.borderColor} ${theme.glowColor} backdrop-blur-2xl shadow-2xl p-3.5 flex items-start gap-3 transition-all duration-300`}
        >
            {/* Left Icon */}
            <div className="flex-shrink-0 mt-0.5">
                <Icon
                    size={20}
                    className={`${theme.iconColor} ${isLoading ? "animate-spin" : ""}`}
                />
            </div>

            {/* Middle Content */}
            <div
                onClick={onClick}
                className={`flex-1 min-w-0 ${onClick ? "cursor-pointer" : ""}`}
            >
                {title && (
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300 dark:text-zinc-300 mb-0.5">
                        {title}
                    </h4>
                )}
                <div className="text-xs sm:text-sm font-medium text-zinc-100 leading-snug break-words">
                    {content}
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 flex-shrink-0 -mr-1">
                {isLoading && (
                    <button
                        onClick={() => toast.toggleCollapse(id)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors cursor-pointer"
                        title="Recolher para indicador discreto"
                        aria-label="Recolher toast"
                    >
                        <ChevronUp size={16} />
                    </button>
                )}

                <button
                    onClick={() => toast.dismiss(id)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors cursor-pointer"
                    title="Fechar"
                    aria-label="Fechar notificação"
                >
                    <X size={16} />
                </button>
            </div>
        </motion.div>
    );
};

export default ToastItem;
