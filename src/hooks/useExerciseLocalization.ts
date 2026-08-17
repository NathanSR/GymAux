'use client';

import { useMemo, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/config/db';
import { Exercise } from '@/config/types';
import { getExerciseLocalized, LocalizedExerciseContent, getLocalizedInstructions as getInstructionsHelper } from '@/utils/exerciseLocalization';

export interface UseExerciseLocalizationReturn {
    locale: string;
    exercises: Exercise[];
    exercisesMap: Map<number, Exercise>;
    isLoading: boolean;
    isReady: boolean;
    getLocalizedName: (exerciseId?: number | null, fallbackName?: string, exercise?: Exercise | null) => string;
    getLocalized: (exerciseOrId?: Exercise | number | null, fallbackName?: string) => LocalizedExerciseContent;
    getLocalizedInstructions: (exerciseOrId?: Exercise | number | null) => string[];
}

/**
 * Hook reativo para obter traduções de exercícios no idioma ativo da aplicação.
 * Integra-se diretamente com o cache do Dexie DB via useLiveQuery para lookup O(1).
 */
export function useExerciseLocalization(): UseExerciseLocalizationReturn {
    const locale = useLocale();

    // Query do Dexie: retorna undefined enquanto carrega do IndexedDB
    const rawExercises = useLiveQuery(
        async () => {
            return await db.exercises.toArray();
        },
        []
    );

    const isLoading = rawExercises === undefined;
    const exercises = useMemo(() => rawExercises ?? [], [rawExercises]);
    const isReady = !isLoading;

    const exercisesMap = useMemo(() => {
        const map = new Map<number, Exercise>();
        exercises.forEach(ex => {
            if (ex.id) {
                map.set(ex.id, ex);
            }
        });
        return map;
    }, [exercises]);

    const getLocalizedName = useCallback(
        (exerciseId?: number | null, fallbackName?: string, exercise?: Exercise | null): string => {
            // 1. Se já forneceu o objeto Exercise diretamente
            if (exercise) {
                const loc = getExerciseLocalized(exercise, locale);
                return loc.name || fallbackName || exercise.name || '';
            }

            // 2. Se forneceu o exerciseId e ele está mapeado no Dexie
            if (exerciseId && exercisesMap.has(exerciseId)) {
                const ex = exercisesMap.get(exerciseId)!;
                const loc = getExerciseLocalized(ex, locale);
                return loc.name || fallbackName || ex.name || '';
            }

            // 3. Fallback
            return fallbackName || '';
        },
        [exercisesMap, locale]
    );

    const getLocalized = useCallback(
        (exerciseOrId?: Exercise | number | null, fallbackName?: string): LocalizedExerciseContent => {
            if (!exerciseOrId) {
                return {
                    name: fallbackName || '',
                    description: undefined,
                    howTo: undefined,
                    tags: []
                };
            }

            if (typeof exerciseOrId === 'number') {
                const ex = exercisesMap.get(exerciseOrId);
                if (ex) {
                    return getExerciseLocalized(ex, locale);
                }
                return {
                    name: fallbackName || '',
                    description: undefined,
                    howTo: undefined,
                    tags: []
                };
            }

            return getExerciseLocalized(exerciseOrId, locale);
        },
        [exercisesMap, locale]
    );

    const getLocalizedInstructions = useCallback(
        (exerciseOrId?: Exercise | number | null): string[] => {
            if (!exerciseOrId) return [];

            let ex: Exercise | undefined;
            if (typeof exerciseOrId === 'number') {
                ex = exercisesMap.get(exerciseOrId);
            } else {
                ex = exerciseOrId;
            }

            if (!ex) return [];
            return getInstructionsHelper(ex, locale);
        },
        [exercisesMap, locale]
    );

    return {
        locale,
        exercises,
        exercisesMap,
        isLoading,
        isReady,
        getLocalizedName,
        getLocalized,
        getLocalizedInstructions
    };
}
