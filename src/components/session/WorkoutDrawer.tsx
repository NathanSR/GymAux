import { Check, ChevronRight, X } from "lucide-react";


export const WorkoutDrawer = ({ showPreview, onClose, exercises, currentExerciseIndex }: { showPreview: boolean; onClose: () => void; exercises: any; currentExerciseIndex: number; }) => {

    return (
        showPreview && (
            <div className="fixed inset-0 z-[60] flex items-end animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
                <div className="relative w-full bg-zinc-900 rounded-t-[40px] border-t border-zinc-800 p-8 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-500">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black uppercase italic tracking-tight">Roteiro do Treino</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{exercises.length} Exercícios no total</p>
                        </div>
                        <button onClick={onClose} className="p-2.5 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {exercises.map((ex: any, idx: number) => (
                            <div
                                key={ex.exerciseId}
                                className={`flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 ${idx === currentExerciseIndex
                                    ? 'bg-lime-400/5 border-lime-400/30 ring-1 ring-lime-400/20'
                                    : 'bg-zinc-800/40 border-zinc-700/50'
                                    } ${idx < currentExerciseIndex ? 'opacity-40 grayscale-[0.5]' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${idx === currentExerciseIndex ? 'bg-lime-400 text-zinc-950' : 'bg-zinc-700 text-zinc-400'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className={`font-black text-sm uppercase ${idx === currentExerciseIndex ? 'text-white' : 'text-zinc-300'}`}>
                                            {ex.exerciseName}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-zinc-500 font-bold uppercase">{ex.sets} séries</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                            <span className="text-[10px] text-zinc-500 font-bold uppercase">{ex.reps} reps</span>
                                        </div>
                                    </div>
                                </div>
                                {idx < currentExerciseIndex ? (
                                    <div className="p-1.5 bg-lime-500/20 rounded-full text-lime-500">
                                        <Check size={16} />
                                    </div>
                                ) : (
                                    <ChevronRight size={18} className={idx === currentExerciseIndex ? 'text-lime-400' : 'text-zinc-700'} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    )
}