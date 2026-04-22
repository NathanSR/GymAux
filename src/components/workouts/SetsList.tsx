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

    return (
        <div className="space-y-1.5">
            <div className="flex flex-col-reverse gap-2 items-end justify-between px-1 mb-2">
                <div className="grid grid-cols-12 gap-1 flex-1 text-[8px] font-black tracking-[0.1em] uppercase text-zinc-400">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-3 text-center">{t('reps')}</div>
                    {isStraight && <div className="col-span-3 text-center">{t('rest')}</div>}
                    <div className={`${isStraight ? 'col-span-4' : 'col-span-7'} text-center`}>{t('tech')}</div>
                    <div className="col-span-1"></div>
                </div>
                {isStraight && (
                    <button
                        type="button"
                        onClick={() => setIsDetailed(false)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 hover:bg-lime-500/20 transition-all text-[8px] font-black uppercase tracking-widest border border-lime-500/20"
                    >
                        <Settings2 size={12} className="shrink-0" />
                        <span>{t('simplifiedView')}</span>
                    </button>
                )}
            </div>

            <AnimatePresence initial={false}>
                {setFields.map((setField: any, setIndex: number) => (
                    <motion.div
                        key={setField.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-12 gap-1 items-center bg-white dark:bg-zinc-800/40 p-1.5 rounded-xl group/set"
                    >
                        <div className="col-span-1 text-center font-bold text-[10px] text-zinc-400">{setIndex + 1}</div>
                        <div className="col-span-3">
                            <input type="number" {...register(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets.${setIndex}.reps`)} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-transparent focus:border-lime-500/30 rounded-lg p-1.5 text-xs font-bold font-mono outline-none text-center text-zinc-800 dark:text-zinc-200" />
                        </div>
                        {isStraight ? (
                            <div className="col-span-3">
                                <input type="number" {...register(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets.${setIndex}.restTime`)} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-transparent focus:border-lime-500/30 rounded-lg p-1.5 text-xs font-bold font-mono outline-none text-center text-zinc-800 dark:text-zinc-200" />
                            </div>
                        ) : null}
                        <div className={isStraight ? 'col-span-4' : 'col-span-7'}>
                            <select {...register(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets.${setIndex}.technique`)} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-transparent focus:border-lime-500/30 rounded-lg p-1.5 text-[10px] font-black uppercase outline-none cursor-pointer appearance-none text-center text-zinc-800 dark:text-zinc-200">
                                <option className='bg-background text-foreground' value="normal">{t('techShorthand.normal')}</option>
                                <option className='bg-background text-foreground' value="drop_set">{t('techShorthand.drop_set')}</option>
                                <option className='bg-background text-foreground' value="rest_pause">{t('techShorthand.rest_pause')}</option>
                                <option className='bg-background text-foreground' value="to_failure">{t('techShorthand.to_failure')}</option>
                            </select>
                        </div>
                        <div className="col-span-1 flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover/set:opacity-100 transition-opacity">
                            <button type="button" onClick={() => removeSet(setIndex)} className="text-red-400 hover:text-red-500 transition-colors p-1"><Trash2 size={12} /></button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {isStraight && (
                <div className="flex gap-2 mt-2">
                    <button
                        type="button"
                        // @ts-ignore
                        onClick={() => appendSet({ reps: setFields[setFields.length - 1]?.reps || 10, restTime: setFields[setFields.length - 1]?.restTime || 60, technique: 'normal' })}
                        className="flex-1 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 hover:text-lime-500 text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
                    >
                        <Plus size={12} /> {t('addSet')}
                    </button>
                    {setFields.length > 0 && (
                        <button
                            type="button"
                            onClick={() => insert(setFields.length, { ...setFields[setFields.length - 1], id: undefined })}
                            className="px-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 hover:text-lime-500 transition-colors"
                            title={t('copySet')}
                        >
                            <Copy size={12} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
