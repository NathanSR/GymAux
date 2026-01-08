'use client';
import { ExerciseService } from "@/services/exerciseService";
import { useLiveQuery } from "dexie-react-hooks";
import { X, Play } from "lucide-react";
import { useTranslations } from "next-intl";

interface ExerciseInstructionModalProps {
    isOpen: boolean;
    onClose: () => void;
    exerciseId: number;
}

export const ExerciseInstructionModal = ({ isOpen, onClose, exerciseId }: ExerciseInstructionModalProps) => {
    const t = useTranslations('ExerciseInstructionModal');
    const te = useTranslations('Exercises');

    const exercise = useLiveQuery(() => ExerciseService.getExerciseById(exerciseId), [exerciseId]);

    if (!isOpen || !exerciseId) return null;

    // URL de fallback com tema de academia/bodybuilding
    const fallbackImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop";

    // Processamento do texto: Limpa numerações (ex: "1.", "1 -", "1)") e filtra vazios
    const instructions = exercise?.howTo
        ? (te.has(exercise.howTo) ? te(exercise.howTo) : exercise.howTo)
            .split('\n')
            .filter(p => p.trim() !== "")
            .map(p => p.replace(/^\d+[\s.\-)]+/, '').trim()) // Remove "1.", "1-", etc no início
        : [];

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 duration-300">
            {/* Backdrop com desfoque e fade suave */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Container do Modal com Slide + Zoom + Bounce leve */}
            <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-[40px] overflow-hidden shadow-[0_0_50px_-12px_rgba(163,230,71,0.2)] flex flex-col max-h-[85vh] animate-in zoom-in-90 slide-in-from-bottom-10 duration-500 fill-mode-forward">

                {/* Media Preview (Imagem Real ou Fallback) */}
                <div className="w-full h-64 bg-zinc-900 relative flex-shrink-0 group overflow-hidden">
                    <img
                        src={exercise?.mediaUrl || fallbackImage}
                        alt={exercise?.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-xl rounded-full text-white border border-white/10 hover:bg-lime-400 hover:text-black transition-all active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Conteúdo do Guia */}
                <div className="px-8 pb-8 pt-4 overflow-y-auto custom-scrollbar flex-1">
                    <div className="flex items-center gap-4 mb-10 animate-in slide-in-from-left-4 delay-150 duration-500 fill-mode-both">
                        <div className="p-3 bg-lime-400 rounded-2xl shadow-[0_0_20px_rgba(163,230,71,0.3)]">
                            <Play size={20} className="text-zinc-950 fill-current ml-0.5" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none">
                                {t('howToPerform')}
                            </h3>
                            <p className="text-[10px] font-black text-lime-400/60 uppercase tracking-[0.2em] mt-2">
                                {te.has(exercise?.name!) ? te(exercise?.name!) : exercise?.name}
                            </p>
                        </div>
                    </div>

                    {/* Lista de Passos Organizada */}
                    <div className="space-y-8">
                        {instructions.length > 0 ? (
                            instructions.map((paragraph, index) => (
                                <div
                                    key={index}
                                    className="flex gap-5 group animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
                                    style={{ animationDelay: `${200 + (index * 100)}ms` }}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-2xl border-2 border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-lime-400/50 group-hover:bg-lime-400/5 transition-all duration-300">
                                            <span className="text-lime-400 font-black italic text-sm leading-none">
                                                {(index + 1).toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                        {index !== instructions.length - 1 && (
                                            <div className="w-[2px] h-full bg-gradient-to-b from-zinc-800 to-transparent my-3" />
                                        )}
                                    </div>
                                    <p className="text-base text-zinc-400 font-medium leading-relaxed pt-2 group-hover:text-zinc-200 transition-colors">
                                        {paragraph}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 animate-pulse">
                                <p className="text-zinc-600 italic text-sm">
                                    {t('noInstructions')}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Botão de Ação Final */}
                    <button
                        onClick={onClose}
                        className="w-full mt-12 py-5 bg-lime-400 text-zinc-950 rounded-[28px] font-black uppercase text-xs tracking-[0.3em] shadow-[0_20px_40px_rgba(163,230,71,0.2)] active:scale-95 transition-all border-b-4 border-lime-600 hover:brightness-110"
                    >
                        {t('gotIt')}
                    </button>
                </div>
            </div>
        </div>
    );
};