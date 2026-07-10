'use client';

import { useState } from 'react';
import { CATEGORIES, EQUIPMENT, CATEGORY_METADATA, EQUIPMENT_METADATA, CategoryType, EquipmentType } from '@/config/constants';
import { useTranslations } from 'next-intl';
import { SlidersHorizontal, RotateCcw, Dumbbell, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExerciseFilterPanelProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    selectedEquipment: string;
    onEquipmentChange: (equipment: string) => void;
    className?: string;
}

export function ExerciseFilterPanel({
    selectedCategory,
    onCategoryChange,
    selectedEquipment,
    onEquipmentChange,
    className = ""
}: ExerciseFilterPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const tc = useTranslations('Categories');
    const te = useTranslations('Equipment');

    const hasActiveFilters = selectedCategory !== 'all' || selectedEquipment !== 'all';

    const activeFiltersCount =
        (selectedCategory !== 'all' ? 1 : 0) +
        (selectedEquipment !== 'all' ? 1 : 0);

    const handleClearAll = () => {
        onCategoryChange('all');
        onEquipmentChange('all');
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Filter Toggle and Summary Row */}
            <div className="flex items-center justify-between gap-3 mb-2">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${isOpen || hasActiveFilters
                        ? 'bg-lime-400 text-zinc-950 border-lime-400 shadow-md shadow-lime-500/10'
                        : 'bg-zinc-100 dark:bg-zinc-900/60 border-zinc-200/50 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                >
                    <SlidersHorizontal size={14} className={isOpen ? "rotate-90 transition-transform duration-300" : "transition-transform duration-300"} />
                    <span>Filtros</span>
                    {activeFiltersCount > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-950 text-lime-400 text-[10px] font-black leading-none">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-zinc-500 hover:text-rose-500 transition-colors active:scale-95 cursor-pointer"
                    >
                        <RotateCcw size={12} />
                        <span>Limpar</span>
                    </button>
                )}
            </div>

            {/* Expandable Filter Panel */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 pb-2 space-y-5 border-t border-zinc-900 dark:border-zinc-850 mt-2">
                            {/* Category Filter */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-zinc-400 tracking-[0.15em] px-1">
                                    <Target size={10} className="text-lime-500" />
                                    <span>Grupo Muscular</span>
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                                    {/* All Categories Card */}
                                    <button
                                        type="button"
                                        onClick={() => onCategoryChange('all')}
                                        className={`relative flex flex-col justify-end w-22 h-22 sm:w-24 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex-shrink-0 overflow-hidden group select-none ${selectedCategory === 'all'
                                            ? 'bg-lime-400/5 border-lime-400/30 shadow-[0_4px_16px_rgba(163,230,71,0.06)]'
                                            : 'bg-zinc-950 border-zinc-200/15 dark:border-zinc-900/50 hover:border-zinc-200/30 dark:hover:border-zinc-800/60'
                                            }`}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center -translate-y-2">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedCategory === 'all'
                                                ? 'bg-lime-400/20 text-lime-400 shadow-[0_0_15px_rgba(163,230,71,0.2)]'
                                                : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                                                }`}>
                                                <Target size={20} className="opacity-80" />
                                            </div>
                                        </div>
                                        {/* Bottom gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
                                        <span className={`relative z-20 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-center truncate w-full ${selectedCategory === 'all' ? 'text-lime-400' : 'text-zinc-400 group-hover:text-white'
                                            }`}>
                                            Todos
                                        </span>
                                    </button>

                                    {/* Categories Cards */}
                                    {CATEGORIES.map(cat => {
                                        const meta = CATEGORY_METADATA[cat];
                                        const isSelected = selectedCategory === cat;
                                        return (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => onCategoryChange(cat)}
                                                className={`relative flex flex-col justify-end w-22 h-22 sm:w-24 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex-shrink-0 overflow-hidden group select-none ${isSelected
                                                    ? 'bg-lime-400/5 border-lime-400/30 shadow-[0_4px_16px_rgba(163,230,71,0.06)]'
                                                    : 'bg-zinc-950 border-zinc-200/15 dark:border-zinc-900/50 hover:border-zinc-200/30 dark:hover:border-zinc-800/60'
                                                    }`}
                                            >
                                                {/* Full image occupying the card */}
                                                <img
                                                    src={meta.imagePath}
                                                    alt={tc(cat)}
                                                    className={`absolute inset-0 w-full h-full object-contain p-2 pb-5 transition-transform duration-550 group-hover:scale-105 ${isSelected ? 'opacity-90 drop-shadow-[0_0_8px_rgba(163,230,71,0.35)]' : 'opacity-55 dark:opacity-65'
                                                        }`}
                                                />
                                                {/* Bottom gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-transparent z-10" />
                                                <span className={`relative z-20 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-center truncate w-full ${isSelected ? 'text-lime-400 font-extrabold' : 'text-zinc-450 dark:text-zinc-400 group-hover:text-white'
                                                    }`}>
                                                    {tc(cat)}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Equipment Filter */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-zinc-400 tracking-[0.15em] px-1">
                                    <Dumbbell size={10} className="text-lime-500" />
                                    <span>Equipamento</span>
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                                    {/* All Equipment Card */}
                                    <button
                                        type="button"
                                        onClick={() => onEquipmentChange('all')}
                                        className={`relative flex flex-col justify-end w-22 h-22 sm:w-24 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex-shrink-0 overflow-hidden group select-none ${selectedEquipment === 'all'
                                            ? 'bg-lime-400/5 border-lime-400/30 shadow-[0_4px_16px_rgba(163,230,71,0.06)]'
                                            : 'bg-zinc-950 border-zinc-200/15 dark:border-zinc-900/50 hover:border-zinc-200/30 dark:hover:border-zinc-800/60'
                                            }`}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center -translate-y-2">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${selectedEquipment === 'all'
                                                ? 'bg-lime-400/20 text-lime-400 shadow-[0_0_15px_rgba(163,230,71,0.2)]'
                                                : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                                                }`}>
                                                <Dumbbell size={20} className="opacity-80" />
                                            </div>
                                        </div>
                                        {/* Bottom gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
                                        <span className={`relative z-20 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-center truncate w-full ${selectedEquipment === 'all' ? 'text-lime-400' : 'text-zinc-400 group-hover:text-white'
                                            }`}>
                                            Todos
                                        </span>
                                    </button>

                                    {/* Equipment Cards */}
                                    {EQUIPMENT.map(eq => {
                                        const meta = EQUIPMENT_METADATA[eq];
                                        const isSelected = selectedEquipment === eq;
                                        return (
                                            <button
                                                key={eq}
                                                type="button"
                                                onClick={() => onEquipmentChange(eq)}
                                                className={`relative flex flex-col justify-end w-22 h-22 sm:w-24 sm:h-24 p-2.5 rounded-2xl border transition-all cursor-pointer flex-shrink-0 overflow-hidden group select-none ${isSelected
                                                    ? 'bg-lime-400/5 border-lime-400/30 shadow-[0_4px_16px_rgba(163,230,71,0.06)]'
                                                    : 'bg-zinc-950 border-zinc-200/15 dark:border-zinc-900/50 hover:border-zinc-200/30 dark:hover:border-zinc-800/60'
                                                    }`}
                                            >
                                                {/* Full image occupying the card */}
                                                <img
                                                    src={meta.imagePath}
                                                    alt={te(eq)}
                                                    className={`absolute inset-0 w-full h-full object-contain p-2 pb-5 transition-transform duration-550 group-hover:scale-105 ${isSelected ? 'opacity-90 drop-shadow-[0_0_8px_rgba(163,230,71,0.35)]' : 'opacity-55 dark:opacity-65'
                                                        }`}
                                                />
                                                {/* Bottom gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-transparent z-10" />
                                                <span className={`relative z-20 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-center truncate w-full ${isSelected ? 'text-lime-400 font-extrabold' : 'text-zinc-450 dark:text-zinc-400 group-hover:text-white'
                                                    }`}>
                                                    {te(eq)}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
