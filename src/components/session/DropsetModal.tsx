import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, Info, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';

interface DropsetPart {
    reps: number;
    weight: number;
}

interface DropsetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (dropset: DropsetPart[] | null) => void;
    initialDropset: DropsetPart[] | null;
    defaultWeight: number;
    defaultReps: number;
}

export function DropsetModal({
    isOpen,
    onClose,
    onSave,
    initialDropset,
    defaultWeight,
    defaultReps
}: DropsetModalProps) {
    const t = useTranslations('Session.dropsetModal');
    const [drops, setDrops] = useState<DropsetPart[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (initialDropset && initialDropset.length > 0) {
                setDrops([...initialDropset]);
            } else {
                // Initialize with at least 1 series based on current inputs, and 1 drop as suggestion
                const firstWeight = Number(defaultWeight) || 0;
                const firstReps = Number(defaultReps) || 0;
                setDrops([
                    { weight: firstWeight, reps: firstReps },
                    { weight: Math.max(0, Math.round((firstWeight * 0.8) * 10) / 10), reps: firstReps }
                ]);
            }
        }
    }, [isOpen, initialDropset, defaultWeight, defaultReps]);

    const handleAddDrop = () => {
        const lastDrop = drops[drops.length - 1] || { weight: defaultWeight, reps: defaultReps };
        // Suggest 20% less weight, rounded to nearest 0.5kg
        const nextWeight = Math.max(0, Math.round(lastDrop.weight * 0.8 * 2) / 2);
        const nextReps = lastDrop.reps;
        setDrops([...drops, { weight: nextWeight, reps: nextReps }]);
    };

    const handleRemoveDrop = (index: number) => {
        if (index === 0) return; // Cannot remove initial set from here
        const newDrops = [...drops];
        newDrops.splice(index, 1);
        setDrops(newDrops);
    };

    const handleUpdateDrop = (index: number, field: keyof DropsetPart, value: number) => {
        const newDrops = [...drops];
        newDrops[index] = {
            ...newDrops[index],
            [field]: Math.max(0, isNaN(value) ? 0 : value)
        };
        setDrops(newDrops);
    };

    const handleConfirm = () => {
        if (drops.length <= 1) {
            onSave(null);
        } else {
            onSave(drops);
        }
        onClose();
    };

    const handleClear = () => {
        onSave(null);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('title')}
            maxWidth="max-w-md"
            className="bg-zinc-950 dark:bg-zinc-950 border-zinc-800/80 p-5 rounded-3xl"
        >
            <div className="flex flex-col gap-4 p-1">
                {/* Subtitle / Tip for beginners */}
                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-lime-400/10 border border-lime-400/20 text-lime-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Info size={18} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-zinc-300">
                            {t('subtitle')}
                        </span>
                        <span className="text-[11px] text-zinc-500 mt-1 leading-snug">
                            {t('infoTip')}
                        </span>
                    </div>
                </div>

                {/* Drops List */}
                <div className="flex flex-col gap-3 max-h-[45vh] overflow-y-auto pr-1 scrollbar-thin">
                    {drops.map((drop, idx) => {
                        const isOriginal = idx === 0;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3.5 rounded-2xl border transition-all ${
                                    isOriginal
                                        ? 'bg-zinc-900/90 border-lime-400/30 shadow-sm shadow-lime-400/5'
                                        : 'bg-zinc-900/40 border-zinc-800/60 hover:border-zinc-700'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-2.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                            isOriginal
                                                ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20'
                                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                                        }`}>
                                            {isOriginal ? t('originalSet') : t('dropIndex', { index: idx })}
                                        </span>
                                    </div>
                                    {!isOriginal && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDrop(idx)}
                                            aria-label={t('deleteDrop')}
                                            className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-all flex items-center justify-center active:scale-90"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {/* Weight control */}
                                    <div className="bg-zinc-950/60 rounded-2xl p-2.5 border border-zinc-800/50 flex items-center justify-between gap-2">
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-wider">
                                                {t('weightShort')} <span className="text-zinc-600 font-normal">(kg)</span>
                                            </span>
                                            <input
                                                type="number"
                                                step="any"
                                                inputMode="decimal"
                                                value={drop.weight}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleUpdateDrop(idx, 'weight', parseFloat(e.target.value))}
                                                className="bg-transparent border-none p-0 text-lg font-black outline-none w-full text-white"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateDrop(idx, 'weight', drop.weight - 1)}
                                                className="w-9 h-9 sm:w-10 sm:h-10 bg-zinc-800/80 hover:bg-zinc-700 hover:border-zinc-600 border border-zinc-700/50 text-zinc-200 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-sm"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateDrop(idx, 'weight', drop.weight + 1)}
                                                className="w-9 h-9 sm:w-10 sm:h-10 bg-zinc-800/80 hover:bg-zinc-700 hover:border-zinc-600 border border-zinc-700/50 text-zinc-200 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-sm"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reps control */}
                                    <div className="bg-zinc-950/60 rounded-2xl p-2.5 border border-zinc-800/50 flex items-center justify-between gap-2">
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-wider">
                                                {t('repsShort')}
                                            </span>
                                            <input
                                                type="number"
                                                inputMode="numeric"
                                                value={drop.reps}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => handleUpdateDrop(idx, 'reps', parseInt(e.target.value, 10))}
                                                className="bg-transparent border-none p-0 text-lg font-black outline-none w-full text-white"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateDrop(idx, 'reps', drop.reps - 1)}
                                                className="w-9 h-9 sm:w-10 sm:h-10 bg-zinc-800/80 hover:bg-zinc-700 hover:border-zinc-600 border border-zinc-700/50 text-zinc-200 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-sm"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateDrop(idx, 'reps', drop.reps + 1)}
                                                className="w-9 h-9 sm:w-10 sm:h-10 bg-zinc-800/80 hover:bg-zinc-700 hover:border-zinc-600 border border-zinc-700/50 text-zinc-200 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-sm"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Add Drop Button */}
                    <button
                        type="button"
                        onClick={handleAddDrop}
                        className="w-full py-3.5 bg-zinc-900/50 hover:bg-lime-400/10 border border-dashed border-zinc-800 hover:border-lime-400/40 text-zinc-300 hover:text-lime-400 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.99] group"
                    >
                        <Plus size={16} className="text-zinc-400 group-hover:text-lime-400 transition-colors" />
                        {t('addDrop')}
                    </button>
                </div>

                {/* Visual Summary Progression */}
                <div className="bg-zinc-900/80 border border-zinc-800/80 p-3.5 rounded-2xl flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                        {t('summaryText', { count: drops.length })}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {drops.map((d, i) => (
                            <React.Fragment key={i}>
                                <span className={`px-2.5 py-1 rounded-xl text-xs font-black tracking-tight ${
                                    i === 0
                                        ? 'bg-lime-400/20 text-lime-300 border border-lime-400/30'
                                        : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/40'
                                }`}>
                                    {d.weight}kg <span className="text-zinc-500 font-medium">×</span> {d.reps}
                                </span>
                                {i < drops.length - 1 && (
                                    <ArrowRight size={12} className="text-zinc-600 flex-shrink-0" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/60 mt-1">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98]"
                    >
                        {t('clear')}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="py-3.5 bg-lime-400 text-zinc-950 font-black rounded-2xl text-xs uppercase tracking-wider hover:bg-lime-300 hover:shadow-lg hover:shadow-lime-400/20 transition-all active:scale-[0.98]"
                    >
                        {t('confirm')}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
