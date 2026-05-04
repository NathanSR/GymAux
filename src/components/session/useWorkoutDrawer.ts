import { useState } from 'react';
import { Session } from '@/config/types';
import Swal from 'sweetalert2';
import { arrayMove } from '@dnd-kit/sortable';
import { SessionService } from '@/services/sessionService';

export const useWorkoutDrawer = (
    session: Session,
    setSession: (session: Session) => void,
    syncSession: () => void,
    isDark: boolean,
    t: any,
    router: any,
    onClose: () => void
) => {
    const [activeTab, setActiveTab] = useState<'todo' | 'done'>('todo');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGroupIdx, setEditingGroupIdx] = useState<number | null>(null);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const groups = session.exercisesToDo || [];
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
        const updatedDone = [...(session.exercisesDone || [])];
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
        handleDragEnd,
        handleDeleteGroup,
        handleUpdateHistorySet,
        onConfirmDeleteSession,
        handleFullClose,
        handleOpenAdd
    };
};
