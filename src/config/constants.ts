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
    chest: { imagePath: "/images/categories/chest.png", translationKey: "chest" },
    back: { imagePath: "/images/categories/back.png", translationKey: "back" },
    shoulders: { imagePath: "/images/categories/sholders.png", translationKey: "shoulders" },
    biceps: { imagePath: "/images/categories/biceps.png", translationKey: "biceps" },
    triceps: { imagePath: "/images/categories/triceps.png", translationKey: "triceps" },
    forearms: { imagePath: "/images/categories/forearms.png", translationKey: "forearms" },
    quadriceps: { imagePath: "/images/categories/quadriceps.png", translationKey: "quadriceps" },
    hamstrings: { imagePath: "/images/categories/hamstrings.png", translationKey: "hamstrings" },
    glutes: { imagePath: "/images/categories/glutes.png", translationKey: "glutes" },
    calves: { imagePath: "/images/categories/calves.png", translationKey: "calves" },
    adductors: { imagePath: "/images/categories/adductors.png", translationKey: "adductors" },
    abductors: { imagePath: "/images/categories/abductors.png", translationKey: "abductors" },
    core: { imagePath: "/images/categories/core.png", translationKey: "core" },
    cardio: { imagePath: "/images/categories/cardio.png", translationKey: "cardio" },
    full_body: { imagePath: "/images/categories/full_body.png", translationKey: "full_body" },
    stretching: { imagePath: "/images/categories/stretching.png", translationKey: "stretching" },
};

export const EQUIPMENT_METADATA: Record<EquipmentType, { imagePath: string; translationKey: string }> = {
    barbell: { imagePath: "/images/equipaments/barbell.png", translationKey: "barbell" },
    dumbbell: { imagePath: "/images/equipaments/dumbbell.png", translationKey: "dumbbell" },
    machine: { imagePath: "/images/equipaments/machine.png", translationKey: "machine" },
    cable: { imagePath: "/images/equipaments/cable.png", translationKey: "cable" },
    bodyweight: { imagePath: "/images/equipaments/bodyweight.png", translationKey: "bodyweight" },
    smith: { imagePath: "/images/equipaments/smith.png", translationKey: "smith" },
    kettlebell: { imagePath: "/images/equipaments/kettlebell.png", translationKey: "kettlebell" },
    band: { imagePath: "/images/equipaments/band.png", translationKey: "band" },
    plate: { imagePath: "/images/equipaments/plate.png", translationKey: "plate" },
    medicine_ball: { imagePath: "/images/equipaments/medicine_ball.png", translationKey: "medicine_ball" },
    jump_rope: { imagePath: "/images/equipaments/jump_rope.png", translationKey: "jump_rope" },
    ab_wheel: { imagePath: "/images/equipaments/ab_wheel.png", translationKey: "ab_wheel" },
    none: { imagePath: "/images/equipaments/none.png", translationKey: "none" },
};

export const LANGUAGES = ["en", "pt", "es"] as const;