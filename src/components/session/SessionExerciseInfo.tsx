import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, CircleHelp, List, ArrowRight } from 'lucide-react';
import { GROUP_CONFIG } from './SessionConstants';
import { useTranslations } from 'next-intl';
import { ExerciseService } from '@/services/exerciseService';

interface SessionExerciseInfoProps {
    currentGroup: any;
    currentExercise: any;
    currentPlannedSet: any;
    currentGroupIndex: number;
    currentExerciseIndex: number;
    currentSetIndex: number;
    totalGroups: number;
    isGroupAlternating: boolean;
    onOpenInstructions: () => void;
}

export function SessionExerciseInfo({
    currentGroup,
    currentExercise,
    currentPlannedSet,
    currentGroupIndex,
    currentExerciseIndex,
    currentSetIndex,
    totalGroups,
    isGroupAlternating,
    onOpenInstructions
}: SessionExerciseInfoProps) {
    const t = useTranslations('Session');
    const te = useTranslations('Exercises');
    const tw = useTranslations('WorkoutForm');
    const tc = useTranslations('Categories');

    const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
    const [category, setCategory] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!currentExercise?.exerciseId) return;
        ExerciseService.getExerciseById(currentExercise.exerciseId).then(ex => {
            if (ex) {
                setMediaUrl(ex.mediaUrl);
                setCategory(ex.category);
            }
        });
    }, [currentExercise?.exerciseId]);

    const groupStyle = GROUP_CONFIG[currentGroup?.groupType || 'straight'] || GROUP_CONFIG.straight;

    const renderExerciseMedia = () => {
        if (mediaUrl) {
            const isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm');
            return (
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950/50 flex items-center justify-center group mt-4">
                    {isVideo ? (
                        <video 
                            src={mediaUrl} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <img 
                            src={mediaUrl} 
                            alt="Tutorial" 
                            className="w-full h-full object-cover" 
                        />
                    )}
                </div>
            );
        }

        return (
            <div className="relative w-full aspect-[16/10] rounded-[24px] overflow-hidden border border-lime-500/10 bg-zinc-950/40 flex flex-col items-center justify-center group shadow-[inset_0_4px_24px_rgba(163,230,71,0.02),0_15px_35px_rgba(0,0,0,0.6)] mt-4">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.03]" />
                <div className="absolute w-36 h-36 rounded-full bg-lime-500/5 blur-[40px] -z-10 group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10 flex flex-col items-center text-center p-6">
                    <motion.div 
                        animate={{ scale: [1, 1.04, 1] }} 
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="w-16 h-16 rounded-full border border-lime-400/20 flex items-center justify-center bg-lime-400/5 text-lime-400 shadow-[0_0_15px_rgba(163,230,71,0.1)] mb-3"
                    >
                        <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6.5 6.5 11 11" />
                            <path d="m21 21-1-1" />
                            <path d="m3 3 1 1" />
                            <path d="m18.5 5.5 3 3" />
                            <path d="m2.5 15.5 3 3" />
                            <path d="m16 16 2.5 2.5" />
                            <path d="M5.5 5.5 8 8" />
                        </svg>
                    </motion.div>
                    <span className="text-[7px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-1">Visualização do Exercício</span>
                    <span className="text-[9px] font-black text-lime-400 uppercase tracking-widest bg-lime-400/10 border border-lime-400/20 px-3 py-0.5 rounded-lg">
                        {category ? (tc.has(category) ? tc(category) : category) : 'Geral'}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <section className="mb-6 mt-2 relative">
            {/* Background Glow Identity */}
            <div className={`absolute -top-10 -left-10 w-40 h-40 rounded-full blur-[80px] opacity-15 -z-10 transition-colors duration-700 ${groupStyle.bg}`} />

            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        {isGroupAlternating && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${groupStyle.bg} ${groupStyle.color} ${groupStyle.border} shadow-sm backdrop-blur-md`}
                            >
                                <groupStyle.icon size={10} className="animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                    {t('groupTypes.' + currentGroup?.groupType)}
                                </span>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 shadow-sm"
                        >
                            <Zap size={10} className="fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                {t('group')} {currentGroupIndex + 1}/{totalGroups}
                            </span>
                        </motion.div>
                    </div>

                    <motion.h2
                        key={currentExercise?.exerciseId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-black uppercase tracking-tighter italic leading-[0.85] truncate pr-2 mt-1"
                    >
                        {te.has(currentExercise?.exerciseName!) ? te(currentExercise?.exerciseName!) : currentExercise?.exerciseName}
                    </motion.h2>

                    {/* Subtitle with Variation and Execution Mode */}
                    {currentExercise && (
                        <motion.div
                            key={`meta-${currentExercise.exerciseId}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-1.5 mt-2 text-xs font-black text-lime-500 uppercase tracking-widest"
                        >
                            {(() => {
                                const parts = [];
                                const variation = currentExercise.variation || 'none';
                                const isPredefined = ['none', 'barbell', 'dumbbell', 'cable', 'machine', 'smith'].includes(variation);
                                parts.push(isPredefined ? tw(`variationOptions.${variation}`) : variation);

                                const mode = currentExercise.executionMode || 'bilateral';
                                parts.push(tw(`executionModes.${mode}`));
                                
                                return parts.join(' • ');
                            })()}
                        </motion.div>
                    )}
                </div>

                <button
                    onClick={onOpenInstructions}
                    className="flex flex-col items-center gap-1.5 group relative flex-shrink-0 transition-transform active:scale-90"
                >
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:border-lime-400 group-hover:text-lime-400 transition-all shadow-lg">
                        <CircleHelp size={22} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest group-hover:text-zinc-400 transition-colors">
                        {t('howTo')}
                    </span>
                </button>
            </div>

            {/* Group Progression - visualizes all exercises in the current group */}
            {isGroupAlternating && currentGroup?.exercises && currentGroup.exercises.length > 1 && (
                <div className="mt-8">
                    <p className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.2em] mb-3 ml-1 flex items-center gap-2">
                        <List size={10} />
                        {t('groupComposition')}
                    </p>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                        {currentGroup.exercises.map((ex: any, idx: number) => {
                            const isActive = idx === currentExerciseIndex;
                            return (
                                <div key={idx} className="flex items-center gap-2 shrink-0">
                                    <div className={`
                                        px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-tight transition-all duration-300
                                        ${isActive
                                            ? `${groupStyle.bg} ${groupStyle.color} ${groupStyle.border} shadow-lg ring-1 ${groupStyle.border}`
                                            : 'bg-zinc-900/30 text-zinc-600 border-zinc-800/50 opacity-40'}
                                    `}>
                                        {te.has(ex.exerciseName) ? te(ex.exerciseName) : ex.exerciseName}
                                    </div>
                                    {idx < currentGroup.exercises.length - 1 && (
                                        <ArrowRight size={12} className="text-zinc-800/50 shrink-0" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-2 mt-5">
                <div className="flex flex-col p-4 bg-zinc-900/40 rounded-3xl border border-white/5 relative overflow-hidden group">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">
                        {isGroupAlternating ? t('round') : t('currentSet')}
                    </span>
                    <span className="text-2xl font-black tabular-nums flex items-baseline gap-1">
                        {currentSetIndex + 1}
                        <span className="text-zinc-600 text-[10px] font-bold">/ {isGroupAlternating ? (currentGroup.rounds || 1) : currentExercise.sets.length}</span>
                    </span>
                </div>
                <div className="flex flex-col p-4 bg-zinc-900/40 rounded-3xl border border-white/5 relative overflow-hidden group">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">{t('goal')}</span>
                    <span className="text-2xl font-black tabular-nums flex items-baseline gap-1.5">
                        {currentPlannedSet?.reps}
                        <span className="text-[9px] text-zinc-500 uppercase font-black tracking-tighter">{t('reps')}</span>
                    </span>
                </div>
            </div>
            {currentPlannedSet?.technique && currentPlannedSet.technique !== 'normal' && (
                <div className="mt-2 text-center p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-black text-rose-400 uppercase tracking-widest">
                    🔥 {t('techniques.' + currentPlannedSet.technique)}
                </div>
            )}

            {/* Espaço de Imagem ou Vídeo do Exercício */}
            {renderExerciseMedia()}
        </section>
    );
}
