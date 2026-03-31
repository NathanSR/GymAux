'use client';
import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { X, Plus, Save, Dumbbell, ChevronDown, GripVertical, History, CheckCircle2, Trash2, RefreshCw, Activity } from "lucide-react";
import { useForm } from 'react-hook-form';
import { DraggableExerciseItem } from './DraggableExerciseItem';
import { Session, ExerciseGroup, ExecutedGroup } from '@/config/types';
import Swal from 'sweetalert2';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext';
import { ExerciseSelector } from '../exercises/ExerciseSelector';
import { SessionService } from '@/services/sessionService';
import { useRouter } from '@/i18n/routing';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { type Exercise } from '@/config/types';

interface WorkoutDrawerProps {
    showPreview: boolean;
    onClose: () => void;
    session: Session;
    setSession: (session: Session) => void;
    syncSession: () => void;
    currentExerciseIndex: number;
}

export const WorkoutDrawer = ({ showPreview, onClose, session, setSession, syncSession, currentExerciseIndex }: WorkoutDrawerProps) => {
    const t = useTranslations('WorkoutDrawer');
    const te = useTranslations('Exercises');
    const { isDark } = useTheme();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [editingGroupIdx, setEditingGroupIdx] = useState<number | null>(null);
    const [formExercises, setFormExercises] = useState<(Exercise | null)[]>([]);
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
    const doneGroups: ExecutedGroup[] = session.exercisesDone || [];

    const currentGroupIndex = session.current?.groupIndex || 0;

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleOpenAdd = () => {
        setEditingGroupIdx(null);
        setFormExercises([null]);
        reset({ groupType: 'straight', sets: 3, reps: 12, restTime: 60 });
        setIsFormOpen(true);
    };

    const handleEditClick = (group: ExerciseGroup, idx: number) => {
        setEditingGroupIdx(idx);
        const exs = group.exercises.map(ex => ({ id: ex.exerciseId, name: ex.exerciseName } as any));
        setFormExercises(exs);

        const firstEx = group.exercises[0];
        setValue('groupType', group.groupType);
        setValue('sets', firstEx?.sets.length || 3);
        setValue('reps', firstEx?.sets[0]?.reps || 12);
        setValue('restTime', group.restAfterGroup || 60);

        setIsFormOpen(true);
    };

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

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const oldIndex = groups.findIndex((_: any, i: number) => `group-${i}` === active.id);
            const newIndex = groups.findIndex((_: any, i: number) => `group-${i}` === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                session.exercisesToDo = arrayMove(groups, oldIndex, newIndex);
                setSession({ ...session });
                syncSession();
            }
        }
    };

    const handleDeleteGroup = async (idx: number) => {
        Swal.fire({
            title: t('confirmDeleteTitle'),
            text: t('confirmDeleteText'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: t('confirmDeleteButton'),
            cancelButtonText: t('cancelButton'),
            background: isDark ? '#18181b' : '#ffffff',
            color: isDark ? '#ffffff' : '#18181b',
        }).then((result) => {
            if (result.isConfirmed) {
                session.exercisesToDo = session.exercisesToDo.filter((_: any, i: number) => i !== idx);
                setSession({ ...session });
                syncSession();
            }
        });
    };

    const handleUpdateHistorySet = (groupIdx: number, exIdx: number, setIdx: number, field: string, value: string) => {
        const updatedDone = [...session.exercisesDone];
        const group = { ...updatedDone[groupIdx] };
        const exercises = [...group.exercises];
        const exercise = { ...exercises[exIdx] };
        const sets = [...exercise.sets];
        sets[setIdx] = { ...sets[setIdx], [field]: Number(value) };
        exercise.sets = sets;
        exercises[exIdx] = exercise;
        group.exercises = exercises;
        updatedDone[groupIdx] = group;
        setSession({ ...session, exercisesDone: updatedDone });
        syncSession();
    };

    const handleFullClose = () => {
        setIsFormOpen(false);
        setEditingGroupIdx(null);
        onClose();
    };

    const onConfirmDeleteSession = () => {
        Swal.fire({
            title: t('confirmDeleteSessionTitle'),
            text: t('confirmDeleteSessionText'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: t('confirmDeleteSessionButton'),
            cancelButtonText: t('cancelButton'),
            background: isDark ? '#18181b' : '#ffffff',
            color: isDark ? '#ffffff' : '#18181b',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await SessionService.deleteSession(session.id!);
                router.push('/home');
                onClose();
            }
        });
    }

    if (!showPreview) return null;

    const hasDoneExercises = doneGroups.some(g => g.exercises.length > 0);

    return (
        <div className="fixed inset-0 z-[60] flex items-end animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleFullClose} />

            <div className="relative w-full bg-zinc-950 rounded-t-[40px] border-t border-zinc-800 p-6 max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 opacity-50" />

                {/* Header with Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800 w-full sm:w-auto overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('todo')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'todo' ? 'bg-lime-400 text-zinc-950' : 'text-zinc-500'}`}
                        >
                            <Dumbbell size={14} />
                            <span>{t('tabs.todo')}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('done')}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'done' ? 'bg-lime-400 text-zinc-950' : 'text-zinc-500'}`}
                        >
                            <History size={14} />
                            <span>{t('tabs.done')}</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-end gap-2 ml-auto sm:ml-0">
                        <button
                            onClick={onConfirmDeleteSession}
                            className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer active:scale-95"
                            title={t('confirmDeleteSessionTitle')}
                        >
                            <Trash2 size={18} />
                        </button>

                        {activeTab === 'todo' && (
                            <button
                                onClick={handleOpenAdd}
                                className="p-3 bg-lime-400 rounded-xl text-zinc-950 active:scale-95 shadow-lg shadow-lime-400/20"
                                title={t('addExercise')}
                            >
                                <Plus size={18} />
                            </button>
                        )}

                        <button
                            onClick={handleFullClose}
                            className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 active:scale-95"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Dynamic Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
                    {activeTab === 'todo' ? (
                        <div className="space-y-3">
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={groups.map((_: any, i: number) => `group-${i}`)} strategy={verticalListSortingStrategy}>
                                    {groups.map((group: ExerciseGroup, idx: number) => (
                                        <DraggableExerciseItem
                                            key={`group-${idx}`}
                                            group={group}
                                            idx={idx}
                                            currentGroupIndex={currentGroupIndex}
                                            onRemove={handleDeleteGroup}
                                            onEdit={handleEditClick}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {!hasDoneExercises ? (
                                <div className="text-center py-12 border-2 border-dashed border-zinc-900 rounded-[32px]">
                                    <History size={32} className="mx-auto mb-3 text-zinc-800" />
                                    <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest italic">
                                        {t('empty')}
                                    </p>
                                </div>
                            ) : (
                                doneGroups.map((group, groupIdx) => (
                                    <div key={groupIdx} className="space-y-3">
                                        {/* Group type badge for alternating */}
                                        {group.groupType !== 'straight' && (
                                            <div className="flex items-center gap-2 px-2">
                                                <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2.5 py-1 rounded-full">
                                                    <RefreshCw size={9} />
                                                    {t(`groupTypes.${group.groupType}`)}
                                                </span>
                                            </div>
                                        )}

                                        {group.exercises.map((ex, exIdx) => (
                                            <div key={exIdx} className="bg-zinc-900/40 border border-zinc-800/50 rounded-[32px] overflow-hidden">
                                                {/* Exercise Header */}
                                                <div className="bg-zinc-900/60 p-5 flex items-center justify-between border-b border-zinc-800/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-lime-400 flex items-center justify-center text-zinc-950 shadow-lg shadow-lime-400/10">
                                                            <CheckCircle2 size={16} />
                                                        </div>
                                                        <h4 className="font-black uppercase italic text-sm text-white tracking-tight">
                                                            {te.has(ex.exerciseName) ? te(ex.exerciseName) : ex.exerciseName}
                                                        </h4>
                                                    </div>
                                                    <span className="text-xs font-black text-zinc-500 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                                                        {ex.sets.length} {t('sets')}
                                                    </span>
                                                </div>

                                                {/* Sets List */}
                                                <div className="p-4 space-y-3">
                                                    {ex.sets.map((set, setIdx) => (
                                                        <div key={setIdx} className="flex items-center gap-3 bg-zinc-950/40 p-2 rounded-2xl border border-zinc-800/30">
                                                            <div className="flex flex-col items-center justify-center min-w-[32px] h-10 bg-zinc-900 rounded-xl border border-zinc-800">
                                                                <span className="text-xs font-black text-zinc-500 leading-none">{t('set')}</span>
                                                                <span className="text-xs font-black text-lime-400 leading-none mt-0.5">{setIdx + 1}</span>
                                                            </div>

                                                            <div className="grid grid-cols-3 gap-2 flex-1">
                                                                {['weight', 'reps', 'rpe'].map((field) => (
                                                                    <div key={field} className="relative group">
                                                                        <label className="absolute -top-1.5 left-2 px-1 bg-zinc-950 text-xs font-black text-zinc-500 uppercase tracking-tighter">
                                                                            {t(field)}
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            min={0}
                                                                            max={field === "rpe" ? 10 : undefined}
                                                                            defaultValue={(set as any)[field]}
                                                                            onBlur={(e) => handleUpdateHistorySet(groupIdx, exIdx, setIdx, field, e.target.value)}
                                                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2 px-2 text-xs font-bold outline-none text-zinc-200 focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/20 transition-all text-center"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <ExerciseSelector
                    isOpen={isSelectorOpen}
                    onClose={() => setIsSelectorOpen(false)}
                    onSelect={handleSelectExercise}
                />

                {/* Add/Edit Form */}
                {isFormOpen && (
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
                                {/* Group Type Header */}
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

                                    {/* Add extra exercise button (only for giant_set/circuit) */}
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

                                {/* Parameters Grid */}
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
                )}
            </div>
        </div>
    );
};