'use client'

import { useState } from "react";
import {
    Play,
    Dumbbell,
    Target,
    ArrowLeft,
    Clock,
    TagIcon,
} from "lucide-react";
import { ExerciseService } from "@/services/exerciseService";
import { useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import Loading from "@/app/[locale]/loading";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import DrawerWorkoutExerciseAdd from "@/components/workouts/DrawerWorkoutExerciseAdd";


export default function ExerciseDetailsPage() {
    const router = useRouter();
    const { id } = useParams();
    const t = useTranslations('ExerciseDetails');
    const tc = useTranslations('Categories');
    const tt = useTranslations('Tags');
    const te = useTranslations('Exercises');

    // // Estados do Modal/Drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const exercise = useLiveQuery(() => ExerciseService.getExerciseById(Number(id)), [id]);

    // Processamento do texto: Limpa numerações (ex: "1.", "1 -", "1)") e filtra vazios
    const instructions = exercise?.howTo
        ? (te.has(exercise.howTo) ? te(exercise.howTo) : exercise.howTo)
            .split('\n')
            .filter(p => p.trim() !== "")
            .map(p => p.replace(/^\d+[\s.\-)]+/, '').trim()) // Remove "1.", "1-", etc no início
        : [];

    if (!exercise) return <Loading />;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-10 transition-colors">
            {/* Header / Imagem de Destaque */}
            <div className="relative h-80 w-full overflow-hidden bg-zinc-200 dark:bg-zinc-900">
                {exercise.mediaUrl ? (
                    <img
                        src={exercise.mediaUrl}
                        alt={exercise.name}
                        className="w-full h-full object-cover opacity-80"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop';
                        }}
                    />
                ) : (
                    <img
                        src={'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'}
                        alt={exercise.name}
                        className="w-full h-full object-cover opacity-80"
                    />
                )}

                {/* Overlay Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent" />

                {/* Botão Voltar */}
                <button
                    className="absolute top-6 left-6 p-3 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/40 transition-all active:scale-95"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={20} />
                </button>

                {/* Badge de Categoria */}
                <div className="absolute bottom-6 left-6">
                    <span className="px-3 py-1.5 bg-lime-400 text-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-lime-500/20">
                        {tc(exercise.category)}
                    </span>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter mt-2 text-zinc-900 dark:text-white leading-none">
                        {te.has(exercise.name) ? te(exercise.name) : exercise.name}
                    </h1>
                </div>
            </div>

            <main className="px-6 -mt-2 relative z-10 space-y-8 max-w-2xl mx-auto">

                {/* Info Cards Row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-[28px] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center">
                        <Target className="text-lime-500 mb-2" size={18} />
                        <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest leading-none mb-1">{t("target")}</span>
                        <span className="text-[10px] font-bold truncate w-full leading-tight">
                            {tc(exercise.category)}
                        </span>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-[28px] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center">
                        <Clock className="text-blue-500 mb-2" size={18} />
                        <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest leading-none mb-1">{t("level")}</span>
                        <span className="text-[10px] font-bold leading-tight">---</span>
                    </div>
                </div>

                {/* Descrição */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-lime-400 rounded-full" />
                        <h2 className="text-sm font-black uppercase italic tracking-wider">{t("description")}</h2>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                        {te.has(exercise.description!) ? te(exercise.description!) : exercise.description}
                    </p>
                </section>

                {/* Tutorial - How To */}
                <section className="bg-zinc-100 dark:bg-zinc-900/50 rounded-[40px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-inner">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-lime-400 rounded-xl">
                            <Play size={16} className="text-zinc-950 fill-current ml-0.5" />
                        </div>
                        <h2 className="text-sm font-black uppercase italic tracking-wider">{t("howToPerform")}</h2>
                    </div>

                    <div className="space-y-6">
                        {instructions.map((paragraph, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-lime-500 font-black italic text-xl opacity-50 leading-none">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </span>
                                    {index !== (exercise.howTo?.split('\n').length || 0) - 1 && (
                                        <div className="w-px h-full bg-zinc-200 dark:bg-zinc-800 mt-2" />
                                    )}
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed pb-2">
                                    {paragraph}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tags */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <TagIcon size={16} className="text-zinc-400" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t("tags")}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {exercise.tags?.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight"
                            >
                                #{tt.has(tag) ? tt(tag) : tag}
                            </span>
                        ))}
                    </div>
                </section>

                {/* CTA Action */}
                <div className="pt-4 sticky bottom-6">
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="w-full py-5 bg-zinc-950 dark:bg-lime-400 dark:text-zinc-950 text-white rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-lime-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-white/10 dark:border-none"
                    >
                        <Dumbbell size={18} />
                        {t("addToWorkout")}
                    </button>
                </div>
            </main>

            <DrawerWorkoutExerciseAdd
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                exercise={exercise}
            />
        </div>
    );
}