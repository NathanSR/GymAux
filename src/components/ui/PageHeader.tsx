"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter, Link } from '@/i18n/routing';

interface PageHeaderProps {
    title: string;
    onBack?: () => void;
    backHref?: string;
    rightAction?: React.ReactNode;
    sticky?: boolean;
    variant?: 'default' | 'minimal';
    className?: string;
    titleClassName?: string;
    children?: React.ReactNode;
}

/**
 * PageHeader - A unified header component for GymAux application.
 * 
 * Provides consistent layout for:
 * [Back Button] [Title] [Right Action or Spacer]
 * [Optional Children (e.g. Search Bar)]
 */
export default function PageHeader({
    title,
    onBack,
    backHref,
    rightAction,
    sticky = true,
    variant = 'default',
    className = '',
    titleClassName = '',
    children
}: PageHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const isMinimal = variant === 'minimal';

    const backButtonContent = (
        <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-90 cursor-pointer">
            <ChevronLeft size={isMinimal ? 20 : 24} />
        </div>
    );

    return (
        <header className={`
            z-50 px-6 py-4 transition-all duration-300
            ${sticky ? 'sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900' : ''}
            ${className}
        `}>
            <div className={`flex items-center justify-between ${children ? 'mb-4' : ''}`}>
                {/* Left Action: Back Button */}
                {/* {backHref ? (
                    <Link href={backHref} aria-label="Voltar">
                        {backButtonContent}
                    </Link>
                ) : ( */}
                <button
                    onClick={handleBack}
                    type="button"
                    aria-label="Voltar"
                >
                    {backButtonContent}
                </button>
                {/*)}*/}

                {/* Center Content: Title */}
                <h1 className={`
                    font-black uppercase tracking-tight
                    ${isMinimal
                        ? 'text-xs tracking-widest text-zinc-400 dark:text-zinc-500'
                        : 'text-lg italic tracking-tight text-zinc-900 dark:text-white text-center'
                    }
                    ${titleClassName}
                `}>
                    {title}
                </h1>

                {/* Right Action or Spacer for symmetry */}
                <div className="flex items-center justify-end min-w-[40px]">
                    {rightAction || <div className="w-10" />}
                </div>
            </div>

            {children && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    {children}
                </div>
            )}
        </header>
    );
}
