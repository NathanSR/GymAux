import { createClient } from '@/lib/supabase/client';
import { Exercise } from '@/config/types';
import { db } from '@/config/db';
import { SyncManager } from './syncManager';
import { withTimeout } from '@/lib/utils/timeout';
import { userService } from './userService';
import { safeBulkPut } from '@/utils/cacheSyncUtil';
import { safeParseArray } from '@/utils/jsonUtil';
import { matchesExerciseSearch } from '@/utils/exerciseLocalization';

const inferEquipmentFromTags = (tags: string[], name: string): 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'smith' | 'kettlebell' | 'none' => {
    const t = tags.map(tag => tag.toLowerCase());
    const n = name.toLowerCase();
    if (t.includes('barbell') || n.includes('barbell') || n.includes('barra')) return 'barbell';
    if (t.includes('dumbbell') || t.includes('dumbbells') || n.includes('dumbbell') || n.includes('halter')) return 'dumbbell';
    if (t.includes('cable') || t.includes('cables') || n.includes('cable') || n.includes('cabo') || n.includes('polia') || n.includes('cross')) return 'cable';
    if (t.includes('machine') || t.includes('machines') || n.includes('machine') || n.includes('maquina') || n.includes('máquina') || n.includes('articulado') || n.includes('press')) return 'machine';
    if (t.includes('bodyweight') || t.includes('calisthenics') || n.includes('bodyweight') || n.includes('flexão') || n.includes('barra fixa') || n.includes('graviton') || n.includes('prancha')) return 'bodyweight';
    if (t.includes('smith') || n.includes('smith') || n.includes('guiado')) return 'smith';
    if (t.includes('kettlebell') || n.includes('kettlebell')) return 'kettlebell';
    return 'none';
};

const inferMechanicsFromTags = (tags: string[], name: string): 'compound' | 'isolation' => {
    const t = tags.map(tag => tag.toLowerCase());
    const n = name.toLowerCase();
    const isolationKeywords = [
        'rosca', 'extensora', 'flexora', 'elevação lateral', 'crucifixo', 
        'voador', 'pec deck', 'triceps testa', 'coice', 'panturrilha',
        'isolation', 'isolated'
    ];
    if (t.includes('isolation') || t.includes('isolated') || isolationKeywords.some(kw => n.includes(kw))) {
        return 'isolation';
    }
    return 'compound';
};

const inferExecutionModeFromTags = (tags: string[], name: string): 'bilateral' | 'unilateral' | 'alternating' => {
    const t = tags.map(tag => tag.toLowerCase());
    const n = name.toLowerCase();
    if (t.includes('unilateral') || n.includes('unilateral')) return 'unilateral';
    if (t.includes('alternating') || t.includes('alternate') || n.includes('alternado') || n.includes('alternada')) return 'alternating';
    return 'bilateral';
};

const mapExerciseFromSupabase = (ex: any): Exercise => {
    const tags = safeParseArray<string>(ex.tags);
    const secondaryMuscles = safeParseArray<any>(ex.secondary_muscles);
    const gallery = safeParseArray<any>(ex.gallery);
    const name = ex.name || 'Exercício sem nome';
    return {
        id: ex.id,
        created_by: ex.created_by,
        created_by_type: ex.created_by_type || "system",
        name: name,
        description: ex.description || undefined,
        category: ex.category || 'core',
        secondaryMuscles: secondaryMuscles.length > 0 ? secondaryMuscles : undefined,
        tags: tags,
        howTo: ex.how_to || undefined,
        imageUrl: ex.image_url || undefined,
        videoUrl: ex.video_url || undefined,
        gallery: gallery.length > 0 ? gallery : undefined,
        level: ex.level as any,
        visibility: ex.visibility || (ex.created_by_type === 'system' || (ex.id && ex.id < 1000) ? 'public' : 'private'),
        shared_with: safeParseArray<string>(ex.shared_with),
        equipment: ex.equipment || inferEquipmentFromTags(tags, name),
        executionMode: ex.execution_mode || inferExecutionModeFromTags(tags, name),
        mechanics: ex.mechanics || inferMechanicsFromTags(tags, name),
        parentId: ex.parent_id || undefined,
        translations: ex.translations || undefined,
    };
};

