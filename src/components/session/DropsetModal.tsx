import React from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { DropsetEditor, DropsetPart } from './DropsetEditor';

interface DropsetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (dropset: DropsetPart[] | null) => void;
    initialDropset: DropsetPart[] | null;
    defaultWeight: number;
    defaultReps: number;
    zIndex?: string | number;
}

export function DropsetModal({
    isOpen,
    onClose,
    onSave,
    initialDropset,
    defaultWeight,
    defaultReps,
    zIndex = "z-[200]"
}: DropsetModalProps) {
    const t = useTranslations('Session.dropsetModal');

    const handleSave = (dropset: DropsetPart[] | null) => {
        onSave(dropset);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('title')}
            maxWidth="max-w-md"
            zIndex={zIndex}
            className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 p-5 rounded-3xl"
        >
            <div className="p-1">
                <DropsetEditor
                    initialDropset={initialDropset}
                    defaultWeight={defaultWeight}
                    defaultReps={defaultReps}
                    onSave={handleSave}
                    onCancel={onClose}
                />
            </div>
        </Modal>
    );
}

export type { DropsetPart };

