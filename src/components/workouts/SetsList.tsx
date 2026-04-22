"use client";

import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Trash2, Plus, Copy, Settings2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

interface SetsListProps {
    groupIndex: number;
    exerciseIndex: number;
    control: any;
    register: any;
    isStraight: boolean;
    watch: any;
    setValue: any;
}

export function SetsList({
    groupIndex,
    exerciseIndex,
    control,
    register,
    isStraight,
    watch,
    setValue
}: SetsListProps) {
    const t = useTranslations('WorkoutForm');
    const [isDetailed, setIsDetailed] = useState(false);

    const { fields: setFields, append: appendSet, remove: removeSet, insert } = useFieldArray({
        control,
        name: `exercises.${groupIndex}.exercises.${exerciseIndex}.sets`
    });

    const sets = watch(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets`) || [];

    // Quick edit handlers
    const handleSetsCountChange = (val: number) => {
        const currentCount = setFields.length;
        const newCount = Math.max(1, val);

        if (newCount > currentCount) {
            const lastSet = setFields[currentCount - 1] || { reps: 10, restTime: 60, technique: 'normal' };
            const toAdd = newCount - currentCount;
            for (let i = 0; i < toAdd; i++) {
                appendSet({ ...lastSet, id: undefined });
            }
        } else if (newCount < currentCount) {
            const toRemove = currentCount - newCount;
            for (let i = 0; i < toRemove; i++) {
                removeSet(currentCount - 1 - i);
            }
        }
    };

    const handleRepsChange = (val: number) => {
        const next = sets.map((s: any) => ({ ...s, reps: val }));
        setValue(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets`, next);
    };

    const handleRestChange = (val: number) => {
        const next = sets.map((s: any) => ({ ...s, restTime: val }));
        setValue(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets`, next);
    };

    if (isStraight && !isDetailed) {
        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{t('quickSets')}</span>
                    <button
                        type="button"
                        onClick={() => setIsDetailed(true)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-lime-500 hover:border-lime-500/30 transition-all text-[9px] font-black uppercase tracking-tight shadow-sm"
                    >
                        <Settings2 size={14} />
                        <span>{t('detailedView')}</span>
                    </button>
                </div>
                <div className="bg-white dark:bg-zinc-800/40 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-700/50 shadow-sm">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest ml-1">{t('sets')}</span>
                            <input
                                type="number"
                                value={setFields.length}
                                onChange={(e) => handleSetsCountChange(parseInt(e.target.value) || 1)}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-transparent focus:border-lime-500/30 rounded-xl p-2.5 text-sm font-black outline-none text-center text-zinc-800 dark:text-zinc-200 transition-all shadow-inner"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest ml-1">{t('reps')}</span>
                            <input
                                type="number"
                                value={sets[0]?.reps || 0}
                                onChange={(e) => handleRepsChange(parseInt(e.target.value) || 0)}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-transparent focus:border-lime-500/30 rounded-xl p-2.5 text-sm font-black outline-none text-center text-zinc-800 dark:text-zinc-200 transition-all shadow-inner"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest ml-1">{t('rest')}</span>
                            <input
                                type="number"
                                value={sets[0]?.restTime || 0}
                                onChange={(e) => handleRestChange(parseInt(e.target.value) || 0)}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-transparent focus:border-lime-500/30 rounded-xl p-2.5 text-sm font-black outline-none text-center text-zinc-800 dark:text-zinc-200 transition-all shadow-inner"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
