import { Session } from '@/config/types';

export const useSessionNavigation = (session: Session) => {
    const currentGroupIndex = session.current.groupIndex;
    const currentExerciseIndex = session.current.exerciseIndex;
    const currentSetIndex = session.current.setIndex;

    const currentGroup = session.exercisesToDo[currentGroupIndex];
    if (!currentGroup) {
        return {
            getNextState: () => ({
                nextGroupIndex: 0,
                nextExerciseIndex: 0,
                nextSetIndex: 0,
                isLastActionInWorkout: true
            })
        };
    }

    const isGroupAlternating = currentGroup.groupType !== 'straight';

    const getNextState = () => {
        const totalExercisesInGroup = currentGroup.exercises.length;
        const currentExercise = currentGroup.exercises[currentExerciseIndex];
        const totalSetsInExercise = currentExercise?.sets.length || 0;
        
        // Use currentGroup.rounds for alternating groups, otherwise use totalSetsInExercise
        const totalRounds = isGroupAlternating ? (currentGroup.rounds || 1) : totalSetsInExercise;

        let nextGroupIndex = currentGroupIndex;
        let nextExerciseIndex = currentExerciseIndex;
        let nextSetIndex = currentSetIndex;
        let isLastActionInWorkout = false;

        if (isGroupAlternating) {
            // Alternating (e.g., Bi-Set, Tri-Set, Giant-Set, Circuit)
            // Priority: exerciseIndex (change exercise in the same round) -> setIndex (change round) -> groupIndex (change group)
            if (nextExerciseIndex < totalExercisesInGroup - 1) {
                // Next exercise in the same round
                nextExerciseIndex++;
            } else {
                // Round finished, check if there's a next round
                if (nextSetIndex < totalRounds - 1) {
                    // Next round
                    nextSetIndex++;
                    nextExerciseIndex = 0;
                } else {
                    // Group Finished, check if there's a next group
                    if (nextGroupIndex < session.exercisesToDo.length - 1) {
                        nextGroupIndex++;
                        nextExerciseIndex = 0;
                        nextSetIndex = 0;
                    } else {
                        isLastActionInWorkout = true;
                    }
                }
            }
        } else {
            // Straight Group
            // Priority: setIndex -> exerciseIndex -> groupIndex
            if (nextSetIndex < totalSetsInExercise - 1) {
                // Next set of same exercise
                nextSetIndex++;
            } else {
                // Exercise finished, check if there's another exercise in the group
                if (nextExerciseIndex < totalExercisesInGroup - 1) {
                    nextExerciseIndex++;
                    nextSetIndex = 0;
                } else {
                    // Group Finished, check if there's a next group
                    if (nextGroupIndex < session.exercisesToDo.length - 1) {
                        nextGroupIndex++;
                        nextExerciseIndex = 0;
                        nextSetIndex = 0;
                    } else {
                        isLastActionInWorkout = true;
                    }
                }
            }
        }

        return {
            nextGroupIndex,
            nextExerciseIndex,
            nextSetIndex,
            isLastActionInWorkout
        };
    };

    return { getNextState };
};
