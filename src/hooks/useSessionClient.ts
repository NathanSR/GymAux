import { useState, useEffect, useCallback, useMemo } from 'react';
import { Session, ExecutedSet } from '@/config/types';
import { useSessionNavigation } from '@/hooks/useSessionNavigation';
import { useSessionActions } from '@/hooks/useSessionActions';
import { useAlerts } from '@/hooks/useAlerts';
import { useTranslations } from 'next-intl';
import { SessionService } from '@/services/sessionService';
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

    const { getNextState } = useSessionNavigation(session);

    const currentGroupIndex = session.current?.groupIndex || 0;
    const currentExerciseIndex = session.current?.exerciseIndex || 0;
    const currentSetIndex = session.current?.setIndex || 0;

    const currentGroup = session.exercisesToDo?.[currentGroupIndex];
    const currentExercise = currentGroup?.exercises?.[currentExerciseIndex];
    const currentPlannedSet = currentExercise?.sets?.[currentSetIndex];

    const isGroupAlternating = currentGroup?.groupType !== 'straight';

    useEffect(() => {
        window.history.pushState(null, '', window.location.href);
        const handleBackButton = (event: PopStateEvent) => {
            event.preventDefault();
            if (session.id) exitSession(session.id);
            window.history.pushState(null, '', window.location.href);
        };
        window.addEventListener('popstate', handleBackButton);
        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [session.id, exitSession]);

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

    const lastWeightUsed = useMemo(() => {
        if (!currentExercise) return null;

        // Find the most recent execution of this exerciseId in the current session
        for (let i = session.exercisesDone.length - 1; i >= 0; i--) {
            const group = session.exercisesDone[i];
            if (!group) continue;

            const ex = group.exercises.find(e => e.exerciseId === currentExercise.exerciseId);
            if (ex && ex.sets.length > 0) {
                // Get the last non-skipped set with a valid weight
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

    return {
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
        lastWeightUsed
    };
}
