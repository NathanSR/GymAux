import { X, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Exercise } from "@/config/types";
import { CATEGORY_METADATA } from "@/config/constants";
import { Modal } from "@/components/ui/Modal";

interface ExerciseInstructionModalProps {
    isOpen: boolean;
    onClose: () => void;
    exercise?: Exercise | null;
}

export const ExerciseInstructionModal = ({ isOpen, onClose, exercise }: ExerciseInstructionModalProps) => {
    const t = useTranslations('ExerciseInstructionModal');
    const te = useTranslations('Exercises');

    const fallbackImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop";
    const categoryMeta = exercise?.category ? CATEGORY_METADATA[exercise.category] : null;
    const hasMedia = !!exercise?.mediaUrl;
    const mediaSrc = exercise?.mediaUrl || categoryMeta?.imagePath || fallbackImage;

    const instructions = exercise?.howTo
        ? (te.has(exercise.howTo) ? te(exercise.howTo) : exercise.howTo)
            .split('\n')
            .filter(p => p.trim() !== "")
            .map(p => p.replace(/^\d+[\s.\-)]+/, '').trim())
        : [];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            maxWidth="max-w-md"
            className="p-0 border border-zinc-200 dark:border-zinc-800 rounded-[40px] overflow-hidden shadow-[0_0_50px_-12px_rgba(163,230,71,0.2)]"
        >
            {/* Media Preview (Imagem Real ou Fallback) */}
            <div className="w-full h-64 bg-zinc-100 dark:bg-zinc-900 relative flex-shrink-0 group overflow-hidden">
                <img
                    src={mediaSrc}
                    alt={exercise?.name}
                    className={`w-full h-full transition-transform duration-700 group-hover:scale-110 object-cover ${hasMedia ? '' : 'bg-zinc-100 dark:bg-zinc-950'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-white/20 dark:via-zinc-950/20 to-transparent" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 bg-zinc-900/60 dark:bg-black/40 backdrop-blur-xl rounded-full text-white border border-white/20 hover:bg-lime-400 hover:text-black transition-all active:scale-90 cursor-pointer"
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
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white leading-none">
                            {t('howToPerform')}
                        </h3>
                        <p className="text-[10px] font-black text-lime-600 dark:text-lime-400/60 uppercase tracking-[0.2em] mt-2">
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
                                    <div className="w-10 h-10 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-lime-500/50 group-hover:bg-lime-400/10 transition-all duration-300">
                                        <span className="text-lime-600 dark:text-lime-400 font-black italic text-sm leading-none">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    {index !== instructions.length - 1 && (
                                        <div className="w-[2px] h-full bg-gradient-to-b from-zinc-200 dark:from-zinc-800 to-transparent my-3" />
                                    )}
                                </div>
                                <p className="text-base text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed pt-2 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                                    {paragraph}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 animate-pulse">
                            <p className="text-zinc-500 dark:text-zinc-600 italic text-sm">
                                {t('noInstructions')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Botão de Ação Final */}
                <button
                    onClick={onClose}
                    className="w-full mt-12 py-5 bg-lime-400 text-zinc-950 rounded-[28px] font-black uppercase text-xs tracking-[0.3em] shadow-[0_20px_40px_rgba(163,230,71,0.2)] active:scale-95 transition-all border-b-4 border-lime-600 hover:brightness-110 cursor-pointer"
                >
                    {t('gotIt')}
                </button>
            </div>
        </Modal>
    );
};