import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { Dumbbell, Check, Plus, Minus, ArrowRight, X, SlidersHorizontal, Zap } from 'lucide-react';
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
    lastWeightUsed
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
            {/* Weight and Reps Inputs */}
            <div className="grid grid-cols-2 gap-3">
                {/* Weight Input Card */}
                {isDropsetActive ? (
                    <div 
                        onClick={() => setIsDropsetOpen(true)}
                        className="group flex bg-zinc-900 border border-lime-400/30 rounded-3xl px-4 py-3 cursor-pointer hover:border-lime-400/50 hover:ring-4 hover:ring-lime-400/5 transition-all flex-1 min-w-0"
                    >
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-1.5 group-hover:text-lime-400 transition-colors">
                                {t('weight')}
                            </span>
                            <div className="flex items-center gap-2">
                                <Dumbbell size={18} className="text-lime-400 flex-shrink-0" />
                                <div className="flex flex-col leading-none">
                                    <span className="text-3xl font-black text-white">{dropset[0].weight}kg</span>
                                    <span className="text-[9px] font-black text-zinc-500 block mt-1">
                                        Carga Inicial
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center pl-2">
                            <div className="w-8 h-8 rounded-xl bg-lime-400/10 flex items-center justify-center text-lime-400">
                                <Zap size={14} className="fill-current" />
                            </div>
                        </div>
                    </div>
                ) : (
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
                        <div className="flex flex-col gap-1 justify-center">
                            <button type="button" onClick={() => adjustWeight(5)} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                                <Plus size={14} />
                            </button>
                            <button type="button" onClick={() => adjustWeight(-5)} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                                <Minus size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Reps Input Card */}
                {isDropsetActive ? (
                    <div 
                        onClick={() => setIsDropsetOpen(true)}
                        className="group flex bg-zinc-900 border border-lime-400/30 rounded-3xl px-4 py-3 cursor-pointer hover:border-lime-400/50 hover:ring-4 hover:ring-lime-400/5 transition-all flex-1 min-w-0"
                    >
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-1.5 group-hover:text-lime-400 transition-colors">
                                {t('performed')}
                            </span>
                            <div className="flex items-center gap-2">
                                <Check size={18} className="text-lime-400 flex-shrink-0" />
                                <div className="flex flex-col leading-none">
                                    <span className="text-3xl font-black text-white">
                                        {dropset.reduce((acc, d) => acc + d.reps, 0)}
                                    </span>
                                    <span className="text-[9px] font-black text-zinc-500 block mt-1">
                                        Reps Totais
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center pl-2">
                            <div className="w-8 h-8 rounded-xl bg-lime-400/10 flex items-center justify-center text-lime-400">
                                <Zap size={14} className="fill-current" />
                            </div>
                        </div>
                    </div>
                ) : (
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
                        <div className="flex flex-col gap-1 justify-center">
                            <button type="button" onClick={() => adjustReps(1)} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                                <Plus size={14} />
                            </button>
                            <button type="button" onClick={() => adjustReps(-1)} className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 active:scale-90 transition-all text-zinc-400 hover:text-white">
                                <Minus size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Prominent Dropset Selector Button */}
            {isDropsetActive ? (
                <button
                    type="button"
                    onClick={() => setIsDropsetOpen(true)}
                    className="w-full py-3 bg-lime-400/10 border border-lime-400/35 hover:bg-lime-400/20 text-lime-400 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.99] shadow-[0_0_15px_rgba(163,230,71,0.03)] cursor-pointer"
                >
                    <Zap size={12} className="fill-current text-lime-400" />
                    Dropset Ativo: {dropset.map(d => `${d.weight}kg`).join(' ➔ ')} (Editar)
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => setIsDropsetOpen(true)}
                    className="w-full py-3 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 hover:border-lime-400/30 text-zinc-400 hover:text-lime-400 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.99] cursor-pointer"
                >
                    <Zap size={12} className="text-zinc-500 flex-shrink-0" />
                    ⚡ Configurar Dropset
                </button>
            )}

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

            {/* Workout Actions (Single Options Button) */}
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

            {/* Actions Dialog Modal */}
            <SessionActionsModal
                isOpen={isActionsOpen}
                onClose={() => setIsActionsOpen(false)}
                onSkipSet={onSkipSet}
                onSkipExercise={onSkipExercise}
                onAddSet={onAddSet}
                onForceFinishWorkout={onForceFinishWorkout}
                isGroupAlternating={isGroupAlternating}
            />

            {/* Submit Confirm Set Button */}
            {!isReadOnly && (
                <button
                    type="submit"
                    className="group w-full py-5 bg-lime-400 text-zinc-950 rounded-[24px] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(163,230,71,0.2)] hover:-translate-y-1 active:scale-[0.98] transition-all border-b-[6px] border-lime-600 cursor-pointer"
                >
                    {t('confirmSet')}
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
            )}
        </form>
    );
}
