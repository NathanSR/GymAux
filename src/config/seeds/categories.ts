import { ExerciseCategory } from '../types';

export const DEFAULT_CATEGORIES: ExerciseCategory[] = [
    {
        slug: 'chest',
        name: 'Peitoral',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/chest.webp',
        color: '#a3e635',
        displayOrder: 1,
        isActive: true,
        translations: {
            pt: 'Peitoral',
            en: 'Chest',
            es: 'Pecho'
        }
    },
    {
        slug: 'back',
        name: 'Costas',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/back.webp',
        color: '#38bdf8',
        displayOrder: 2,
        isActive: true,
        translations: {
            pt: 'Costas',
            en: 'Back',
            es: 'Espalda'
        }
    },
    {
        slug: 'shoulders',
        name: 'Ombros',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/shoulders.webp',
        color: '#fb923c',
        displayOrder: 3,
        isActive: true,
        translations: {
            pt: 'Ombros',
            en: 'Shoulders',
            es: 'Hombros'
        }
    },
    {
        slug: 'biceps',
        name: 'Bíceps',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/biceps.webp',
        color: '#f43f5e',
        displayOrder: 4,
        isActive: true,
        translations: {
            pt: 'Bíceps',
            en: 'Biceps',
            es: 'Bíceps'
        }
    },
    {
        slug: 'triceps',
        name: 'Tríceps',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/triceps.webp',
        color: '#c084fc',
        displayOrder: 5,
        isActive: true,
        translations: {
            pt: 'Tríceps',
            en: 'Triceps',
            es: 'Tríceps'
        }
    },
    {
        slug: 'forearms',
        name: 'Antebraço',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/forearms.webp',
        color: '#a855f7',
        displayOrder: 6,
        isActive: true,
        translations: {
            pt: 'Antebraço',
            en: 'Forearms',
            es: 'Antebrazos'
        }
    },
    {
        slug: 'quadriceps',
        name: 'Quadríceps',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/quadriceps.webp',
        color: '#34d399',
        displayOrder: 7,
        isActive: true,
        translations: {
            pt: 'Quadríceps',
            en: 'Quadriceps',
            es: 'Cuádriceps'
        }
    },
    {
        slug: 'hamstrings',
        name: 'Posterior de Coxa',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/hamstrings.webp',
        color: '#2dd4bf',
        displayOrder: 8,
        isActive: true,
        translations: {
            pt: 'Posterior de Coxa',
            en: 'Hamstrings',
            es: 'Isquiotibiales'
        }
    },
    {
        slug: 'glutes',
        name: 'Glúteos',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/glutes.webp',
        color: '#ec4899',
        displayOrder: 9,
        isActive: true,
        translations: {
            pt: 'Glúteos',
            en: 'Glutes',
            es: 'Glúteos'
        }
    },
    {
        slug: 'calves',
        name: 'Panturrilhas',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/calves.webp',
        color: '#facc15',
        displayOrder: 10,
        isActive: true,
        translations: {
            pt: 'Panturrilhas',
            en: 'Calves',
            es: 'Pantorrillas'
        }
    },
    {
        slug: 'adductors',
        name: 'Adutores',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/adductors.webp',
        color: '#818cf8',
        displayOrder: 11,
        isActive: true,
        translations: {
            pt: 'Adutores',
            en: 'Adductors',
            es: 'Aductores'
        }
    },
    {
        slug: 'abductors',
        name: 'Abdutores',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/abductors.webp',
        color: '#60a5fa',
        displayOrder: 12,
        isActive: true,
        translations: {
            pt: 'Abdutores',
            en: 'Abductors',
            es: 'Abductores'
        }
    },
    {
        slug: 'core',
        name: 'Core e Abdômen',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/core.webp',
        color: '#f97316',
        displayOrder: 13,
        isActive: true,
        translations: {
            pt: 'Core e Abdômen',
            en: 'Core & Abs',
            es: 'Core y Abdominales'
        }
    },
    {
        slug: 'cardio',
        name: 'Cardio',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/cardio.webp',
        color: '#ef4444',
        displayOrder: 14,
        isActive: true,
        translations: {
            pt: 'Cardio',
            en: 'Cardio',
            es: 'Cardio'
        }
    },
    {
        slug: 'full_body',
        name: 'Corpo Inteiro',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/full_body.webp',
        color: '#06b6d4',
        displayOrder: 15,
        isActive: true,
        translations: {
            pt: 'Corpo Inteiro',
            en: 'Full Body',
            es: 'Cuerpo Completo'
        }
    },
    {
        slug: 'stretching',
        name: 'Alongamento',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/stretching.webp',
        color: '#10b981',
        displayOrder: 16,
        isActive: true,
        translations: {
            pt: 'Alongamento',
            en: 'Stretching',
            es: 'Estiramiento'
        }
    }
];
