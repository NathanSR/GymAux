import { motion } from 'framer-motion';
import { Zap, CircleHelp, List, ArrowRight } from 'lucide-react';
import { GROUP_CONFIG } from './SessionConstants';
import { useTranslations } from 'next-intl';

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

    const groupStyle = GROUP_CONFIG[currentGroup?.groupType || 'straight'] || GROUP_CONFIG.straight;

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
        </section>
    );
}
