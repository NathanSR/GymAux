'use client';
import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { X, Plus, Save, Dumbbell, ChevronDown, GripVertical, History, CheckCircle2 } from "lucide-react";
import { useForm } from 'react-hook-form';
import { DraggableExerciseItem } from './DraggableExerciseItem';
import { Session } from '@/config/types';
import Swal from 'sweetalert2';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext';
import { ExerciseSelector } from '../exercises/ExerciseSelector';

interface WorkoutDrawerProps {
    showPreview: boolean;
    onClose: () => void;
    session: Session;
    setSession: (session: Session) => any;
    syncSession: () => any;
    currentExerciseIndex: number;
}

export const WorkoutDrawer = ({ showPreview, onClose, session, setSession, syncSession, currentExerciseIndex }: WorkoutDrawerProps) => {
    const t = useTranslations('WorkoutDrawer');
    const te = useTranslations('Exercises');
    const { theme } = useTheme();

    // Novo estado para controlar as abas
    const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<{ id: number; name: string } | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: { sets: 3, reps: 12, restTime: 60 }
    });

    const exercises = session.exercisesToDo || [];
    const doneExercises = session.exercisesDone || [];

    // SENSORES AJUSTADOS: Incluindo suporte mobile com delay para não conflitar com scroll
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // FUNÇÕES ORIGINAIS MANTIDAS
    const handleOpenAdd = () => {
        setEditingId(null);
        setSelectedExercise(null);
        reset({ sets: 3, reps: 12, restTime: 60 });
        setIsFormOpen(true);
    };

    const handleEditClick = (ex: any) => {
        setEditingId(ex.exerciseId);
        setSelectedExercise({ id: ex.exerciseId, name: ex.exerciseName });
        setValue('sets', ex.sets);
        setValue('reps', ex.reps);
        setValue('restTime', ex.restTime);
        setIsFormOpen(true);
    };

    const handleSelectExercise = (exercise: any) => {
        setSelectedExercise({ id: exercise.id, name: exercise.name });
        setIsSelectorOpen(false);
    };

    const onSave = (data: any) => {
        if (!selectedExercise) return setIsSelectorOpen(true);
        if (editingId !== null) {
            const updatedExercises = exercises.map((ex: any) =>
                ex.exerciseId === editingId
                    ? { ...ex, exerciseName: selectedExercise.name, sets: Number(data.sets), reps: Number(data.reps), restTime: Number(data.restTime) }
                    : ex
            );
            session.exercisesToDo = updatedExercises;
        } else {
            const newEx = {
                exerciseId: Date.now(),
                exerciseName: selectedExercise.name,
                sets: Number(data.sets),
                reps: Number(data.reps),
                restTime: Number(data.restTime),
            };
            session.exercisesToDo = [...exercises, newEx];
        }
        setSession({ ...session });
        syncSession();
        setIsFormOpen(false);
        setEditingId(null);
        reset();
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const oldIndex = exercises.findIndex((ex: any) => ex.exerciseId === active.id);
            const newIndex = exercises.findIndex((ex: any) => ex.exerciseId === over.id);
            session.exercisesToDo = arrayMove(exercises, oldIndex, newIndex);
            setSession({ ...session });
            syncSession();
        }
    };

    const handleDeleteExercise = async (id: number) => {
        Swal.fire({
            title: t('confirmDeleteTitle'),
            text: t('confirmDeleteText'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: t('confirmDeleteButton'),
            cancelButtonText: t('cancelButton'),
            background: theme === 'dark' ? '#18181b' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#18181b',
        }).then((result) => {
            if (result.isConfirmed) {
                session.exercisesToDo = session.exercisesToDo.filter((ex: any) => ex.exerciseId !== id);
                setSession({ ...session });
                syncSession();
            }
        });
    };

    // NOVA FUNÇÃO: Edição rápida do histórico de séries
    const handleUpdateHistorySet = (exIdx: number, setIdx: number, field: string, value: string) => {
        const updatedDone = [...session.exercisesDone];
        (updatedDone[exIdx].sets[setIdx] as any)[field] = Number(value);
        setSession({ ...session, exercisesDone: updatedDone });
        syncSession();
    };

    const handleFullClose = () => {
        setIsFormOpen(false);
        setEditingId(null);
        onClose();
    };

    if (!showPreview) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleFullClose} />

            <div className="relative w-full bg-zinc-950 rounded-t-[40px] border-t border-zinc-800 p-6 max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 opacity-50" />

                {/* Header com Abas e Botões */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
                        <button
                            onClick={() => setActiveTab('todo')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'todo' ? 'bg-lime-400 text-zinc-950' : 'text-zinc-500'}`}
                        >
                            <Dumbbell size={14} /> {t('tabs.todo') || 'Roteiro'}
                        </button>
                        <button
                            onClick={() => setActiveTab('done')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'done' ? 'bg-lime-400 text-zinc-950' : 'text-zinc-500'}`}
                        >
                            <History size={14} /> {t('tabs.done') || 'Realizados'}
                        </button>
                    </div>

                    <div className="flex gap-2">
                        {activeTab === 'todo' && (
                            <button onClick={handleOpenAdd} className="p-3 bg-lime-400 rounded-2xl text-zinc-950 active:scale-95 shadow-lg shadow-lime-400/20">
                                <Plus size={20} />
                            </button>
                        )}
                        <button onClick={handleFullClose} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Conteúdo Dinâmico com Scroll */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
                    {activeTab === 'todo' ? (
                        <div className="space-y-3">
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={exercises.map((ex: any) => ex.exerciseId)} strategy={verticalListSortingStrategy}>
                                    {exercises.map((ex: any, idx: number) => (
                                        <DraggableExerciseItem
                                            key={ex.exerciseId}
                                            ex={ex}
                                            idx={idx}
                                            currentExerciseIndex={currentExerciseIndex}
                                            onRemove={handleDeleteExercise}
                                            onEdit={handleEditClick}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {doneExercises.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-zinc-900 rounded-[32px]">
                                    <History size={32} className="mx-auto mb-3 text-zinc-800" />
                                    <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest italic">
                                        {t('empty') || 'Nenhum exercício concluído'}
                                    </p>
                                </div>
                            ) : (
                                doneExercises.map((ex, exIdx) => (
                                    <div key={exIdx} className="bg-zinc-900/40 border border-zinc-800/50 rounded-[32px] overflow-hidden">
                                        {/* Header do Exercício Concluído */}
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

                                        {/* Listagem de Séries Estilizada */}
                                        <div className="p-4 space-y-3">
                                            {ex.sets.map((set, setIdx) => (
                                                <div key={setIdx} className="flex items-center gap-3 bg-zinc-950/40 p-2 rounded-2xl border border-zinc-800/30">
                                                    {/* Indicador de número da série */}
                                                    <div className="flex flex-col items-center justify-center min-w-[32px] h-10 bg-zinc-900 rounded-xl border border-zinc-800">
                                                        <span className="text-xs font-black text-zinc-500 leading-none">{t('set')}</span>
                                                        <span className="text-xs font-black text-lime-400 leading-none mt-0.5">{setIdx + 1}</span>
                                                    </div>

                                                    {/* Inputs Grid */}
                                                    <div className="grid grid-cols-3 gap-2 flex-1">
                                                        {['weight', 'reps', 'rpe'].map((field) => (
                                                            <div key={field} className="relative group">
                                                                <label className="absolute -top-1.5 left-2 px-1 bg-zinc-950 text-xs font-black text-zinc-500 uppercase tracking-tighter">
                                                                    {t(`${field}`) || field}
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    min={0}
                                                                    max={field === "rpe" ? 10 : undefined}
                                                                    defaultValue={(set as any)[field]}
                                                                    onBlur={(e) => handleUpdateHistorySet(exIdx, setIdx, field, e.target.value)}
                                                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2 px-2 text-xs font-bold outline-none text-zinc-200 focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/20 transition-all text-center"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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

                {/* Formulário Único MANTIDO INTEGRALMENTE */}
                {isFormOpen && (
                    <div className="absolute inset-0 bg-zinc-950 z-20 rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-lg font-black uppercase italic tracking-tighter">
                                {editingId ? t('editExercise') || 'Editar Exercício' : t('addExercise')}
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
                                <Save size={18} /> {editingId ? t('confirmEdit') || 'Salvar Alterações' : t('confirmAdd')}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};