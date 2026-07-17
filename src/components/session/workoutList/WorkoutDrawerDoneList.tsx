import { History, RefreshCw, CheckCircle2 } from "lucide-react";
import { ExecutedGroup } from '@/config/types';
import { numberInputUtils } from "@/utils/numberUtil";
import { useTranslations } from "next-intl";

interface WorkoutDrawerDoneListProps {
    doneGroups: ExecutedGroup[];
    hasDoneExercises: boolean;
    t: any;
    te: any;
    handleUpdateHistorySet: (groupIdx: number, exIdx: number, setIdx: number, field: string, value: string) => void;
}

export const WorkoutDrawerDoneList = ({
    doneGroups,
    hasDoneExercises,
    t,
    te,
    handleUpdateHistorySet
}: WorkoutDrawerDoneListProps) => {
    const tw = useTranslations('WorkoutForm');

    return (
        <div className="space-y-4">
            {!hasDoneExercises ? (
                <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px]">
                    <History size={32} className="mx-auto mb-3 text-zinc-400 dark:text-zinc-700" />
                    <p className="text-zinc-500 dark:text-zinc-500 font-black uppercase text-[10px] tracking-widest italic">
                        {t('empty')}
                    </p>
                </div>
            ) : (
                doneGroups.map((group, groupIdx) => {
                    if (!group || !group.exercises || group.exercises.length === 0) return null;
                    return (
                        <div key={groupIdx} className="space-y-3">
                            {group.groupType !== 'straight' && (
                            <div className="flex items-center gap-2 px-2">
                                <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest bg-indigo-500/10 dark:bg-indigo-400/10 px-2.5 py-1 rounded-full">
                                    <RefreshCw size={9} />
                                    {t(`groupTypes.${group.groupType}`)}
                                </span>
                            </div>
                        )}

                        {group.exercises.map((ex, exIdx) => (
                            <div key={exIdx} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/50 rounded-[32px] overflow-hidden shadow-xs">
                                <div className="bg-zinc-50 dark:bg-zinc-900/60 p-5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-lime-400 flex items-center justify-center text-zinc-950 shadow-lg shadow-lime-400/10">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <h4 className="font-black uppercase italic text-sm text-zinc-900 dark:text-white tracking-tight">
                                            {(() => {
                                                const baseName = te.has(ex.exerciseName) ? te(ex.exerciseName) : ex.exerciseName;
                                                const currentVar = ex.variation || 'none';
                                                const currentMode = ex.executionMode || 'bilateral';
                                                const parts = [];
                                                if (currentVar !== 'none') {
                                                    const isPredefined = ['none', 'barbell', 'dumbbell', 'cable', 'machine', 'smith'].includes(currentVar);
                                                    parts.push(isPredefined ? tw(`variationOptions.${currentVar}`) : currentVar);
                                                }
                                                if (currentMode !== 'bilateral') {
                                                    parts.push(tw(`executionModes.${currentMode}`));
                                                }
                                                if (parts.length > 0) {
                                                    return `${baseName} (${parts.join(' • ')})`;
                                                }
                                                return baseName;
                                            })()}
                                        </h4>
                                    </div>
                                    <span className="text-xs font-black text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-950 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800">
                                        {ex.sets.length} {t('sets')}
                                    </span>
                                </div>

                                <div className="p-4 space-y-3">
                                    {ex.sets.map((set, setIdx) => (
                                        <div key={setIdx} className="flex flex-col gap-2 bg-zinc-50 dark:bg-zinc-950/40 p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800/30">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col items-center justify-center min-w-[32px] h-10 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                                    <span className="text-[10px] font-black text-zinc-500 leading-none">{t('set')}</span>
                                                    <span className="text-xs font-black text-lime-600 dark:text-lime-400 leading-none mt-0.5">{setIdx + 1}</span>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2 flex-1">
                                                    {['weight', 'reps', 'rpe'].map((field) => (
                                                        <div key={field} className="relative group">
                                                            <label className="absolute -top-1.5 left-2 px-1 bg-zinc-50 dark:bg-zinc-950 text-[9px] font-black text-zinc-500 uppercase tracking-tighter">
                                                                {t(field)}
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                max={field === "rpe" ? 10 : undefined}
                                                                defaultValue={(set as any)[field]}
                                                                onFocus={numberInputUtils.onFocus}
                                                                onBlur={(e) => handleUpdateHistorySet(groupIdx, exIdx, setIdx, field, e.target.value)}
                                                                className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-2 text-xs font-bold outline-none text-zinc-900 dark:text-zinc-200 focus:border-lime-500/50 dark:focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/20 transition-all text-center"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {set.dropset && set.dropset.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 items-center pl-1 text-[10px] text-zinc-500 font-bold border-t border-zinc-200 dark:border-zinc-900/60 pt-2 mt-1">
                                                    <span className="text-[8px] font-black uppercase text-lime-700 dark:text-lime-400 bg-lime-400/10 px-1 py-0.5 rounded border border-lime-500/30 dark:border-lime-400/20 mr-1">Dropset</span>
                                                    {set.dropset.map((drop, dIdx) => (
                                                        <span key={dIdx} className="flex items-center">
                                                            <span className="text-zinc-800 dark:text-zinc-300 font-black">{drop.weight}kg</span>
                                                            <span className="mx-0.5 text-zinc-400 dark:text-zinc-600">×</span>
                                                            <span>{drop.reps}</span>
                                                            {dIdx < (set.dropset?.length || 0) - 1 && (
                                                                <span className="mx-1.5 text-zinc-400 dark:text-zinc-600">➔</span>
                                                            )}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    );
                })
            )}
        </div>
    );
};
