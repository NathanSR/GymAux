import { Dumbbell, History, Trash2, Plus, X } from "lucide-react";

interface WorkoutDrawerHeaderProps {
    activeTab: 'todo' | 'done';
    setActiveTab: (tab: 'todo' | 'done') => void;
    onConfirmDeleteSession: () => void;
    handleOpenAdd: () => void;
    handleFullClose: () => void;
    t: any;
}

export const WorkoutDrawerHeader = ({
    activeTab,
    setActiveTab,
    onConfirmDeleteSession,
    handleOpenAdd,
    handleFullClose,
    t
}: WorkoutDrawerHeaderProps) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800 w-full sm:w-auto overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setActiveTab('todo')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'todo' ? 'bg-lime-400 text-zinc-950' : 'text-zinc-500'}`}
                >
                    <Dumbbell size={14} />
                    <span>{t('tabs.todo')}</span>
                </button>
                <button
                    onClick={() => setActiveTab('done')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === 'done' ? 'bg-lime-400 text-zinc-950' : 'text-zinc-500'}`}
                >
                    <History size={14} />
                    <span>{t('tabs.done')}</span>
                </button>
            </div>

            <div className="flex items-center justify-end gap-2 ml-auto sm:ml-0">
                <button
                    type="button"
                    onClick={onConfirmDeleteSession}
                    className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer active:scale-95"
                    title={t('confirmDeleteSessionTitle')}
                >
                    <Trash2 size={18} />
                </button>

                {activeTab === 'todo' && (
                    <button
                        onClick={handleOpenAdd}
                        className="p-3 bg-lime-400 rounded-xl text-zinc-950 active:scale-95 shadow-lg shadow-lime-400/20"
                        title={t('addExercise')}
                    >
                        <Plus size={18} />
                    </button>
                )}

                <button
                    onClick={handleFullClose}
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 active:scale-95"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};
