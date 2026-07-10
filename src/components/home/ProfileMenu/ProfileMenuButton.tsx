import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export interface ProfileMenuButtonProps {
    icon: React.ReactNode;
    label: string;
    value?: string;
    onClick?: () => void;
    href?: string;
    showChevron?: boolean;
    variant?: 'default' | 'premium';
}

export const ProfileMenuButton = ({
    icon,
    label,
    value,
    onClick,
    href,
    showChevron,
    variant = 'default'
}: ProfileMenuButtonProps) => {
    const content = (
        <>
            <div className="flex-shrink-0">
                {icon}
            </div>
            <span className="flex-1 text-left">{label}</span>
            {value && (
                <span className="text-[10px] font-black bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded-full text-zinc-600 dark:text-zinc-400">
                    {value}
                </span>
            )}
            {showChevron && (
                <ChevronRight
                    size={14}
                    className={`opacity-20 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${
                        variant === 'premium' ? 'text-white dark:text-black' : ''
                    }`}
                />
            )}
        </>
    );

    const className = `w-full flex items-center gap-3 px-4 py-3 text-sm font-black rounded-[18px] transition-all mb-0.5 group active:scale-[0.98] ${
        variant === 'premium'
            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-white/5'
            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300'
    }`;

    if (href) {
        return (
            <Link href={href as any} onClick={onClick} className={className}>
                {content}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={className}>
            {content}
        </button>
    );
};
