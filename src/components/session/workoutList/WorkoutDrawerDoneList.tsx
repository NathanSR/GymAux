import React, { useState } from "react";
import { History, RefreshCw, CheckCircle2, Zap, Trash2, Plus, SlidersHorizontal } from "lucide-react";
import { ExecutedGroup, ExecutedSet } from '@/config/types';
import { numberInputUtils } from "@/utils/numberUtil";
import { useTranslations } from "next-intl";
import { LocalizedExerciseName } from "@/components/ui/LocalizedExerciseName";
import { DropsetModal, DropsetPart } from "@/components/session/DropsetModal";

interface WorkoutDrawerDoneListProps {
    doneGroups: ExecutedGroup[];
    hasDoneExercises: boolean;
    t: any;
    te: any;
    handleUpdateHistorySet: (groupIdx: number, exIdx: number, setIdx: number, field: string, value: string | number) => void;
    handleUpdateHistorySetDrop: (groupIdx: number, exIdx: number, setIdx: number, dropIdx: number, field: 'weight' | 'reps', value: number) => void;
    handleUpdateHistorySetDropset: (groupIdx: number, exIdx: number, setIdx: number, dropset: DropsetPart[] | null) => void;
    handleAddHistoryDrop: (groupIdx: number, exIdx: number, setIdx: number) => void;
    handleRemoveHistoryDrop: (groupIdx: number, exIdx: number, setIdx: number, dropIdx: number) => void;
}

