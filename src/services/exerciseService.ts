import { createClient } from '@/lib/supabase/client';
import { Exercise } from '@/config/types';
import { db } from '@/config/db';
import { SyncManager } from './syncManager';
import { withTimeout } from '@/lib/utils/timeout';
import { userService } from './userService';

const mapExerciseFromSupabase = (ex: any): Exercise => ({
    id: ex.id,
    created_by: ex.created_by,
    created_by_type: ex.created_by_type || "system",
    name: ex.name,
    description: ex.description || undefined,
    category: ex.category as any,
    tags: ex.tags || [],
    howTo: ex.how_to || undefined,
    mediaUrl: ex.media_url || undefined,
    level: ex.level as any,
    isPublic: ex.is_public,
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

        let exercises: Exercise[] = [];
        let totalCount = 0;

        try {
            const supabase = supabaseInput || createClient();
            let query = supabase.from('exercises').select('*', { count: 'exact' });

            // 1. Filtro por Categoria (SQL)
            if (category !== 'all') {
                query = query.eq('category', category);
            }

            const { data, error } = await withTimeout(query, 3000);

            if (error) throw error;

            exercises = (data || []).map(mapExerciseFromSupabase);
            
            // Sync to local DB for cache (only user/trainer exercises, system ones are seeded)
            if (typeof window !== 'undefined') {
                const userExercises = exercises.filter(ex => ex.created_by_type !== 'system');
                if (userExercises.length > 0) {
                    await db.exercises.bulkPut(userExercises).catch(() => {});
                }
            }
        } catch (error) {
            console.warn('[ExerciseService] Fetch failed, falling back to local DB:', error);
            if (typeof window !== 'undefined') {
                let localQuery = db.exercises.toCollection();
                if (category !== 'all') {
                    localQuery = db.exercises.where('category').equals(category);
                }
                exercises = await localQuery.toArray();
                totalCount = exercises.length;
            } else {
                return { exercises: [], totalCount: 0 };
            }
        }

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

        // 3. Ordenação: User > Trainer > System
        const typePriority: Record<string, number> = {
            'user': 1,
            'trainer': 2,
            'system': 3
        };

        exercises.sort((a: Exercise, b: Exercise) => {
            const pA = typePriority[a.created_by_type] || 4;
            const pB = typePriority[b.created_by_type] || 4;
            if (pA === pB) {
                return (a.id || 0) - (b.id || 0);
            }
            return pA - pB;
        });

        totalCount = exercises.length;

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
        // Local-first
        if (typeof window !== 'undefined') {
            const local = await db.exercises.get(id);
            if (local) return local;
        }

        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('exercises')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle(),
                3000
            );

            if (error) throw error;

            if (data) {
                const exercise = mapExerciseFromSupabase(data);
                // Cache for offline
                if (typeof window !== 'undefined') {
                    await db.exercises.put(exercise).catch(() => {});
                }
                return exercise;
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

        const apiPayload = {
            name: formattedName,
            description: exerciseData.description?.trim(),
            how_to: exerciseData.howTo,
            media_url: exerciseData.mediaUrl?.trim() || null,
            category: exerciseData.category,
            tags: exerciseData.tags,
            level: exerciseData.level,
            created_by: userId,
            created_by_type: 'user',
            is_public: exerciseData.isPublic ?? false,
        };

        if (typeof window !== 'undefined') {
            const id = Date.now(); // Temporary numeric ID for local use
            const localExercise = { id, ...apiPayload } as Exercise;
            await db.exercises.add(localExercise);
            await SyncManager.enqueue('CREATE', 'EXERCISE', id, apiPayload);
            return localExercise;
        }

        const supabase = supabaseInput || createClient();
        const { data, error } = await withTimeout(
            supabase
                .from('exercises')
                .insert(apiPayload)
                .select()
                .single(),
            3000
        );

        if (error) throw error;
        return mapExerciseFromSupabase(data);
    },

    async updateExercise(id: number, updateData: Partial<Omit<Exercise, 'id'>> & { userId: string }, supabaseInput?: any) {
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
        if (updateData.isPublic !== undefined) updates.is_public = updateData.isPublic;

        // Local-first
        if (typeof window !== 'undefined') {
            const local = await db.exercises.get(id);
            if (local) {
                const updated = { ...local, ...updateData };
                await db.exercises.put(updated);
                await SyncManager.enqueue('UPDATE', 'EXERCISE', id, updates);
                return updated as Exercise;
            }

            // Not in local cache — try to fetch and cache first
            try {
                const supabase = supabaseInput || createClient();
                const { data: fetchedData } = await withTimeout(
                    supabase.from('exercises').select('*').eq('id', id).maybeSingle(),
                    3000
                );
                if (fetchedData) {
                    const exercise = mapExerciseFromSupabase(fetchedData);
                    const updated = { ...exercise, ...updateData };
                    await db.exercises.put(updated);
                    await SyncManager.enqueue('UPDATE', 'EXERCISE', id, updates);
                    return updated as Exercise;
                }
            } catch {
                // Can't fetch — enqueue anyway
                await SyncManager.enqueue('UPDATE', 'EXERCISE', id, updates);
                return { id, ...updateData } as Exercise;
            }
        }

        // Server-only path
        const supabase = supabaseInput || createClient();
        const { data, error } = await withTimeout(
            supabase
                .from('exercises')
                .update(updates)
                .eq('id', id)
                .eq('created_by', updateData.userId)
                .select()
                .single(),
            3000
        );

        if (error) throw error;
        return mapExerciseFromSupabase(data);
    },

    // Deletar exercicio
    async deleteExercise(id: number, userId: string, supabaseInput?: any) {
        if (id < 1000) {
            throw new Error("Cannot delete system exercises");
        }

        // Local-first
        if (typeof window !== 'undefined') {
            await db.exercises.delete(id);
            await SyncManager.enqueue('DELETE', 'EXERCISE', id, { id });
            return;
        }

        // Server-only path
        const supabase = supabaseInput || createClient();
        const { error } = await withTimeout(
            supabase
                .from('exercises')
                .delete()
                .eq('id', id)
                .eq('created_by', userId),
            3000
        );

        if (error) throw error;
    }
};
