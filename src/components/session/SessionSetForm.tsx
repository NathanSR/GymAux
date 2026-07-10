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
    onSubstituteExercise
}: SessionSetFormProps) {
    const t = useTranslations('Session');

    const [isDropsetOpen, setIsDropsetOpen] = useState(false);
    const [isActionsOpen, setIsActionsOpen] = useState(false);
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

    const isDropsetActive = dropset && dropset.length > 0;

    return (
        <form
            onSubmit={handleSubmit((data) => onCompleteSet({ ...data, dropset }, false))}
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
                        className="flex flex-col gap-3 bg-zinc-950/40 border border-zinc-900 rounded-[28px] p-4"
                    >
                        {/* Dropset Header */}
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-400"></span>
                                </div>
                                <span className="text-[10px] font-black uppercase text-lime-400 tracking-[0.15em]">
                                    Dropset Ativo
                                </span>
                            </div>
                            <div className="flex gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setIsDropsetOpen(true)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-lime-400/40 text-[9px] font-black uppercase tracking-wider text-zinc-400 hover:text-lime-400 transition-all cursor-pointer active:scale-95"
                                >
                                    <Zap size={10} className="fill-current text-lime-400" />
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDropset(null)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-rose-500/40 text-[9px] font-black uppercase tracking-wider text-zinc-400 hover:text-rose-400 transition-all cursor-pointer active:scale-95"
                                >
                                    <Trash2 size={10} className="text-rose-400" />
                                    Remover
                                </button>
                            </div>
                        </div>

                        {/* Horizontal list of drops */}
                        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                            {dropset.map((drop, idx) => {
                                const isFirst = idx === 0;
                                const diff = idx > 0 ? drop.weight - dropset[idx - 1].weight : 0;
                                return (
                                    <div key={idx} className="flex items-center gap-2.5 flex-shrink-0">
                                        {idx > 0 && (
                                            <div className="text-zinc-700 flex-shrink-0">
                                                <ArrowRight size={14} className="stroke-[3] text-zinc-800" />
                                            </div>
                                        )}
                                        <div
                                            onClick={() => setIsDropsetOpen(true)}
                                            className={`group flex flex-col justify-between w-28 h-24 p-3.5 rounded-2xl cursor-pointer transition-all border ${
                                                isFirst
                                                    ? 'bg-gradient-to-br from-zinc-900 to-zinc-950 border-lime-400/30 hover:border-lime-400/60 shadow-[0_4px_16px_rgba(163,230,71,0.04)]'
                                                    : 'bg-zinc-900/40 border-zinc-850/80 hover:border-zinc-700'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className={`text-[8px] font-black uppercase tracking-widest ${
                                                    isFirst ? 'text-lime-400' : 'text-zinc-500'
                                                }`}>
                                                    {isFirst ? 'Original' : `Drop ${idx}`}
                                                </span>
                                                {diff < 0 && (
                                                    <span className="text-[8px] font-black text-rose-400 bg-rose-500/10 px-1 py-0.5 rounded-md leading-none">
                                                        {diff}kg
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col leading-none mt-1">
                                                <span className="text-2xl font-black text-white tracking-tight group-hover:text-lime-400 transition-colors">
                                                    {drop.weight}
                                                    <span className="text-[10px] font-bold text-zinc-500 ml-0.5">kg</span>
                                                </span>
                                                <span className="text-[10px] font-black text-zinc-400 mt-1.5 flex items-baseline gap-0.5">
                                                    {drop.reps}
                                                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">{t('reps')}</span>
                                                </span>
                                            </div>
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
                            <div className="group flex bg-zinc-900 border border-zinc-800 rounded-3xl px-4 py-3 focus-within:border-lime-400/50 focus-within:ring-4 focus-within:ring-lime-400/5 transition-all">
                                <div className='flex flex-col flex-1 min-w-0'>
                                    <label className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-1.5 group-focus-within:text-lime-400 transition-colors">
                                        {t('weight')}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Dumbbell size={18} className="text-lime-400 flex-shrink-0" />
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
                                                    className="bg-transparent border-none p-0 text-3xl font-black outline-none w-full text-white placeholder:text-zinc-800"
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
                            <div className="group flex bg-zinc-900 border border-zinc-800 rounded-3xl px-4 py-3 focus-within:border-lime-400/50 focus-within:ring-4 focus-within:ring-lime-400/5 transition-all">
                                <div className='flex flex-col flex-1 min-w-0'>
                                    <label className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-1.5 group-focus-within:text-lime-400 transition-colors">
                                        {t('performed')}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <Check size={18} className="text-lime-400 flex-shrink-0" />
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
                                                    className="bg-transparent border-none p-0 text-3xl font-black outline-none w-full text-white placeholder:text-zinc-800"
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
                            className="w-full py-3 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 hover:border-lime-400/30 text-zinc-400 hover:text-lime-400 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.99] cursor-pointer"
                        >
                            <Zap size={12} className="text-zinc-500 flex-shrink-0" />
                            ⚡ Configurar Dropset
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* RPE Selector with Rotary Dial Component */}
            <Controller
                name="rpe"
                control={control}
                render={({ field }) => (
                    <RpeDial
                        value={field.value}
                        onChange={field.onChange}
                        label={t('effort')}
                        subLabel={t(RPE_EMOJIS[Number(rpeValue)]?.labelKey)}
                    />
                )}
            />

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
            />

            {/* Submit / Confirm & Actions side-by-side */}
            {!isReadOnly && (
                <div className="flex gap-2.5 items-stretch pb-2 pt-1">
                    <button
                        type="submit"
                        className="group flex-1 py-5 bg-lime-400 text-zinc-950 rounded-[24px] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(163,230,71,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all border-b-[6px] border-lime-600 cursor-pointer"
                    >
                        {t('confirmSet')}
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsActionsOpen(true)}
                        className="aspect-square px-5 bg-zinc-900 border border-zinc-800 rounded-[24px] text-zinc-400 hover:text-white hover:bg-zinc-850 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center border-b-[6px] border-zinc-950"
                        title="Opções da Série / Ações"
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
                        className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 hover:text-white active:scale-[0.98] transition-all cursor-pointer"
                    >
                        <SlidersHorizontal size={14} />
                        Opções da Série / Ações
                    </button>
                </div>
            )}
        </form>
    );
}
