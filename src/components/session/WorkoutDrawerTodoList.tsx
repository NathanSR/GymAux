import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, TouchSensor } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableExerciseItem } from './DraggableExerciseItem';
import { ExerciseGroup } from '@/config/types';

interface WorkoutDrawerTodoListProps {
    groups: ExerciseGroup[];
    currentGroupIndex: number;
    handleDragEnd: (event: any) => void;
    handleDeleteGroup: (idx: number) => void;
    handleEditClick: (group: ExerciseGroup, idx: number) => void;
}

export const WorkoutDrawerTodoList = ({
    groups,
    currentGroupIndex,
    handleDragEnd,
    handleDeleteGroup,
    handleEditClick
}: WorkoutDrawerTodoListProps) => {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    return (
        <div className="space-y-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={groups.map((_: any, i: number) => `group-${i}`)} strategy={verticalListSortingStrategy}>
                    {groups.map((group: ExerciseGroup, idx: number) => (
                        <DraggableExerciseItem
                            key={`group-${idx}`}
                            group={group}
                            idx={idx}
                            currentGroupIndex={currentGroupIndex}
                            onRemove={handleDeleteGroup}
                            onEdit={handleEditClick}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
};
