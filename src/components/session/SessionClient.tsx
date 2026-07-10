"use client";

import { useRef, useState } from 'react';
import { Session } from '@/config/types';
import { RestTimer } from '@/components/session/RestTimer';
import { WorkoutDrawer } from '@/components/session/workoutList/WorkoutDrawer';
import { useTranslations } from 'next-intl';
import { CompletedSession } from '@/components/session/CompletedSession';
import { ExerciseInstructionModal } from '@/components/session/ExerciseInstructionModal';
import { motion, AnimatePresence } from 'framer-motion';
import { SessionSubstituteModal } from './SessionSubstituteModal';
import { ExerciseSelector } from '../exercises/ExerciseSelector';

import { useSessionClient } from '../../hooks/useSessionClient';
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

    const [showSubstitute, setShowSubstitute] = useState(false);
    const [showFullSelector, setShowFullSelector] = useState(false);

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
        handleAddSet,
        exitSession,
        synchronizeProgress,
        lastWeightUsed,
        handleSubstituteExercise
    } = useSessionClient({
        initialSession,
        isReadOnly,
        watchValues: () => watchValuesRef.current ? watchValuesRef.current() : { weight: 0, reps: 0, rpe: 7, dropset: undefined }
    });

    const isCompletion = session.current.step === 'completion';

    return (
        <div className="h-[100dvh] bg-zinc-950 text-white flex flex-col font-sans selection:bg-lime-400 selection:text-zinc-950 overflow-hidden">
            <AnimatePresence mode="wait">
                {isCompletion ? (
                    <motion.div
                        key="completion"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1"
                    >
                        <CompletedSession session={session} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="active"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col overflow-hidden"
                    >
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
                                            onAddSet={handleAddSet}
                                            onForceFinishWorkout={handleForceFinishWorkout}
                                            setWatchValues={(watchFn) => { watchValuesRef.current = watchFn; }}
                                            lastWeightUsed={lastWeightUsed}
                                            onSubstituteExercise={() => setShowSubstitute(true)}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </main>

                        {/* Modais de Substituição Dinâmica de Exercícios */}
                        <SessionSubstituteModal
                            isOpen={showSubstitute}
                            onClose={() => setShowSubstitute(false)}
                            exerciseId={currentExercise?.exerciseId || null}
                            exerciseName={currentExercise?.exerciseName || null}
                            onSelectSubstitute={handleSubstituteExercise}
                            onOpenFullSelector={() => setShowFullSelector(true)}
                        />

                        <ExerciseSelector
                            isOpen={showFullSelector}
                            onClose={() => setShowFullSelector(false)}
                            onSelect={handleSubstituteExercise}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
