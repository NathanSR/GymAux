'use client';

import { useState } from "react";
import {
    Play,
    Dumbbell,
    Target,
    ArrowLeft,
    Clock,
    TagIcon,
    ChevronLeft,
    Share2,
    Info
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import DrawerWorkoutExerciseAdd from "@/components/workouts/DrawerWorkoutExerciseAdd";
import { Exercise } from "@/config/types";
import { motion, AnimatePresence } from "framer-motion";

interface ViewExerciseClientProps {
    exercise: Exercise;
}

export default function ViewExerciseClient({ exercise }: ViewExerciseClientProps) {
    const t = useTranslations('ExerciseDetails');
    const tc = useTranslations('Categories');
    const tt = useTranslations('Tags');
    const te = useTranslations('Exercises');

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Process instructions: Clean numbers and trim
    const instructions = exercise.howTo
        ? (te.has(exercise.howTo) ? te(exercise.howTo) : exercise.howTo)
            .split('\n')
            .filter(p => p.trim() !== "")
            .map(p => p.replace(/^\d+[\s.\-)]+/, '').trim())
        : [];

    const getFormattedName = (name: string) => te.has(name) ? te(name) : name;
    const getFormattedDescription = (desc?: string) => desc && te.has(desc) ? te(desc) : desc;

    const handleShare = async () => {
        const shareData = {
            title: getFormattedName(exercise.name),
            text: getFormattedDescription(exercise.description) || t("checkOutExercise"),
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                // Optionally add a toast here if react-toastify is available
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32 transition-colors selection:bg-lime-400 selection:text-zinc-950">
            {/* --- HERO SECTION --- */}
            <div className="relative h-[45vh] w-full overflow-hidden group">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src={exercise.mediaUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'}
                        alt={exercise.name}
                        className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop';
                        }}
                    />
                </motion.div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-zinc-950/20 mix-blend-multiply" />

                {/* Top Actions Nav */}
                <nav className="absolute top-0 inset-x-0 p-6 flex items-center justify-between z-20">
                    <Link
                        href="/exercises"
                        className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:bg-white/20 transition-all active:scale-90 shadow-2xl"
                    >
                        <ChevronLeft size={24} />
                    </Link>

                    <div className="flex gap-2">
                        <button
                            onClick={handleShare}
                            className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:bg-white/20 transition-all active:scale-90"
                        >
                            <Share2 size={20} />
                        </button>
                    </div>
                </nav>

                {/* Content Overlay */}
                <div className="absolute bottom-10 left-8 right-8 z-10">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <span className="inline-flex items-center px-4 py-1.5 bg-lime-400 text-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl shadow-lime-500/30 mb-4">
                            <Target size={12} className="mr-1.5" />
                            {tc(exercise.category)}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white drop-shadow-2xl leading-none">
                            {getFormattedName(exercise.name)}
                        </h1>
                    </motion.div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <main className="px-6 -mt-4 relative z-20 max-w-2xl mx-auto space-y-12">

                {/* Visual Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="group bg-white dark:bg-zinc-900 p-5 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-lime-500/20 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Target size={18} />
                            </div>
                        </div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-1">{t("target")}</p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{tc(exercise.category)}</p>
                    </motion.div>

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="group bg-white dark:bg-zinc-900 p-5 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-lime-500/20 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-lime-500/10 rounded-xl text-lime-500 group-hover:bg-lime-500 group-hover:text-zinc-950 transition-colors">
                                <Clock size={18} />
                            </div>
                        </div>
                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-1">{t("level")}</p>
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 capitalize">{exercise.level || "---"}</p>
                    </motion.div>
                </div>

                {/* Description Section */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-900 dark:bg-white rounded-lg">
                            <Info size={14} className="text-white dark:text-zinc-950" />
                        </div>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">{t("description")}</h2>
                    </div>
                    <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                            {getFormattedDescription(exercise.description) || "---"}
                        </p>
                    </div>
                </motion.section>

                {/* Tutorial Section - Modern Card List */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-lime-400 rounded-2xl shadow-lg shadow-lime-500/20">
                                <Play size={18} className="text-zinc-950 fill-current ml-0.5" />
                            </div>
                            <h2 className="text-sm font-black uppercase italic tracking-wider">{t("howToPerform")}</h2>
                        </div>
                    </div>

                    <div className="space-y-4 p-4">
                        {instructions.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ x: -10, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-5 group"
                            >
                                <div className="flex flex-col items-center flex-shrink-0 pt-1">
                                    <div className="w-10 h-10 aspect-square rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:border-lime-500/50 group-hover:bg-lime-400/5 transition-all">
                                        <span className="text-sm font-black italic text-zinc-400 group-hover:text-lime-500">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    {index !== instructions.length - 1 && (
                                        <div className="w-px h-full bg-gradient-to-b from-zinc-200 dark:from-zinc-800 to-transparent my-2" />
                                    )}
                                </div>
                                <div className="pb-4 pt-1">
                                    <p className="text-base text-zinc-600 dark:text-zinc-300 font-semibold leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                        {step}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Tags Section */}
                <motion.section
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-2 px-2">
                        <TagIcon size={14} className="text-zinc-400" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{t("tags")}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {exercise.tags?.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight hover:border-lime-500/30 hover:text-lime-500 transition-colors cursor-default"
                            >
                                #{tt.has(tag) ? tt(tag) : tag}
                            </span>
                        ))}
                    </div>
                </motion.section>
            </main>

            {/* --- CTA BOTTOM BAR --- */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 1, type: "spring", stiffness: 100 }}
                className="fixed bottom-0 inset-x-0 p-6 z-50 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-zinc-50/80 dark:via-zinc-950/80 to-transparent backdrop-blur-sm"
            >
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="group relative w-full overflow-hidden py-5 bg-zinc-950 dark:bg-lime-400 rounded-[32px] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-lime-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-white/10 dark:border-none"
                    >
                        {/* Interactive Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-zinc-950/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="p-1.5 bg-white/10 dark:bg-zinc-950/10 rounded-lg group-hover:scale-110 transition-transform">
                            <Dumbbell size={18} className="text-white dark:text-zinc-950" />
                        </div>
                        <span className="text-white dark:text-zinc-950">{t("addToWorkout")}</span>
                    </button>
                </div>
            </motion.div>

            <DrawerWorkoutExerciseAdd
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                exercise={exercise}
            />
        </div>
    );
}
