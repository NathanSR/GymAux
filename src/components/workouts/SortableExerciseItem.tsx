// Importações do dnd-kit
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Save,
    Plus,
    Trash2,
    GripVertical,
    Dumbbell,
    ChevronDown,
    Loader2
} from 'lucide-react';

export function SortableExerciseItem({
    field,
    index,
    register,
    remove,
    openSelectorFor
}: {
    field: any;
    index: number;
    register: any;
    remove: any;
    openSelectorFor: any;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white dark:bg-zinc-900 border ${isDragging ? 'border-lime-400 shadow-2xl' : 'dark:border-zinc-800'} rounded-[32px] p-5 shadow-sm space-y-4`}
        >
            <div className="flex items-center gap-3">
                {/* Handle de Arrasto */}
                <div
                    {...attributes}
                    {...listeners}
                    className="p-2 cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 transition-colors"
                >
                    <GripVertical size={20} />
                </div>

                <button
                    type="button"
                    onClick={() => openSelectorFor(index)}
                    className="flex-1 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border dark:border-zinc-800 text-left hover:border-zinc-200 transition-all"
                >
                    <div className="flex items-center gap-3">
                        <Dumbbell size={16} className="text-lime-500" />
                        <span className="text-sm font-black uppercase tracking-tight">
                            {field.exerciseName || "Selecionar Exercício"}
                        </span>
                    </div>
                    <ChevronDown size={16} className="text-zinc-400" />
                </button>

                <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border dark:border-zinc-800 focus-within:ring-1 focus-within:ring-lime-400 transition-all">
                    <span className="block text-[8px] font-black text-zinc-400 uppercase mb-1 tracking-tighter">Séries</span>
                    <input type="number" {...register(`exercises.${index}.sets`)} className="w-full bg-transparent font-black outline-none" />
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border dark:border-zinc-800 focus-within:ring-1 focus-within:ring-lime-400 transition-all">
                    <span className="block text-[8px] font-black text-zinc-400 uppercase mb-1 tracking-tighter">Reps</span>
                    <input {...register(`exercises.${index}.reps`)} className="w-full bg-transparent font-black outline-none" />
                </div>
                {/* <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border dark:border-zinc-800 focus-within:ring-1 focus-within:ring-lime-400 transition-all">
                    <span className="block text-[8px] font-black text-zinc-400 uppercase mb-1 tracking-tighter">Carga (kg)</span>
                    <input type="number" step="0.5" {...register(`exercises.${index}.weight`)} className="w-full bg-transparent font-black outline-none" />
                </div> */}
                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border dark:border-zinc-800 focus-within:ring-1 focus-within:ring-lime-400 transition-all">
                    <span className="block text-[8px] font-black text-zinc-400 uppercase mb-1 tracking-tighter">Descanso (s)</span>
                    <input type="number" step="0.5" {...register(`exercises.${index}.restTime`)} className="w-full bg-transparent font-black outline-none" />
                </div>
            </div>
        </div>
    );
}