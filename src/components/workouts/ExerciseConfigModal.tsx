"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { ExerciseGroup } from '@/config/types';
import { ExerciseConfigForm } from './ExerciseConfigForm';

interface ExerciseConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupData: ExerciseGroup | null;
    onSave: (group: ExerciseGroup) => void;
}

export const ExerciseConfigModal: React.FC<ExerciseConfigModalProps> = ({
    isOpen,
    onClose,
    groupData,
    onSave
}) => {
    const t = useTranslations('WorkoutForm');
    const te = useTranslations('Exercises');

    const titleText = groupData?.exercises?.[0]?.exerciseName
        ? (te.has(groupData.exercises[0].exerciseName) ? te(groupData.exercises[0].exerciseName) : groupData.exercises[0].exerciseName)
        : t('selectExercise');

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={titleText}
            maxWidth="max-w-2xl"
        >
            <div className="p-5">
                <ExerciseConfigForm
                    initialGroupData={groupData}
                    onSave={(updatedGroup) => {
                        onSave(updatedGroup);
                        onClose();
                    }}
                    onCancel={onClose}
                />
            </div>
        </Modal>
    );
};

export default ExerciseConfigModal;
