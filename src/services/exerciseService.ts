import { Exercise } from '@/config/types';
import { getDatabase } from '@/config/rxDatabase';
import { userService } from './userService';

export const ExerciseService = {
    // Buscar todos com Filtros e Paginação
    async getAllExercises(
        params: {
            searchQuery?: string,
            category?: string,
            pagination?: { page: number; limit: number },
            translations?: { te: any, tt: any },
            supabase?: any
        }
    ) {
        const {
            searchQuery = '',
            category = 'all',
            pagination = { page: 1, limit: 20 },
            translations,
            supabase: supabaseInput
        } = params;

        let exercises: Exercise[] = [];
        let totalCount = 0;

        try {
            const db = await getDatabase();
            let query = db.exercises.find();
            if (category !== 'all') {
                query = db.exercises.find({
                    selector: { category }
                });
            }
            
            const docs = await query.exec();
            // Converter documentos RxDB para objetos JSON puros e mapear id para number se possível
            exercises = docs.map(doc => {
                const json = doc.toJSON();
                return {
                    ...json,
                    id: Number(json.id)
                } as Exercise;
            });
        } catch (error) {
            console.error('[ExerciseService] Local fetch failed:', error);
        }

        // Filtro de Texto (Nome ou Tag) - No JS para suportar traduções
        if (searchQuery.trim() && translations) {
            const { te, tt } = translations;
            const isTagSearch = searchQuery.startsWith('#');

            const cleanQuery = isTagSearch
                ? searchQuery.substring(1).toLowerCase().trim()
                : searchQuery.toLowerCase().trim();

            if (cleanQuery.length > 0) {
                exercises = exercises.filter((ex: any) => {
                    if (isTagSearch) {
                        return ex.tags?.some((tag: string) => {
                            const translatedTag = tt.has(tag) ? tt(tag).toLowerCase() : tag.toLowerCase();
                            return translatedTag.includes(cleanQuery);
                        });
                    } else {
                        const translatedName = te.has(ex.name) ? te(ex.name).toLowerCase() : ex.name.toLowerCase();
                        return translatedName.includes(cleanQuery);
                    }
                });
            }
        }

        // Ordenação: User > Trainer > System
        const typePriority: Record<string, number> = {
            'user': 1,
            'trainer': 2,
            'system': 3
        };

        exercises.sort((a: Exercise, b: Exercise) => {
            const pA = a.created_by_type ? typePriority[a.created_by_type] || 4 : 4;
            const pB = b.created_by_type ? typePriority[b.created_by_type] || 4 : 4;
            if (pA === pB) {
                return (a.id || 0) - (b.id || 0);
            }
            return pA - pB;
        });

        totalCount = exercises.length;

        // Paginação (JS)
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit;
        const paginatedExercises = exercises.slice(from, to);

        return {
            exercises: paginatedExercises,
            totalCount: totalCount
        };
    },

    // Buscar por ID
    async getExerciseById(id: number, supabaseInput?: any) {
        try {
            const db = await getDatabase();
            const doc = await db.exercises.findOne(String(id)).exec();
            if (doc) {
                const json = doc.toJSON();
                return {
                    ...json,
                    id: Number(json.id)
                } as Exercise;
            }
            return null;
        } catch (error) {
            console.warn('[ExerciseService] getExerciseById failed:', error);
            return null;
        }
    },

    // Criar novo
    async createExercise(exerciseData: Omit<Exercise, 'id'> & { userId?: string }, supabaseInput?: any) {
        const formattedName = exerciseData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("Name too short");
        }

        const userId = exerciseData.userId || await userService.resolveCurrentUserId();

        if (!userId) {
            throw new Error("User not found");
        }

        const db = await getDatabase();
        // Gerar um ID numérico incremental local temporário acima de 1000
        const exercisesCount = await db.exercises.count().exec();
        const nextId = 1001 + exercisesCount;

        const localExercise = {
            id: String(nextId),
            name: formattedName,
            description: exerciseData.description?.trim() || '',
            howTo: exerciseData.howTo || '',
            mediaUrl: exerciseData.mediaUrl?.trim() || '',
            category: exerciseData.category,
            tags: exerciseData.tags || [],
            level: exerciseData.level || 'beginner',
            created_by: userId,
            created_by_type: 'user' as const,
            isPublic: exerciseData.isPublic ?? false,
            updated_at: new Date().toISOString()
        };

        const inserted = await db.exercises.insert(localExercise);
        const json = inserted.toJSON();
        return {
            ...json,
            id: Number(json.id)
        } as Exercise;
    },

    // Atualizar exercício
    async updateExercise(id: number, updateData: Partial<Omit<Exercise, 'id'>> & { userId: string }, supabaseInput?: any) {
        // Regra de Negócio: exercícios do sistema (< 1000) não podem ser alterados
        if (id < 1000) {
            throw new Error("Cannot update system exercises");
        }

        const db = await getDatabase();
        const doc = await db.exercises.findOne(String(id)).exec();
        if (!doc) {
            throw new Error("Exercise not found");
        }

        const cleanUpdates: any = {
            updated_at: new Date().toISOString()
        };
        if (updateData.name !== undefined) cleanUpdates.name = updateData.name.trim();
        if (updateData.description !== undefined) cleanUpdates.description = updateData.description.trim();
        if (updateData.howTo !== undefined) cleanUpdates.howTo = updateData.howTo;
        if (updateData.mediaUrl !== undefined) cleanUpdates.mediaUrl = updateData.mediaUrl.trim() || '';
        if (updateData.category !== undefined) cleanUpdates.category = updateData.category;
        if (updateData.tags !== undefined) cleanUpdates.tags = updateData.tags;
        if (updateData.level !== undefined) cleanUpdates.level = updateData.level;
        if (updateData.isPublic !== undefined) cleanUpdates.isPublic = updateData.isPublic;

        const updated = await doc.incrementalPatch(cleanUpdates);
        const json = updated.toJSON();
        return {
            ...json,
            id: Number(json.id)
        } as Exercise;
    },

    // Deletar exercício
    async deleteExercise(id: number, userId: string, supabaseInput?: any) {
        if (id < 1000) {
            throw new Error("Cannot delete system exercises");
        }

        const db = await getDatabase();
        const doc = await db.exercises.findOne(String(id)).exec();
        if (doc) {
            await doc.remove();
        }
    }
};
