import { useState, useEffect, useCallback, useMemo } from 'react';
import { Session, ExecutedSet, Exercise } from '@/config/types';
import { useSessionNavigation } from '@/hooks/useSessionNavigation';
import { useSessionActions } from '@/hooks/useSessionActions';
import { useAlerts } from '@/hooks/useAlerts';
import { useTranslations } from 'next-intl';
import { SessionService } from '@/services/sessionService';
import { ExerciseService } from '@/services/exerciseService';
import { UseFormWatch } from 'react-hook-form';

interface UseSessionClientProps {
    initialSession: Session;
    isReadOnly?: boolean;
    watchValues?: () => { weight: number; reps: number; rpe: number; dropset?: { reps: number; weight: number }[] };
}

export function useSessionClient({ initialSession, isReadOnly = false, watchValues }: UseSessionClientProps) {
    const t = useTranslations('Session');
    const { exitSession, forceFinishWorkout } = useSessionActions();
    const { confirm } = useAlerts();

    const [session, setSession] = useState<Session>(initialSession);
    const [showPreview, setShowPreview] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [restDuration, setRestDuration] = useState<number>(60);
    const [currentExerciseDetails, setCurrentExerciseDetails] = useState<Exercise | null>(null);

    const { getNextState } = useSessionNavigation(session);

    const currentGroupIndex = session.current?.groupIndex || 0;
    const currentExerciseIndex = session.current?.exerciseIndex || 0;
    const currentSetIndex = session.current?.setIndex || 0;

    const currentGroup = session.exercisesToDo?.[currentGroupIndex];
    const currentExercise = currentGroup?.exercises?.[currentExerciseIndex];
    const currentPlannedSet = currentExercise?.sets?.[currentSetIndex];

    const isGroupAlternating = currentGroup?.groupType !== 'straight';

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
        if (typeof window !== 'undefined') {
            window.history.pushState({ ...window.history.state, __sessionTrap: true }, '', window.location.href);
        }
        const handleBackButton = (event: PopStateEvent) => {
            if (event.state && (event.state.__modalId || event.state.__drawerId)) {
                return;
            }
            const hasOverlayOpen = showPreview || document.querySelector('[role="dialog"]:not([data-state="closed"])') !== null;
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
    }, [session.id, exitSession, showPreview]);

    const synchronizeProgress = useCallback(async (newSession: Session) => {
        if (!newSession.id) return;
        await SessionService.syncSessionProgress(newSession.id, { ...newSession });
    }, []);

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

        const newSession = { ...session };
        let updatedExecutions = [...newSession.exercisesDone];

        if (!updatedExecutions[currentGroupIndex]) {
            updatedExecutions[currentGroupIndex] = {
                groupType: currentGroup.groupType,
                exercises: []
            };
        }

        const executedGroup = updatedExecutions[currentGroupIndex];

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
        newSession.exercisesDone = updatedExecutions;

        const { nextGroupIndex, nextExerciseIndex, nextSetIndex, isLastActionInWorkout } = getNextState();

        if (isLastActionInWorkout) {
            newSession.current.step = 'completion';
            if (!session.pausedAt && session.resumedAt) {
                const finalSegment = new Date().getTime() - session.resumedAt.getTime();
                newSession.duration += finalSegment;
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
        }

        setSession(newSession);
        if (!isReadOnly) {
            synchronizeProgress(newSession);
        }
    }, [session, currentExercise, currentGroup, currentPlannedSet, currentGroupIndex, getNextState, isReadOnly, synchronizeProgress]);

    const moveToNextStep = useCallback(() => {
        const newSession = { ...session };
        newSession.current.step = 'executing';
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
            const newSession = { ...session };
            const nextGroupIndex = currentGroupIndex + 1;

            if (nextGroupIndex < session.exercisesToDo.length) {
                newSession.current.groupIndex = nextGroupIndex;
                newSession.current.exerciseIndex = 0;
                newSession.current.setIndex = 0;
                newSession.current.step = 'executing';
            } else {
                newSession.current.step = 'completion';
            }
            setSession(newSession);
            synchronizeProgress(newSession);
        }
    }, [confirm, t, session, currentGroupIndex, synchronizeProgress]);

    const handleForceFinishWorkout = useCallback(() => {
        forceFinishWorkout(session, (s) => setSession(s as Session), () => synchronizeProgress(session));
    }, [forceFinishWorkout, session, synchronizeProgress]);

    const handleAddSet = useCallback(() => {
        const newSession = { ...session };
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

        const newSession = { ...session };
        
        // 1. Atualizar o exercício em exercisesToDo (planejados)
        newSession.exercisesToDo[currentGroupIndex].exercises[currentExerciseIndex] = {
            ...currentExercise,
            exerciseId: newEx.id as number,
            exerciseName: newEx.name,
            variation: undefined,
            executionMode: undefined
        };

        // 2. Se já tiver feito alguma execução desse exercício na sessão atual, atualiza também em exercisesDone
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

        const newSession = { ...session };
        const group = newSession.exercisesToDo[currentGroupIndex];
        if (group) {
            if (group.groupType === 'straight') {
                const ex = group.exercises[currentExerciseIndex];
                if (ex) {
                    ex.sets.forEach(s => {
                        s.restTime = seconds;
                    });
                }
            } else {
                group.restAfterGroup = seconds;
            }
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

    const lastExecutedSetRpe = useMemo(() => {
        if (!currentExercise?.exerciseId) return 7;
        for (let i = session.exercisesDone.length - 1; i >= 0; i--) {
            const group = session.exercisesDone[i];
            if (!group) continue;
            const ex = group.exercises.find(e => e.exerciseId === currentExercise.exerciseId);
            if (ex && ex.sets.length > 0) {
                const lastSet = ex.sets[ex.sets.length - 1];
                if (lastSet && lastSet.rpe !== undefined) {
                    return lastSet.rpe;
                }
            }
        }
        return 7;
    }, [session.exercisesDone, currentExercise?.exerciseId]);

    const handleUpdateLastSetRpe = useCallback(async (newRpe: number) => {
        if (!currentExercise?.exerciseId) return;
        const updatedSession = { ...session };
        const updatedExecutions = [...updatedSession.exercisesDone];

        if (updatedExecutions[currentGroupIndex]) {
            const group = updatedExecutions[currentGroupIndex];
            const ex = group.exercises.find(e => e.exerciseId === currentExercise.exerciseId);
            if (ex && ex.sets.length > 0) {
                const lastSetIndex = ex.sets.length - 1;
                ex.sets[lastSetIndex] = { ...ex.sets[lastSetIndex], rpe: newRpe };
                updatedSession.exercisesDone = updatedExecutions;
                setSession(updatedSession);
                await synchronizeProgress(updatedSession);
            }
        }
    }, [currentExercise?.exerciseId, currentGroupIndex, session, synchronizeProgress]);

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