export const WorkoutDrawerDoneList = ({
    doneGroups,
    hasDoneExercises,
    t,
    handleUpdateHistorySet,
    handleUpdateHistorySetDrop,
    handleUpdateHistorySetDropset,
    handleAddHistoryDrop,
    handleRemoveHistoryDrop
}: WorkoutDrawerDoneListProps) => {
    const tw = useTranslations('WorkoutForm');

    const [modalTarget, setModalTarget] = useState<{
        groupIdx: number;
        exIdx: number;
        setIdx: number;
        set: ExecutedSet;
    } | null>(null);

    const handleOpenDropsetModal = (groupIdx: number, exIdx: number, setIdx: number, set: ExecutedSet) => {
        setModalTarget({ groupIdx, exIdx, setIdx, set });
    };

    const handleSaveDropsetModal = (dropset: DropsetPart[] | null) => {
        if (!modalTarget) return;
        handleUpdateHistorySetDropset(
            modalTarget.groupIdx,
            modalTarget.exIdx,
            modalTarget.setIdx,
            dropset
        );
        setModalTarget(null);
    };

    return (
        <div className="space-y-4">
            {!hasDoneExercises ? (
                <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px]">
                    <History size={32} className="mx-auto mb-3 text-zinc-400 dark:text-zinc-700" />
                    <p className="text-zinc-500 dark:text-zinc-500 font-black uppercase text-[10px] tracking-widest italic">
                        {t('empty')}
                    </p>
                </div>
            ) : (
                doneGroups.map((group, groupIdx) => {
                    if (!group || !group.exercises || group.exercises.length === 0) return null;
                    return (
                        <div key={groupIdx} className="space-y-3">
                            {group.groupType !== 'straight' && (
                                <div className="flex items-center gap-2 px-2">
                                    <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest bg-indigo-500/10 dark:bg-indigo-400/10 px-2.5 py-1 rounded-full">
                                        <RefreshCw size={9} />
                                        {t(`groupTypes.${group.groupType}`)}
                                    </span>
                                </div>
                            )}

                            {group.exercises.map((ex, exIdx) => {
                                const currentVar = ex.variation || 'none';
                                const currentMode = ex.executionMode || 'bilateral';
                                const parts = [];
                                if (currentVar !== 'none') {
                                    const isPredefined = ['none', 'barbell', 'dumbbell', 'cable', 'machine', 'smith'].includes(currentVar);
                                    parts.push(isPredefined ? tw(`variationOptions.${currentVar}`) : currentVar);
                                }
                                if (currentMode !== 'bilateral') {
                                    parts.push(tw(`executionModes.${currentMode}`));
                                }
                                const suffix = parts.length > 0 ? ` (${parts.join(' • ')})` : null;

                                return (
                                    <div key={exIdx} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 rounded-[32px] overflow-hidden shadow-xs">
                                        <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/50">
                                            <div className="flex items-center gap-3 min-w-0 pr-2">
                                                <div className="w-8 h-8 rounded-xl bg-lime-400 flex items-center justify-center text-zinc-950 shadow-lg shadow-lime-400/10 shrink-0">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                                <h4 className="font-black uppercase italic text-sm text-zinc-900 dark:text-white tracking-tight truncate">
                                                    <LocalizedExerciseName
                                                        exerciseId={ex.exerciseId}
                                                        fallbackName={ex.exerciseName}
                                                        suffix={suffix}
                                                    />
                                                </h4>
                                            </div>
                                            <span className="text-xs font-black text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-950 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 shrink-0">
                                                {ex.sets.length} {t('sets')}
                                            </span>
                                        </div>

                                        <div className="p-4 space-y-3">
                                            {ex.sets.map((set, setIdx) => {
                                                const hasDropset = Boolean(set.dropset && set.dropset.length > 0);

                                                return (
                                                    <div
                                                        key={setIdx}
                                                        className={`rounded-2xl border transition-all ${
                                                            hasDropset
                                                                ? 'bg-lime-400/[0.04] dark:bg-zinc-950/60 border-lime-500/30 dark:border-lime-400/25 p-3.5 space-y-3'
                                                                : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800/30 p-2.5 space-y-2'
                                                        }`}
                                                    >
                                                        {hasDropset ? (
                                                            /* ============================================================ */
                                                            /* DROIPSET SET VIEW (Dedicated Drop Sequence & Controls)      */
                                                            /* ============================================================ */
                                                            <div className="space-y-3">
                                                                {/* Set Header Bar with Badge, RPE & Actions */}
                                                                <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-lime-500/20 dark:border-lime-400/10">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex flex-col items-center justify-center min-w-[32px] h-8 bg-white dark:bg-zinc-900 rounded-lg border border-lime-500/30 dark:border-lime-400/20 px-1.5 shadow-2xs">
                                                                            <span className="text-[8px] font-black text-zinc-500 leading-none uppercase">{t('set')}</span>
                                                                            <span className="text-xs font-black text-lime-600 dark:text-lime-400 leading-none mt-0.5">{setIdx + 1}</span>
                                                                        </div>
                                                                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-lime-700 dark:text-lime-400 bg-lime-400/15 dark:bg-lime-400/10 px-2 py-0.5 rounded-md border border-lime-500/30 dark:border-lime-400/20">
                                                                            <Zap size={10} className="fill-current text-lime-500 shrink-0" />
                                                                            {t('dropsetBadge', { count: set.dropset?.length || 0 })}
                                                                        </span>
                                                                    </div>

                                                                    {/* RPE & Action buttons */}
                                                                    <div className="flex items-center gap-2">
                                                                        {/* RPE Mini Input */}
                                                                        <div className="relative flex items-center">
                                                                            <label className="text-[8.5px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-tight mr-1.5">
                                                                                {t('rpe')}
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                min={0}
                                                                                max={10}
                                                                                value={numberInputUtils.formatValue(set.rpe)}
                                                                                onFocus={numberInputUtils.onFocus}
                                                                                onChange={(e) => numberInputUtils.onChange(e, (val) => handleUpdateHistorySet(groupIdx, exIdx, setIdx, 'rpe', val))}
                                                                                className="w-11 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 px-1 text-xs font-black text-center text-lime-600 dark:text-lime-400 outline-none focus:border-lime-500"
                                                                            />
                                                                        </div>

                                                                        {/* Edit in Modal Button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleOpenDropsetModal(groupIdx, exIdx, setIdx, set)}
                                                                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[9px] font-black uppercase text-zinc-700 dark:text-zinc-300 hover:text-lime-600 dark:hover:text-lime-400 hover:border-lime-500/40 transition-all cursor-pointer shadow-2xs active:scale-95"
                                                                            title={t('editDropset')}
                                                                        >
                                                                            <SlidersHorizontal size={11} className="text-lime-500" />
                                                                            <span>{t('editDropset')}</span>
                                                                        </button>

                                                                        {/* Remove Dropset Button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleUpdateHistorySetDropset(groupIdx, exIdx, setIdx, null)}
                                                                            className="p-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-rose-500 hover:border-rose-500/30 transition-all cursor-pointer active:scale-90"
                                                                            title={t('removeDropset')}
                                                                        >
                                                                            <Trash2 size={13} />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* Drops List with Direct Inputs */}
                                                                <div className="space-y-2">
                                                                    {set.dropset?.map((drop, dIdx) => {
                                                                        const isFirst = dIdx === 0;
                                                                        return (
                                                                            <div
                                                                                key={dIdx}
                                                                                className="flex items-center gap-2 bg-white dark:bg-zinc-900/80 p-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs"
                                                                            >
                                                                                {/* Drop Indicator */}
                                                                                <div className="flex items-center gap-1 min-w-[58px] shrink-0">
                                                                                    <span className={`text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                                                                                        isFirst
                                                                                            ? 'bg-lime-400/20 text-lime-700 dark:text-lime-400 border border-lime-500/30'
                                                                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/50'
                                                                                    }`}>
                                                                                        {isFirst ? t('initialDrop') : t('dropLabel', { index: dIdx })}
                                                                                    </span>
                                                                                </div>

                                                                                {/* Weight Input */}
                                                                                <div className="flex-1 min-w-0 relative">
                                                                                    <label className="absolute -top-1.5 left-2 px-1 bg-white dark:bg-zinc-900 text-[8px] font-black text-zinc-500 uppercase tracking-tighter z-1">
                                                                                        {t('weight')} (kg)
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        step="any"
                                                                                        min={0}
                                                                                        value={numberInputUtils.formatValue(drop.weight)}
                                                                                        onFocus={numberInputUtils.onFocus}
                                                                                        onChange={(e) => numberInputUtils.onChange(e, (val) => handleUpdateHistorySetDrop(groupIdx, exIdx, setIdx, dIdx, 'weight', Number(val) || 0))}
                                                                                        className="w-full bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1.5 px-2 text-xs font-black outline-none text-zinc-900 dark:text-zinc-100 focus:border-lime-500 text-center"
                                                                                    />
                                                                                </div>

                                                                                {/* Reps Input */}
                                                                                <div className="flex-1 min-w-0 relative">
                                                                                    <label className="absolute -top-1.5 left-2 px-1 bg-white dark:bg-zinc-900 text-[8px] font-black text-zinc-500 uppercase tracking-tighter z-1">
                                                                                        {t('reps')}
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        min={1}
                                                                                        value={numberInputUtils.formatValue(drop.reps)}
                                                                                        onFocus={numberInputUtils.onFocus}
                                                                                        onChange={(e) => numberInputUtils.onChange(e, (val) => handleUpdateHistorySetDrop(groupIdx, exIdx, setIdx, dIdx, 'reps', Number(val) || 1))}
                                                                                        className="w-full bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1.5 px-2 text-xs font-black outline-none text-zinc-900 dark:text-zinc-100 focus:border-lime-500 text-center"
                                                                                    />
                                                                                </div>

                                                                                {/* Delete Drop Button (for drops > 0 if length > 2) */}
                                                                                {!isFirst && (set.dropset?.length || 0) > 2 && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleRemoveHistoryDrop(groupIdx, exIdx, setIdx, dIdx)}
                                                                                        className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                                                                                        title="Remover drop"
                                                                                    >
                                                                                        <Trash2 size={12} />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>

                                                                {/* Add Drop Quick Button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleAddHistoryDrop(groupIdx, exIdx, setIdx)}
                                                                    className="w-full py-2 bg-white hover:bg-lime-400/10 dark:bg-zinc-900/80 dark:hover:bg-lime-400/10 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-lime-500/40 text-zinc-600 dark:text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 rounded-xl flex items-center justify-center gap-1.5 text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer active:scale-[0.99]"
                                                                >
                                                                    <Plus size={12} className="text-lime-500" />
                                                                    <span>{t('addDrop')}</span>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            /* ============================================================ */
                                                            /* STANDARD SET VIEW (Weight, Reps, RPE + Convert to Dropset)  */
                                                            /* ============================================================ */
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex flex-col items-center justify-center min-w-[32px] h-10 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
                                                                        <span className="text-[10px] font-black text-zinc-500 leading-none">{t('set')}</span>
                                                                        <span className="text-xs font-black text-lime-600 dark:text-lime-400 leading-none mt-0.5">{setIdx + 1}</span>
                                                                    </div>

                                                                    <div className="grid grid-cols-3 gap-2 flex-1">
                                                                        {['weight', 'reps', 'rpe'].map((field) => (
                                                                            <div key={field} className="relative group">
                                                                                <label className="absolute -top-1.5 left-2 px-1 bg-zinc-50 dark:bg-zinc-950 text-[9px] font-black text-zinc-500 uppercase tracking-tighter z-1">
                                                                                    {t(field)}
                                                                                </label>
                                                                                <input
                                                                                    type="number"
                                                                                    min={0}
                                                                                    max={field === "rpe" ? 10 : undefined}
                                                                                    value={numberInputUtils.formatValue((set as any)[field])}
                                                                                    onFocus={numberInputUtils.onFocus}
                                                                                    onChange={(e) => numberInputUtils.onChange(e, (val) => handleUpdateHistorySet(groupIdx, exIdx, setIdx, field, val))}
                                                                                    className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-2 text-xs font-bold outline-none text-zinc-900 dark:text-zinc-200 focus:border-lime-500/50 dark:focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/20 transition-all text-center"
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Convert to Dropset subtle button */}
                                                                <div className="flex justify-end pt-0.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleAddHistoryDrop(groupIdx, exIdx, setIdx)}
                                                                        className="flex items-center gap-1 text-[8.5px] font-black uppercase tracking-wider text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 px-2 py-1 rounded-md hover:bg-lime-400/10 transition-all cursor-pointer"
                                                                    >
                                                                        <Zap size={10} className="text-lime-500" />
                                                                        <span>{t('convertToDropset')}</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })
            )}

            {/* Modal for In-depth Dropset Configuration */}
            {modalTarget && (
                <DropsetModal
                    isOpen={Boolean(modalTarget)}
                    onClose={() => setModalTarget(null)}
                    onSave={handleSaveDropsetModal}
                    initialDropset={modalTarget.set.dropset || null}
                    defaultWeight={Number(modalTarget.set.weight) || 20}
                    defaultReps={Number(modalTarget.set.reps) || 10}
                    zIndex="z-[250]"
                />
            )}
        </div>
    );
};

