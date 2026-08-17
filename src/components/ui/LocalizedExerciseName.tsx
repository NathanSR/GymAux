'use client';

import React, { memo } from 'react';
import { Exercise } from '@/config/types';
import { useExerciseLocalization } from '@/hooks/useExerciseLocalization';

export interface LocalizedExerciseNameProps {
    exerciseId?: number | null;
    exercise?: Exercise | null;
    fallbackName?: string;
    suffix?: React.ReactNode;
    className?: string;
    skeletonClassName?: string;
    showSkeleton?: boolean;
    as?: 'span' | 'p' | 'h2' | 'h3' | 'h4' | 'div';
}

/**
 * Componente otimizado para renderizar nomes de exercícios com tradução dinâmica e
 * transição suave via micro-skeleton para evitar qualquer flicker visual (FOUC).
 */
export const LocalizedExerciseName = memo(({
    exerciseId,
    exercise,
    fallbackName = '',
    suffix,
    className = '',
    skeletonClassName = '',
    showSkeleton = true,
    as: Component = 'span'
}: LocalizedExerciseNameProps) => {
    const { getLocalizedName, isLoading } = useExerciseLocalization();

    // Se já temos o objeto completo de exercício, resolvemos imediatamente
    const resolvedName = getLocalizedName(exerciseId, fallbackName, exercise);

    // Se ainda está carregando do Dexie e temos um exerciseId que ainda não foi mapeado
    const isPending = isLoading && !!exerciseId && !exercise;

    if (isPending && showSkeleton) {
        return (
            <Component className={`inline-flex items-center gap-1.5 ${className}`}>
                <span
                    className={`inline-block h-3.5 w-24 sm:w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse align-middle ${skeletonClassName}`}
                    aria-hidden="true"
                />
                {suffix}
            </Component>
        );
    }

    const displayText = resolvedName || fallbackName;

    return (
        <Component className={className}>
            {displayText}
            {suffix}
        </Component>
    );
});

LocalizedExerciseName.displayName = 'LocalizedExerciseName';

export default LocalizedExerciseName;
