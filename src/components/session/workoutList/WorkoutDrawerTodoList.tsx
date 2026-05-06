import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableExerciseItem } from './DraggableExerciseItem';
import { ExerciseGroup } from '@/config/types';

interface WorkoutDrawerTodoListProps {
    groups: ExerciseGroup[];
    currentGroupIndex: number;
    activeId: string | null;
    activeGroup: ExerciseGroup | null;
    handleDragStart: (event: any) => void;
    handleDragOver: (event: any) => void;
    handleDragEnd: (event: any) => void;
    handleDeleteGroup: (idx: number) => void;
    handleEditClick: (group: ExerciseGroup, idx: number) => void;
}

export const WorkoutDrawerTodoList = ({
    groups,
    currentGroupIndex,
    activeId,
    activeGroup,
    handleDragStart,
    handleDragOver,
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
            <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={groups.map((g: any) => g.id || '')} strategy={verticalListSortingStrategy}>
                    {groups.map((group: ExerciseGroup, idx: number) => (
                        <DraggableExerciseItem
                            key={group.id || `group-${idx}`}
                            group={group}
                            idx={idx}
                            currentGroupIndex={currentGroupIndex}
                            onRemove={handleDeleteGroup}
                            onEdit={handleEditClick}
                            isAnyItemDragging={!!activeId}
                        />
                    ))}
                </SortableContext>

                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.4',
                            },
                        },
                    }),
                }}>
                    {activeId && activeGroup ? (
                        <DraggableExerciseItem
                            group={activeGroup}
                            idx={groups.findIndex(g => g.id === activeId)}
                            currentGroupIndex={currentGroupIndex}
                            onRemove={() => { }}
                            onEdit={() => { }}
                            isOverlay
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};
