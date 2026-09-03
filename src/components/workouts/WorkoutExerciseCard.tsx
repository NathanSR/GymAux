'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
    Dumbbell,
    MoreVertical,
    Pencil,
    RefreshCw,
    Trash2,
    Check,
    Zap,
    Clock,
    Repeat,
    Layers,
    NotebookPen,
    Eye
} from 'lucide-react';
import { ExerciseGroup, WorkoutExercise, Exercise } from '@/config/types';
import { CATEGORY_METADATA, CategoryType } from '@/config/constants';
import { useExerciseLocalization } from '@/hooks/useExerciseLocalization';
import { LocalizedExerciseName } from '@/components/ui/LocalizedExerciseName';
import { Popover, usePopoverState } from '@/components/ui/Popover';
import { ExerciseInstructionModal } from '@/components/session/ExerciseInstructionModal';

export interface WorkoutExerciseCardProps {
    /** Grupo completo de treino (Straight, Bi-set, Superset, etc.) */
    group?: ExerciseGroup;
    /** Exercício de treino individual (se não usar group) */
    exercise?: WorkoutExercise;
    /** Objeto do exercício com metadados/imagem pré-carregados (opcional) */
    exerciseDetails?: Exercise;

    /** Índice ordinal (1-based ou 0-based se fornecido) */
    index?: number;
    /** Se é o exercício/grupo atualmente ativo na sessão */
    isCurrent?: boolean;
    /** Se o exercício/grupo já foi concluído na sessão */
    isCompleted?: boolean;
    /** Se o item está sendo arrastado */
    isDragging?: boolean;
    /** Se a lista está no modo de reorganização */
    isReorderMode?: boolean;

    /** Slot opcional para o manipulador de arrasto (drag handle) */
    dragHandle?: React.ReactNode;

    /** Ações */
    onEdit?: () => void;
    onReplace?: () => void;
    onRemove?: () => void;
    onViewInfo?: () => void;
    onClick?: () => void;

    /** Classes adicionais para customização */
    className?: string;
}

