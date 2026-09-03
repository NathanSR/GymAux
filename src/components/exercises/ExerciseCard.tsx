"use client";

import React, { useState } from 'react';
import { Dumbbell, Eye, Edit, PlayCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Exercise } from '@/config/types';
import { CATEGORY_METADATA } from '@/config/constants';
import { getExerciseLocalized } from '@/utils/exerciseLocalization';

export interface ExerciseCardProps {
    exercise: Exercise;
    activeUserId?: string;
}

export const ExerciseCard = React.forwardRef<HTMLDivElement, ExerciseCardProps>(
    function ExerciseCard({ exercise, activeUserId }, ref) {
        const t = useTranslations('ExerciseList');
        const tc = useTranslations('Categories');
        const te = useTranslations('Exercises');
        const teq = useTranslations('Equipment');
        const locale = useLocale();

        const [imgFailed, setImgFailed] = useState(false);
        const [catImgFailed, setCatImgFailed] = useState(false);

        // Imagem do exercício tem prioridade sobre a imagem da categoria
        const exercisePhoto = exercise.imageUrl || exercise.gallery?.find(g => g.type === 'image')?.url;
        const categoryIllustration = exercise.category && CATEGORY_METADATA[exercise.category]?.imagePath;

        const hasCustomPhoto = Boolean(exercisePhoto && !imgFailed);
        const hasCategoryImg = Boolean(categoryIllustration && !catImgFailed);
        const hasVideo = Boolean(exercise.videoUrl || exercise.gallery?.some(g => g.type === 'video'));

        const localized = getExerciseLocalized(exercise, locale);
        const exerciseName = localized.name || (te.has(exercise.name) ? te(exercise.name) : exercise.name);
        const exerciseDescription = localized.description || (exercise.description && te.has(exercise.description) ? te(exercise.description) : exercise.description);

        const canEdit =
            exercise.created_by_type !== 'system' &&
            (exercise.id ? exercise.id >= 1000 : false) &&
            Boolean(activeUserId && exercise.created_by === activeUserId);

        return (
            <div
                ref={ref}
                className="group relative bg-white dark:bg-zinc-900/80 hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-lime-500/40 rounded-3xl p-3.5 sm:p-4.5 transition-all duration-300 shadow-xs hover:shadow-md overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4"
            >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    {/* Imagem em Destaque (Foto do Exercício ou Ilustração do Grupo Muscular) */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80 overflow-hidden shrink-0 flex items-center justify-center p-0.5 group-hover:scale-[1.02] transition-transform">
                        {hasCustomPhoto ? (
                            <img
                                src={exercisePhoto}
                                alt={exerciseName}
                                className="w-full h-full object-cover rounded-xl"
                                onError={() => setImgFailed(true)}
                            />
                        ) : hasCategoryImg ? (
                            <img
                                src={categoryIllustration}
                                alt={tc(exercise.category)}
                                className="w-full h-full object-contain p-1 rounded-xl"
                                onError={() => setCatImgFailed(true)}
                            />
                        ) : (
                            <Dumbbell size={24} className="text-zinc-400 dark:text-zinc-600" />
                        )}

                        {/* Indicador de Vídeo */}
                        {hasVideo && (
                            <div className="absolute right-1 bottom-1 w-5 h-5 bg-lime-400 text-zinc-950 rounded-full flex items-center justify-center shadow-md shadow-black/20">
                                <PlayCircle size={12} className="fill-current text-zinc-950" />
                            </div>
                        )}
                    </div>

                    {/* Informações Textuais */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[10px] font-black uppercase text-lime-600 dark:text-lime-400 tracking-widest">
                                {tc(exercise.category)}
                            </span>

                            {exercise.equipment && exercise.equipment !== 'none' && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60">
                                    {teq.has(exercise.equipment) ? teq(exercise.equipment) : exercise.equipment}
                                </span>
                            )}
                        </div>

                        <h3 className="font-black text-sm sm:text-base uppercase italic tracking-tight text-zinc-900 dark:text-zinc-100 truncate group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                            {exerciseName}
                        </h3>

                        {exerciseDescription && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5 font-medium">
                                {exerciseDescription}
                            </p>
                        )}
                    </div>
                </div>

                {/* Ações Rápidas */}
                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800/60">
                    <Link
                        href={`/exercises/${exercise.id}`}
                        className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                        <Eye size={14} />
                        <span>{t('viewDetails')}</span>
                    </Link>

                    {canEdit && (
                        <Link
                            href={`/exercises/${exercise.id}/edit`}
                            className="h-10 w-10 rounded-xl bg-lime-400 hover:bg-lime-300 text-zinc-950 flex items-center justify-center transition-all active:scale-95 shadow-sm shadow-lime-400/20 shrink-0"
                            title={t('edit')}
                        >
                            <Edit size={15} />
                        </Link>
                    )}
                </div>
            </div>
        );
    }
);
