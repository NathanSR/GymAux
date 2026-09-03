import { useState, useEffect } from 'react';
import { Session, ExerciseGroup, Exercise } from '@/config/types';
import { useDialog } from '@/hooks/useDialog';
import { arrayMove } from '@dnd-kit/sortable';
import { SessionService } from '@/services/sessionService';
import { startTopLoader } from '@/utils/topLoader';

export const useWorkoutDrawer = (
    session: Session,
    setSession: (session: Session) => void,
    syncSession: (session: Session) => void,
    isDark: boolean,
    t: any,
    onClose: () => void
) => {
    const { confirm, error: showError } = useDialog();
    const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGroupIdx, setEditingGroupIdx] = useState<number | null>(null);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeGroup, setActiveGroup] = useState<any>(null);

    const [substituteTarget, setSubstituteTarget] = useState<{
        groupIdx: number;
        exIdx: number;
        exerciseId: number;
        exerciseName: string;
    } | null>(null);

    // Ensure all groups have stable IDs for DnD
    useEffect(() => {
        if (session.exercisesToDo && session.exercisesToDo.length > 0) {
            const hasMissingId = session.exercisesToDo.some(g => !g.id);
            if (hasMissingId) {
                const updated = session.exercisesToDo.map(g => ({
                    ...g,
                    id: g.id || `group-${crypto.randomUUID()}`
                }));
                const updatedSession = { ...session, exercisesToDo: updated };
                setSession(updatedSession);
                syncSession(updatedSession);
            }
        }
    }, [session.exercisesToDo]);

    const handleDragStart = (event: any) => {
        const { active } = event;
        setActiveId(active.id);
        const group = session.exercisesToDo?.find(g => g.id === active.id);
        if (group) setActiveGroup(group);
    };

    const handleDragOver = (event: any) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const groups = [...(session.exercisesToDo || [])];
            const oldIndex = groups.findIndex(g => g.id === active.id);
            const newIndex = groups.findIndex(g => g.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const newGroups = arrayMove(groups, oldIndex, newIndex);
                setSession({ ...session, exercisesToDo: newGroups });
            }
        }
    };

    const handleDragEnd = () => {
        setActiveId(null);
        setActiveGroup(null);
        syncSession(session);
    };

    const handleDeleteGroup = async (idx: number) => {
        const result = await confirm({
            title: t('confirmDeleteTitle'),
            description: t('confirmDeleteText'),
            variant: 'delete',
            confirmText: t('confirmDeleteButton'),
            cancelText: t('cancelButton'),
        });

        if (result.isConfirmed) {
            const updatedToDo = (session.exercisesToDo || []).filter((_: any, i: number) => i !== idx);
            const updatedSession = { ...session, exercisesToDo: updatedToDo };
            setSession(updatedSession);
            syncSession(updatedSession);
        }
    };

    const handleUpdateHistorySet = (groupIdx: number, exIdx: number, setIdx: number, field: string, value: string | number) => {
        const updatedDone = [...(session.exercisesDone || [])];
        const group = updatedDone[groupIdx];
        if (!group) return;
        
        const exercises = [...(group.exercises || [])];
        const exercise = exercises[exIdx];
        if (!exercise) return;
        
        const sets = [...(exercise.sets || [])];
        sets[setIdx] = { ...sets[setIdx], [field]: Number(value) };
        exercises[exIdx] = { ...exercise, sets };
        updatedDone[groupIdx] = { ...group, exercises };
        
        const updatedSession = { ...session, exercisesDone: updatedDone };
        setSession(updatedSession);
        syncSession(updatedSession);
    };

    const handleUpdateHistorySetDrop = (
        groupIdx: number,
        exIdx: number,
        setIdx: number,
        dropIdx: number,
        field: 'weight' | 'reps',
        value: number
    ) => {
        const updatedDone = [...(session.exercisesDone || [])];
        const group = updatedDone[groupIdx];
        if (!group) return;

        const exercises = [...(group.exercises || [])];
        const exercise = exercises[exIdx];
        if (!exercise) return;

        const sets = [...(exercise.sets || [])];
        const targetSet = sets[setIdx];
        if (!targetSet || !targetSet.dropset) return;

        const dropset = [...targetSet.dropset];
        if (!dropset[dropIdx]) return;

        dropset[dropIdx] = {
            ...dropset[dropIdx],
            [field]: Math.max(field === 'reps' ? 1 : 0, Number(value) || 0)
        };

        const totalReps = dropset.reduce((sum, d) => sum + Number(d.reps || 0), 0);
        const firstWeight = Number(dropset[0]?.weight || 0);

        sets[setIdx] = {
            ...targetSet,
            dropset,
            weight: firstWeight,
            reps: totalReps
        };

        exercises[exIdx] = { ...exercise, sets };
        updatedDone[groupIdx] = { ...group, exercises };

        const updatedSession = { ...session, exercisesDone: updatedDone };
        setSession(updatedSession);
        syncSession(updatedSession);
    };

    const handleUpdateHistorySetDropset = (
        groupIdx: number,
        exIdx: number,
        setIdx: number,
        dropset: { reps: number; weight: number }[] | null
    ) => {
        const updatedDone = [...(session.exercisesDone || [])];
        const group = updatedDone[groupIdx];
        if (!group) return;

        const exercises = [...(group.exercises || [])];
        const exercise = exercises[exIdx];
        if (!exercise) return;

        const sets = [...(exercise.sets || [])];
        const targetSet = sets[setIdx];
        if (!targetSet) return;

        if (dropset && dropset.length > 1) {
            const sanitizedDrops = dropset.map((d, idx) => ({
                weight: Math.max(0, Number(d.weight) || (idx === 0 ? (Number(targetSet.weight) || 20) : 0)),
                reps: Math.max(1, Number(d.reps) || (Number(targetSet.reps) || 10))
            }));
            const totalReps = sanitizedDrops.reduce((sum, d) => sum + Number(d.reps || 0), 0);
            const firstWeight = Number(sanitizedDrops[0]?.weight || 0);

            sets[setIdx] = {
                ...targetSet,
                technique: 'drop_set',
                dropset: sanitizedDrops,
                weight: firstWeight,
                reps: totalReps
            };
        } else {
            sets[setIdx] = {
                ...targetSet,
                technique: targetSet.technique === 'drop_set' ? 'normal' : targetSet.technique,
                dropset: undefined
            };
        }

        exercises[exIdx] = { ...exercise, sets };
        updatedDone[groupIdx] = { ...group, exercises };

        const updatedSession = { ...session, exercisesDone: updatedDone };
        setSession(updatedSession);
        syncSession(updatedSession);
    };

    const handleAddHistoryDrop = (groupIdx: number, exIdx: number, setIdx: number) => {
        const updatedDone = [...(session.exercisesDone || [])];
        const group = updatedDone[groupIdx];
        if (!group) return;

        const exercises = [...(group.exercises || [])];
        const exercise = exercises[exIdx];
        if (!exercise) return;

        const sets = [...(exercise.sets || [])];
        const targetSet = sets[setIdx];
        if (!targetSet) return;

        let dropset: { reps: number; weight: number }[] = [];
        if (targetSet.dropset && targetSet.dropset.length > 0) {
            dropset = [...targetSet.dropset];
            const lastDrop = dropset[dropset.length - 1];
            const nextWeight = Math.max(0, Math.round(Number(lastDrop.weight) * 0.8 * 2) / 2);
            dropset.push({ weight: nextWeight, reps: Number(lastDrop.reps) || 10 });
        } else {
            const currentWeight = Number(targetSet.weight) || 20;
            const currentReps = Number(targetSet.reps) || 10;
            dropset = [
                { weight: currentWeight, reps: currentReps },
                { weight: Math.max(0, Math.round(currentWeight * 0.8 * 2) / 2), reps: currentReps }
            ];
        }

        const totalReps = dropset.reduce((sum, d) => sum + Number(d.reps || 0), 0);
        const firstWeight = Number(dropset[0]?.weight || 0);

        sets[setIdx] = {
            ...targetSet,
            technique: 'drop_set',
            dropset,
            weight: firstWeight,
            reps: totalReps
        };

        exercises[exIdx] = { ...exercise, sets };
        updatedDone[groupIdx] = { ...group, exercises };

        const updatedSession = { ...session, exercisesDone: updatedDone };
        setSession(updatedSession);
        syncSession(updatedSession);
    };

    const handleRemoveHistoryDrop = (groupIdx: number, exIdx: number, setIdx: number, dropIdx: number) => {
        const updatedDone = [...(session.exercisesDone || [])];
        const group = updatedDone[groupIdx];
        if (!group) return;

        const exercises = [...(group.exercises || [])];
        const exercise = exercises[exIdx];
        if (!exercise) return;

        const sets = [...(exercise.sets || [])];
        const targetSet = sets[setIdx];
        if (!targetSet || !targetSet.dropset) return;

        const dropset = [...targetSet.dropset];
        dropset.splice(dropIdx, 1);

        if (dropset.length <= 1) {
            sets[setIdx] = {
                ...targetSet,
                technique: targetSet.technique === 'drop_set' ? 'normal' : targetSet.technique,
                dropset: undefined,
                weight: dropset[0]?.weight ?? targetSet.weight ?? 0,
                reps: dropset[0]?.reps ?? targetSet.reps ?? 10
            };
        } else {
            const totalReps = dropset.reduce((sum, d) => sum + Number(d.reps || 0), 0);
            const firstWeight = Number(dropset[0]?.weight || 0);

            sets[setIdx] = {
                ...targetSet,
                dropset,
                weight: firstWeight,
                reps: totalReps
            };
        }

        exercises[exIdx] = { ...exercise, sets };
        updatedDone[groupIdx] = { ...group, exercises };

        const updatedSession = { ...session, exercisesDone: updatedDone };
        setSession(updatedSession);
        syncSession(updatedSession);
    };

    const handleSaveGroup = (updatedGroup: ExerciseGroup) => {
        const groupToSave: ExerciseGroup = {
            ...updatedGroup,
            id: updatedGroup.id || `group-${crypto.randomUUID()}`
        };
        const updatedGroups = [...(session.exercisesToDo || [])];
        if (editingGroupIdx !== null && updatedGroups[editingGroupIdx]) {
            updatedGroups[editingGroupIdx] = groupToSave;
        } else {
            updatedGroups.push(groupToSave);
        }
        const updatedSession: Session = { ...session, exercisesToDo: updatedGroups };
        setSession(updatedSession);
        syncSession(updatedSession);
        setIsFormOpen(false);
        setEditingGroupIdx(null);
    };

    const onConfirmDeleteSession = async () => {
        const result = await confirm({
            title: t('confirmDeleteSessionTitle'),
            description: t('confirmDeleteSessionText'),
            variant: 'delete',
            confirmText: t('confirmDeleteSessionButton'),
            cancelText: t('cancelButton'),
        });

        if (result.isConfirmed) {
            try {
                if (session.id) {
                    await SessionService.deleteSession(session.id);
                    // Force a hard redirect to bypass any Next.js router unmount/lifecycle issues
                    if (typeof window !== 'undefined') {
                        startTopLoader();
                        window.location.href = '/home';
                    }
                }
            } catch (error) {
                console.error('Error deleting session:', error);
                showError('Error', 'Could not delete session');
            }
        }
    };

    const handleFullClose = () => {
        setIsFormOpen(false);
        setEditingGroupIdx(null);
        setSubstituteTarget(null);
        onClose();
    };

    const handleOpenAdd = () => {
        setEditingGroupIdx(null);
        setIsFormOpen(true);
    };

    const handleOpenSubstitute = (groupIdx: number, exIdx: number = 0) => {
        const group = session.exercisesToDo?.[groupIdx];
        const ex = group?.exercises?.[exIdx];
        if (!ex) return;

        setSubstituteTarget({
            groupIdx,
            exIdx,
            exerciseId: ex.exerciseId,
            exerciseName: ex.exerciseName
        });
    };

    const handleCloseSubstitute = () => {
        setSubstituteTarget(null);
    };

    const handleSelectSubstitute = (newEx: Exercise) => {
        if (!substituteTarget || !newEx.id) return;
        const { groupIdx, exIdx } = substituteTarget;

        const updatedToDo = [...(session.exercisesToDo || [])];
        const group = updatedToDo[groupIdx];
        if (!group) return;

        const updatedExercises = [...group.exercises];
        const currentEx = updatedExercises[exIdx];
        if (!currentEx) return;

        updatedExercises[exIdx] = {
            ...currentEx,
            exerciseId: newEx.id,
            exerciseName: newEx.name
        };

        updatedToDo[groupIdx] = {
            ...group,
            exercises: updatedExercises
        };

        const updatedSession = { ...session, exercisesToDo: updatedToDo };
        setSession(updatedSession);
        syncSession(updatedSession);
        setSubstituteTarget(null);
    };

    return {
        activeTab,
        setActiveTab,
        isFormOpen,
        setIsFormOpen,
        editingGroupIdx,
        setEditingGroupIdx,
        activeId,
        activeGroup,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleDeleteGroup,
        handleUpdateHistorySet,
        handleUpdateHistorySetDrop,
        handleUpdateHistorySetDropset,
        handleAddHistoryDrop,
        handleRemoveHistoryDrop,
        handleSaveGroup,
        onConfirmDeleteSession,
        handleFullClose,
        handleOpenAdd,
        substituteTarget,
        handleOpenSubstitute,
        handleCloseSubstitute,
        handleSelectSubstitute
    };
};
