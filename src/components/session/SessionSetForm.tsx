import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { Dumbbell, Check, Plus, Minus, ArrowRight, X, SlidersHorizontal, Zap, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { numberInputUtils } from '../../utils/numberUtil';
import { RPE_EMOJIS, RPE_OPTIONS } from './SessionConstants';
import { Controller, useWatch } from 'react-hook-form';
import { RpeDial } from './RpeDial';
import { DropsetModal } from './DropsetModal';
import { SessionActionsModal } from './SessionActionsModal';
import { SlideToConfirm } from '@/components/ui/SlideToConfirm';

interface SessionSetFormProps {
    currentPlannedSet: any;
    currentGroupIndex: number;
    currentExerciseIndex: number;
    currentSetIndex: number;
    isReadOnly?: boolean;
    isGroupAlternating: boolean;
    onCompleteSet: (formData: any, skipped: boolean) => void;
    onSkipSet: () => void;
    onSkipExercise: () => void;
    onAddSet: () => void;
    onForceFinishWorkout: () => void;
    setWatchValues: (watchFn: () => { weight: number; reps: number; rpe: number; dropset?: { reps: number; weight: number }[] }) => void;
    lastWeightUsed?: number | null;
    onSubstituteExercise: () => void;
    onOpenStandaloneTimer?: () => void;
    currentRestDuration?: number;
    onUpdateRestDuration?: (seconds: number) => void;
    isActionsOpen?: boolean;
    onActionsOpenChange?: (open: boolean) => void;
}

export function SessionSetForm({
    currentPlannedSet,
    currentGroupIndex,
    currentExerciseIndex,
    currentSetIndex,
    isReadOnly = false,
    isGroupAlternating,
    onCompleteSet,
    onSkipSet,
    onSkipExercise,
    onAddSet,
    onForceFinishWorkout,
    setWatchValues,
    lastWeightUsed,
    onSubstituteExercise,
    onOpenStandaloneTimer,
    currentRestDuration,
    onUpdateRestDuration,
    isActionsOpen: controlledActionsOpen,
    onActionsOpenChange
}: SessionSetFormProps) {
    const t = useTranslations('Session');

    const [isDropsetOpen, setIsDropsetOpen] = useState(false);
    const [internalActionsOpen, setInternalActionsOpen] = useState(false);

    const isActionsOpen = controlledActionsOpen !== undefined ? controlledActionsOpen : internalActionsOpen;
    const setIsActionsOpen = (open: boolean) => {
        if (onActionsOpenChange) {
            onActionsOpenChange(open);
        } else {
            setInternalActionsOpen(open);
        }
    };
    const [dropset, setDropset] = useState<{ reps: number; weight: number }[] | null>(null);

    const { register, handleSubmit, setValue, control } = useForm({
        defaultValues: {
            weight: 0,
            reps: currentPlannedSet?.reps || 0,
            rpe: 7
        }
    });

    const weight = useWatch({ control, name: "weight" });
    const rpeValue = useWatch({ control, name: "rpe" });
    const repsValue = useWatch({ control, name: "reps" });

    useEffect(() => {
        // Prioritize last weight used for this exercise, then plan, then 0
        const initialWeight = lastWeightUsed ?? currentPlannedSet?.weight ?? 0;

        setValue("weight", initialWeight);
        setValue("reps", currentPlannedSet?.reps || 0);
        setValue("rpe", 7); // Reset RPE on every change
        setDropset(null); // Reset dropset state on set change
    }, [currentGroupIndex, currentExerciseIndex, currentSetIndex, setValue, currentPlannedSet, lastWeightUsed]);

    useEffect(() => {
        setWatchValues(() => ({
            weight: dropset && dropset.length > 0 ? dropset[0].weight : Number(weight),
            reps: dropset && dropset.length > 0 ? dropset.reduce((acc, d) => acc + d.reps, 0) : Number(repsValue),
            rpe: Number(rpeValue),
            dropset: dropset || undefined
        }));
    }, [weight, repsValue, rpeValue, dropset, setWatchValues]);

    const adjustWeight = (amount: number) => {
        const currentWeight = Number(weight || 0);
        setValue("weight", Math.max(0, currentWeight + amount));
    };

    const adjustReps = (amount: number) => {
        const currentReps = Number(repsValue || 0);
        setValue("reps", Math.max(0, currentReps + amount));
    };

    const handleConfirmSet = handleSubmit((data) => {
        onCompleteSet({ ...data, dropset }, false);
    });

    const isDropsetActive = dropset && dropset.length > 0;

    return (
        <form
            onSubmit={handleConfirmSet}
            className="space-y-4"
        >
            {/* Weight and Reps Inputs / Dropset Sequence */}
            <AnimatePresence mode="wait">
                {isDropsetActive ? (
                    <motion.div
                        key="dropset-active-sequence"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-2.5 bg-slate-100/80 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800 p-3 rounded-2xl shadow-sm backdrop-blur-sm"
                    >
                        {/* Dropset Header */}
                        <div className="flex items-center justify-between px-0.5">
                            <div className="flex items-center gap-2">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500 dark:bg-lime-400"></span>
                                </div>
                                <span className="text-[10px] font-black uppercase text-lime-600 dark:text-lime-400 tracking-wider">
                                    {t('activeDropset')}
                                </span>
                            </div>
                            <div className="flex gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setIsDropsetOpen(true)}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-lime-500/40 text-[9px] font-black uppercase tracking-wider text-slate-600 dark:text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 transition-all cursor-pointer active:scale-95 shadow-xs"
                                >
                                    <Zap size={10} className="fill-current text-lime-500 dark:text-lime-400" />
                                    {t('edit')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDropset(null)}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-rose-500/40 text-[9px] font-black uppercase tracking-wider text-slate-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 transition-all cursor-pointer active:scale-95 shadow-xs"
                                >
                                    <Trash2 size={10} className="text-rose-500 dark:text-rose-400" />
                                    {t('remove')}
                                </button>
                            </div>
                        </div>

                        {/* Minimalist Horizontal list of drops */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                            {dropset.map((drop, idx) => {
                                const isFirst = idx === 0;
                                const diff = idx > 0 ? drop.weight - dropset[idx - 1].weight : 0;
                                return (
                                    <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                                        {idx > 0 && (
                                            <ArrowRight size={12} className="stroke-[2.5] text-slate-400 dark:text-zinc-700 flex-shrink-0" />
                                        )}
                                        <div
                                            onClick={() => setIsDropsetOpen(true)}
                                            className={`group flex items-center justify-between gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all border shadow-xs h-[48px] min-w-[105px] ${isFirst
                                                ? 'bg-lime-400/10 dark:bg-lime-400/10 border-lime-500/30 dark:border-lime-400/30 hover:border-lime-500/60 dark:hover:border-lime-400/60'
                                                : 'bg-white dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                                                }`}
                                        >
                                            <div className="flex flex-col min-w-0">
                                                <span className={`text-[8px] font-black uppercase tracking-wider ${isFirst ? 'text-lime-600 dark:text-lime-400' : 'text-slate-400 dark:text-zinc-500'
                                                    }`}>
                                                    {isFirst ? t('originalSet') : t('dropsetModal.dropIndex', { index: idx })}
                                                </span>
                                                <div className="flex items-baseline gap-1 mt-0.5">
                                                    <span className="text-base font-black text-slate-900 dark:text-white tracking-tight group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors leading-none">
                                                        {drop.weight}<span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 ml-0.5">kg</span>
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 leading-none">
                                                        × {drop.reps}
                                                    </span>
                                                </div>
                                            </div>

                                            {diff < 0 && (
                                                <span className="text-[8px] font-black text-rose-500 dark:text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-md leading-none flex-shrink-0">
                                                    {diff}kg
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="standard-inputs"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-3"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            {/* Weight Input Card */}
                            <div className="group flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl px-4 py-3 focus-within:border-lime-500/50 dark:focus-within:border-lime-400/50 focus-within:ring-4 focus-within:ring-lime-400/10 transition-all shadow-xs">
                                <div className='flex flex-col flex-1 min-w-0'>
                                    <label className="text-[8px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-[0.2em] block mb-1.5 group-focus-within:text-lime-600 dark:group-focus-within:text-lime-400 transition-colors">
                                        {t('weight')}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Dumbbell size={18} className="text-lime-600 dark:text-lime-400 flex-shrink-0" />
                                        <Controller
                                            name="weight"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="number"
                                                    inputMode="decimal"
                                                    value={numberInputUtils.formatValue(field.value)}
                                                    onFocus={numberInputUtils.onFocus}
                                                    onChange={(e) => numberInputUtils.onChange(e, field.onChange)}
                                                    className="bg-transparent border-none p-0 text-3xl font-black outline-none w-full text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-800"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 justify-center pl-1">
                                    <button type="button" onClick={() => adjustWeight(5)} className="w-7 h-7 rounded-full bg-lime-400 hover:bg-lime-500 text-zinc-950 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-[0_4px_10px_rgba(163,230,71,0.15)]">
                                        <Plus size={12} strokeWidth={4} />
                                    </button>
                                    <button type="button" onClick={() => adjustWeight(-5)} className="w-7 h-7 rounded-full bg-lime-400 hover:bg-lime-500 text-zinc-950 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-[0_4px_10px_rgba(163,230,71,0.15)]">
                                        <Minus size={12} strokeWidth={4} />
                                    </button>
                                </div>
                            </div>

                            {/* Reps Input Card */}
                            <div className="group flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl px-4 py-3 focus-within:border-lime-500/50 dark:focus-within:border-lime-400/50 focus-within:ring-4 focus-within:ring-lime-400/10 transition-all shadow-xs">
                                <div className='flex flex-col flex-1 min-w-0'>
                                    <label className="text-[8px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-[0.2em] block mb-1.5 group-focus-within:text-lime-600 dark:group-focus-within:text-lime-400 transition-colors">
                                        {t('performed')}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Check size={18} className="text-lime-600 dark:text-lime-400 flex-shrink-0" />
                                        <Controller
                                            name="reps"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="number"
                                                    inputMode="numeric"
                                                    value={numberInputUtils.formatValue(field.value)}
                                                    onFocus={numberInputUtils.onFocus}
                                                    onChange={(e) => numberInputUtils.onChange(e, field.onChange)}
                                                    className="bg-transparent border-none p-0 text-3xl font-black outline-none w-full text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-800"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 justify-center pl-1">
                                    <button type="button" onClick={() => adjustReps(1)} className="w-7 h-7 rounded-full bg-lime-400 hover:bg-lime-500 text-zinc-950 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-[0_4px_10px_rgba(163,230,71,0.15)]">
                                        <Plus size={12} strokeWidth={4} />
                                    </button>
                                    <button type="button" onClick={() => adjustReps(-1)} className="w-7 h-7 rounded-full bg-lime-400 hover:bg-lime-500 text-zinc-950 flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-[0_4px_10px_rgba(163,230,71,0.15)]">
                                        <Minus size={12} strokeWidth={4} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Configurar Dropset Button */}
                        <button
                            type="button"
                            onClick={() => setIsDropsetOpen(true)}
                            className="w-full py-2.5 bg-slate-100/60 hover:bg-slate-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-lime-500/30 dark:hover:border-lime-400/30 text-slate-600 hover:text-lime-600 dark:text-zinc-400 dark:hover:text-lime-400 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.99] cursor-pointer"
                        >
                            <Zap size={12} className="text-slate-400 dark:text-zinc-500 flex-shrink-0" />
                            ⚡ {t('configureDropset')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dropset Configuration Modal */}
            <DropsetModal
                isOpen={isDropsetOpen}
                onClose={() => setIsDropsetOpen(false)}
                onSave={(d) => setDropset(d)}
                initialDropset={dropset}
                defaultWeight={Number(weight)}
                defaultReps={Number(repsValue)}
            />

            {/* Actions Dialog Modal */}
            <SessionActionsModal
                isOpen={isActionsOpen}
                onClose={() => setIsActionsOpen(false)}
                onSkipSet={onSkipSet}
                onSkipExercise={onSkipExercise}
                onAddSet={onAddSet}
                onForceFinishWorkout={onForceFinishWorkout}
                isGroupAlternating={isGroupAlternating}
                onSubstituteExercise={onSubstituteExercise}
                onOpenStandaloneTimer={onOpenStandaloneTimer}
                currentRestDuration={currentRestDuration}
                onUpdateRestDuration={onUpdateRestDuration}
            />

            {/* Submit / Confirm & Actions side-by-side */}
            {!isReadOnly && (
                <div className="flex gap-2.5 items-center pb-2 pt-1">
                    <div className="flex-1 min-w-0">
                        <SlideToConfirm
                            onConfirm={handleConfirmSet}
                            text={t('confirmSet')}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsActionsOpen(true)}
                        className="w-[58px] h-[58px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[24px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-850 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center border-b-[4px] border-b-zinc-200 dark:border-b-zinc-950 shadow-xs shrink-0"
                        title={t('setOptions')}
                    >
                        <SlidersHorizontal size={18} />
                    </button>
                </div>
            )}

            {isReadOnly && (
                <div className="pb-2 pt-1">
                    <button
                        type="button"
                        onClick={() => setIsActionsOpen(true)}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-600 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                    >
                        <SlidersHorizontal size={14} />
                        {t('setOptions')}
                    </button>
                </div>
            )}
        </form>
    );
}
