import { ExerciseEquipment } from '../types';

export const DEFAULT_EQUIPMENT: ExerciseEquipment[] = [
    {
        slug: 'barbell',
        name: 'Barra',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/barbell.webp',
        displayOrder: 1,
        isActive: true,
        translations: {
            pt: 'Barra',
            en: 'Barbell',
            es: 'Barra'
        }
    },
    {
        slug: 'dumbbell',
        name: 'Halter',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/dumbbell.webp',
        displayOrder: 2,
        isActive: true,
        translations: {
            pt: 'Halter',
            en: 'Dumbbell',
            es: 'Mancuerna'
        }
    },
    {
        slug: 'machine',
        name: 'Máquina',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/machine.webp',
        displayOrder: 3,
        isActive: true,
        translations: {
            pt: 'Máquina',
            en: 'Machine',
            es: 'Máquina'
        }
    },
    {
        slug: 'cable',
        name: 'Polia / Cabo',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/cable.webp',
        displayOrder: 4,
        isActive: true,
        translations: {
            pt: 'Polia / Cabo',
            en: 'Cable',
            es: 'Polea / Cable'
        }
    },
    {
        slug: 'bodyweight',
        name: 'Peso Corporal',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/bodyweight.webp',
        displayOrder: 5,
        isActive: true,
        translations: {
            pt: 'Peso Corporal',
            en: 'Bodyweight',
            es: 'Peso Corporal'
        }
    },
    {
        slug: 'smith',
        name: 'Smith / Guiado',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/smith.webp',
        displayOrder: 6,
        isActive: true,
        translations: {
            pt: 'Smith / Guiado',
            en: 'Smith Machine',
            es: 'Smith / Guiado'
        }
    },
    {
        slug: 'kettlebell',
        name: 'Kettlebell',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/kettlebell.webp',
        displayOrder: 7,
        isActive: true,
        translations: {
            pt: 'Kettlebell',
            en: 'Kettlebell',
            es: 'Pesa Rusa'
        }
    },
    {
        slug: 'band',
        name: 'Elástico',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/band.webp',
        displayOrder: 8,
        isActive: true,
        translations: {
            pt: 'Elástico',
            en: 'Resistance Band',
            es: 'Banda de Resistencia'
        }
    },
    {
        slug: 'plate',
        name: 'Anilha',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/plate.webp',
        displayOrder: 9,
        isActive: true,
        translations: {
            pt: 'Anilha',
            en: 'Weight Plate',
            es: 'Disco'
        }
    },
    {
        slug: 'medicine_ball',
        name: 'Bola',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/medicine_ball.webp',
        displayOrder: 10,
        isActive: true,
        translations: {
            pt: 'Bola',
            en: 'Medicine Ball',
            es: 'Balón Medicinal'
        }
    },
    {
        slug: 'jump_rope',
        name: 'Corda de Pular',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/jump_rope.webp',
        displayOrder: 11,
        isActive: true,
        translations: {
            pt: 'Corda de Pular',
            en: 'Jump Rope',
            es: 'Cuerda de Saltar'
        }
    },
    {
        slug: 'ab_wheel',
        name: 'Roda Abdominal',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/ab_wheel.webp',
        displayOrder: 12,
        isActive: true,
        translations: {
            pt: 'Roda Abdominal',
            en: 'Ab Wheel',
            es: 'Rueda Abdominal'
        }
    },
    {
        slug: 'none',
        name: 'Nenhum',
        imageUrl: 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/none.webp',
        displayOrder: 13,
        isActive: true,
        translations: {
            pt: 'Nenhum',
            en: 'None',
            es: 'Ninguno'
        }
    }
];
