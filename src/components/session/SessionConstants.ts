import { Zap, RefreshCw, Flame, Trophy } from 'lucide-react';

export const RPE_EMOJIS: Record<number, { emoji: string; labelKey: string }> = {
    0: { emoji: "☁️", labelKey: "rpeVeryLight" },
    1: { emoji: "☁️", labelKey: "rpeVeryLight" },
    2: { emoji: "☁️", labelKey: "rpeVeryLight" },
    3: { emoji: "🙂", labelKey: "rpeLight" },
    4: { emoji: "🙂", labelKey: "rpeLight" },
    5: { emoji: "😐", labelKey: "rpeModerate" },
    6: { emoji: "😐", labelKey: "rpeModerate" },
    7: { emoji: "💪", labelKey: "rpeHard" },
    8: { emoji: "🔥", labelKey: "rpeVeryHard" },
    9: { emoji: "💀", labelKey: "rpeTechnical" },
    10: { emoji: "🚀", labelKey: "rpeTotal" },
};

export const RPE_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const GROUP_CONFIG: Record<string, {
    color: string;
    bg: string;
    border: string;
    icon: any;
    glow: string;
}> = {
    straight: {
        color: 'text-lime-400',
        bg: 'bg-lime-400/10',
        border: 'border-lime-400/20',
        icon: Zap,
        glow: 'shadow-lime-400/20'
    },
    bi_set: {
        color: 'text-indigo-400',
        bg: 'bg-indigo-400/10',
        border: 'border-indigo-400/20',
        icon: RefreshCw,
        glow: 'shadow-indigo-400/20'
    },
    tri_set: {
        color: 'text-amber-400',
        bg: 'bg-amber-400/10',
        border: 'border-amber-400/20',
        icon: Flame,
        glow: 'shadow-amber-400/20'
    },
    giant_set: {
        color: 'text-rose-400',
        bg: 'bg-rose-400/10',
        border: 'border-rose-400/20',
        icon: Trophy,
        glow: 'shadow-rose-400/20'
    },
    circuit: {
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10',
        border: 'border-cyan-400/20',
        icon: RefreshCw,
        glow: 'shadow-cyan-400/20'
    },
    superset: {
        color: 'text-fuchsia-400',
        bg: 'bg-fuchsia-400/10',
        border: 'border-fuchsia-400/20',
        icon: Zap,
        glow: 'shadow-fuchsia-400/20'
    }
};
