import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { GripVertical, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DraggableExerciseItem } from './DraggableExerciseItem';
import { ExerciseGroup } from '@/config/types';

interface WorkoutDrawerTodoListProps {
    groups: ExerciseGroup[];
    currentGroupIndex: number;
    activeId: string | null;
    activeGroup: ExerciseGroup | null;
    handleDragStart: (event: any) => void;
    handleDragOver: (event: any) => void;
    handleDragEnd: () => void;
    handleDeleteGroup: (idx: number) => void;
    handleEditClick: (group: ExerciseGroup, idx: number) => void;
    handleReplaceClick?: (group: ExerciseGroup, idx: number) => void;
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
    handleEditClick,
    handleReplaceClick
}: WorkoutDrawerTodoListProps) => {
    const tw = useTranslations('WorkoutForm');
    const [isReorderMode, setIsReorderMode] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    return (
        <div className="space-y-3">
            {/* Barra de controle com botão de alternância do modo de reordenação */}
            {groups.length > 1 && (
                <div className="flex items-center justify-between px-1 pb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        {groups.length} {groups.length === 1 ? 'exercício' : 'exercícios'}
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsReorderMode(!isReorderMode)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                            isReorderMode
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                        }`}
                    >
                        {isReorderMode ? (
                            <>
                                <Check className="w-3 h-3" />
                                {tw('doneReordering')}
                            </>
                        ) : (
                            <>
                                <GripVertical className="w-3 h-3" />
                                {tw('reorderItems')}
                            </>
                        )}
                    </button>
                </div>
            )}

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
                            onReplace={handleReplaceClick}
                            isReorderMode={isReorderMode}
                            isAnyItemDragging={!!activeId}
                        />
                    ))}
                </SortableContext>

                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.5',
                            },
                        },
                    }),
                }}>
                    {activeId && activeGroup ? (
                        <div className="w-full">
                            <DraggableExerciseItem
                                group={activeGroup}
                                idx={groups.findIndex(g => g.id === activeId)}
                                currentGroupIndex={currentGroupIndex}
                                onRemove={() => { }}
                                onEdit={() => { }}
                                isReorderMode={true}
                                isOverlay
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};
