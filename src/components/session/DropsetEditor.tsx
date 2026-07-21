import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, Info, ArrowRight, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface DropsetPart {
    reps: number;
    weight: number;
}

export interface DropsetEditorProps {
    initialDropset: DropsetPart[] | null;
    defaultWeight: number;
    defaultReps: number;
    onSave: (dropset: DropsetPart[] | null) => void;
    onCancel?: () => void;
    className?: string;
}

export function DropsetEditor({
    initialDropset,
    defaultWeight,
    defaultReps,
    onSave,
    onCancel,
    className = ''
}: DropsetEditorProps) {
    const t = useTranslations('Session.dropsetModal');
    const [drops, setDrops] = useState<DropsetPart[]>([]);

    useEffect(() => {
        if (initialDropset && initialDropset.length > 0) {
            setDrops(JSON.parse(JSON.stringify(initialDropset)));
        } else {
            const firstWeight = Number(defaultWeight) > 0 ? Number(defaultWeight) : 20;
            const firstReps = Number(defaultReps) > 0 ? Number(defaultReps) : 10;
            setDrops([
                { weight: firstWeight, reps: firstReps },
                { weight: Math.max(0, Math.round((firstWeight * 0.8) * 10) / 10), reps: firstReps }
            ]);
        }
    }, [initialDropset, defaultWeight, defaultReps]);

    const handleAddDrop = () => {
        const lastDrop = drops[drops.length - 1] || { weight: defaultWeight || 20, reps: defaultReps || 10 };
        const nextWeight = Math.max(0, Math.round(lastDrop.weight * 0.8 * 2) / 2);
        const nextReps = lastDrop.reps;
        setDrops([...drops, { weight: nextWeight, reps: nextReps }]);
    };

    const handleRemoveDrop = (index: number) => {
        if (index === 0) return;
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
    };

    const handleClear = () => {
        onSave(null);
    };

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {/* Tip Banner */}
            <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-lime-400/10 border border-lime-400/20 text-lime-600 dark:text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Info size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
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
                                    ? 'bg-lime-400/10 dark:bg-zinc-900/90 border-lime-500/40 dark:border-lime-400/30 shadow-xs shadow-lime-400/5'
                                    : 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-2.5">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                        isOriginal
                                            ? 'bg-lime-400/20 text-lime-700 dark:text-lime-400 border border-lime-500/30 dark:border-lime-400/20'
                                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700/50'
                                    }`}>
                                        {isOriginal ? t('originalSet') : t('dropIndex', { index: idx })}
                                    </span>
                                </div>
                                {!isOriginal && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveDrop(idx)}
                                        aria-label={t('deleteDrop')}
                                        className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 border border-rose-500/20 transition-all flex items-center justify-center active:scale-90 cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Weight control */}
                                <div className="bg-white dark:bg-zinc-950/60 rounded-2xl p-2.5 border border-zinc-200 dark:border-zinc-800/50 flex items-center justify-between gap-2 shadow-xs">
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-wider">
                                            {t('weightShort')} <span className="text-zinc-400 dark:text-zinc-600 font-normal">(kg)</span>
                                        </span>
                                        <input
                                            type="number"
                                            step="any"
                                            inputMode="decimal"
                                            value={drop.weight}
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) => handleUpdateDrop(idx, 'weight', parseFloat(e.target.value))}
                                            className="bg-transparent border-none p-0 text-lg font-black outline-none w-full text-zinc-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateDrop(idx, 'weight', Math.max(0, drop.weight - 1))}
                                            className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-200 rounded-xl flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateDrop(idx, 'weight', drop.weight + 1)}
                                            className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-200 rounded-xl flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Reps control */}
                                <div className="bg-white dark:bg-zinc-950/60 rounded-2xl p-2.5 border border-zinc-200 dark:border-zinc-800/50 flex items-center justify-between gap-2 shadow-xs">
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
                                            className="bg-transparent border-none p-0 text-lg font-black outline-none w-full text-zinc-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateDrop(idx, 'reps', Math.max(1, drop.reps - 1))}
                                            className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-200 rounded-xl flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleUpdateDrop(idx, 'reps', drop.reps + 1)}
                                            className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-200 rounded-xl flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                                        >
                                            <Plus size={14} />
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
                    className="w-full py-3 bg-zinc-50 hover:bg-lime-400/10 dark:bg-zinc-900/50 dark:hover:bg-lime-400/10 border border-dashed border-zinc-300 dark:border-zinc-800 hover:border-lime-500/40 dark:hover:border-lime-400/40 text-zinc-600 dark:text-zinc-300 hover:text-lime-600 dark:hover:text-lime-400 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.99] group cursor-pointer"
                >
                    <Plus size={16} className="text-zinc-400 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors" />
                    {t('addDrop')}
                </button>
            </div>

            {/* Visual Summary Progression */}
            <div className="bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 p-3 rounded-2xl flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">
                    {t('summaryText', { count: drops.length })}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                    {drops.map((d, i) => (
                        <React.Fragment key={i}>
                            <span className={`px-2.5 py-1 rounded-xl text-xs font-black tracking-tight ${
                                i === 0
                                    ? 'bg-lime-400/20 text-lime-700 dark:text-lime-300 border border-lime-500/30 dark:border-lime-400/30'
                                    : 'bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-zinc-300/60 dark:border-zinc-700/40'
                            }`}>
                                {d.weight}kg <span className="text-zinc-500 font-medium">×</span> {d.reps}
                            </span>
                            {i < drops.length - 1 && (
                                <ArrowRight size={12} className="text-zinc-400 dark:text-zinc-600 shrink-0" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-zinc-200 dark:border-zinc-800/60">
                <button
                    type="button"
                    onClick={handleClear}
                    className="py-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                >
                    <Trash2 size={14} />
                    <span>{t('clear')}</span>
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    className="py-3 bg-lime-400 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider hover:bg-lime-300 hover:shadow-md hover:shadow-lime-400/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                >
                    <Check size={14} />
                    <span>{t('confirm')}</span>
                </button>
            </div>
        </div>
    );
}

export default DropsetEditor;
