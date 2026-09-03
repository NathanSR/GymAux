'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from "lucide-react";
import { ExerciseGroup } from '@/config/types';
import { motion } from 'framer-motion';
import { WorkoutExerciseCard } from '@/components/workouts/WorkoutExerciseCard';

interface DraggableExerciseItemProps {
    group: ExerciseGroup;
    idx: number;
    currentGroupIndex: number;
    onRemove: (idx: number) => void;
    onEdit: (group: ExerciseGroup, idx: number) => void;
    onReplace?: (group: ExerciseGroup, idx: number) => void;
    isReorderMode?: boolean;
    isOverlay?: boolean;
    isAnyItemDragging?: boolean;
}

export const DraggableExerciseItem = ({ 
    group, 
    idx, 
    currentGroupIndex, 
    onRemove, 
    onEdit,
    onReplace,
    isReorderMode = false,
    isOverlay = false,
    isAnyItemDragging = false
}: DraggableExerciseItemProps) => {
    const groupId = group.id || `group-${idx}`;

    const { attributes, listeners, setNodeRef, isDragging } = useSortable({
        id: groupId,
        disabled: isOverlay || !isReorderMode || idx < currentGroupIndex
    });

    const style = {
        zIndex: isOverlay ? 100 : (isDragging ? 50 : 1),
    };

    const isCurrent = idx === currentGroupIndex;
    const isCompleted = idx < currentGroupIndex;

    const dragHandle = isReorderMode && !isCompleted ? (
        <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className={`p-1.5 rounded-lg transition-all duration-300 ${
                isOverlay
                    ? 'cursor-grabbing text-lime-600 dark:text-lime-400'
                    : 'cursor-grab text-zinc-400 dark:text-zinc-600 hover:text-lime-600 dark:hover:text-lime-400'
            }`}
            style={{ touchAction: 'none' }}
        >
            <GripVertical size={18} />
        </div>
    ) : undefined;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
                opacity: isOverlay ? 1 : (isDragging ? 0.3 : (isAnyItemDragging ? 0.6 : 1)), 
                y: 0,
                scale: isOverlay ? 1.02 : 1,
                boxShadow: isOverlay 
                    ? '0 25px 50px -12px rgba(132, 204, 22, 0.25)' 
                    : 'none'
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            ref={setNodeRef}
            style={style}
        >
            <WorkoutExerciseCard
                group={group}
                index={idx}
                isCurrent={isCurrent}
                isCompleted={isCompleted}
                isDragging={isDragging && !isOverlay}
                isReorderMode={isReorderMode}
                dragHandle={dragHandle}
                onEdit={!isCompleted && !isOverlay && !isReorderMode ? () => onEdit(group, idx) : undefined}
                onReplace={!isCompleted && !isOverlay && !isReorderMode && onReplace ? () => onReplace(group, idx) : undefined}
                onRemove={!isCompleted && !isOverlay && !isCurrent && !isReorderMode ? () => onRemove(idx) : undefined}
                className={isOverlay ? 'ring-2 ring-lime-400/40 border-lime-500 shadow-xl' : ''}
            />
        </motion.div>
    );
};