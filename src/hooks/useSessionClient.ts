import { useState, useEffect, useCallback } from 'react';
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
    watchValues?: () => { weight: number; reps: number; rpe: number };
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

        const newSet: ExecutedSet = {
            weight: Number(formData.weight),
            reps: Number(formData.reps),
            rpe: Number(formData.rpe),
            skipped,
            technique: currentPlannedSet?.technique || 'normal'
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
        exitSession,
        synchronizeProgress
    };
}
