'use client';
import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { X, Plus, Save, Dumbbell, ChevronDown, GripVertical, History, CheckCircle2, Trash2, RefreshCw } from "lucide-react";
import { useForm } from 'react-hook-form';
import { DraggableExerciseItem } from './DraggableExerciseItem';
import { Session, ExerciseGroup, ExecutedGroup } from '@/config/types';
import Swal from 'sweetalert2';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext';
import { ExerciseSelector } from '../exercises/ExerciseSelector';
import { SessionService } from '@/services/sessionService';
import { useRouter } from '@/i18n/routing';

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
    const [selectedExercise, setSelectedExercise] = useState<{ id: number; name: string } | null>(null);
    const [editingGroupIdx, setEditingGroupIdx] = useState<number | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: { sets: 3, reps: 12, restTime: 60 }
    });

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
        setSelectedExercise(null);
        reset({ sets: 3, reps: 12, restTime: 60 });
        setIsFormOpen(true);
    };

    const handleEditClick = (group: ExerciseGroup, idx: number) => {
        setEditingGroupIdx(idx);
        const firstExercise = group.exercises[0];
        if (firstExercise) {
            setSelectedExercise({ id: firstExercise.exerciseId, name: firstExercise.exerciseName });
            setValue('sets', firstExercise.sets.length);
            setValue('reps', firstExercise.sets[0]?.reps || 12);
            setValue('restTime', firstExercise.sets[0]?.restTime || 60);
        }
        setIsFormOpen(true);
    };

    const handleSelectExercise = (exercise: any) => {
        setSelectedExercise({ id: exercise.id, name: exercise.name });
        setIsSelectorOpen(false);
    };

    const onSave = (data: any) => {
        if (!selectedExercise) return setIsSelectorOpen(true);

        const setsCount = Number(data.sets);
        const reps = Number(data.reps);
        const restTime = Number(data.restTime);

        const plannedSets = Array.from({ length: setsCount }, () => ({
            reps,
            restTime,
            technique: 'normal' as const
        }));

        if (editingGroupIdx !== null) {
            const updatedGroups = [...groups];
            const group = { ...updatedGroups[editingGroupIdx] };
            group.exercises = group.exercises.map(ex =>
                ex.exerciseId === selectedExercise.id
                    ? { ...ex, exerciseName: selectedExercise.name, sets: plannedSets }
                    : ex
            );
            updatedGroups[editingGroupIdx] = group;
            session.exercisesToDo = updatedGroups;
        } else {
            const newGroup: ExerciseGroup = {
                groupType: 'straight',
                rounds: 1,
                restBetweenRounds: 0,
                restAfterGroup: restTime,
                exercises: [{
                    exerciseId: selectedExercise.id,
                    exerciseName: selectedExercise.name,
                    sets: plannedSets,
                    restAfterExercise: 0
                }]
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
                    <div className="absolute inset-0 bg-zinc-950 z-20 rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-lg font-black uppercase italic tracking-tighter">
                                {editingGroupIdx !== null ? t('editExercise') : t('addExercise')}
                            </h4>
                            <button onClick={() => setIsFormOpen(false)} className="text-zinc-500 p-2"><X /></button>
                        </div>

                        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
                            <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-5 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 text-zinc-700"><GripVertical size={20} /></div>
                                    <button
                                        type="button"
                                        onClick={() => setIsSelectorOpen(true)}
                                        className="flex-1 flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-left hover:border-lime-400/50 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Dumbbell size={16} className="text-lime-500 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-black uppercase tracking-tight">
                                                {selectedExercise
                                                    ? (te.has(selectedExercise.name) ? te(selectedExercise.name) : selectedExercise.name)
                                                    : t('selectExercise')}
                                            </span>
                                        </div>
                                        <ChevronDown size={16} className="text-zinc-400" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {['sets', 'reps', 'restTime'].map((field) => (
                                        <div key={field} className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 focus-within:ring-2 focus-within:ring-lime-400/50 transition-all">
                                            <span className="block text-[8px] font-black text-zinc-500 uppercase mb-1 tracking-tighter">
                                                {t(field)}
                                            </span>
                                            <input
                                                type="number"
                                                {...register(field as any)}
                                                className="w-full bg-transparent font-black outline-none text-white text-lg"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-lime-400 text-zinc-950 rounded-[28px] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-lime-400/10 active:scale-95 transition-all mt-4">
                                <Save size={18} /> {editingGroupIdx !== null ? t('confirmEdit') : t('confirmAdd')}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};