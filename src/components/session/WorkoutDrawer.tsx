'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from '@/i18n/routing';
import { Session } from '@/config/types';
import { useWorkoutDrawer } from './useWorkoutDrawer';
import { WorkoutDrawerHeader } from './WorkoutDrawerHeader';
import { WorkoutDrawerTodoList } from './WorkoutDrawerTodoList';
import { WorkoutDrawerDoneList } from './WorkoutDrawerDoneList';
import { WorkoutDrawerForm } from './WorkoutDrawerForm';

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
    currentExerciseIndex 
}: WorkoutDrawerProps) => {
    const t = useTranslations('WorkoutDrawer');
    const te = useTranslations('Exercises');
    const { isDark } = useTheme();
    const router = useRouter();

    const {
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
    } = useWorkoutDrawer(session, setSession, syncSession, isDark, t, router, onClose);

    if (!showPreview) return null;

    const groups = session.exercisesToDo || [];
    const doneGroups = session.exercisesDone || [];
    const hasDoneExercises = doneGroups.some(g => g.exercises.length > 0);
    const currentGroupIndex = session.current?.groupIndex || 0;

    return (
        <div className="fixed inset-0 z-[60] flex items-end animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleFullClose} />

            <div className="relative w-full bg-zinc-950 rounded-t-[40px] border-t border-zinc-800 p-6 max-h-[92vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-full duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 opacity-50" />

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
                            handleDragEnd={handleDragEnd}
                            handleDeleteGroup={handleDeleteGroup}
                            handleEditClick={(group, idx) => {
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

                <WorkoutDrawerForm
                    session={session}
                    setSession={setSession}
                    syncSession={syncSession}
                    isFormOpen={isFormOpen}
                    setIsFormOpen={setIsFormOpen}
                    editingGroupIdx={editingGroupIdx}
                    setEditingGroupIdx={setEditingGroupIdx}
                    t={t}
                    te={te}
                />
            </div>
        </div>
    );
};