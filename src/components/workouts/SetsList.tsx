"use client";

import { useState, memo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Trash2, Plus, Settings2, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { numberInputUtils } from '../../utils/numberUtil';

interface SetsListProps {
    groupIndex: number;
    exerciseIndex: number;
    isStraight: boolean;
}

export const SetsList = memo(({
    groupIndex,
    exerciseIndex,
    isStraight
}: SetsListProps) => {
    const { control, setValue } = useFormContext();
    const t = useTranslations('WorkoutForm');
    const [isDetailed, setIsDetailed] = useState(false);

    const { fields: setFields, append: appendSet, remove: removeSet } = useFieldArray({
        control,
        name: `exercises.${groupIndex}.exercises.${exerciseIndex}.sets`
    });

    const sets = useWatch({
        control,
        name: `exercises.${groupIndex}.exercises.${exerciseIndex}.sets`
    }) || [];

    const handleSetsCountChange = (val: number) => {
        const currentCount = setFields.length;
        const newCount = val;

        if (newCount > currentCount) {
            const lastSet = sets[currentCount - 1] || { reps: 10, weight: 0, restTime: 60, technique: 'normal' };
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

    const handleWeightChange = (val: number) => {
        const next = sets.map((s: any) => ({ ...s, weight: val }));
        setValue(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets`, next);
    };

    const handleRestChange = (val: number) => {
        const next = sets.map((s: any) => ({ ...s, restTime: val }));
        setValue(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets`, next);
    };

    if (!isStraight) {
        return null;
    }

    if (!isDetailed) {
        return (
            <div className="space-y-1.5 mt-1.5">
                <div className="flex items-center justify-between px-0.5">
                    <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{t('quickSets')}</span>
                    <button
                        type="button"
                        onClick={() => setIsDetailed(true)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 hover:text-lime-500 hover:border-lime-500/40 transition-all text-[9px] font-black uppercase tracking-tight shadow-2xs cursor-pointer"
                    >
                        <Settings2 size={12} />
                        <span>{t('detailedView')}</span>
                    </button>
                </div>
                <div className="bg-zinc-50/80 dark:bg-zinc-950/60 p-2 sm:p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80">
                    <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-[7.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center">{t('sets')}</span>
                            <input
                                type="number"
                                onFocus={numberInputUtils.onFocus}
                                value={setFields.length === 0 ? "" : numberInputUtils.formatValue(setFields.length)}
                                onChange={(e) => numberInputUtils.onChange(e, (val) => handleSetsCountChange(val === "" ? 0 : val))}
                                onBlur={() => {
                                    if (setFields.length < 1) {
                                        handleSetsCountChange(1);
                                    }
                                }}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1.5 text-xs font-black outline-none text-center text-zinc-900 dark:text-zinc-100 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[7.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center">{t('reps')}</span>
                            <input
                                type="number"
                                onFocus={numberInputUtils.onFocus}
                                value={numberInputUtils.formatValue(sets[0]?.reps)}
                                onChange={(e) => numberInputUtils.onChange(e, (val) => handleRepsChange(val as number))}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1.5 text-xs font-black outline-none text-center text-zinc-900 dark:text-zinc-100 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[7.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center">{t('weight')}</span>
                            <input
                                type="number"
                                step="any"
                                onFocus={numberInputUtils.onFocus}
                                value={numberInputUtils.formatValue(sets[0]?.weight)}
                                onChange={(e) => numberInputUtils.onChange(e, (val) => handleWeightChange(val as number))}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1.5 text-xs font-black outline-none text-center text-lime-600 dark:text-lime-400 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[7.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center">{t('rest')}</span>
                            <input
                                type="number"
                                onFocus={numberInputUtils.onFocus}
                                value={numberInputUtils.formatValue(sets[0]?.restTime)}
                                onChange={(e) => numberInputUtils.onChange(e, (val) => handleRestChange(val as number))}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1.5 text-xs font-black outline-none text-center text-zinc-900 dark:text-zinc-100 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-1.5 mt-1.5">
            <div className="flex items-center justify-between px-0.5">
                <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{t('detailedView')}</span>
                {isStraight && (
                    <button
                        type="button"
                        onClick={() => setIsDetailed(false)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 hover:text-lime-500 hover:border-lime-500/40 transition-all text-[9px] font-black uppercase tracking-tight shadow-2xs cursor-pointer"
                    >
                        <SlidersHorizontal size={12} />
                        <span>{t('simplifiedView')}</span>
                    </button>
                )}
            </div>
            <div className="bg-zinc-50/80 dark:bg-zinc-950/60 p-2 sm:p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 space-y-1.5">
                <div className="grid grid-cols-12 gap-1.5 text-[7.5px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-1 text-center">
                    <span className="col-span-1 text-left">#</span>
                    <span className="col-span-3">{t('reps')}</span>
                    <span className="col-span-3">{t('weight')}</span>
                    <span className="col-span-2">{t('rest')}</span>
                    <span className="col-span-2">{t('tech')}</span>
                    <span className="col-span-1"></span>
                </div>

                {setFields.map((field, sIndex) => {
                    const setObj = sets[sIndex] || {};
                    return (
                        <div key={field.id} className="grid grid-cols-12 gap-1.5 items-center">
                            <span className="col-span-1 text-[10px] font-black text-zinc-400 dark:text-zinc-500 pl-1">
                                {sIndex + 1}
                            </span>
                            <div className="col-span-3">
                                <input
                                    type="number"
                                    onFocus={numberInputUtils.onFocus}
                                    value={numberInputUtils.formatValue(setObj.reps)}
                                    onChange={(e) => numberInputUtils.onChange(e, (val) => {
                                        const newSets = [...sets];
                                        newSets[sIndex] = { ...newSets[sIndex], reps: val };
                                        setValue(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets`, newSets);
                                    })}
                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1 text-xs font-black outline-none text-center text-zinc-900 dark:text-zinc-100"
                                />
                            </div>
                            <div className="col-span-3">
                                <input
                                    type="number"
                                    step="any"
                                    onFocus={numberInputUtils.onFocus}
                                    value={numberInputUtils.formatValue(setObj.weight)}
                                    onChange={(e) => numberInputUtils.onChange(e, (val) => {
                                        const newSets = [...sets];
                                        newSets[sIndex] = { ...newSets[sIndex], weight: val };
                                        setValue(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets`, newSets);
                                    })}
                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1 text-xs font-black outline-none text-center text-lime-600 dark:text-lime-400"
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    type="number"
                                    onFocus={numberInputUtils.onFocus}
                                    value={numberInputUtils.formatValue(setObj.restTime)}
                                    onChange={(e) => numberInputUtils.onChange(e, (val) => {
                                        const newSets = [...sets];
                                        newSets[sIndex] = { ...newSets[sIndex], restTime: val };
                                        setValue(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets`, newSets);
                                    })}
                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1 text-xs font-black outline-none text-center text-zinc-900 dark:text-zinc-100"
                                />
                            </div>
                            <div className="col-span-2">
                                <select
                                    value={setObj.technique || 'normal'}
                                    onChange={(e) => {
                                        const newSets = [...sets];
                                        newSets[sIndex] = { ...newSets[sIndex], technique: e.target.value };
                                        setValue(`exercises.${groupIndex}.exercises.${exerciseIndex}.sets`, newSets);
                                    }}
                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 focus:border-lime-500 rounded-lg p-1 text-[10px] font-bold outline-none text-zinc-900 dark:text-zinc-100 text-center cursor-pointer"
                                >
                                    <option value="normal">{t('techShorthand.normal')}</option>
                                    <option value="drop_set">{t('techShorthand.drop_set')}</option>
                                    <option value="rest_pause">{t('techShorthand.rest_pause')}</option>
                                    <option value="to_failure">{t('techShorthand.to_failure')}</option>
                                </select>
                            </div>
                            <div className="col-span-1 flex justify-center">
                                <button
                                    type="button"
                                    disabled={setFields.length <= 1}
                                    onClick={() => removeSet(sIndex)}
                                    className="p-1 text-zinc-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors cursor-pointer"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    );
                })}

                <button
                    type="button"
                    onClick={() => {
                        const lastSet = sets[sets.length - 1] || { reps: 10, weight: 0, restTime: 60, technique: 'normal' };
                        appendSet({ ...lastSet, id: undefined });
                    }}
                    className="w-full py-1.5 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-lime-500 hover:border-lime-400/50 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                    <Plus size={12} />
                    <span>{t('addSet')}</span>
                </button>
            </div>
        </div>
    );
});

export default SetsList;
