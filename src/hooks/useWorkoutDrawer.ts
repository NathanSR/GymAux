import { useState, useEffect } from 'react';
import { Session, ExerciseGroup } from '@/config/types';
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

    const handleDragEnd = (event: any) => {
        setActiveId(null);
        setActiveGroup(null);
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const groups = [...(session.exercisesToDo || [])];
            const oldIndex = groups.findIndex(g => g.id === active.id);
            const newIndex = groups.findIndex(g => g.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const newGroups = arrayMove(groups, oldIndex, newIndex);
                const updatedSession: Session = { ...session, exercisesToDo: newGroups };
                setSession(updatedSession);
                syncSession(updatedSession);
            }
        }
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

    const handleUpdateHistorySet = (groupIdx: number, exIdx: number, setIdx: number, field: string, value: string) => {
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
        onClose();
    };

    const handleOpenAdd = () => {
        setEditingGroupIdx(null);
        setIsFormOpen(true);
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
        handleDragEnd,
        handleDeleteGroup,
        handleUpdateHistorySet,
        handleSaveGroup,
        onConfirmDeleteSession,
        handleFullClose,
        handleOpenAdd
    };
};
