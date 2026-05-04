import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Dumbbell, ChevronDown, Activity } from "lucide-react";
import { ExerciseGroup, Exercise, Session } from '@/config/types';
import { ExerciseSelector } from '../exercises/ExerciseSelector';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface WorkoutDrawerFormProps {
    session: Session;
    setSession: (session: Session) => void;
    syncSession: () => void;
    isFormOpen: boolean;
    setIsFormOpen: (isOpen: boolean) => void;
    editingGroupIdx: number | null;
    setEditingGroupIdx: (idx: number | null) => void;
    t: any;
    te: any;
}

export const WorkoutDrawerForm = ({
    session,
    setSession,
    syncSession,
    isFormOpen,
    setIsFormOpen,
    editingGroupIdx,
    setEditingGroupIdx,
    t,
    te
}: WorkoutDrawerFormProps) => {
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [formExercises, setFormExercises] = useState<(Exercise | null)[]>([null]);
    const [selectingIndex, setSelectingIndex] = useState<number | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        newType: string | null;
    }>({
        isOpen: false,
        newType: null
    });

    const { register, handleSubmit, reset, setValue, watch } = useForm<any>({
        defaultValues: { groupType: 'straight', sets: 3, reps: 12, restTime: 60, exerciseReps: {} }
    });

    const groupType = watch('groupType');
    const groups = session.exercisesToDo || [];

    useEffect(() => {
        if (isFormOpen) {
            if (editingGroupIdx !== null && groups[editingGroupIdx]) {
                const group = groups[editingGroupIdx];
                const exs = group.exercises.map((ex: any) => ({ id: ex.exerciseId, name: ex.exerciseName } as any));
                setFormExercises(exs);

                const firstEx = group.exercises[0];
                setValue('groupType', group.groupType);
                setValue('sets', firstEx?.sets.length || 3);
                setValue('reps', firstEx?.sets[0]?.reps || 12);
                setValue('restTime', group.restAfterGroup || 60);
            } else {
                setFormExercises([null]);
                reset({ groupType: 'straight', sets: 3, reps: 12, restTime: 60, exerciseReps: {} });
            }
        }
    }, [isFormOpen, editingGroupIdx, groups, setValue, reset]);

    const handleSelectExercise = (exercise: any) => {
        if (selectingIndex !== null) {
            const newExs = [...formExercises];
            newExs[selectingIndex] = { id: exercise.id, name: exercise.name } as any;
            setFormExercises(newExs);
        }
        setIsSelectorOpen(false);
        setSelectingIndex(null);
    };

    const handleGroupTypeChange = (newType: string) => {
        const currentType = watch('groupType');
        if (newType === currentType) return;

        let requiredCount = formExercises.length;
        if (newType === 'straight') requiredCount = 1;
        else if (newType === 'bi_set') requiredCount = 2;
        else if (newType === 'tri_set') requiredCount = 3;

        if (requiredCount > formExercises.length) {
            const newExs = [...formExercises];
            while (newExs.length < requiredCount) {
                newExs.push(null);
            }
            setFormExercises(newExs);
            setValue('groupType', newType);
        } else if (requiredCount < formExercises.length) {
            const toRemove = formExercises.slice(requiredCount);
            const hasData = toRemove.some(ex => !!ex);

            if (hasData) {
                setConfirmModal({ isOpen: true, newType });
            } else {
                setFormExercises(formExercises.slice(0, requiredCount));
                setValue('groupType', newType);
            }
        } else {
            setValue('groupType', newType);
        }
    };

    const confirmTypeChange = () => {
        const newType = confirmModal.newType;
        if (!newType) return;

        let requiredCount = formExercises.length;
        if (newType === 'straight') requiredCount = 1;
        else if (newType === 'bi_set') requiredCount = 2;
        else if (newType === 'tri_set') requiredCount = 3;

        setFormExercises(formExercises.slice(0, requiredCount));
        setValue('groupType', newType);
        setConfirmModal({ isOpen: false, newType: null });
    };

    const onSave = (data: any) => {
        const filledCount = formExercises.filter(ex => !!ex).length;
        if (filledCount < formExercises.length) {
            const missingIdx = formExercises.findIndex(ex => !ex);
            setSelectingIndex(missingIdx);
            return setIsSelectorOpen(true);
        }

        const currentGroupType = data.groupType;
        const setsCount = Number(data.sets);
        const reps = Number(data.reps);
        const restTime = Number(data.restTime);
        const exerciseReps = watch('exerciseReps') || {};

        const mappedExercises = formExercises.map((ex, idx) => {
            const exReps = Number(exerciseReps[idx] || reps);
            const plannedSets = Array.from({ length: setsCount }, () => ({
                reps: exReps,
                restTime,
                technique: 'normal' as const
            }));

            return {
                exerciseId: ex!.id!,
                exerciseName: ex!.name,
                sets: plannedSets,
                restAfterExercise: 0
            };
        });

        if (editingGroupIdx !== null) {
            const updatedGroups = [...groups];
            updatedGroups[editingGroupIdx] = {
                ...updatedGroups[editingGroupIdx],
                groupType: currentGroupType,
                rounds: setsCount,
                exercises: mappedExercises,
                restAfterGroup: restTime
            };
            session.exercisesToDo = updatedGroups;
        } else {
            const newGroup: ExerciseGroup = {
                groupType: currentGroupType,
                rounds: setsCount,
                restBetweenRounds: 0,
                restAfterGroup: restTime,
                exercises: mappedExercises
            };
            session.exercisesToDo = [...groups, newGroup];
        }

        setSession({ ...session });
        syncSession();
        setIsFormOpen(false);
        setEditingGroupIdx(null);
        reset();
    };

    if (!isFormOpen) return null;

    return (
        <div className={`absolute bg-zinc-950 inset-0 z-20 rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300 flex flex-col overflow-hidden
            ${groupType === 'straight'
                ? 'bg-zinc-950'
                : 'bg-gradient-to-br from-lime-500/5 to-zinc-950 border-t border-lime-500/20'}
        `}>
            {groupType !== 'straight' && (
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Activity size={80} className="text-lime-500" />
                </div>
            )}
            <div className="flex items-center justify-between mb-8">
                <h4 className="text-lg font-black uppercase italic tracking-tighter">
                    {editingGroupIdx !== null ? t('editExercise') : t('addExercise')}
                </h4>
                <button onClick={() => setIsFormOpen(false)} className="text-zinc-500 p-2"><X /></button>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{t('groupTypeLabel')}</label>
                        <select
                            value={groupType}
                            onChange={(e) => handleGroupTypeChange(e.target.value)}
                            className="bg-zinc-950 text-lime-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl border border-zinc-800 outline-none cursor-pointer hover:border-lime-400/50 transition-colors shadow-lg shadow-black/50"
                        >
                            <option value="straight">{t('groupTypes.straight')}</option>
                            <option value="bi_set">{t('groupTypes.bi_set')}</option>
                            <option value="tri_set">{t('groupTypes.tri_set')}</option>
                            <option value="giant_set">{t('groupTypes.giant_set')}</option>
                            <option value="circuit">{t('groupTypes.circuit')}</option>
                        </select>
                    </div>

                    <div className={`space-y-3 relative ${groupType !== 'straight' ? 'pl-5' : ''}`}>
                        {groupType !== 'straight' && (
                            <div className="absolute left-[7px] top-6 bottom-6 w-0.5 bg-lime-500/20 rounded-full" />
                        )}
                        {formExercises.map((ex, idx) => (
                            <div key={idx} className={`relative flex items-center gap-3 group transition-all`}>
                                {groupType !== 'straight' && (
                                    <div className="absolute -left-[19px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-lime-500 ring-4 ring-lime-500/10 z-10" />
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectingIndex(idx);
                                        setIsSelectorOpen(true);
                                    }}
                                    className="flex-1 flex items-center justify-between bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50 text-left group-hover:border-lime-400/20 transition-all overflow-hidden"
                                >
                                    <div className="flex items-center gap-3">
                                        <Dumbbell size={14} className={`${ex ? 'text-lime-400' : 'text-zinc-700'} shrink-0`} />
                                        <span className={`text-[10px] sm:text-xs font-black uppercase tracking-tight truncate ${ex ? 'text-white' : 'text-zinc-600'}`}>
                                            {ex ? (te.has(ex.name) ? te(ex.name) : ex.name) : t('selectExercise')}
                                        </span>
                                    </div>
                                    <ChevronDown size={14} className="text-zinc-700 shrink-0" />
                                </button>

                                {groupType !== 'straight' && (
                                    <div className="w-16 shrink-0 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 p-2 flex flex-col items-center justify-center">
                                        <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">{t('reps')}</span>
                                        <input
                                            type="number"
                                            className="w-full bg-transparent text-center font-black text-xs outline-none text-lime-400"
                                            value={watch(`exerciseReps.${idx}`) || watch('reps') || 10}
                                            onChange={(e) => setValue(`exerciseReps.${idx}`, parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                )}

                                {formExercises.length > 1 && groupType !== 'bi_set' && groupType !== 'tri_set' && (
                                    <button
                                        type="button"
                                        onClick={() => setFormExercises(formExercises.filter((_, i) => i !== idx))}
                                        className="p-2 text-zinc-600 hover:text-red-500 transition-colors shrink-0"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        ))}

                        {groupType !== 'bi_set' && groupType !== 'tri_set' && groupType !== 'straight' && (
                            <button
                                type="button"
                                onClick={() => setFormExercises([...formExercises, null])}
                                className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:border-lime-400/30 hover:text-lime-500 transition-all"
                            >
                                + {t('addExercise')}
                            </button>
                        )}
                    </div>

                    <div className={`grid ${groupType === 'straight' ? 'grid-cols-3' : 'grid-cols-2'} gap-2 pt-2`}>
                        <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 focus-within:ring-2 focus-within:ring-lime-400/50 transition-all">
                            <span className="block text-[8px] font-black text-zinc-500 uppercase mb-1 tracking-tighter">
                                {groupType === 'straight' ? t('sets') : t('rounds')}
                            </span>
                            <input
                                type="number"
                                {...register('sets')}
                                className="w-full bg-transparent font-black outline-none text-white text-lg"
                            />
                        </div>

                        {groupType === 'straight' && (
                            <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 focus-within:ring-2 focus-within:ring-lime-400/50 transition-all">
                                <span className="block text-[8px] font-black text-zinc-500 uppercase mb-1 tracking-tighter">
                                    {t('reps')}
                                </span>
                                <input
                                    type="number"
                                    {...register('reps')}
                                    className="w-full bg-transparent font-black outline-none text-white text-lg"
                                />
                            </div>
                        )}

                        <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 focus-within:ring-2 focus-within:ring-lime-400/50 transition-all">
                            <span className="block text-[8px] font-black text-zinc-500 uppercase mb-1 tracking-tighter">
                                {groupType === 'straight' ? t('restTime') : t('restBetweenRounds')}
                            </span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    {...register('restTime')}
                                    className="flex-1 bg-transparent font-black outline-none text-white text-lg"
                                />
                                <span className="text-[10px] font-black text-zinc-600">S</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full py-5 bg-lime-400 text-zinc-950 rounded-[32px] font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-lime-400/10 active:scale-95 transition-all mt-6">
                    <Save size={18} /> {editingGroupIdx !== null ? t('confirmEdit') : t('confirmAdd')}
                </button>
            </form>

            <ExerciseSelector
                isOpen={isSelectorOpen}
                onClose={() => setIsSelectorOpen(false)}
                onSelect={handleSelectExercise}
            />

            <ConfirmDialog
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmTypeChange}
                title={t('confirmTypeChange')}
                description={t('confirmTypeChangeText', { type: confirmModal.newType ? t(`groupTypes.${confirmModal.newType}`) : '' })}
                confirmText={t('confirmChange')}
                cancelText={t('cancelChange')}
                variant="warning"
            />
        </div>
    );
};
