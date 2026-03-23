'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    limit: number;
    onLimitChange: (limit: number) => void;
    totalCount: number;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    limit,
    onLimitChange,
    totalCount
}: PaginationProps) {
    const t = useTranslations('Pagination');

    if (totalCount === 0) return null;

    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalCount);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Info de Resultados */}
            <div className="text-[10px] font-black uppercase text-zinc-400 tracking-widest italic">
                {t('resultsCount', { count: totalCount })}
                <span className="mx-2 opacity-30">|</span>
                <span className="text-lime-500">
                    {startItem}-{endItem}
                </span>
            </div>

            <div className="flex items-center gap-6">
                {/* Seletor de Limite */}
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{t('itemsPerPage')}</span>
                    <select
                        value={limit}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                        className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-[11px] font-bold outline-none focus:ring-1 focus:ring-lime-400 transition-all"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                {/* Controles de Navegação */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-400 disabled:opacity-20 hover:text-lime-500 transition-colors border border-zinc-100 dark:border-zinc-800 cursor-pointer disabled:cursor-not-allowed active:scale-90"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 w-24 text-center">
                        {t('pageIndicator', { current: currentPage, total: Math.max(1, totalPages) })}
                    </span>

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-400 disabled:opacity-20 hover:text-lime-500 transition-colors border border-zinc-100 dark:border-zinc-800 cursor-pointer disabled:cursor-not-allowed active:scale-90"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
