import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Session, ExecutedSet, Exercise } from '@/config/types';
import { useSessionNavigation } from '@/hooks/useSessionNavigation';
import { useSessionActions } from '@/hooks/useSessionActions';
import { useAlerts } from '@/hooks/useAlerts';
import { OverlayStackManager } from './useOverlayStack';
import { useTranslations } from 'next-intl';
import { SessionService } from '@/services/sessionService';
import { ExerciseService } from '@/services/exerciseService';

interface UseSessionClientProps {
    initialSession: Session;
    isReadOnly?: boolean;
    watchValues?: () => { weight: number; reps: number; rpe: number; dropset?: { reps: number; weight: number }[] };
}

function cloneSession(s: Session): Session {
    try {
        return structuredClone(s);
    } catch {
        return JSON.parse(JSON.stringify(s));
    }
}

function getInitialRestDuration(initialSession: Session): number {
    if (initialSession.current?.step === 'resting' && initialSession.current?.restEndsAt) {
        const remaining = Math.ceil((initialSession.current.restEndsAt - Date.now()) / 1000);
        return Math.max(1, remaining);
    }
    const gIdx = initialSession.current?.groupIndex || 0;
    const eIdx = initialSession.current?.exerciseIndex || 0;
    const sIdx = initialSession.current?.setIndex || 0;
    const group = initialSession.exercisesToDo?.[gIdx];
    const ex = group?.exercises?.[eIdx];
    return ex?.sets?.[sIdx]?.restTime || group?.restAfterGroup || 60;
}

