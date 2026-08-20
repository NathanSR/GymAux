export const CATEGORIES = [
    "chest",
    "back",
    "shoulders",
    "biceps",
    "triceps",
    "forearms",
    "quadriceps",
    "hamstrings",
    "glutes",
    "calves",
    "adductors",
    "abductors",
    "core",
    "cardio",
    "full_body",
    "stretching",
] as const;

export const EQUIPMENT = [
    'barbell',
    'dumbbell',
    'machine',
    'cable',
    'bodyweight',
    'smith',
    'kettlebell',
    'band',
    'plate',
    'medicine_ball',
    'jump_rope',
    'ab_wheel',
    'none',
] as const;

export type CategoryType = typeof CATEGORIES[number];
export type EquipmentType = typeof EQUIPMENT[number];

export const CATEGORY_METADATA: Record<CategoryType, { imagePath: string; translationKey: string }> = {
    chest: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/chest.webp", translationKey: "chest" },
    back: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/back.webp", translationKey: "back" },
    shoulders: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/shoulders.webp", translationKey: "shoulders" },
    biceps: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/biceps.webp", translationKey: "biceps" },
    triceps: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/triceps.webp", translationKey: "triceps" },
    forearms: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/forearms.webp", translationKey: "forearms" },
    quadriceps: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/quadriceps.webp", translationKey: "quadriceps" },
    hamstrings: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/hamstrings.webp", translationKey: "hamstrings" },
    glutes: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/glutes.webp", translationKey: "glutes" },
    calves: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/calves.webp", translationKey: "calves" },
    adductors: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/adductors.webp", translationKey: "adductors" },
    abductors: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/abductors.webp", translationKey: "abductors" },
    core: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/core.webp", translationKey: "core" },
    cardio: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/cardio.webp", translationKey: "cardio" },
    full_body: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/full_body.webp", translationKey: "full_body" },
    stretching: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/categories/stretching.webp", translationKey: "stretching" },
};

export const EQUIPMENT_METADATA: Record<EquipmentType, { imagePath: string; translationKey: string }> = {
    barbell: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/barbell.webp", translationKey: "barbell" },
    dumbbell: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/dumbbell.webp", translationKey: "dumbbell" },
    machine: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/machine.webp", translationKey: "machine" },
    cable: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/cable.webp", translationKey: "cable" },
    bodyweight: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/bodyweight.webp", translationKey: "bodyweight" },
    smith: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/smith.webp", translationKey: "smith" },
    kettlebell: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/kettlebell.webp", translationKey: "kettlebell" },
    band: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/band.webp", translationKey: "band" },
    plate: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/plate.webp", translationKey: "plate" },
    medicine_ball: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/medicine_ball.webp", translationKey: "medicine_ball" },
    jump_rope: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/jump_rope.webp", translationKey: "jump_rope" },
    ab_wheel: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/ab_wheel.webp", translationKey: "ab_wheel" },
    none: { imagePath: "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/equipments/none.webp", translationKey: "none" },
};

export const LANGUAGES = ["en", "pt", "es"] as const;

export const LEVELS = [
    'beginner',
    'intermediate',
    'advanced',
] as const;

export type LevelType = typeof LEVELS[number];