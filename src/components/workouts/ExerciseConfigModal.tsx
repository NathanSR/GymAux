"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { ExerciseGroup } from '@/config/types';
import { ExerciseConfigForm } from './ExerciseConfigForm';
import { useExerciseLocalization } from '@/hooks/useExerciseLocalization';

interface ExerciseConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupData: ExerciseGroup | null;
    onSave: (group: ExerciseGroup) => void;
    zIndex?: string | number;
}

export const ExerciseConfigModal: React.FC<ExerciseConfigModalProps> = ({
    isOpen,
    onClose,
    groupData,
    onSave,
    zIndex = "z-[150]"
}) => {
    const t = useTranslations('WorkoutForm');
    const { getLocalizedName } = useExerciseLocalization();

    const firstEx = groupData?.exercises?.[0];
    const titleText = getLocalizedName(firstEx?.exerciseId, firstEx?.exerciseName) || t('selectExercise');

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={titleText}
            maxWidth="max-w-2xl"
            zIndex={zIndex}
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
