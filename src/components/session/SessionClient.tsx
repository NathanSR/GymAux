"use client";

import { useRef } from 'react';
import { Session } from '@/config/types';
import { RestTimer } from '@/components/session/RestTimer';
import { WorkoutDrawer } from '@/components/session/WorkoutDrawer';
import { useTranslations } from 'next-intl';
import { CompletedSession } from '@/components/session/CompletedSession';
import { ExerciseInstructionModal } from '@/components/session/ExerciseInstructionModal';
import { motion, AnimatePresence } from 'framer-motion';

import { useSessionClient } from './useSessionClient';
import { SessionHeader } from './SessionHeader';
import { SessionExerciseInfo } from './SessionExerciseInfo';
import { SessionSetForm } from './SessionSetForm';

interface SessionClientProps {
    initialSession: Session;
    isReadOnly?: boolean;
}

export default function SessionClient({ initialSession, isReadOnly = false }: SessionClientProps) {
    const t = useTranslations('Session');

    const watchValuesRef = useRef<(() => { weight: number; reps: number; rpe: number }) | null>(null);

    const {
        session,
        setSession,
        showPreview,
        setShowPreview,
        showInstructions,
        setShowInstructions,
        restDuration,
        currentGroupIndex,
        currentExerciseIndex,
        currentSetIndex,
        currentGroup,
        currentExercise,
        currentPlannedSet,
        isGroupAlternating,
        handleSetCompletion,
        moveToNextStep,
        handleSkipSet,
        handleSkipExercise,
        handleForceFinishWorkout,
        exitSession,
        synchronizeProgress
    } = useSessionClient({
        initialSession,
        isReadOnly,
        watchValues: () => watchValuesRef.current ? watchValuesRef.current() : { weight: 0, reps: 0, rpe: 7 }
    });

    if (session.current.step === 'completion') {
        return <CompletedSession session={session} />;
    }

    return (
        <div className="h-[100dvh] bg-zinc-950 text-white flex flex-col font-sans selection:bg-lime-400 selection:text-zinc-950 overflow-hidden">
            <WorkoutDrawer
                showPreview={showPreview}
                onClose={() => setShowPreview(false)}
                session={session}
                setSession={setSession}
                syncSession={() => synchronizeProgress(session)}
                currentExerciseIndex={currentGroupIndex}
            />

            <ExerciseInstructionModal
                isOpen={showInstructions}
                onClose={() => setShowInstructions(false)}
                exerciseId={currentExercise?.exerciseId as number}
            />

            <SessionHeader
                session={session}
                currentGroupIndex={currentGroupIndex}
                onExit={() => exitSession(session.id as string)}
                onOpenPreview={() => setShowPreview(true)}
            />

            <main className="flex-1 flex flex-col px-5 py-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
                <SessionExerciseInfo
                    currentGroup={currentGroup}
                    currentExercise={currentExercise}
                    currentPlannedSet={currentPlannedSet}
                    currentGroupIndex={currentGroupIndex}
                    currentExerciseIndex={currentExerciseIndex}
                    currentSetIndex={currentSetIndex}
                    totalGroups={session.exercisesToDo.length}
                    isGroupAlternating={isGroupAlternating}
                    onOpenInstructions={() => setShowInstructions(true)}
                />

                <AnimatePresence mode="wait">
                    {session.current.step === 'resting' ? (
                        <motion.div
                            key="resting"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="flex-1 flex flex-col justify-center"
                        >
                            <RestTimer
                                seconds={restDuration}
                                onFinish={moveToNextStep}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="executing"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-3"
                        >
                            <SessionSetForm
                                currentPlannedSet={currentPlannedSet}
                                currentGroupIndex={currentGroupIndex}
                                currentExerciseIndex={currentExerciseIndex}
                                currentSetIndex={currentSetIndex}
                                isReadOnly={isReadOnly}
                                isGroupAlternating={isGroupAlternating}
                                onCompleteSet={handleSetCompletion}
                                onSkipSet={handleSkipSet}
                                onSkipExercise={handleSkipExercise}
                                setWatchValues={(watchFn) => { watchValuesRef.current = watchFn; }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="pb-8 pt-4">
                    <button
                        type="button"
                        onClick={handleForceFinishWorkout}
                        className="w-full py-4 text-zinc-600 hover:text-rose-500 transition-all font-black uppercase text-[9px] tracking-[0.3em] opacity-50 hover:opacity-100 flex items-center justify-center gap-2"
                    >
                        <div className="w-8 h-[1px] bg-zinc-800" />
                        {t('finishNow')}
                        <div className="w-8 h-[1px] bg-zinc-800" />
                    </button>
                </div>
            </main>
        </div>
    );
}
