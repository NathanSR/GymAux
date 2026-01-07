import { Exercise } from "@/config/types";

/**
 * Extrai todas as tags únicas de uma lista de exercícios.
 * @param exercises Array de exercícios (pode conter todas as categorias juntas)
 * @returns String[] Lista de tags únicas ordenadas alfabeticamente
 */
export const getUniqueTags = (exercises: Exercise[]): string[] => {
    const allTags = exercises.flatMap(exercise => exercise.tags || []);

    // Set remove duplicatas automaticamente
    const uniqueTags = Array.from(new Set(allTags));

    // Retorna ordenado para facilitar a organização no JSON
    return uniqueTags.sort();
};

// Exemplo de como você usaria:
// const todasAsTags = getUniqueTags([...CHEST_EXERCISES, ...BACK_EXERCISES, ...CORE_EXERCISES, ...]);
// console.log(todasAsTags);