export function WorkoutExerciseCard({
    group,
    exercise,
    exerciseDetails,
    index,
    isCurrent = false,
    isCompleted = false,
    isDragging = false,
    isReorderMode = false,
    dragHandle,
    onEdit,
    onReplace,
    onRemove,
    onViewInfo,
    onClick,
    className = '',
}: WorkoutExerciseCardProps) {
    const tc = useTranslations('WorkoutExerciseCard');
    const t = useTranslations('WorkoutDrawer');
    const tw = useTranslations('WorkoutForm');

    const { exercisesMap } = useExerciseLocalization();
    const [imgFailed, setImgFailed] = useState(false);
    const [catImgFailed, setCatImgFailed] = useState(false);
    const [isInstructionOpen, setIsInstructionOpen] = useState(false);

    // Popover de ações
    const { isOpen: isMenuOpen, close: closeMenu, toggle: toggleMenu } = usePopoverState(false);
    const menuTriggerRef = useRef<HTMLButtonElement>(null);

    // Normalização: lista de exercícios no card
    const exercisesList = useMemo<WorkoutExercise[]>(() => {
        if (group?.exercises && group.exercises.length > 0) {
            return group.exercises;
        }
        if (exercise) {
            return [exercise];
        }
        return [];
    }, [group, exercise]);

    const primaryExercise = exercisesList[0];
    const isAlternating = Boolean(group && group.groupType !== 'straight' && group.exercises.length > 1);

    // Resolução de dados do exercício primário para thumbnail e categoria
    const resolvedExercise = useMemo<Exercise | null>(() => {
        if (exerciseDetails) return exerciseDetails;
        if (!primaryExercise?.exerciseId) return null;
        return exercisesMap.get(primaryExercise.exerciseId) || null;
    }, [exerciseDetails, primaryExercise?.exerciseId, exercisesMap]);

    // Resolução da Imagem: Prioridade 1: Imagem do exercício -> Prioridade 2: Categoria/Músculo -> Fallback: Ícone
    const exercisePhoto = resolvedExercise?.imageUrl || resolvedExercise?.gallery?.find(g => g.type === 'image')?.url;
    const categoryIllustration = resolvedExercise?.category && CATEGORY_METADATA[resolvedExercise.category as CategoryType]?.imagePath;

    const hasCustomPhoto = Boolean(exercisePhoto && !imgFailed);
    const hasCategoryImg = Boolean(categoryIllustration && !catImgFailed);

    // Cálculos de séries e resumo
    const totalSets = useMemo(() => {
        if (group) {
            return group.exercises.reduce((sum, ex) => sum + (ex.sets?.length || 0), 0);
        }
        return exercise?.sets?.length || 0;
    }, [group, exercise]);

    const firstExReps = primaryExercise?.sets?.[0]?.reps ?? 10;
    const firstExRest = primaryExercise?.sets?.[0]?.restTime ?? group?.restAfterGroup ?? 60;
    const rounds = group?.rounds ?? 1;

    // Técnicas especiais (dropset, rest-pause, etc.)
    const specialTechnique = useMemo(() => {
        for (const ex of exercisesList) {
            for (const s of (ex.sets || [])) {
                if (s.technique && s.technique !== 'normal') return s.technique;
                if (s.dropset && s.dropset.length > 0) return 'drop_set';
            }
        }
        return null;
    }, [exercisesList]);

    const hasNotes = useMemo(() => {
        return Boolean(group?.notes || exercisesList.some(ex => !!ex.notes));
    }, [group, exercisesList]);

    const handleOpenInstructions = () => {
        if (onViewInfo) {
            onViewInfo();
        } else if (resolvedExercise) {
            setIsInstructionOpen(true);
        }
    };

    // Contagem de ações disponíveis
    const canShowInstructions = Boolean(onViewInfo || resolvedExercise);
    const availableActionsCount = [
        canShowInstructions,
        Boolean(onEdit),
        Boolean(onReplace),
        Boolean(onRemove)
    ].filter(Boolean).length;
    const hasMultipleActions = availableActionsCount > 1;

    const isCompact = Boolean(isReorderMode || isDragging);

    return (
        <>
            <div
                onClick={onClick}
                className={`
                    group/card relative rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden select-none
                    ${onClick ? 'cursor-pointer' : ''}
                    ${isDragging
                        ? 'border-dashed border-lime-500/50 bg-lime-400/10 shadow-none py-1.5 px-3'
                        : isCompact
                        ? 'border-lime-500/30 bg-zinc-50 dark:bg-zinc-950/60 shadow-none py-1.5 px-3'
                        : isCurrent
                        ? 'bg-lime-400/10 border-lime-500/50 dark:border-lime-400/40 shadow-xs ring-1 ring-lime-400/20'
                        : 'bg-white dark:bg-zinc-900/90 border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/80 shadow-2xs'
                    }
                    ${isCompleted && !isDragging ? 'opacity-50 hover:opacity-80' : ''}
                    ${className}
                `}
            >
                <div className={`flex items-center gap-2.5 sm:gap-3 min-w-0 ${isCompact ? 'p-1' : 'p-3 sm:p-3.5'}`}>
                    {/* Drag Handle: Apenas exibido quando em modo de reorganização */}
                    {isReorderMode && dragHandle && (
                        <div className="shrink-0 flex items-center" onClick={(e) => e.stopPropagation()}>
                            {dragHandle}
                        </div>
                    )}

                    {/* Imagem em Destaque com Badge Numérico Flutuante no Top-Left */}
                    <div className="relative shrink-0">
                        <div
                            onClick={(e) => {
                                if (canShowInstructions && !isCompact) {
                                    e.stopPropagation();
                                    handleOpenInstructions();
                                }
                            }}
                            className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80 overflow-hidden flex items-center justify-center p-0.5 shadow-2xs ${
                                canShowInstructions && !isCompact ? 'cursor-pointer group-hover/card:border-lime-500/40' : ''
                            } transition-transform active:scale-95`}
                            title={canShowInstructions && !isCompact ? tc('viewInstructions') : undefined}
                        >
                            {hasCustomPhoto ? (
                                <img
                                    src={exercisePhoto}
                                    alt={primaryExercise?.exerciseName || ''}
                                    className="w-full h-full object-cover rounded-xl"
                                    onError={() => setImgFailed(true)}
                                />
                            ) : hasCategoryImg ? (
                                <img
                                    src={categoryIllustration}
                                    alt={resolvedExercise?.category || ''}
                                    className="w-full h-full object-contain p-1 rounded-xl"
                                    onError={() => setCatImgFailed(true)}
                                />
                            ) : (
                                <div className="w-full h-full rounded-xl bg-lime-400/10 flex items-center justify-center">
                                    <Dumbbell size={18} className="text-lime-600 dark:text-lime-400" />
                                </div>
                            )}
                        </div>

                        {/* Badge Numérico / Checkmark Flutuante sobreposto na imagem (economiza largura) */}
                        {index !== undefined && (
                            <div
                                className={`absolute -top-1.5 -left-1.5 w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full flex items-center justify-center font-black text-[10px] shadow-sm border-2 border-white dark:border-zinc-900 transition-colors pointer-events-none z-10 ${
                                    isCompleted
                                        ? 'bg-emerald-500 text-white'
                                        : isCurrent
                                        ? 'bg-lime-400 text-zinc-950 ring-2 ring-lime-400/30'
                                        : 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-200'
                                }`}
                            >
                                {isCompleted ? <Check size={11} strokeWidth={3.5} /> : index + 1}
                            </div>
                        )}
                    </div>

                    {/* Conteúdo Central: Título e Variações */}
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        {/* Se estiver no modo Compacto/Reorder, ocultamos elementos secundários */}
                        {!isCompact && isAlternating && group && (
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                                    <Layers size={10} />
                                    {t(`groupTypes.${group.groupType}`)}
                                </span>
                                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-0.5">
                                    <Repeat size={9} /> {rounds} {tc('rounds')}
                                </span>
                            </div>
                        )}

                        {/* Nomes dos exercícios com variação/modo de execução */}
                        <div className="space-y-0.5">
                            {exercisesList.map((ex, exIdx) => {
                                const currentVar = ex.variation || 'none';
                                const currentMode = ex.executionMode || 'bilateral';
                                const parts: string[] = [];

                                if (currentVar !== 'none') {
                                    const isPredefined = ['none', 'barbell', 'dumbbell', 'cable', 'machine', 'smith'].includes(currentVar);
                                    parts.push(isPredefined ? tw(`variationOptions.${currentVar}`) : currentVar);
                                }
                                if (currentMode !== 'bilateral') {
                                    parts.push(tw(`executionModes.${currentMode}`));
                                }
                                const suffix = parts.length > 0 ? ` • ${parts.join(' • ')}` : null;

                                return (
                                    <div key={exIdx} className="flex items-center gap-1.5 min-w-0">
                                        {!isCompact && isAlternating && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-lime-500 shrink-0" />
                                        )}
                                        <div className="truncate min-w-0">
                                            <span className={`font-black text-xs sm:text-sm uppercase tracking-tight truncate ${
                                                isCurrent ? 'text-zinc-950 dark:text-white' : 'text-zinc-800 dark:text-zinc-200'
                                            }`}>
                                                <LocalizedExerciseName
                                                    exerciseId={ex.exerciseId}
                                                    fallbackName={ex.exerciseName}
                                                />
                                            </span>
                                            {!isCompact && suffix && (
                                                <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 truncate ml-1">
                                                    {suffix}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Linha Resumo (Ocultada durante o modo compacto/arrasto) */}
                        {!isCompact && (
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[10px] font-black">
                                <span className="text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md shrink-0">
                                    {isAlternating
                                        ? `${rounds} ${tc('rounds')} × ${firstExReps} ${tc('reps')}`
                                        : `${totalSets} ${tc('sets')} × ${firstExReps} ${tc('reps')}`
                                    }
                                </span>

                                <span className="text-zinc-500 dark:text-zinc-400 bg-zinc-100/70 dark:bg-zinc-800/50 px-1.5 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                                    <Clock size={10} className="text-zinc-400" />
                                    {firstExRest}s
                                </span>

                                {specialTechnique && (
                                    <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md shrink-0 border border-amber-500/20">
                                        <Zap size={9} className="fill-current" />
                                        {specialTechnique === 'drop_set' ? t('dropset') : tw(`techniques.${specialTechnique}`)}
                                    </span>
                                )}

                                {hasNotes && (
                                    <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md shrink-0 border border-blue-500/20">
                                        <NotebookPen size={9} />
                                        {tc('note')}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Ações (Ocultadas durante o modo compacto/arrasto) */}
                    {!isCompact && availableActionsCount > 0 && (
                        <div className="shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {hasMultipleActions ? (
                                <>
                                    <button
                                        ref={menuTriggerRef}
                                        type="button"
                                        onClick={toggleMenu}
                                        className="p-2 sm:p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer active:scale-95 shadow-2xs"
                                        aria-label={tc('actions')}
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    <Popover
                                        isOpen={isMenuOpen}
                                        onClose={closeMenu}
                                        triggerRef={menuTriggerRef}
                                        side="bottom"
                                        align="end"
                                        sideOffset={8}
                                        showBackdrop={true}
                                        className="w-52 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl space-y-1"
                                    >
                                        {canShowInstructions && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    closeMenu();
                                                    handleOpenInstructions();
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer text-left"
                                            >
                                                <Eye size={14} className="text-zinc-400" />
                                                <span>{tc('viewInstructions')}</span>
                                            </button>
                                        )}

                                        {onEdit && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    closeMenu();
                                                    onEdit();
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer text-left"
                                            >
                                                <Pencil size={14} className="text-zinc-400" />
                                                <span>{tc('editExercise')}</span>
                                            </button>
                                        )}

                                        {onReplace && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    closeMenu();
                                                    onReplace();
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer text-left"
                                            >
                                                <RefreshCw size={14} className="text-lime-500" />
                                                <span>{tc('replaceExercise')}</span>
                                            </button>
                                        )}

                                        {onRemove && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    closeMenu();
                                                    onRemove();
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer text-left"
                                            >
                                                <Trash2 size={14} />
                                                <span>{tc('removeExercise')}</span>
                                            </button>
                                        )}
                                    </Popover>
                                </>
                            ) : (
                                <>
                                    {canShowInstructions && (
                                        <button
                                            type="button"
                                            onClick={handleOpenInstructions}
                                            className="p-2 sm:p-2.5 rounded-xl text-zinc-400 hover:text-lime-500 hover:bg-lime-500/10 active:scale-95 transition-all cursor-pointer"
                                            title={tc('viewInstructions')}
                                        >
                                            <Eye size={16} />
                                        </button>
                                    )}
                                    {onEdit && (
                                        <button
                                            type="button"
                                            onClick={onEdit}
                                            className="p-2 sm:p-2.5 rounded-xl text-zinc-400 hover:text-lime-500 hover:bg-lime-500/10 active:scale-95 transition-all cursor-pointer"
                                            title={tc('editExercise')}
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    )}
                                    {onReplace && (
                                        <button
                                            type="button"
                                            onClick={onReplace}
                                            className="p-2 sm:p-2.5 rounded-xl text-zinc-400 hover:text-lime-500 hover:bg-lime-500/10 active:scale-95 transition-all cursor-pointer"
                                            title={tc('replaceExercise')}
                                        >
                                            <RefreshCw size={16} />
                                        </button>
                                    )}
                                    {onRemove && (
                                        <button
                                            type="button"
                                            onClick={onRemove}
                                            className="p-2 sm:p-2.5 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer"
                                            title={tc('removeExercise')}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Instruções do Exercício */}
            {resolvedExercise && (
                <ExerciseInstructionModal
                    isOpen={isInstructionOpen}
                    onClose={() => setIsInstructionOpen(false)}
                    exercise={resolvedExercise}
                />
            )}
        </>
    );
}

