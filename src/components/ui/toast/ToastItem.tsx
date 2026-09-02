"use client";

import React from "react";
import { motion } from "framer-motion";
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
import { useTranslations } from "next-intl";

interface ToastItemProps {
    toastData: ToastData;
}

interface ToastThemeConfig {
    icon: typeof CheckCircle2;
    iconColor: string;
    badgeBg: string;
    cardBg: string;
    borderColor: string;
    shadowColor: string;
    ringColor: string;
    buttonHover: string;
}

const TOAST_THEMES: Record<ToastType, ToastThemeConfig> = {
    success: {
        icon: CheckCircle2,
        iconColor: "text-lime-400",
        badgeBg: "bg-lime-500/20 border border-lime-500/30",
        cardBg: "bg-gradient-to-r from-emerald-950/95 via-zinc-950/95 to-lime-950/90",
        borderColor: "border-lime-500/40",
        shadowColor: "shadow-lime-500/20",
        ringColor: "ring-1 ring-lime-500/25",
        buttonHover: "hover:bg-lime-500/20 text-lime-200/80 hover:text-white"
    },
    error: {
        icon: AlertCircle,
        iconColor: "text-rose-400",
        badgeBg: "bg-rose-500/20 border border-rose-500/30",
        cardBg: "bg-gradient-to-r from-rose-950/95 via-zinc-950/95 to-red-950/90",
        borderColor: "border-rose-500/40",
        shadowColor: "shadow-rose-500/20",
        ringColor: "ring-1 ring-rose-500/25",
        buttonHover: "hover:bg-rose-500/20 text-rose-200/80 hover:text-white"
    },
    warning: {
        icon: AlertTriangle,
        iconColor: "text-amber-400",
        badgeBg: "bg-amber-500/20 border border-amber-500/30",
        cardBg: "bg-gradient-to-r from-amber-950/95 via-zinc-950/95 to-orange-950/90",
        borderColor: "border-amber-500/40",
        shadowColor: "shadow-amber-500/20",
        ringColor: "ring-1 ring-amber-500/25",
        buttonHover: "hover:bg-amber-500/20 text-amber-200/80 hover:text-white"
    },
    info: {
        icon: Info,
        iconColor: "text-sky-400",
        badgeBg: "bg-sky-500/20 border border-sky-500/30",
        cardBg: "bg-gradient-to-r from-sky-950/95 via-zinc-950/95 to-cyan-950/90",
        borderColor: "border-sky-500/40",
        shadowColor: "shadow-sky-500/20",
        ringColor: "ring-1 ring-sky-500/25",
        buttonHover: "hover:bg-sky-500/20 text-sky-200/80 hover:text-white"
    },
    loading: {
        icon: Loader2,
        iconColor: "text-lime-400",
        badgeBg: "bg-lime-500/20 border border-lime-500/30",
        cardBg: "bg-gradient-to-r from-zinc-950/95 via-zinc-900/95 to-lime-950/80",
        borderColor: "border-lime-500/40",
        shadowColor: "shadow-lime-500/20",
        ringColor: "ring-1 ring-lime-500/25",
        buttonHover: "hover:bg-lime-500/20 text-lime-200/80 hover:text-white"
    }
};

export const ToastItem: React.FC<ToastItemProps> = ({ toastData }) => {
    const { id, type, content, title, isLoading, isCollapsed, onClick } = toastData;
    const t = useTranslations("Toast");
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
                    className="group flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-zinc-950/95 to-zinc-900/95 border border-lime-500/50 ring-1 ring-lime-500/30 text-white backdrop-blur-2xl shadow-2xl shadow-lime-500/25 cursor-pointer active:scale-95 transition-all duration-200"
                    title={t("expandDetails")}
                    aria-label={t("expandDetails")}
                >
                    <div className="relative flex items-center justify-center">
                        <Loader2 size={15} className="animate-spin text-lime-400" />
                        <span className="absolute inset-0 rounded-full animate-ping bg-lime-400/20" />
                    </div>
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-white tracking-wide transition-colors">
                        {t("processing")}
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
            className={`pointer-events-auto w-full max-w-sm sm:max-w-md rounded-2xl ${theme.cardBg} border ${theme.borderColor} ${theme.shadowColor} ${theme.ringColor} backdrop-blur-2xl shadow-2xl p-3 flex items-center gap-3 transition-all duration-300`}
        >
            {/* Left Icon with Themed Badge */}
            <div className={`flex-shrink-0 p-1.5 rounded-xl ${theme.badgeBg} flex items-center justify-center`}>
                <Icon
                    size={17}
                    className={`${theme.iconColor} ${isLoading ? "animate-spin" : ""}`}
                />
            </div>

            {/* Middle Content */}
            <div
                onClick={onClick}
                className={`flex-1 flex flex-col justify-center min-w-0 ${onClick ? "cursor-pointer" : ""}`}
            >
                {title && (
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-200 mb-0.5">
                        {title}
                    </h4>
                )}
                <div className="text-xs sm:text-sm font-medium text-white/95 leading-snug break-words">
                    {content}
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 flex-shrink-0 -mr-0.5">
                {isLoading && (
                    <button
                        onClick={() => toast.toggleCollapse(id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${theme.buttonHover}`}
                        title={t("collapseToast")}
                        aria-label={t("collapseToast")}
                    >
                        <ChevronUp size={15} />
                    </button>
                )}

                <button
                    onClick={() => toast.dismiss(id)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${theme.buttonHover}`}
                    title={t("close")}
                    aria-label={t("close")}
                >
                    <X size={15} />
                </button>
            </div>
        </motion.div>
    );
};

export default ToastItem;