export const ExerciseService = {
    // Buscar todos com Filtros e Paginação
    async getAllExercises(
        params: {
            searchQuery?: string,
            category?: string,
            equipment?: string,
            level?: string,
            pagination?: { page: number; limit: number },
            translations?: { te: any, tt: any },
            locale?: string,
            supabase?: any,
            studentMode?: boolean,
            trainerId?: string,
        }
    ) {
        const {
            searchQuery = '',
            category = 'all',
            equipment = 'all',
            level = 'all',
            pagination = { page: 1, limit: 20 },
            translations,
            locale = 'pt',
            supabase: supabaseInput,
            studentMode = false,
            trainerId,
        } = params;

        let exercises: Exercise[] = [];
        let totalCount = 0;

        const fetchFromLocalDB = async () => {
            if (typeof window !== 'undefined') {
                let localExercises: Exercise[] = [];
                if (category !== 'all') {
                    localExercises = await db.exercises.where('category').equals(category).toArray();
                } else {
                    localExercises = await db.exercises.toArray();
                }
                return localExercises;
            }
            return [];
        };

        const isOffline = typeof window !== 'undefined' && !navigator.onLine;

        if (isOffline) {
            exercises = await fetchFromLocalDB();
        } else {
            try {
                const supabase = supabaseInput || createClient();
                let query = supabase.from('exercises').select('*', { count: 'exact' });

                if (category !== 'all') {
                    query = query.eq('category', category);
                }
                if (level !== 'all') {
                    query = query.eq('level', level);
                }

                const { data, error } = await withTimeout(query, 1800);

                if (error) throw error;

                exercises = (data || []).map(mapExerciseFromSupabase);
            } catch (error) {
                console.warn('[ExerciseService] Fetch failed, falling back to local DB:', error);
                exercises = await fetchFromLocalDB();
            }
        }

        // Filtro por Equipamento (JS para suportar os mapeados/inferidos)
        if (equipment !== 'all') {
            exercises = exercises.filter(ex => ex.equipment === equipment);
        }

        // Filtro por Nível
        if (level !== 'all') {
            exercises = exercises.filter(ex => ex.level === level);
        }

        // Filtro de Segurança para Aluno: Apenas exercícios do sistema ou do próprio treinador que sejam públicos/para alunos
        if (studentMode) {
            exercises = exercises.filter(ex => {
                const isSystem = ex.created_by_type === 'system' || (ex.id !== undefined && ex.id < 1000);
                if (isSystem) return true;
                const isTrainer = trainerId ? ex.created_by === trainerId : true;
                const isAccessible = ex.visibility === 'public' || ex.visibility === 'students';
                return isTrainer && isAccessible;
            });
        }

        // 2. Filtro de Texto (Nome ou Tag) - Suporte dinâmico e fallback
        if (searchQuery.trim()) {
            const isTagSearch = searchQuery.startsWith('#');
            const cleanQuery = (isTagSearch ? searchQuery.substring(1) : searchQuery).toLowerCase().trim();

            if (cleanQuery.length > 0) {
                exercises = exercises.filter((ex: any) => {
                    if (translations) {
                        const { te, tt } = translations;
                        if (isTagSearch) {
                            const matchTag = ex.tags?.some((tag: string) => {
                                const translatedTag = tt.has(tag) ? tt(tag).toLowerCase() : tag.toLowerCase();
                                return translatedTag.includes(cleanQuery);
                            });
                            if (matchTag) return true;
                        } else {
                            const translatedName = te.has(ex.name) ? te(ex.name).toLowerCase() : ex.name.toLowerCase();
                            if (translatedName.includes(cleanQuery)) return true;
                        }
                    }
                    return matchesExerciseSearch(ex, searchQuery, locale);
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
            const pA = typePriority[a.created_by_type || 'system'] || 4;
            const pB = typePriority[b.created_by_type || 'system'] || 4;
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
            image_url: exerciseData.imageUrl?.trim() || null,
            video_url: exerciseData.videoUrl?.trim() || null,
            gallery: exerciseData.gallery || [],
            secondary_muscles: exerciseData.secondaryMuscles || [],
            category: exerciseData.category,
            tags: exerciseData.tags,
            level: exerciseData.level,
            equipment: exerciseData.equipment || 'none',
            execution_mode: exerciseData.executionMode || 'bilateral',
            mechanics: exerciseData.mechanics || 'compound',
            parent_id: exerciseData.parentId || null,
            created_by: userId,
            created_by_type: 'user',
            visibility: exerciseData.visibility || 'private',
            shared_with: exerciseData.shared_with || [],
            translations: exerciseData.translations || {},
        };

        if (typeof window !== 'undefined') {
            const id = Date.now(); // Temporary numeric ID (> 100,000) for local use
            const localExercise = { id, ...apiPayload } as Exercise;
            await db.exercises.add(localExercise);
            await SyncManager.enqueue('CREATE', 'EXERCISE', id, apiPayload, userId);
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

    async updateExercise(id: number, updateData: Partial<Omit<Exercise, 'id'>> & { userId?: string }, supabaseInput?: any) {
        // Business rule: system exercises (id < 1000) cannot be updated by users
        if (id < 1000) {
            throw new Error("Cannot update system exercises");
        }

        // Build payload
        const updates: any = {};
        if (updateData.name !== undefined) updates.name = updateData.name.trim();
        if (updateData.description !== undefined) updates.description = updateData.description?.trim() || null;
        if (updateData.howTo !== undefined) updates.how_to = updateData.howTo;
        if (updateData.imageUrl !== undefined) updates.image_url = updateData.imageUrl?.trim() || null;
        if (updateData.videoUrl !== undefined) updates.video_url = updateData.videoUrl?.trim() || null;
        if (updateData.gallery !== undefined) updates.gallery = updateData.gallery;
        if (updateData.secondaryMuscles !== undefined) updates.secondary_muscles = updateData.secondaryMuscles;
        if (updateData.category !== undefined) updates.category = updateData.category;
        if (updateData.tags !== undefined) updates.tags = updateData.tags;
        if (updateData.level !== undefined) updates.level = updateData.level;
        if (updateData.equipment !== undefined) updates.equipment = updateData.equipment;
        if (updateData.executionMode !== undefined) updates.execution_mode = updateData.executionMode;
        if (updateData.mechanics !== undefined) updates.mechanics = updateData.mechanics;
        if (updateData.parentId !== undefined) updates.parent_id = updateData.parentId;
        if (updateData.visibility !== undefined) updates.visibility = updateData.visibility;
        if (updateData.shared_with !== undefined) updates.shared_with = updateData.shared_with;
        if (updateData.translations !== undefined) updates.translations = updateData.translations;

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
    },

    // Buscar exercicios semelhantes (substitutos dinâmicos)
    async getAlternativeExercises(
        exercise: Exercise,
        supabaseInput?: any,
        options?: { studentMode?: boolean; trainerId?: string }
    ): Promise<Exercise[]> {
        if (!exercise.category || !exercise.id) return [];
        const category = exercise.category;
        const mechanics = exercise.mechanics || 'compound';
        const id = exercise.id;

        const filterAccessible = (list: Exercise[]) => {
            if (!options?.studentMode) return list;
            return list.filter(ex => {
                const isSystem = ex.created_by_type === 'system' || (ex.id !== undefined && ex.id < 1000);
                if (isSystem) return true;
                const isTrainer = options.trainerId ? ex.created_by === options.trainerId : true;
                const isAccessible = ex.visibility === 'public' || ex.visibility === 'students';
                return isTrainer && isAccessible;
            });
        };

        // Local-first
        if (typeof window !== 'undefined') {
            const localMatches = await db.exercises
                .where('category')
                .equals(category)
                .toArray();
            const mapped = localMatches.map(mapExerciseFromSupabase);
            const filtered = mapped.filter(ex => ex.id !== id && ex.mechanics === mechanics);
            return filterAccessible(filtered).slice(0, 5);
        }

        // Server path
        try {
            const supabase = supabaseInput || createClient();
            const { data, error } = await withTimeout(
                supabase
                    .from('exercises')
                    .select('*')
                    .eq('category', category)
                    .eq('mechanics', mechanics)
                    .neq('id', id)
                    .limit(10),
                3000
            );
            if (error) throw error;
            const mapped = (data || []).map(mapExerciseFromSupabase);
            return filterAccessible(mapped).slice(0, 5);
        } catch (error) {
            console.error('[ExerciseService] Failed to fetch alternative exercises:', error);
            return [];
        }
    }
};
