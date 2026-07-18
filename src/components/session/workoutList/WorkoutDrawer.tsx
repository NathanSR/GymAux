'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext';
import { Session } from '@/config/types';
import { WorkoutDrawerHeader } from './WorkoutDrawerHeader';
import { WorkoutDrawerTodoList } from './WorkoutDrawerTodoList';
import { WorkoutDrawerDoneList } from './WorkoutDrawerDoneList';
import ExerciseConfigModal from '@/components/workouts/ExerciseConfigModal';
import { useWorkoutDrawer } from '@/hooks/useWorkoutDrawer';
import { Drawer } from '@/components/ui/Drawer';

interface WorkoutDrawerProps {
    showPreview: boolean;
    onClose: () => void;
    session: Session;
    setSession: (session: Session) => void;
    syncSession: () => void;
    currentExerciseIndex: number;
}

export const WorkoutDrawer = ({
    showPreview,
    onClose,
    session,
    setSession,
    syncSession,
}: WorkoutDrawerProps) => {
    const t = useTranslations('WorkoutDrawer');
    const te = useTranslations('Exercises');
    const { isDark } = useTheme();

    const {
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
    } = useWorkoutDrawer(session, setSession, syncSession, isDark, t, onClose);

    const groups = session.exercisesToDo || [];
    const doneGroups = session.exercisesDone || [];
    const hasDoneExercises = doneGroups.some(g => g && g.exercises && g.exercises.length > 0);
    const currentGroupIndex = session.current?.groupIndex || 0;

    const handleSaveGroup = (updatedGroup: any) => {
        const updatedGroups = [...(session.exercisesToDo || [])];
        if (editingGroupIdx !== null && updatedGroups[editingGroupIdx]) {
            updatedGroups[editingGroupIdx] = updatedGroup;
        } else {
            updatedGroups.push(updatedGroup);
        }
        setSession({ ...session, exercisesToDo: updatedGroups });
        syncSession();
        setIsFormOpen(false);
        setEditingGroupIdx(null);
    };

    return (
        <Drawer
            isOpen={showPreview}
            onClose={handleFullClose}
            showClose={false}
            bodyClassName="p-6 relative flex flex-col"
        >
            <WorkoutDrawerHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onConfirmDeleteSession={onConfirmDeleteSession}
                handleOpenAdd={handleOpenAdd}
                handleFullClose={handleFullClose}
                t={t}
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
                {activeTab === 'todo' ? (
                    <WorkoutDrawerTodoList
                        groups={groups}
                        currentGroupIndex={currentGroupIndex}
                        activeId={activeId}
                        activeGroup={activeGroup}
                        handleDragStart={handleDragStart}
                        handleDragOver={handleDragOver}
                        handleDragEnd={handleDragEnd}
                        handleDeleteGroup={handleDeleteGroup}
                        handleEditClick={(_, idx) => {
                            setEditingGroupIdx(idx);
                            setIsFormOpen(true);
                        }}
                    />
                ) : (
                    <WorkoutDrawerDoneList
                        doneGroups={doneGroups}
                        hasDoneExercises={hasDoneExercises}
                        t={t}
                        te={te}
                        handleUpdateHistorySet={handleUpdateHistorySet}
                    />
                )}
            </div>

            <ExerciseConfigModal
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingGroupIdx(null);
                }}
                groupData={editingGroupIdx !== null ? groups[editingGroupIdx] : null}
                onSave={handleSaveGroup}
            />
        </Drawer>
    );
};