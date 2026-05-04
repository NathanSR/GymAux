import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, LayoutGroup } from 'framer-motion';
import { Dumbbell, Check, Plus, Minus, SkipForward, FastForward, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { RPE_EMOJIS, RPE_OPTIONS } from './SessionConstants';

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
    setWatchValues: (watchFn: () => { weight: number; reps: number; rpe: number }) => void;
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
    setWatchValues
}: SessionSetFormProps) {
    const t = useTranslations('Session');

    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            weight: 0,
            reps: currentPlannedSet?.reps || 0,
            rpe: 7
        }
    });

    const weight = watch("weight");
    const rpeValue = watch("rpe");

    useEffect(() => {
        setValue("weight", currentPlannedSet?.weight || weight || 0);
        setValue("reps", currentPlannedSet?.reps || 0);
        setValue("rpe", 7); // Reset RPE on every change
    }, [currentGroupIndex, currentExerciseIndex, currentSetIndex, setValue, currentPlannedSet]);

    useEffect(() => {
        setWatchValues(() => ({
            weight: watch("weight"),
            reps: watch("reps"),
            rpe: watch("rpe")
        }));
    }, [watch, setWatchValues]);

    const adjustWeight = (amount: number) => {
        const currentWeight = Number(watch("weight") || 0);
        setValue("weight", Math.max(0, currentWeight + amount));
    };

    const adjustReps = (amount: number) => {
        const currentReps = Number(watch("reps") || 0);
        setValue("reps", Math.max(0, currentReps + amount));
    };

    return (
        <form
            onSubmit={handleSubmit((data) => onCompleteSet(data, false))}
            className="space-y-3"
        >
            <div className="grid grid-cols-2 gap-3">
                <div className="group flex bg-zinc-900 border border-zinc-800 rounded-3xl px-4 py-3 focus-within:border-lime-400/50 focus-within:ring-4 focus-within:ring-lime-400/5 transition-all">
                    <div className='flex flex-col'>
                        <label className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-1.5 group-focus-within:text-lime-400 transition-colors">
                            {t('weight')}
                        </label>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Dumbbell size={18} className="text-lime-400 flex-shrink-0" />
                                <input
                                    {...register("weight")}
                                    type="number"
                                    inputMode="decimal"
                                    className="bg-transparent border-none p-0 text-3xl font-black outline-none w-full text-white placeholder:text-zinc-800"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 justify-center">
                        <button type="button" onClick={() => adjustWeight(5)} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                            <Plus size={14} />
                        </button>
                        <button type="button" onClick={() => adjustWeight(-5)} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                            <Minus size={14} />
                        </button>
                    </div>
                </div>

                <div className="group flex bg-zinc-900 border border-zinc-800 rounded-3xl px-4 py-3 focus-within:border-lime-400/50 focus-within:ring-4 focus-within:ring-lime-400/5 transition-all">
                    <div className='flex flex-col'>
                        <label className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-1.5 group-focus-within:text-lime-400 transition-colors">
                            {t('performed')}
                        </label>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Check size={18} className="text-lime-400 flex-shrink-0" />
                                <input
                                    {...register("reps")}
                                    type="number"
                                    inputMode="numeric"
                                    className="bg-transparent border-none p-0 text-3xl font-black outline-none w-full text-white placeholder:text-zinc-800"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 justify-center">
                        <button type="button" onClick={() => adjustReps(1)} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                            <Plus size={14} />
                        </button>
                        <button type="button" onClick={() => adjustReps(-1)} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                            <Minus size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* RPE Simplificado (Apenas Emojis) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 transition-colors duration-300">
                <div className="flex justify-between items-center mb-3">
                    <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">{t('effort')}</label>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] text-lime-400 font-bold uppercase tracking-tight">{t(RPE_EMOJIS[Number(rpeValue)]?.labelKey)}</span>
                        <span className="w-6 h-6 bg-lime-400 rounded-lg text-zinc-950 flex items-center justify-center font-black text-xs italic">
                            {rpeValue}
                        </span>
                    </div>
                </div>

                <LayoutGroup>
                    <div className="flex flex-wrap justify-center gap-1.5 p-1 bg-black/20 rounded-2xl">
                        {RPE_OPTIONS.map((val) => (
                            <motion.button
                                key={val}
                                type="button"
                                onClick={() => setValue("rpe", val)}
                                whileTap={{ scale: 0.9 }}
                                className={`relative w-[11%] aspect-square rounded-xl flex items-center justify-center text-2xl sm:text-3xl transition-colors overflow-hidden ${Number(rpeValue) === val
                                    ? 'bg-transparent text-zinc-950'
                                    : 'bg-zinc-800/50 text-zinc-500'
                                    }`}
                            >
                                {Number(rpeValue) === val && (
                                    <motion.div
                                        layoutId="activeRpe"
                                        className="absolute inset-0 bg-lime-400"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className={`z-10 transition-transform ${Number(rpeValue) === val ? 'scale-110' : ''}`}>
                                    {RPE_EMOJIS[val]?.emoji}
                                </span>
                                <span className={`absolute bottom-0 right-0 px-1 text-[10px] sm:text-xs font-black z-10 ${Number(rpeValue) === val ? 'text-lime-950/40' : 'text-lime-400'}`}>{val}</span>
                            </motion.button>
                        ))}
                    </div>
                </LayoutGroup>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-2 pt-1">
                <button
                    type="button"
                    onClick={onSkipSet}
                    className="flex items-center justify-center gap-1.5 py-4 px-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 active:scale-[0.98] transition-all"
                >
                    <SkipForward size={14} />
                    {t('skipSet')}
                </button>
                <button
                    type="button"
                    onClick={onSkipExercise}
                    className="flex items-center justify-center gap-1.5 py-4 px-3 bg-rose-950/20 border border-rose-900/30 rounded-2xl text-rose-500 text-[9px] font-black uppercase tracking-widest hover:bg-rose-900/30 active:scale-[0.98] transition-all"
                >
                    <FastForward size={14} />
                    {isGroupAlternating ? t('skipGroup') : t('skipExercise')}
                </button>
            </div>

            {!isReadOnly && (
                <button
                    type="submit"
                    className="group w-full py-5 bg-lime-400 text-zinc-950 rounded-[24px] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(163,230,71,0.2)] hover:-translate-y-1 active:scale-[0.98] transition-all border-b-[6px] border-lime-600"
                >
                    {t('confirmSet')}
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
            )}
        </form>
    );
}
