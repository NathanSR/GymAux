'use client';

import { useState, useEffect } from 'react';
import { CATEGORIES, EQUIPMENT, CATEGORY_METADATA, EQUIPMENT_METADATA } from '@/config/constants';
import { ExerciseCategory, ExerciseEquipment } from '@/config/types';
import { taxonomyService } from '@/services/taxonomyService';
import { useTranslations, useLocale } from 'next-intl';
import { SlidersHorizontal, RotateCcw, Dumbbell, Target, Check, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface ExerciseFilterPanelProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    selectedEquipment: string;
    onEquipmentChange: (equipment: string) => void;
    className?: string;
    zIndex?: string | number;
}

export function ExerciseFilterPanel({
    selectedCategory,
    onCategoryChange,
    selectedEquipment,
    onEquipmentChange,
    className = "",
    zIndex = "z-[250]"
}: ExerciseFilterPanelProps) {
    const locale = useLocale();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const tc = useTranslations('Categories');
    const te = useTranslations('Equipment');

    const [categoriesList, setCategoriesList] = useState<ExerciseCategory[]>([]);
    const [equipmentList, setEquipmentList] = useState<ExerciseEquipment[]>([]);

    useEffect(() => {
        let isMounted = true;
        async function loadTaxonomy() {
            try {
                const [cats, eqs] = await Promise.all([
                    taxonomyService.getCategories(locale),
                    taxonomyService.getEquipment(locale)
                ]);
                if (isMounted) {
                    setCategoriesList(cats);
                    setEquipmentList(eqs);
                }
            } catch (err) {
                console.error('[ExerciseFilterPanel] Error loading taxonomy:', err);
            }
        }
        loadTaxonomy();
        return () => { isMounted = false; };
    }, [locale]);

    const activeCategoryItem = categoriesList.find(c => c.slug === selectedCategory);
    const activeEquipmentItem = equipmentList.find(e => e.slug === selectedEquipment);

    const activeCategoryLabel = activeCategoryItem
        ? taxonomyService.getCategoryLocalizedName(activeCategoryItem, locale)
        : (tc.has(selectedCategory) ? tc(selectedCategory) : selectedCategory);

    const activeEquipmentLabel = activeEquipmentItem
        ? taxonomyService.getEquipmentLocalizedName(activeEquipmentItem, locale)
        : (te.has(selectedEquipment) ? te(selectedEquipment) : selectedEquipment);

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
            {/* Filter Toggle and Active Chips Bar */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${hasActiveFilters
                        ? 'bg-lime-400 text-zinc-950 border-lime-400 shadow-md shadow-lime-500/10 hover:bg-lime-500'
                        : 'bg-zinc-100 dark:bg-zinc-900/60 border-zinc-200/50 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                >
                    <SlidersHorizontal size={14} />
                    <span>Filtros</span>
                    {activeFiltersCount > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-950 text-lime-400 text-[10px] font-black leading-none">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>

                {/* Active Category Chip */}
                {selectedCategory !== 'all' && (
                    <div className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-xl bg-lime-400/10 dark:bg-lime-400/15 border border-lime-400/30 text-lime-600 dark:text-lime-400 text-[11px] font-bold">
                        <Target size={12} />
                        <span>{activeCategoryLabel}</span>
                        <button
                            type="button"
                            onClick={() => onCategoryChange('all')}
                            className="p-1 hover:bg-lime-400/20 rounded-md transition-colors cursor-pointer"
                            aria-label="Remover filtro de grupo muscular"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}

                {/* Active Equipment Chip */}
                {selectedEquipment !== 'all' && (
                    <div className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-xl bg-lime-400/10 dark:bg-lime-400/15 border border-lime-400/30 text-lime-600 dark:text-lime-400 text-[11px] font-bold">
                        <Dumbbell size={12} />
                        <span>{activeEquipmentLabel}</span>
                        <button
                            type="button"
                            onClick={() => onEquipmentChange('all')}
                            className="p-1 hover:bg-lime-400/20 rounded-md transition-colors cursor-pointer"
                            aria-label="Remover filtro de equipamento"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}

                {/* Clear All Button */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={handleClearAll}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-rose-500 transition-colors active:scale-95 cursor-pointer ml-auto"
                    >
                        <RotateCcw size={12} />
                        <span>Limpar</span>
                    </button>
                )}
            </div>

            {/* Filter Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Filtros de Exercício"
                maxWidth="max-w-2xl"
                zIndex={zIndex}
                className="!rounded-[36px]"
            >
                <div className="flex flex-col h-full max-h-[80vh]">
                    <div className="p-5 sm:p-6 space-y-7 overflow-y-auto flex-1">
                        {/* Category Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-900 dark:text-zinc-100 tracking-wider">
                                    <Target size={14} className="text-lime-500" />
                                    <span>Grupo Muscular</span>
                                </div>
                                {selectedCategory !== 'all' && (
                                    <button
                                        type="button"
                                        onClick={() => onCategoryChange('all')}
                                        className="text-[10px] font-bold text-lime-500 hover:underline uppercase tracking-wider cursor-pointer"
                                    >
                                        Limpar Seleção
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {/* All Categories Card */}
                                <button
                                    type="button"
                                    onClick={() => onCategoryChange('all')}
                                    className={`relative flex flex-col justify-between h-28 sm:h-32 p-3 rounded-2xl border transition-all cursor-pointer overflow-hidden group select-none ${selectedCategory === 'all'
                                        ? 'bg-lime-400/10 border-lime-400 shadow-[0_0_20px_rgba(163,230,71,0.15)] ring-2 ring-lime-400/40'
                                        : 'bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                        }`}
                                >
                                    {selectedCategory === 'all' && (
                                        <div className="absolute top-2.5 right-2.5 z-30 w-5 h-5 rounded-full bg-lime-400 text-zinc-950 flex items-center justify-center shadow-md">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                    )}
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedCategory === 'all'
                                            ? 'bg-lime-400/20 text-lime-400 shadow-[0_0_15px_rgba(163,230,71,0.25)] scale-110'
                                            : 'bg-zinc-200/60 dark:bg-zinc-900 text-zinc-500 border border-zinc-300/40 dark:border-zinc-800'
                                            }`}>
                                            <Target size={22} />
                                        </div>
                                    </div>
                                    <span className={`relative z-20 text-[10px] sm:text-xs font-black uppercase tracking-wider text-center truncate w-full ${selectedCategory === 'all' ? 'text-lime-400' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white'
                                        }`}>
                                        Todos
                                    </span>
                                </button>

                                {/* Categories Cards */}
                                {(categoriesList.length > 0 ? categoriesList : CATEGORIES.map(c => ({ slug: c, name: c, imageUrl: CATEGORY_METADATA[c]?.imagePath }))).map(cat => {
                                    const imgPath = cat.imageUrl || (CATEGORY_METADATA as any)[cat.slug]?.imagePath || null;
                                    const label = 'translations' in cat
                                        ? taxonomyService.getCategoryLocalizedName(cat as ExerciseCategory, locale)
                                        : (tc.has(cat.slug) ? tc(cat.slug) : cat.name);
                                    const isSelected = selectedCategory === cat.slug;
                                    return (
                                        <button
                                            key={cat.slug}
                                            type="button"
                                            onClick={() => onCategoryChange(cat.slug)}
                                            className={`relative flex flex-col justify-end h-28 sm:h-32 p-3 rounded-2xl border transition-all cursor-pointer overflow-hidden group select-none ${isSelected
                                                ? 'bg-lime-400/10 border-lime-400 shadow-[0_0_20px_rgba(163,230,71,0.15)] ring-2 ring-lime-400/40'
                                                : 'bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                                }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-2.5 right-2.5 z-30 w-5 h-5 rounded-full bg-lime-400 text-zinc-950 flex items-center justify-center shadow-md">
                                                <Check size={12} strokeWidth={3} />
                                                </div>
                                            )}
                                            {/* Category Image */}
                                            {imgPath && (
                                                <img
                                                    src={imgPath}
                                                    alt={label}
                                                    className={`absolute inset-0 w-full h-full object-contain p-2 pb-7 transition-transform duration-300 group-hover:scale-105 ${isSelected ? 'opacity-100 drop-shadow-[0_0_10px_rgba(163,230,71,0.4)]' : 'opacity-70 dark:opacity-75 group-hover:opacity-100'
                                                        }`}
                                                />
                                            )}
                                            {/* Bottom gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent z-10" />
                                            <span className={`relative z-20 text-[10px] sm:text-xs font-black uppercase tracking-wider text-center truncate w-full ${isSelected ? 'text-lime-400 font-black' : 'text-zinc-200 group-hover:text-white'
                                                }`}>
                                                {label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Equipment Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-900 dark:text-zinc-100 tracking-wider">
                                    <Dumbbell size={14} className="text-lime-500" />
                                    <span>Equipamento</span>
                                </div>
                                {selectedEquipment !== 'all' && (
                                    <button
                                        type="button"
                                        onClick={() => onEquipmentChange('all')}
                                        className="text-[10px] font-bold text-lime-500 hover:underline uppercase tracking-wider cursor-pointer"
                                    >
                                        Limpar Seleção
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {/* All Equipment Card */}
                                <button
                                    type="button"
                                    onClick={() => onEquipmentChange('all')}
                                    className={`relative flex flex-col justify-between h-28 sm:h-32 p-3 rounded-2xl border transition-all cursor-pointer overflow-hidden group select-none ${selectedEquipment === 'all'
                                        ? 'bg-lime-400/10 border-lime-400 shadow-[0_0_20px_rgba(163,230,71,0.15)] ring-2 ring-lime-400/40'
                                        : 'bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                        }`}
                                >
                                    {selectedEquipment === 'all' && (
                                        <div className="absolute top-2.5 right-2.5 z-30 w-5 h-5 rounded-full bg-lime-400 text-zinc-950 flex items-center justify-center shadow-md">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                    )}
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedEquipment === 'all'
                                            ? 'bg-lime-400/20 text-lime-400 shadow-[0_0_15px_rgba(163,230,71,0.25)] scale-110'
                                            : 'bg-zinc-200/60 dark:bg-zinc-900 text-zinc-500 border border-zinc-300/40 dark:border-zinc-800'
                                            }`}>
                                            <Dumbbell size={22} />
                                        </div>
                                    </div>
                                    <span className={`relative z-20 text-[10px] sm:text-xs font-black uppercase tracking-wider text-center truncate w-full ${selectedEquipment === 'all' ? 'text-lime-400' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white'
                                        }`}>
                                        Todos
                                    </span>
                                </button>

                                {/* Equipment Cards */}
                                {(equipmentList.length > 0 ? equipmentList : EQUIPMENT.map(e => ({ slug: e, name: e, imageUrl: EQUIPMENT_METADATA[e]?.imagePath }))).map(eq => {
                                    const imgPath = eq.imageUrl || (EQUIPMENT_METADATA as any)[eq.slug]?.imagePath || null;
                                    const label = 'translations' in eq
                                        ? taxonomyService.getEquipmentLocalizedName(eq as ExerciseEquipment, locale)
                                        : (te.has(eq.slug) ? te(eq.slug) : eq.name);
                                    const isSelected = selectedEquipment === eq.slug;
                                    return (
                                        <button
                                            key={eq.slug}
                                            type="button"
                                            onClick={() => onEquipmentChange(eq.slug)}
                                            className={`relative flex flex-col justify-end h-28 sm:h-32 p-3 rounded-2xl border transition-all cursor-pointer overflow-hidden group select-none ${isSelected
                                                ? 'bg-lime-400/10 border-lime-400 shadow-[0_0_20px_rgba(163,230,71,0.15)] ring-2 ring-lime-400/40'
                                                : 'bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                                }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-2.5 right-2.5 z-30 w-5 h-5 rounded-full bg-lime-400 text-zinc-950 flex items-center justify-center shadow-md">
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                            )}
                                            {/* Equipment Image */}
                                            {imgPath && (
                                                <img
                                                    src={imgPath}
                                                    alt={label}
                                                    className={`absolute inset-0 w-full h-full object-contain p-2 pb-7 transition-transform duration-300 group-hover:scale-105 ${isSelected ? 'opacity-100 drop-shadow-[0_0_10px_rgba(163,230,71,0.4)]' : 'opacity-70 dark:opacity-75 group-hover:opacity-100'
                                                        }`}
                                                />
                                            )}
                                            {/* Bottom gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent z-10" />
                                            <span className={`relative z-20 text-[10px] sm:text-xs font-black uppercase tracking-wider text-center truncate w-full ${isSelected ? 'text-lime-400 font-black' : 'text-zinc-200 group-hover:text-white'
                                                }`}>
                                                {label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 p-4 sm:p-5 bg-white dark:bg-zinc-900 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-3 z-20">
                        {hasActiveFilters ? (
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-xs font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-900/50 transition-all cursor-pointer active:scale-95"
                            >
                                <RotateCcw size={14} />
                                <span>Limpar Tudo</span>
                            </button>
                        ) : (
                            <div />
                        )}

                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-lime-500/20 active:scale-95 transition-all cursor-pointer"
                        >
                            <span>Aplicar Filtros</span>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

