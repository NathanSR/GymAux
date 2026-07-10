import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, X, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
    const t = useTranslations('Session');
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
                    { weight: Math.max(0, Math.round(firstWeight * 0.8 * 10) / 10), reps: firstReps }
                ]);
            }
        }
    }, [isOpen, initialDropset, defaultWeight, defaultReps]);

    if (!isOpen) return null;

    const handleAddDrop = () => {
        const lastDrop = drops[drops.length - 1] || { weight: defaultWeight, reps: defaultReps };
        // Suggest 20% less weight, keep the same reps
        const nextWeight = Math.max(0, Math.round(lastDrop.weight * 0.8 * 2) / 2); // rounded to nearest 0.5kg
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
            [field]: Math.max(0, value)
        };
        setDrops(newDrops);
    };

    const handleConfirm = () => {
        if (drops.length <= 1) {
            // If only 1 drop is left, it's just a normal set
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
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.4 }}
                    className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 flex flex-col overflow-hidden max-h-[85vh]"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">
                                Configurar Dropset
                            </h3>
                            <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                Reduza as cargas consecutivamente sem intervalo.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Drops List */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 scrollbar-thin">
                        {drops.map((drop, idx) => {
                            const isOriginal = idx === 0;
                            return (
                                <div
                                    key={idx}
                                    className={`p-3 rounded-2xl border transition-all ${
                                        isOriginal
                                            ? 'bg-zinc-950/60 border-zinc-800/80'
                                            : 'bg-zinc-900 border-zinc-800/40 hover:border-zinc-800'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                                            isOriginal ? 'text-lime-400' : 'text-zinc-500'
                                        }`}>
                                            {isOriginal ? 'Série 1 (Original)' : `Drop ${idx}`}
                                        </span>
                                        {!isOriginal && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveDrop(idx)}
                                                className="text-zinc-600 hover:text-rose-500 transition-colors p-1"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Weight control */}
                                        <div className="bg-zinc-950/40 rounded-xl px-3 py-2 border border-zinc-800/30 flex items-center justify-between">
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[7px] font-black uppercase text-zinc-500 tracking-wider">Carga</span>
                                                <input
                                                    type="number"
                                                    value={drop.weight}
                                                    onChange={(e) => handleUpdateDrop(idx, 'weight', Number(e.target.value))}
                                                    className="bg-transparent border-none p-0 text-base font-black outline-none w-full text-white"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateDrop(idx, 'weight', drop.weight - 2)}
                                                    className="w-5 h-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded flex items-center justify-center active:scale-90 transition-all"
                                                >
                                                    <Minus size={10} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateDrop(idx, 'weight', drop.weight + 2)}
                                                    className="w-5 h-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded flex items-center justify-center active:scale-90 transition-all"
                                                >
                                                    <Plus size={10} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Reps control */}
                                        <div className="bg-zinc-950/40 rounded-xl px-3 py-2 border border-zinc-800/30 flex items-center justify-between">
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[7px] font-black uppercase text-zinc-500 tracking-wider">Reps</span>
                                                <input
                                                    type="number"
                                                    value={drop.reps}
                                                    onChange={(e) => handleUpdateDrop(idx, 'reps', Number(e.target.value))}
                                                    className="bg-transparent border-none p-0 text-base font-black outline-none w-full text-white"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateDrop(idx, 'reps', drop.reps - 1)}
                                                    className="w-5 h-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded flex items-center justify-center active:scale-90 transition-all"
                                                >
                                                    <Minus size={10} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateDrop(idx, 'reps', drop.reps + 1)}
                                                    className="w-5 h-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded flex items-center justify-center active:scale-90 transition-all"
                                                >
                                                    <Plus size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add Drop Button */}
                        <button
                            type="button"
                            onClick={handleAddDrop}
                            className="w-full py-3 bg-zinc-950 border border-dashed border-zinc-800 hover:border-lime-400/40 hover:bg-lime-400/5 text-zinc-400 hover:text-lime-400 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.99]"
                        >
                            <Plus size={12} />
                            Adicionar Drop
                        </button>
                    </div>

                    {/* Summary Info */}
                    <div className="my-4 bg-zinc-950/40 border border-zinc-800/40 p-3 rounded-2xl flex items-start gap-2.5">
                        <AlertCircle size={15} className="text-lime-400 flex-shrink-0 mt-0.5" />
                        <div className="text-[10px] text-zinc-400 font-bold leading-normal">
                            <span>Série totalizando <strong>{drops.length} drops</strong> com cargas de: </span>
                            <span className="text-lime-400 italic block mt-0.5">
                                {drops.map(d => `${d.weight}kg`).join(' ➔ ')}
                            </span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/50">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="py-3.5 bg-zinc-800 hover:bg-zinc-700 hover:text-white text-zinc-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            Limpar Dropset
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="py-3.5 bg-lime-400 text-zinc-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-lime-500 hover:shadow-lg hover:shadow-lime-500/10 transition-all active:scale-[0.98]"
                        >
                            Confirmar
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
