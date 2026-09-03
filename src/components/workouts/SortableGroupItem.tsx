"use client";

import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useWatch, useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { WorkoutExerciseCard } from './WorkoutExerciseCard';

interface SortableGroupItemProps {
    group: any;
    groupIndex: number;
    removeGroup: (index: number) => void;
    onOpenConfigModal: (groupIndex: number) => void;
    onReplaceGroup?: (groupIndex: number) => void;
    isAnyItemDragging?: boolean;
    isReorderMode?: boolean;
    isOverlay?: boolean;
}

export const SortableGroupItem = memo(({
    group,
    groupIndex,
    removeGroup,
    onOpenConfigModal,
    onReplaceGroup,
    isAnyItemDragging = false,
    isReorderMode = false,
    isOverlay = false
}: SortableGroupItemProps) => {
    const { control } = useFormContext();

    const groupType = useWatch({
        control,
        name: `exercises.${groupIndex}.groupType`
    }) || group?.groupType || 'straight';

    const rounds = useWatch({
        control,
        name: `exercises.${groupIndex}.rounds`
    }) || group?.rounds || 1;

    const exercisesInGroup = useWatch({
        control,
        name: `exercises.${groupIndex}.exercises`
    }) || group?.exercises || [];

    const restAfterGroup = useWatch({
        control,
        name: `exercises.${groupIndex}.restAfterGroup`
    }) || group?.restAfterGroup || 60;

    const liveGroup = {
        ...group,
        groupType,
        rounds,
        exercises: exercisesInGroup,
        restAfterGroup
    };

    const {
        attributes,
        listeners,
        setNodeRef,
        isDragging
    } = useSortable({
        id: group.id,
        disabled: isOverlay || !isReorderMode
    });

    const style = {
        zIndex: isOverlay ? 100 : (isDragging ? 50 : 1),
    };

    const dragHandle = isReorderMode ? (
        <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 -ml-1 cursor-grab active:cursor-grabbing text-lime-500 rounded-lg hover:bg-lime-500/10 transition-colors"
            style={{ touchAction: 'none' }}
        >
            <GripVertical size={18} />
        </div>
    ) : undefined;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{
                opacity: isOverlay ? 1 : (isDragging ? 0.3 : 1),
                y: 0,
                scale: isOverlay ? 1.01 : 1,
                boxShadow: isOverlay
                    ? '0 20px 40px -10px rgba(132, 204, 22, 0.2)'
                    : (isDragging ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)')
            }}
            exit={{ opacity: 0, scale: 0.96 }}
            ref={setNodeRef}
            style={style}
        >
            <WorkoutExerciseCard
                group={liveGroup}
                index={groupIndex}
                isDragging={isDragging && !isOverlay}
                isReorderMode={isReorderMode}
                dragHandle={dragHandle}
                onClick={!isReorderMode ? () => onOpenConfigModal(groupIndex) : undefined}
                onEdit={() => onOpenConfigModal(groupIndex)}
                onReplace={onReplaceGroup ? () => onReplaceGroup(groupIndex) : undefined}
                onRemove={() => removeGroup(groupIndex)}
                className={isOverlay ? 'ring-2 ring-lime-400/30 border-lime-500 shadow-xl' : ''}
            />
        </motion.div>
    );
});

export default SortableGroupItem;

