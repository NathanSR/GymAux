import { History, RefreshCw, CheckCircle2 } from "lucide-react";
import { ExecutedGroup } from '@/config/types';

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
    return (
        <div className="space-y-4">
            {!hasDoneExercises ? (
                <div className="text-center py-12 border-2 border-dashed border-zinc-900 rounded-[32px]">
                    <History size={32} className="mx-auto mb-3 text-zinc-800" />
                    <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest italic">
                        {t('empty')}
                    </p>
                </div>
            ) : (
                doneGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-3">
                        {group.groupType !== 'straight' && (
                            <div className="flex items-center gap-2 px-2">
                                <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2.5 py-1 rounded-full">
                                    <RefreshCw size={9} />
                                    {t(`groupTypes.${group.groupType}`)}
                                </span>
                            </div>
                        )}

                        {group.exercises.map((ex, exIdx) => (
                            <div key={exIdx} className="bg-zinc-900/40 border border-zinc-800/50 rounded-[32px] overflow-hidden">
                                <div className="bg-zinc-900/60 p-5 flex items-center justify-between border-b border-zinc-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-lime-400 flex items-center justify-center text-zinc-950 shadow-lg shadow-lime-400/10">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <h4 className="font-black uppercase italic text-sm text-white tracking-tight">
                                            {te.has(ex.exerciseName) ? te(ex.exerciseName) : ex.exerciseName}
                                        </h4>
                                    </div>
                                    <span className="text-xs font-black text-zinc-500 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                                        {ex.sets.length} {t('sets')}
                                    </span>
                                </div>

                                <div className="p-4 space-y-3">
                                    {ex.sets.map((set, setIdx) => (
                                        <div key={setIdx} className="flex items-center gap-3 bg-zinc-950/40 p-2 rounded-2xl border border-zinc-800/30">
                                            <div className="flex flex-col items-center justify-center min-w-[32px] h-10 bg-zinc-900 rounded-xl border border-zinc-800">
                                                <span className="text-xs font-black text-zinc-500 leading-none">{t('set')}</span>
                                                <span className="text-xs font-black text-lime-400 leading-none mt-0.5">{setIdx + 1}</span>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 flex-1">
                                                {['weight', 'reps', 'rpe'].map((field) => (
                                                    <div key={field} className="relative group">
                                                        <label className="absolute -top-1.5 left-2 px-1 bg-zinc-950 text-xs font-black text-zinc-500 uppercase tracking-tighter">
                                                            {t(field)}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={field === "rpe" ? 10 : undefined}
                                                            defaultValue={(set as any)[field]}
                                                            onBlur={(e) => handleUpdateHistorySet(groupIdx, exIdx, setIdx, field, e.target.value)}
                                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2 px-2 text-xs font-bold outline-none text-zinc-200 focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/20 transition-all text-center"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
};
