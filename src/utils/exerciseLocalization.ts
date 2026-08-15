import { Exercise, ExerciseTranslation } from "@/config/types";

export interface LocalizedExerciseContent {
    name: string;
    description?: string;
    howTo?: string;
    tags: string[];
}

/**
 * Retorna os textos do exercício no idioma especificado, com fallback automático:
 * Idioma Ativo -> Português (pt) -> Inglês (en) -> Propriedades Base do Exercício.
 */
export function getExerciseLocalized(
    exercise: Exercise | null | undefined,
    locale: string = 'pt'
): LocalizedExerciseContent {
    if (!exercise) {
        return {
            name: '',
            description: undefined,
            howTo: undefined,
            tags: []
        };
    }

    const trans = exercise.translations;
    const target = trans?.[locale];
    const pt = trans?.['pt'];
    const en = trans?.['en'];

    // Nome: target -> pt -> en -> base name
    const name = target?.name?.trim() || pt?.name?.trim() || en?.name?.trim() || exercise.name || '';

    // Descrição: target -> pt -> en -> base description
    const description = target?.description?.trim() || pt?.description?.trim() || en?.description?.trim() || exercise.description || undefined;

    // HowTo / Instruções: target -> pt -> en -> base howTo
    const howTo = target?.howTo?.trim() || pt?.howTo?.trim() || en?.howTo?.trim() || exercise.howTo || undefined;

    // Tags: target -> pt -> en -> base tags
    const tags = (target?.tags && target.tags.length > 0)
        ? target.tags
        : (pt?.tags && pt.tags.length > 0)
            ? pt.tags
            : (en?.tags && en.tags.length > 0)
                ? en.tags
                : exercise.tags || [];

    return {
        name,
        description,
        howTo,
        tags
    };
}

/**
 * Retorna uma lista limpa de passos de instrução (array de strings) a partir do howTo localizado.
 */
export function getLocalizedInstructions(
    exercise: Exercise | null | undefined,
    locale: string = 'pt'
): string[] {
    const { howTo } = getExerciseLocalized(exercise, locale);
    if (!howTo) return [];

    return howTo
        .split('\n')
        .map(p => p.trim())
        .filter(p => p !== '')
        .map(p => p.replace(/^\d+[\s.\-)]+/, '').trim());
}

/**
 * Verifica se um exercício atende ao termo de busca no idioma do usuário ou em tags.
 */
export function matchesExerciseSearch(
    exercise: Exercise,
    query: string,
    locale: string = 'pt'
): boolean {
    if (!query || !query.trim()) return true;

    const isTagSearch = query.startsWith('#');
    const cleanQuery = (isTagSearch ? query.substring(1) : query).toLowerCase().trim();
    if (!cleanQuery) return true;

    const { name, tags } = getExerciseLocalized(exercise, locale);

    if (isTagSearch) {
        return tags.some(tag => tag.toLowerCase().includes(cleanQuery));
    }

    // Busca no nome traduzido ou em qualquer uma das tags
    return (
        name.toLowerCase().includes(cleanQuery) ||
        tags.some(tag => tag.toLowerCase().includes(cleanQuery))
    );
}