export function useSessionClient({ initialSession, isReadOnly = false, watchValues }: UseSessionClientProps) {
    const t = useTranslations('Session');
    const { exitSession, forceFinishWorkout } = useSessionActions();
    const { confirm } = useAlerts();

    const [session, setSession] = useState<Session>(initialSession);
    const [showPreview, setShowPreview] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [restDuration, setRestDuration] = useState<number>(() => getInitialRestDuration(initialSession));
    const [currentExerciseDetails, setCurrentExerciseDetails] = useState<Exercise | null>(null);
    const inFlightWritesRef = useRef(0);

    const { getNextState } = useSessionNavigation(session);

    const currentGroupIndex = session.current?.groupIndex || 0;
    const currentExerciseIndex = session.current?.exerciseIndex || 0;
    const currentSetIndex = session.current?.setIndex || 0;

    const currentGroup = session.exercisesToDo?.[currentGroupIndex];
    const currentExercise = currentGroup?.exercises?.[currentExerciseIndex];
    const currentPlannedSet = currentExercise?.sets?.[currentSetIndex];

    const isGroupAlternating = currentGroup?.groupType !== 'straight';

    // Protege contra perda de escrita caso o usuário acione reload durante uma transação IndexedDB ativa
    useEffect(() => {
        if (typeof window === 'undefined' || isReadOnly) return;
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (inFlightWritesRef.current > 0) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isReadOnly]);

    useEffect(() => {
        let isMounted = true;
        if (!currentExercise?.exerciseId) {
            setCurrentExerciseDetails(null);
            return;
        }
        ExerciseService.getExerciseById(currentExercise.exerciseId).then(ex => {
            if (isMounted) {
                setCurrentExerciseDetails(ex || null);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [currentExercise?.exerciseId]);

    useEffect(() => {
        if (isReadOnly) return;

        if (typeof window !== 'undefined') {
            window.history.pushState({ ...window.history.state, __sessionTrap: true }, '', window.location.href);
        }
        const handleBackButton = (event: PopStateEvent) => {
            if (OverlayStackManager.isCleaningUpHistory()) {
                return;
            }
            const hasOverlayOpen = showPreview || OverlayStackManager.hasOpenOverlays();
            if (hasOverlayOpen) {
                return;
            }

            event.preventDefault();
            if (session.id) exitSession(session.id);
            if (typeof window !== 'undefined') {
                window.history.pushState({ ...window.history.state, __sessionTrap: true }, '', window.location.href);
            }
        };
        window.addEventListener('popstate', handleBackButton);
        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [session.id, exitSession, showPreview, isReadOnly]);

    const synchronizeProgress = useCallback(async (newSession: Session) => {
        if (!newSession.id || isReadOnly) return;
        inFlightWritesRef.current += 1;
        try {
            await SessionService.syncSessionProgress(newSession.id, { ...newSession });
        } catch (err) {
            console.error('[useSessionClient] Failed to persist session progress:', err);
        } finally {
            inFlightWritesRef.current = Math.max(0, inFlightWritesRef.current - 1);
        }
    }, [isReadOnly]);

    const handleSetCompletion = useCallback((formData: any, skipped: boolean = false) => {
        if (!session || !currentExercise || !currentGroup) return;

        const isDropSet = formData.dropset && formData.dropset.length > 0;
        const newSet: ExecutedSet = {
            weight: isDropSet ? Number(formData.dropset[0].weight) : Number(formData.weight),
            reps: isDropSet ? formData.dropset.reduce((acc: number, d: any) => acc + Number(d.reps), 0) : Number(formData.reps),
            rpe: Number(formData.rpe),
            skipped,
            technique: isDropSet ? 'drop_set' : (currentPlannedSet?.technique || 'normal'),
            dropset: isDropSet ? formData.dropset : undefined
        };

        // Cópia profunda imutável: nunca mutar o estado React in-place!
        const newSession = cloneSession(session);
        if (!Array.isArray(newSession.exercisesDone)) {
            newSession.exercisesDone = [];
        }

        if (!newSession.exercisesDone[currentGroupIndex]) {
            newSession.exercisesDone[currentGroupIndex] = {
                groupType: currentGroup.groupType,
                exercises: []
            };
        }

        const executedGroup = newSession.exercisesDone[currentGroupIndex];

        let exIdx = executedGroup.exercises.findIndex(e => e.exerciseId === currentExercise.exerciseId);
        if (exIdx === -1) {
            executedGroup.exercises.push({
                exerciseId: currentExercise.exerciseId,
                exerciseName: currentExercise.exerciseName,
                sets: []
            });
            exIdx = executedGroup.exercises.length - 1;
        }

        executedGroup.exercises[exIdx].sets.push(newSet);

        const { nextGroupIndex, nextExerciseIndex, nextSetIndex, isLastActionInWorkout } = getNextState();

        if (isLastActionInWorkout) {
            newSession.current.step = 'completion';
            newSession.current.restEndsAt = null;
            if (!session.pausedAt && session.resumedAt) {
                const finalSegment = new Date().getTime() - new Date(session.resumedAt).getTime();
                newSession.duration += Math.max(0, finalSegment);
            }
        } else {
            let shouldRest = true;
            let calculatedRestTime = 60;

            const isNextSameGroup = nextGroupIndex === currentGroupIndex;

            if (currentGroup.groupType === 'straight') {
                if (isNextSameGroup) {
                    calculatedRestTime = currentPlannedSet?.restTime || 60;
                } else {
                    calculatedRestTime = currentGroup.restAfterGroup || 60;
                }
            } else {
                if (isNextSameGroup) {
                    if (nextSetIndex > currentSetIndex) {
                        calculatedRestTime = currentGroup.restAfterGroup || 60;
                    } else {
                        shouldRest = true;
                        calculatedRestTime = 3;
                    }
                } else {
                    calculatedRestTime = currentGroup.restAfterGroup || 60;
                }
            }

            setRestDuration(calculatedRestTime);
            newSession.current.step = shouldRest ? 'resting' : 'executing';
            newSession.current.groupIndex = nextGroupIndex;
            newSession.current.exerciseIndex = nextExerciseIndex;
            newSession.current.setIndex = nextSetIndex;
            newSession.current.restEndsAt = shouldRest ? Date.now() + calculatedRestTime * 1000 : null;
        }

        setSession(newSession);
        if (!isReadOnly) {
            synchronizeProgress(newSession);
        }
    }, [session, currentExercise, currentGroup, currentPlannedSet, currentGroupIndex, currentSetIndex, getNextState, isReadOnly, synchronizeProgress]);

    const moveToNextStep = useCallback(() => {
        const newSession = cloneSession(session);
        newSession.current.step = 'executing';
        newSession.current.restEndsAt = null;
        setSession(newSession);
        if (!isReadOnly) {
            synchronizeProgress(newSession);
        }
    }, [session, isReadOnly, synchronizeProgress]);

    const handleSkipSet = useCallback(async () => {
        const result = await confirm({
            title: t('skipSetTitle'),
            text: t('skipSetText'),
            icon: 'warning',
            confirmText: t('skipSetConfirm'),
            cancelText: t('exitCancel'),
        });
        if (result.isConfirmed && watchValues) {
            const currentValues = watchValues();
            handleSetCompletion(currentValues, true);
        }
    }, [confirm, t, watchValues, handleSetCompletion]);

    const handleSkipExercise = useCallback(async () => {
        const result = await confirm({
            title: t('skipExerciseTitle'),
            text: t('skipExerciseText'),
            icon: 'warning',
            confirmText: t('skipExerciseConfirm'),
            cancelText: t('exitCancel'),
            danger: true
        });
        if (result.isConfirmed) {
            const newSession = cloneSession(session);
            const nextGroupIndex = currentGroupIndex + 1;

            if (nextGroupIndex < session.exercisesToDo.length) {
                newSession.current.groupIndex = nextGroupIndex;
                newSession.current.exerciseIndex = 0;
                newSession.current.setIndex = 0;
                newSession.current.step = 'executing';
                newSession.current.restEndsAt = null;
            } else {
                newSession.current.step = 'completion';
                newSession.current.restEndsAt = null;
            }
            setSession(newSession);
            synchronizeProgress(newSession);
        }
    }, [confirm, t, session, currentGroupIndex, synchronizeProgress]);

    const handleForceFinishWorkout = useCallback(() => {
        forceFinishWorkout(
            session,
            (updated) => setSession(updated),
            (updated) => synchronizeProgress(updated)
        );
    }, [forceFinishWorkout, session, synchronizeProgress]);

    const handleAddSet = useCallback(() => {
        const newSession = cloneSession(session);
        const group = newSession.exercisesToDo[currentGroupIndex];
        if (!group) return;

        if (group.groupType === 'straight') {
            const exercise = group.exercises[currentExerciseIndex];
            if (exercise) {
                const lastSet = exercise.sets[exercise.sets.length - 1] || { reps: 10, restTime: 60 };
                exercise.sets.push({ ...lastSet });
            }
        } else {
            group.rounds = (group.rounds || 1) + 1;
            group.exercises.forEach((ex: any) => {
                const lastSet = ex.sets[ex.sets.length - 1] || { reps: 10, restTime: 60 };
                ex.sets.push({ ...lastSet });
            });
        }

        setSession(newSession);
        synchronizeProgress(newSession);
    }, [session, currentGroupIndex, currentExerciseIndex, synchronizeProgress]);

    const handleSubstituteExercise = useCallback((newEx: Exercise) => {
        if (!session || !currentExercise || !currentGroup) return;

        const newSession = cloneSession(session);

        if (newSession.exercisesToDo?.[currentGroupIndex]?.exercises?.[currentExerciseIndex]) {
            newSession.exercisesToDo[currentGroupIndex].exercises[currentExerciseIndex] = {
                ...currentExercise,
                exerciseId: newEx.id as number,
                exerciseName: newEx.name,
                variation: undefined,
                executionMode: undefined
            };
        }

        if (newSession.exercisesDone?.[currentGroupIndex]) {
            const executedGroup = newSession.exercisesDone[currentGroupIndex];
            const exIdx = executedGroup.exercises.findIndex(e => e.exerciseId === currentExercise.exerciseId);
            if (exIdx !== -1) {
                executedGroup.exercises[exIdx].exerciseId = newEx.id as number;
                executedGroup.exercises[exIdx].exerciseName = newEx.name;
            }
        }

        setSession(newSession);
        synchronizeProgress(newSession);
    }, [session, currentExercise, currentGroup, currentGroupIndex, currentExerciseIndex, synchronizeProgress]);

    const handleUpdateRestDuration = useCallback((seconds: number) => {
        setRestDuration(seconds);
        if (!session || !currentExercise || !currentGroup) return;

        const newSession = cloneSession(session);
        const group = newSession.exercisesToDo[currentGroupIndex];
        if (group) {
            if (group.groupType === 'straight') {
                const ex = group.exercises[currentExerciseIndex];
                if (ex) {
                    ex.sets.forEach((s: any) => {
                        s.restTime = seconds;
                    });
                }
            } else {
                group.restAfterGroup = seconds;
            }
        }

        if (newSession.current.step === 'resting') {
            newSession.current.restEndsAt = Date.now() + seconds * 1000;
        }

        setSession(newSession);
        synchronizeProgress(newSession);
    }, [session, currentExercise, currentGroup, currentGroupIndex, currentExerciseIndex, synchronizeProgress]);

    const lastWeightUsed = useMemo(() => {
        if (!currentExercise?.exerciseId) return null;
        for (let i = session.exercisesDone.length - 1; i >= 0; i--) {
            const group = session.exercisesDone[i];
            if (!group) continue;

            const ex = group.exercises.find(e => e.exerciseId === currentExercise.exerciseId);
            if (ex && ex.sets.length > 0) {
                for (let j = ex.sets.length - 1; j >= 0; j--) {
                    const s = ex.sets[j];
                    if (!s.skipped && s.weight !== undefined && s.weight !== null) {
                        return s.weight;
                    }
                }
            }
        }
        return null;
    }, [session.exercisesDone, currentExercise?.exerciseId]);

    const getLastExecutedSetInfo = useCallback(() => {
        if (!session.exercisesDone || session.exercisesDone.length === 0) return null;
        for (let gIdx = session.exercisesDone.length - 1; gIdx >= 0; gIdx--) {
            const group = session.exercisesDone[gIdx];
            if (!group || !group.exercises || group.exercises.length === 0) continue;
            for (let exIdx = group.exercises.length - 1; exIdx >= 0; exIdx--) {
                const ex = group.exercises[exIdx];
                if (ex && ex.sets && ex.sets.length > 0) {
                    const lastSetIndex = ex.sets.length - 1;
                    return {
                        groupIndex: gIdx,
                        exerciseIndex: exIdx,
                        setIndex: lastSetIndex,
                        set: ex.sets[lastSetIndex]
                    };
                }
            }
        }
        return null;
    }, [session.exercisesDone]);

    const lastExecutedSetRpe = useMemo(() => {
        const info = getLastExecutedSetInfo();
        if (info && info.set && info.set.rpe !== undefined) {
            return info.set.rpe;
        }
        return 7;
    }, [getLastExecutedSetInfo]);

    const handleUpdateLastSetRpe = useCallback(async (newRpe: number) => {
        const info = getLastExecutedSetInfo();
        if (!info) return;

        const updatedSession = cloneSession(session);
        const group = updatedSession.exercisesDone[info.groupIndex];
        if (group && group.exercises[info.exerciseIndex]) {
            const ex = group.exercises[info.exerciseIndex];
            if (ex.sets[info.setIndex]) {
                ex.sets[info.setIndex] = { ...ex.sets[info.setIndex], rpe: newRpe };
                setSession(updatedSession);
                await synchronizeProgress(updatedSession);
            }
        }
    }, [getLastExecutedSetInfo, session, synchronizeProgress]);

    return {
        session,
        setSession,
        showPreview,
        setShowPreview,
        showInstructions,
        setShowInstructions,
        restDuration,
        setRestDuration,
        currentGroupIndex,
        currentExerciseIndex,
        currentSetIndex,
        currentGroup,
        currentExercise,
        currentExerciseDetails,
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
        lastExecutedSetRpe,
        handleUpdateLastSetRpe,
        handleSubstituteExercise,
        handleUpdateRestDuration
    };
}
