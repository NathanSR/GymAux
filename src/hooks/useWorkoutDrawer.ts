import { useState, useEffect } from 'react';
import { Session } from '@/config/types';
import { useDialog } from '@/hooks/useDialog';
import { arrayMove } from '@dnd-kit/sortable';
import { SessionService } from '@/services/sessionService';
import { useRouter } from '@/i18n/routing';

import { startTopLoader } from '@/utils/topLoader';

export const useWorkoutDrawer = (
    session: Session,
    setSession: (session: Session) => void,
    syncSession: () => void,
    isDark: boolean,
    t: any,
    onClose: () => void
) => {
    const router = useRouter();
    const { confirm, error: showError } = useDialog();
    const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGroupIdx, setEditingGroupIdx] = useState<number | null>(null);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeGroup, setActiveGroup] = useState<any>(null);

    // Ensure all groups have stable IDs for DnD
    useEffect(() => {
        if (session.exercisesToDo) {
            const hasMissingId = session.exercisesToDo.some(g => !g.id);
            if (hasMissingId) {
                const updated = session.exercisesToDo.map(g => ({
                    ...g,
                    id: g.id || `group-${Math.random().toString(36).substr(2, 9)}`
                }));
                setSession({ ...session, exercisesToDo: updated });
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
        if (active && over && active.id !== over.id) {
            const groups = [...(session.exercisesToDo || [])];
            const oldIndex = groups.findIndex(g => g.id === active.id);
            const newIndex = groups.findIndex(g => g.id === over.id);
            
            if (oldIndex !== -1 && newIndex !== -1) {
                const newGroups = arrayMove(groups, oldIndex, newIndex);
                setSession({ ...session, exercisesToDo: newGroups });
            }
        }
    };

    const handleDragEnd = (event: any) => {
        setActiveId(null);
        setActiveGroup(null);
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            syncSession();
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
            session.exercisesToDo = session.exercisesToDo.filter((_: any, i: number) => i !== idx);
            setSession({ ...session });
            syncSession();
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
        exercise.sets = sets;
        exercises[exIdx] = exercise;
        
        const updatedGroup = { ...group, exercises };
        updatedDone[groupIdx] = updatedGroup;
        setSession({ ...session, exercisesDone: updatedDone });
        syncSession();
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
        handleDragOver,
        handleDragEnd,
        handleDeleteGroup,
        handleUpdateHistorySet,
        onConfirmDeleteSession,
        handleFullClose,
        handleOpenAdd
    };
};
