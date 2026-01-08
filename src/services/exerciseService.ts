import { db } from '@/config/db';
import { Exercise } from '@/config/types';

export const ExerciseService = {
    // Buscar todos
    async getAllExercises(searchQuery = '', category = 'all', translations?: { te: any, tt: any }) {
        let exercises = await db.exercises.toArray();

        // 1. Filtro por Categoria (sempre aplicado se não for 'all')
        if (category !== 'all') {
            exercises = exercises.filter(ex => ex.category === category);
        }

        // 2. Filtro de Texto (Nome ou Tag)
        if (searchQuery.trim() && translations) {
            const { te, tt } = translations;
            const isTagSearch = searchQuery.startsWith('#');

            // Remove o '#' e espaços para a comparação
            const cleanQuery = isTagSearch
                ? searchQuery.substring(1).toLowerCase().trim()
                : searchQuery.toLowerCase().trim();

            if (cleanQuery.length > 0) {
                exercises = exercises.filter(ex => {
                    if (isTagSearch) {
                        // FILTRAR APENAS POR TAGS
                        return ex.tags?.some(tag => {
                            const translatedTag = tt.has(tag) ? tt(tag).toLowerCase() : tag.toLowerCase();
                            return translatedTag.includes(cleanQuery);
                        });
                    } else {
                        // FILTRAR APENAS POR NOME
                        const translatedName = te.has(ex.name) ? te(ex.name).toLowerCase() : ex.name.toLowerCase();
                        return translatedName.includes(cleanQuery);
                    }
                });
            }
        }

        return exercises;
    },

    // Buscar por ID
    async getExerciseById(id: number) {
        return await db.exercises.get(id);
    },

    // Criar novo com regras de negócio
    async createExercise(exerciseData: Omit<Exercise, 'id' | 'createdAt'>) {
        // Exemplo de regra de negócio: Garantir que o nome esteja capitalizado
        const formattedName = exerciseData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("Name too short");
        }

        return await db.exercises.add({
            ...exerciseData,
            name: formattedName,
            description: exerciseData.description?.trim(),
            mediaUrl: exerciseData.mediaUrl?.trim() || undefined,
            category: exerciseData.category,
            tags: exerciseData.tags,
        });
    },

    async updateExercise(id: number, updateData: Partial<Omit<Exercise, 'id' | 'createdAt'>>) {

        if (id < 1000) {
            throw new Error("Invalid ID");
        }
        // Exemplo de regra de negócio: Não permitir atualização para nome vazio
        if (updateData.name !== undefined) {
            const formattedName = updateData.name.trim();

            if (formattedName.length < 2) {
                throw new Error("Name too short");
            }
        }

        return await db.exercises.update(id, updateData);
    },

    // Deletar exercicio
    async deleteExerciseById(id: number) {
        return await db.exercises.delete(id);
    }
};