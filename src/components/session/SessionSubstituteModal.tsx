'use client';

import { ExerciseSubstituteModal, ExerciseSubstituteModalProps } from '@/components/exercises/ExerciseSubstituteModal';

export type SessionSubstituteModalProps = ExerciseSubstituteModalProps;

export function SessionSubstituteModal(props: SessionSubstituteModalProps) {
    return <ExerciseSubstituteModal {...props} />;
}


