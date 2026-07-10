import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Dumbbell, AlertCircle, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Exercise } from '@/config/types';
import { ExerciseService } from '@/services/exerciseService';

interface SessionSubstituteModalProps {
    isOpen: boolean;
    onClose: () => void;
    exerciseId: number | null;
    exerciseName: string | null;
    onSelectSubstitute: (exercise: Exercise) => void;
    onOpenFullSelector: () => void;
}

export function SessionSubstituteModal({
    isOpen,
    onClose,
    exerciseId,
    exerciseName,
    onSelectSubstitute,
    onOpenFullSelector
}: SessionSubstituteModalProps) {
    const t = useTranslations('Session');
    const te = useTranslations('Exercises');
    const tc = useTranslations('Categories');

    const [isLoading, setIsLoading] = useState(false);
    const [alternatives, setAlternatives] = useState<Exercise[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !exerciseId) return;

        const loadAlternatives = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 1. Fetch full exercise to get category and mechanics
                const fullEx = await ExerciseService.getExerciseById(exerciseId);
                if (!fullEx) {
                    throw new Error("Exercise not found");
                }

                // 2. Fetch alternative exercises
                const alts = await ExerciseService.getAlternativeExercises(fullEx);
                setAlternatives(alts);
            } catch (err: any) {
                console.error('[SessionSubstituteModal] Error loading alternatives:', err);
                setError(err.message || "Failed to load alternatives");
            } finally {
                setIsLoading(false);
            }
        };

        loadAlternatives();
    }, [isOpen, exerciseId]);

    if (!isOpen) return null;

    const getLevelBadge = (level?: string) => {
        if (!level) return null;
        const colors: Record<string, string> = {
            beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10',
            intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/10',
            advanced: 'bg-rose-500/10 text-rose-400 border-rose-500/10',
        };
        const labels: Record<string, string> = {
            beginner: 'Iniciante',
            intermediate: 'Intermediário',
            advanced: 'Avançado',
        };
        return (
            <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-lg border ${colors[level] || ''}`}>
                {labels[level] || level}
            </span>
        );
    };

    const getEquipmentBadge = (equipment?: string) => {
        if (!equipment || equipment === 'none') return null;
        const labels: Record<string, string> = {
            barbell: 'Barra',
            dumbbell: 'Halter',
            machine: 'Máquina',
            cable: 'Cabo',
            bodyweight: 'Peso Corporal',
            smith: 'Smith',
            kettlebell: 'Kettlebell',
        };
        return (
            <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                {labels[equipment] || equipment}
            </span>
        );
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-end justify-center">
                {/* Backdrop Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/75 backdrop-blur-sm"
                />

                {/* Bottom Drawer Card */}
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 220 }}
                    className="relative w-full max-w-md bg-zinc-900 border-t border-zinc-800 rounded-t-[32px] p-6 shadow-2xl z-10 flex flex-col focus:outline-none max-h-[85vh] overflow-hidden"
                >
                    {/* Drawer Handle */}
                    <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-5 flex-shrink-0" />

                    {/* Header */}
                    <div className="flex justify-between items-center mb-5 flex-shrink-0">
                        <div>
                            <h3 className="text-base font-black uppercase italic tracking-tighter text-white">
                                Substituir Exercício
                            </h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                                Substituto para: <span className="text-lime-400">{exerciseName}</span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto min-h-[250px] max-h-[50vh] pr-1 -mr-2 space-y-4">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                                <Loader2 size={32} className="animate-spin text-lime-500 mb-3 opacity-60" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">Buscando alternativas...</span>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                                <AlertCircle size={32} className="text-rose-500 mb-3" />
                                <p className="text-xs font-black uppercase tracking-wider text-rose-400">{error}</p>
                            </div>
                        ) : alternatives.length > 0 ? (
                            <div className="space-y-2">
                                <span className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.25em] block mb-3 ml-1">
                                    Substitutos Recomendados (Mesmo Músculo)
                                </span>
                                {alternatives.map((alt) => (
                                    <button
                                        key={alt.id}
                                        onClick={() => {
                                            onSelectSubstitute(alt);
                                            onClose();
                                        }}
                                        className="w-full flex items-center gap-3 p-3.5 rounded-[20px] bg-zinc-950/40 hover:bg-zinc-950 border border-zinc-850 hover:border-lime-500/25 active:scale-[0.98] transition-all text-left group cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-lime-400 group-hover:text-zinc-950 transition-all shadow-inner">
                                            <Dumbbell size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-white uppercase text-[11px] leading-tight tracking-tight truncate">
                                                {te.has(alt.name) ? te(alt.name) : alt.name}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                                <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">
                                                    {tc(alt.category)}
                                                </span>
                                                {getEquipmentBadge(alt.equipment)}
                                                {getLevelBadge(alt.level)}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                                <AlertCircle size={32} className="text-zinc-500 mb-3" />
                                <h4 className="text-xs font-black uppercase text-white mb-1">Nenhuma sugestão encontrada</h4>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide leading-relaxed">
                                    Não encontramos nenhum exercício composto na mesma categoria para substituição automática.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Bottom Action - Search Full Catalog */}
                    <div className="border-t border-zinc-800/60 pt-4 mt-4 flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => {
                                onOpenFullSelector();
                                onClose();
                            }}
                            className="w-full py-4 px-4 bg-zinc-950 hover:bg-zinc-800 text-lime-400 rounded-2xl flex items-center justify-center gap-2.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] border border-zinc-850 hover:border-lime-500/25 cursor-pointer shadow-inner"
                        >
                            <Search size={14} className="text-lime-400" />
                            Buscar no Catálogo Completo
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
