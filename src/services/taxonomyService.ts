import { createClient } from '@/lib/supabase/client';
import { db } from '@/config/db';
import { ExerciseCategory, ExerciseEquipment } from '@/config/types';
import { CATEGORIES, EQUIPMENT, CATEGORY_METADATA, EQUIPMENT_METADATA } from '@/config/constants';
import { withTimeout } from '@/lib/utils/timeout';

// Fallback arrays generated from constants
const FALLBACK_CATEGORIES: ExerciseCategory[] = CATEGORIES.map((slug, index) => ({
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    imageUrl: CATEGORY_METADATA[slug]?.imagePath || null,
    displayOrder: index + 1,
    isActive: true,
    translations: {}
}));

const FALLBACK_EQUIPMENT: ExerciseEquipment[] = EQUIPMENT.map((slug, index) => ({
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    imageUrl: EQUIPMENT_METADATA[slug]?.imagePath || null,
    displayOrder: index + 1,
    isActive: true,
    translations: {}
}));

export const taxonomyService = {
    /**
     * Resolve o nome localizado de uma categoria
     */
    getCategoryLocalizedName(category: ExerciseCategory, locale: string = 'pt'): string {
        if (category.translations && category.translations[locale]) {
            return category.translations[locale];
        }
        if (category.translations && category.translations['pt']) {
            return category.translations['pt'];
        }
        if (category.translations && category.translations['en']) {
            return category.translations['en'];
        }
        return category.name || category.slug;
    },

    /**
     * Resolve o nome localizado de um equipamento
     */
    getEquipmentLocalizedName(equipment: ExerciseEquipment, locale: string = 'pt'): string {
        if (equipment.translations && equipment.translations[locale]) {
            return equipment.translations[locale];
        }
        if (equipment.translations && equipment.translations['pt']) {
            return equipment.translations['pt'];
        }
        if (equipment.translations && equipment.translations['en']) {
            return equipment.translations['en'];
        }
        return equipment.name || equipment.slug;
    },

    /**
     * Busca todas as categorias ativas (com cache no Dexie e fallback seguro)
     */
    async getCategories(locale: string = 'pt', customSupabase?: any): Promise<ExerciseCategory[]> {
        const supabase = customSupabase || createClient();

        try {
            const { data, error } = await withTimeout(
                supabase
                    .from('categories')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true }),
                4000
            );

            if (error) throw error;

            if (data && data.length > 0) {
                const mapped: ExerciseCategory[] = data.map((item: any) => ({
                    id: item.id,
                    slug: item.slug,
                    name: item.name,
                    imageUrl: item.image_url,
                    color: item.color,
                    displayOrder: item.display_order,
                    isActive: item.is_active,
                    translations: item.translations || {}
                }));

                // Salva no cache local do Dexie
                if (typeof window !== 'undefined') {
                    try {
                        await db.categories.clear();
                        await db.categories.bulkPut(mapped);
                    } catch (dexieErr) {
                        console.warn('[taxonomyService] Error updating local categories cache:', dexieErr);
                    }
                }

                return mapped;
            }
        } catch (err) {
            console.warn('[taxonomyService] Error fetching categories from Supabase, trying local cache:', err);
        }

        // Tenta ler do Dexie
        if (typeof window !== 'undefined') {
            try {
                const local = await db.categories.where('isActive').equals(1).sortBy('displayOrder');
                if (local && local.length > 0) return local;
            } catch (dexieErr) {
                console.warn('[taxonomyService] Error fetching from Dexie:', dexieErr);
            }
        }

        return FALLBACK_CATEGORIES;
    },

    /**
     * Busca todos os equipamentos ativos (com cache no Dexie e fallback seguro)
     */
    async getEquipment(locale: string = 'pt', customSupabase?: any): Promise<ExerciseEquipment[]> {
        const supabase = customSupabase || createClient();

        try {
            const { data, error } = await withTimeout(
                supabase
                    .from('equipments')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true }),
                4000
            );

            if (error) throw error;

            if (data && data.length > 0) {
                const mapped: ExerciseEquipment[] = data.map((item: any) => ({
                    id: item.id,
                    slug: item.slug,
                    name: item.name,
                    imageUrl: item.image_url,
                    displayOrder: item.display_order,
                    isActive: item.is_active,
                    translations: item.translations || {}
                }));

                // Salva no cache local do Dexie
                if (typeof window !== 'undefined') {
                    try {
                        await db.equipment.clear();
                        await db.equipment.bulkPut(mapped);
                    } catch (dexieErr) {
                        console.warn('[taxonomyService] Error updating local equipment cache:', dexieErr);
                    }
                }

                return mapped;
            }
        } catch (err) {
            console.warn('[taxonomyService] Error fetching equipment from Supabase, trying local cache:', err);
        }

        // Tenta ler do Dexie
        if (typeof window !== 'undefined') {
            try {
                const local = await db.equipment.where('isActive').equals(1).sortBy('displayOrder');
                if (local && local.length > 0) return local;
            } catch (dexieErr) {
                console.warn('[taxonomyService] Error fetching from Dexie:', dexieErr);
            }
        }

        return FALLBACK_EQUIPMENT;
    },

    /**
     * Admin: Busca todas as categorias (inclusive inativas)
     */
    async getAllCategoriesAdmin(customSupabase?: any): Promise<ExerciseCategory[]> {
        const supabase = customSupabase || createClient();
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        return (data || []).map((item: any) => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            imageUrl: item.image_url,
            color: item.color,
            displayOrder: item.display_order,
            isActive: item.is_active,
            translations: item.translations || {}
        }));
    },

    /**
     * Admin: Busca todos os equipamentos (inclusive inativos)
     */
    async getAllEquipmentAdmin(customSupabase?: any): Promise<ExerciseEquipment[]> {
        const supabase = customSupabase || createClient();
        const { data, error } = await supabase
            .from('equipments')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        return (data || []).map((item: any) => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            imageUrl: item.image_url,
            displayOrder: item.display_order,
            isActive: item.is_active,
            translations: item.translations || {}
        }));
    },

    /**
     * Admin: Criar Categoria
     */
    async createCategoryAdmin(category: Partial<ExerciseCategory>, customSupabase?: any): Promise<ExerciseCategory> {
        const supabase = customSupabase || createClient();
        const payload = {
            slug: category.slug,
            name: category.name,
            image_url: category.imageUrl || null,
            color: category.color || '#a3e635',
            display_order: category.displayOrder || 0,
            is_active: category.isActive ?? true,
            translations: category.translations || {}
        };

        const { data, error } = await supabase
            .from('categories')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return {
            id: data.id,
            slug: data.slug,
            name: data.name,
            imageUrl: data.image_url,
            color: data.color,
            displayOrder: data.display_order,
            isActive: data.is_active,
            translations: data.translations || {}
        };
    },

    /**
     * Admin: Atualizar Categoria
     */
    async updateCategoryAdmin(id: string, category: Partial<ExerciseCategory>, customSupabase?: any): Promise<void> {
        const supabase = customSupabase || createClient();
        const payload: any = {
            updated_at: new Date().toISOString()
        };

        if (category.slug !== undefined) payload.slug = category.slug;
        if (category.name !== undefined) payload.name = category.name;
        if (category.imageUrl !== undefined) payload.image_url = category.imageUrl;
        if (category.color !== undefined) payload.color = category.color;
        if (category.displayOrder !== undefined) payload.display_order = category.displayOrder;
        if (category.isActive !== undefined) payload.is_active = category.isActive;
        if (category.translations !== undefined) payload.translations = category.translations;

        const { error } = await supabase
            .from('categories')
            .update(payload)
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Admin: Deletar Categoria
     */
    async deleteCategoryAdmin(id: string, customSupabase?: any): Promise<void> {
        const supabase = customSupabase || createClient();
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Admin: Criar Equipamento
     */
    async createEquipmentAdmin(equipment: Partial<ExerciseEquipment>, customSupabase?: any): Promise<ExerciseEquipment> {
        const supabase = customSupabase || createClient();
        const payload = {
            slug: equipment.slug,
            name: equipment.name,
            image_url: equipment.imageUrl || null,
            display_order: equipment.displayOrder || 0,
            is_active: equipment.isActive ?? true,
            translations: equipment.translations || {}
        };

        const { data, error } = await supabase
            .from('equipments')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return {
            id: data.id,
            slug: data.slug,
            name: data.name,
            imageUrl: data.image_url,
            displayOrder: data.display_order,
            isActive: data.is_active,
            translations: data.translations || {}
        };
    },

    /**
     * Admin: Atualizar Equipamento
     */
    async updateEquipmentAdmin(id: string, equipment: Partial<ExerciseEquipment>, customSupabase?: any): Promise<void> {
        const supabase = customSupabase || createClient();
        const payload: any = {
            updated_at: new Date().toISOString()
        };

        if (equipment.slug !== undefined) payload.slug = equipment.slug;
        if (equipment.name !== undefined) payload.name = equipment.name;
        if (equipment.imageUrl !== undefined) payload.image_url = equipment.imageUrl;
        if (equipment.displayOrder !== undefined) payload.display_order = equipment.displayOrder;
        if (equipment.isActive !== undefined) payload.is_active = equipment.isActive;
        if (equipment.translations !== undefined) payload.translations = equipment.translations;

        const { error } = await supabase
            .from('equipments')
            .update(payload)
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Admin: Deletar Equipamento
     */
    async deleteEquipmentAdmin(id: string, customSupabase?: any): Promise<void> {
        const supabase = customSupabase || createClient();
        const { error } = await supabase
            .from('equipments')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
