import { createClient } from '@/lib/supabase/client';
import { Exercise } from '@/config/types';

const mapExerciseFromSupabase = (ex: any): Exercise => ({
    id: ex.id,
    name: ex.name,
    description: ex.description || undefined,
    category: ex.category as any,
    tags: ex.tags || [],
    howTo: ex.how_to || undefined,
    mediaUrl: ex.media_url || undefined,
    level: ex.level as any,
});

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

        const supabase = supabaseInput || createClient();
        let query = supabase.from('exercises').select('*', { count: 'exact' });

        // 1. Filtro por Categoria (SQL)
        if (category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching exercises:', error);
            return { exercises: [], totalCount: 0 };
        }

        let exercises = (data || []).map(mapExerciseFromSupabase);

        // 2. Filtro de Texto (Nome ou Tag) - No JS para suportar traduções
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

        const totalCount = exercises.length;

        // 3. Paginação (JS)
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
        const supabase = supabaseInput || createClient();
        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            console.error('Error fetching exercise by ID:', error);
            return null;
        }

        return data ? mapExerciseFromSupabase(data) : null;
    },

    // Criar novo
    async createExercise(exerciseData: Omit<Exercise, 'id'>, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        const formattedName = exerciseData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("Name too short");
        }

        const { data, error } = await supabase
            .from('exercises')
            .insert({
                name: formattedName,
                description: exerciseData.description?.trim(),
                how_to: exerciseData.howTo,
                media_url: exerciseData.mediaUrl?.trim() || null,
                category: exerciseData.category,
                tags: exerciseData.tags,
                level: exerciseData.level,
                created_by_type: 'user',
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapExerciseFromSupabase(data);
    },

    async updateExercise(id: number, updateData: Partial<Omit<Exercise, 'id'>>, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        // Business rule: system exercises (id < 1000) cannot be updated by users
        if (id < 1000) {
            throw new Error("Cannot update system exercises");
        }

        const updates: any = {};
        if (updateData.name !== undefined) {
            const formattedName = updateData.name.trim();
            if (formattedName.length < 2) {
                throw new Error("Name too short");
            }
            updates.name = formattedName;
        }
        if (updateData.description !== undefined) updates.description = updateData.description.trim();
        if (updateData.howTo !== undefined) updates.how_to = updateData.howTo;
        if (updateData.mediaUrl !== undefined) updates.media_url = updateData.mediaUrl.trim() || null;
        if (updateData.category !== undefined) updates.category = updateData.category;
        if (updateData.tags !== undefined) updates.tags = updateData.tags;
        if (updateData.level !== undefined) updates.level = updateData.level;

        const { data, error } = await supabase
            .from('exercises')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return mapExerciseFromSupabase(data);
    },

    // Deletar exercicio
    async deleteExercise(id: number, supabaseInput?: any) {
        const supabase = supabaseInput || createClient();
        if (id < 1000) {
            throw new Error("Cannot delete system exercises");
        }

        const { error } = await supabase
            .from('exercises')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }
    }
};