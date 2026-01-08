'use client';
import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { X, Plus, Save, Dumbbell, ChevronDown, GripVertical } from "lucide-react";
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

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<{ id: number; name: string } | null>(null);

    // Estado para controle de edição
    const [editingId, setEditingId] = useState<number | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: { sets: 3, reps: 12, restTime: 60 }
    });

    const exercises = session.exercisesToDo || [];

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Abrir formulário para ADICIONAR
    const handleOpenAdd = () => {
        setEditingId(null);
        setSelectedExercise(null);
        reset({ sets: 3, reps: 12, restTime: 60 });
        setIsFormOpen(true);
    };

    // Abrir formulário para EDITAR
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
            // MODO EDIÇÃO
            const updatedExercises = exercises.map((ex: any) =>
                ex.exerciseId === editingId
                    ? { ...ex, exerciseName: selectedExercise.name, sets: Number(data.sets), reps: Number(data.reps), restTime: Number(data.restTime) }
                    : ex
            );
            session.exercisesToDo = updatedExercises;
        } else {
            // MODO ADIÇÃO
            const newEx = {
                exerciseId: Math.random(), // Idealmente um ID único do banco ou UUID
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

    // FUNÇÃO PARA FECHAR TUDO E RESETAR
    const handleFullClose = () => {
        setIsFormOpen(false); // Garante que ao reabrir voltará para a lista
        setEditingId(null);
        onClose();
    };

    if (!showPreview) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleFullClose} />

            <div className="relative w-full bg-zinc-950 rounded-t-[40px] border-t border-zinc-800 p-6 max-h-[90vh] flex flex-col shadow-2xl">
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 opacity-50" />

                {/* Header do Drawer */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">{t('title')}</h3>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">
                            {exercises.length} {t('totalExercises')}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleOpenAdd} className="p-3 bg-lime-400 rounded-2xl text-zinc-950 active:scale-95 shadow-lg shadow-lime-400/20">
                            <Plus size={20} />
                        </button>
                        <button onClick={handleFullClose} className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Lista de Exercícios */}
                <div className="flex-1 overflow-y-auto space-y-3 pb-10 custom-scrollbar">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={exercises.map((ex: any) => ex.exerciseId)} strategy={verticalListSortingStrategy}>
                            {exercises.map((ex: any, idx: number) => (
                                <div key={ex.exerciseId}>
                                    <DraggableExerciseItem
                                        ex={ex}
                                        idx={idx}
                                        currentExerciseIndex={currentExerciseIndex}
                                        onRemove={handleDeleteExercise}
                                        onEdit={handleEditClick}
                                    />
                                </div>
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>

                {/* Modal Seletor */}
                <ExerciseSelector
                    isOpen={isSelectorOpen}
                    onClose={() => setIsSelectorOpen(false)}
                    onSelect={handleSelectExercise}
                />

                {/* Formulário Único (Adição e Edição) */}
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
                                            <span className="text-sm font-black uppercase tracking-tight">
                                                {selectedExercise
                                                    ? (te.has(selectedExercise.name) ? te(selectedExercise.name) : selectedExercise.name)
                                                    : t('selectExercise')}
                                            </span>
                                        </div>
                                        <ChevronDown size={16} className="text-zinc-400" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {/* Inputs replicados com o estilo anterior */}
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