// import { Exercise } from "./types"; // Ajuste o import para onde está sua interface

export const CHEST_EXERCISES: any[] = [
    // --- CALISTENIA / PESO DO CORPO ---
    {
        id: 1,
        name: "standard_push_up",
        description: "standard_push_up_desc",
        category: "chest",
        tags: ["bodyweight", "compound", "home", "basics"],
        howTo: "standard_push_up_howto",
        mediaUrl: "/exercises/peitoral/flexão_pushup.png",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 2,
        name: "decline_push_up",
        description: "decline_push_up_desc",
        category: "chest",
        tags: ["bodyweight", "upper_chest", "home"],
        howTo: "decline_push_up_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner",
        parentId: 1
    },
    {
        id: 3,
        name: "incline_push_up",
        description: "incline_push_up_desc",
        category: "chest",
        tags: ["bodyweight", "lower_chest", "home"],
        howTo: "incline_push_up_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner",
        parentId: 1
    },
    {
        id: 4,
        name: "diamond_push_up",
        description: "diamond_push_up_desc",
        category: "chest",
        tags: ["bodyweight", "triceps", "inner_chest"],
        howTo: "diamond_push_up_howto",
        mediaUrl: "/exercises/peitoral/flexao_diamante.png",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 1
    },
    {
        id: 5,
        name: "wide_push_up",
        description: "wide_push_up_desc",
        category: "chest",
        tags: ["bodyweight", "outer_chest", "home"],
        howTo: "wide_push_up_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner",
        parentId: 1
    },
    {
        id: 6,
        name: "archer_push_up",
        description: "archer_push_up_desc",
        category: "chest",
        tags: ["bodyweight", "unilateral", "advanced"],
        howTo: "archer_push_up_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "advanced",
        parentId: 1
    },
    {
        id: 7,
        name: "explosive_push_up",
        description: "explosive_push_up_desc",
        category: "chest",
        tags: ["bodyweight", "power", "plyometric"],
        howTo: "explosive_push_up_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 1
    },
    {
        id: 8,
        name: "chest_dips",
        description: "chest_dips_desc",
        category: "chest",
        tags: ["bodyweight", "compound", "lower_chest", "advanced"],
        howTo: "chest_dips_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 9,
        name: "spiderman_push_up",
        description: "spiderman_push_up_desc",
        category: "chest",
        tags: ["bodyweight", "core", "mobility"],
        howTo: "spiderman_push_up_howto",
        mediaUrl: "/exercises/core/prancha_spiderman.png",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 1
    },

    // --- SUPINOS COM BARRA ---
    {
        id: 10,
        name: "barbell_bench_press",
        description: "barbell_bench_press_desc",
        category: "chest",
        tags: ["barbell", "compound", "power", "mass"],
        howTo: "barbell_bench_press_howto",
        mediaUrl: "/exercises/peitoral/supino_reto_barra.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 11,
        name: "incline_barbell_press",
        description: "incline_barbell_press_desc",
        category: "chest",
        tags: ["barbell", "upper_chest", "compound"],
        howTo: "incline_barbell_press_howto",
        mediaUrl: "/exercises/peitoral/supino_inclinado_barra.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 10
    },
    {
        id: 12,
        name: "decline_barbell_press",
        description: "decline_barbell_press_desc",
        category: "chest",
        tags: ["barbell", "lower_chest", "compound"],
        howTo: "decline_barbell_press_howto",
        mediaUrl: "/exercises/peitoral/suplino_declinado_barra.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 10
    },
    {
        id: 13,
        name: "close_grip_barbell_press",
        description: "close_grip_barbell_press_desc",
        category: "chest",
        tags: ["barbell", "triceps", "inner_chest"],
        howTo: "close_grip_barbell_press_howto",
        mediaUrl: "/exercises/triceps/supino_fechado_barra.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 10
    },
    {
        id: 14,
        name: "barbell_floor_press",
        description: "barbell_floor_press_desc",
        category: "chest",
        tags: ["barbell", "power", "limited_range"],
        howTo: "barbell_floor_press_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 10
    },

    // --- SUPINOS COM HALTERES ---
    {
        id: 15,
        name: "dumbbell_bench_press",
        description: "dumbbell_bench_press_desc",
        category: "chest",
        tags: ["dumbbells", "compound", "unilateral_balance"],
        howTo: "dumbbell_bench_press_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 16,
        name: "incline_dumbbell_press",
        description: "incline_dumbbell_press_desc",
        category: "chest",
        tags: ["dumbbells", "upper_chest", "compound"],
        howTo: "incline_dumbbell_press_howto",
        mediaUrl: "/exercises/peitoral/supino_inclinado_halteres.png",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 15
    },
    {
        id: 17,
        name: "decline_dumbbell_press",
        description: "decline_dumbbell_press_desc",
        category: "chest",
        tags: ["dumbbells", "lower_chest", "compound"],
        howTo: "decline_dumbbell_press_howto",
        mediaUrl: "/exercises/peitoral/supino_declinado_halteres.png",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 15
    },
    {
        id: 18,
        name: "dumbbell_rotation_press",
        description: "dumbbell_rotation_press_desc",
        category: "chest",
        tags: ["dumbbells", "isolation_focus", "mobility"],
        howTo: "dumbbell_rotation_press_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 15
    },
    {
        id: 19,
        name: "squeeze_press",
        description: "squeeze_press_desc",
        category: "chest",
        tags: ["dumbbells", "inner_chest", "isolation"],
        howTo: "squeeze_press_howto",
        mediaUrl: "/exercises/peitoral/squeeze_press_halteres.png",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 15
    },

    // --- ISOLADORES (CRUCIFIXOS / VOADOR) ---
    {
        id: 20,
        name: "flat_dumbbell_fly",
        description: "flat_dumbbell_fly_desc",
        category: "chest",
        tags: ["dumbbells", "isolation", "stretch"],
        howTo: "flat_dumbbell_fly_howto",
        mediaUrl: "/exercises/peitoral/crucifixo_halteres.png",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 21,
        name: "incline_dumbbell_fly",
        description: "incline_dumbbell_fly_desc",
        category: "chest",
        tags: ["dumbbells", "upper_chest", "isolation"],
        howTo: "incline_dumbbell_fly_howto",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 20
    },
    {
        id: 22,
        name: "cable_crossover_high",
        description: "cable_crossover_high_desc",
        category: "chest",
        tags: ["cables", "lower_chest", "isolation"],
        howTo: "cable_crossover_high_howto",
        mediaUrl: "/exercises/peitoral/crucifixo_crossover_polia.png",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 23,
        name: "cable_crossover_mid",
        description: "cable_crossover_mid_desc",
        category: "chest",
        tags: ["cables", "middle_chest", "isolation"],
        howTo: "cable_crossover_mid_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 22
    },
    {
        id: 24,
        name: "cable_crossover_low",
        description: "cable_crossover_low_desc",
        category: "chest",
        tags: ["cables", "upper_chest", "isolation"],
        howTo: "cable_crossover_low_howto",
        mediaUrl: "/exercises/peitoral/crossover_pullover_polia.png",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 22
    },
    {
        id: 25,
        name: "pec_deck_fly",
        description: "pec_deck_fly_desc",
        category: "chest",
        tags: ["machine", "isolation", "safety"],
        howTo: "pec_deck_fly_howto",
        mediaUrl: "/exercises/peitoral/voador_peckdeck.png",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 26,
        name: "machine_fly",
        description: "machine_fly_desc",
        category: "chest",
        tags: ["machine", "isolation", "constant_tension"],
        howTo: "machine_fly_howto",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },

    // --- MÁQUINAS E OUTROS ---
    {
        id: 27,
        name: "machine_chest_press",
        description: "machine_chest_press_desc",
        category: "chest",
        tags: ["machine", "compound", "safety", "failure"],
        howTo: "machine_chest_press_howto",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 28,
        name: "smith_machine_press",
        description: "smith_machine_press_desc",
        category: "chest",
        tags: ["machine", "smith", "compound", "stability"],
        howTo: "smith_machine_press_howto",
        equipment: "smith",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 29,
        name: "landmine_press",
        description: "landmine_press_desc",
        category: "chest",
        tags: ["barbell", "upper_chest", "shoulder_health"],
        howTo: "landmine_press_howto",
        mediaUrl: "/exercises/costas/prensa_unilateral_barra.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 30,
        name: "dumbbell_pullover",
        description: "dumbbell_pullover_desc",
        category: "chest",
        tags: ["dumbbells", "stretch", "ribcage"],
        howTo: "dumbbell_pullover_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 31,
        name: "svendsen_press",
        description: "svendsen_press_desc",
        category: "chest",
        tags: ["plate", "isometric", "inner_chest"],
        howTo: "svendsen_press_howto",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    }
];

export const BACK_EXERCISES: any[] = [
    // --- PESO DO CORPO / CALISTENIA ---
    {
        id: 50,
        name: "pull_up",
        description: "pull_up_desc",
        category: "back",
        tags: ["bodyweight", "compound", "vertical_pull", "latissimus"],
        howTo: "pull_up_howto",
        mediaUrl: "/exercises/costas/barra_fixa.png",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 51,
        name: "chin_up",
        description: "chin_up_desc",
        category: "back",
        tags: ["bodyweight", "compound", "biceps", "vertical_pull"],
        howTo: "chin_up_howto",
        mediaUrl: "/exercises/costas/puxada_supinada.png",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 50
    },
    {
        id: 52,
        name: "neutral_grip_pull_up",
        description: "neutral_grip_pull_up_desc",
        category: "back",
        tags: ["bodyweight", "compound", "vertical_pull", "safe_shoulders"],
        howTo: "neutral_grip_pull_up_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 50
    },
    {
        id: 53,
        name: "inverted_row",
        description: "inverted_row_desc",
        category: "back",
        tags: ["bodyweight", "horizontal_pull", "basics", "home"],
        howTo: "inverted_row_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner",
        parentId: 50
    },
    {
        id: 54,
        name: "superman_exercise",
        description: "superman_exercise_desc",
        category: "back",
        tags: ["bodyweight", "isolation", "lower_back", "home"],
        howTo: "superman_exercise_howto",
        mediaUrl: "/exercises/cardio_e_multiarticulares/prancha_superman.png",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },

    // --- REMADAS COM BARRA E HALTERES (HORIZONTAIS) ---
    {
        id: 55,
        name: "barbell_bent_over_row",
        description: "barbell_bent_over_row_desc",
        category: "back",
        tags: ["barbell", "compound", "thickness", "mass"],
        howTo: "barbell_bent_over_row_howto",
        mediaUrl: "/exercises/costas/remada_curvada_barra.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 56,
        name: "pendlay_row",
        description: "pendlay_row_desc",
        category: "back",
        tags: ["barbell", "power", "explosive", "compound"],
        howTo: "pendlay_row_howto",
        mediaUrl: "/exercises/costas/remada_meadows.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 57,
        name: "t_bar_row",
        description: "t_bar_row_desc",
        category: "back",
        tags: ["barbell", "compound", "thickness", "classic"],
        howTo: "t_bar_row_howto",
        mediaUrl: "/exercises/costas/remada_cavalinho_barra.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 58,
        name: "one_arm_dumbbell_row",
        description: "one_arm_dumbbell_row_desc",
        category: "back",
        tags: ["dumbbells", "unilateral", "isolation_focus", "mass"],
        howTo: "one_arm_dumbbell_row_howto",
        mediaUrl: "/exercises/costas/remada_unilateral_halter.png",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 59,
        name: "seal_row",
        description: "seal_row_desc",
        category: "back",
        tags: ["barbell", "dumbbells", "strict_form", "no_swing"],
        howTo: "seal_row_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 60,
        name: "renegade_row",
        description: "renegade_row_desc",
        category: "back",
        tags: ["dumbbells", "core", "stability", "compound"],
        howTo: "renegade_row_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- PUXADAS EM POLIA (VERTICAIS) ---
    {
        id: 61,
        name: "lat_pulldown_wide_grip",
        description: "lat_pulldown_wide_grip_desc",
        category: "back",
        tags: ["machine", "cables", "width", "latissimus"],
        howTo: "lat_pulldown_wide_grip_howto",
        mediaUrl: "/exercises/costas/puxada_alta_polia.png",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 62,
        name: "lat_pulldown_close_grip",
        description: "lat_pulldown_close_grip_desc",
        category: "back",
        tags: ["machine", "cables", "inner_back", "vertical_pull"],
        howTo: "lat_pulldown_close_grip_howto",
        mediaUrl: "/exercises/costas/puxada_polia.png",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 63,
        name: "lat_pulldown_behind_neck",
        description: "lat_pulldown_behind_neck_desc",
        category: "back",
        tags: ["machine", "cables", "advanced", "mobility"],
        howTo: "lat_pulldown_behind_neck_howto",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 64,
        name: "straight_arm_pulldown",
        description: "straight_arm_pulldown_desc",
        category: "back",
        tags: ["cables", "isolation", "latissimus", "stretch"],
        howTo: "straight_arm_pulldown_howto",
        mediaUrl: "/exercises/costas/pulldown_polia_alta.png",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 65,
        name: "single_arm_lat_pulldown",
        description: "single_arm_lat_pulldown_desc",
        category: "back",
        tags: ["cables", "unilateral", "symmetry", "vertical_pull"],
        howTo: "single_arm_lat_pulldown_howto",
        mediaUrl: "/exercises/costas/pulldown_unilateral_polia.png",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "intermediate"
    },

    // --- REMADAS EM POLIA E MÁQUINAS ---
    {
        id: 66,
        name: "seated_cable_row",
        description: "seated_cable_row_desc",
        category: "back",
        tags: ["machine", "cables", "thickness", "compound"],
        howTo: "seated_cable_row_howto",
        mediaUrl: "/exercises/costas/remada_baixa_sentada.png",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 67,
        name: "one_arm_cable_row",
        description: "one_arm_cable_row_desc",
        category: "back",
        tags: ["cables", "unilateral", "rotation", "isolation"],
        howTo: "one_arm_cable_row_howto",
        mediaUrl: "/exercises/costas/serrote_polia.png",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 68,
        name: "face_pull",
        description: "face_pull_desc",
        category: "back",
        tags: ["cables", "rear_delts", "posture", "upper_back"],
        howTo: "face_pull_howto",
        mediaUrl: "/exercises/costas/voador_reverso_maquina.png",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 69,
        name: "machine_chest_supported_row",
        description: "machine_chest_supported_row_desc",
        category: "back",
        tags: ["machine", "thickness", "isolation_focus", "safety"],
        howTo: "machine_chest_supported_row_howto",
        mediaUrl: "/exercises/costas/remada_inclinada_maquina.png",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },

    // --- CADEIA POSTERIOR E LOMBAR ---
    {
        id: 70,
        name: "deadlift_conventional",
        description: "deadlift_conventional_desc",
        category: "back",
        tags: ["barbell", "compound", "power", "full_body"],
        howTo: "deadlift_conventional_howto",
        mediaUrl: "/exercises/posterior de coxa/levantamento_terra_barra.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 71,
        name: "rack_pull",
        description: "rack_pull_desc",
        category: "back",
        tags: ["barbell", "power", "traps", "limited_range"],
        howTo: "rack_pull_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 72,
        name: "back_extension",
        description: "back_extension_desc",
        category: "back",
        tags: ["machine", "bodyweight", "lower_back", "isolation"],
        howTo: "back_extension_howto",
        mediaUrl: "/exercises/core/extensao_lombar.png",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 73,
        name: "good_morning",
        description: "good_morning_desc",
        category: "back",
        tags: ["barbell", "lower_back", "hamstrings", "posterior_chain"],
        howTo: "good_morning_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- TRAPÉZIO (VARIANCE) ---
    {
        id: 74,
        name: "barbell_shrug",
        description: "barbell_shrug_desc",
        category: "back",
        tags: ["barbell", "traps", "isolation", "power"],
        howTo: "barbell_shrug_howto",
        mediaUrl: "/exercises/costas/encolhimento_barra.png",
        equipment: "barbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 75,
        name: "dumbbell_shrug",
        description: "dumbbell_shrug_desc",
        category: "back",
        tags: ["dumbbells", "traps", "isolation", "symmetry"],
        howTo: "dumbbell_shrug_howto",
        mediaUrl: "/exercises/costas/encolhimento_halteres.png",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 76,
        name: "cable_shrug",
        description: "cable_shrug_desc",
        category: "back",
        tags: ["cables", "traps", "constant_tension"],
        howTo: "cable_shrug_howto",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    }
];

export const SHOULDERS_EXERCISES: any[] = [
    // --- DESENVOLVIMENTOS (FOCO EM MASSA E FORÇA) ---
    {
        id: 90,
        name: "overhead_barbell_press",
        description: "overhead_barbell_press_desc",
        category: "shoulders",
        tags: ["barbell", "compound", "power", "deltoid_anterior"],
        howTo: "overhead_barbell_press_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 91,
        name: "dumbbell_shoulder_press",
        description: "dumbbell_shoulder_press_desc",
        category: "shoulders",
        tags: ["dumbbells", "compound", "symmetry", "stability"],
        howTo: "dumbbell_shoulder_press_howto",
        mediaUrl: "/exercises/ombros/desenvolvimento_halteres.png",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 92,
        name: "arnold_press",
        description: "arnold_press_desc",
        category: "shoulders",
        tags: ["dumbbells", "compound", "rotation", "full_shoulder"],
        howTo: "arnold_press_howto",
        mediaUrl: "/exercises/ombros/desenvolvimento_arnold_halteres.png",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 93,
        name: "smith_machine_shoulder_press",
        description: "smith_machine_shoulder_press_desc",
        category: "shoulders",
        tags: ["machine", "stability", "safety", "failure"],
        howTo: "smith_machine_shoulder_press_howto",
        equipment: "smith",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 94,
        name: "seated_military_press",
        description: "seated_military_press_desc",
        category: "shoulders",
        tags: ["barbell", "compound", "strict_form", "strength"],
        howTo: "seated_military_press_howto",
        mediaUrl: "/exercises/ombros/desenvolvimento_militar_barra.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- ELEVAÇÕES LATERAIS (FOCO EM LARGURA) ---
    {
        id: 95,
        name: "dumbbell_lateral_raise",
        description: "dumbbell_lateral_raise_desc",
        category: "shoulders",
        tags: ["dumbbells", "isolation", "medial_deltoid", "width"],
        howTo: "dumbbell_lateral_raise_howto",
        mediaUrl: "/exercises/ombros/elevação_lateral_halteres.png",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 96,
        name: "cable_lateral_raise",
        description: "cable_lateral_raise_desc",
        category: "shoulders",
        tags: ["cables", "constant_tension", "isolation", "medial_deltoid"],
        howTo: "cable_lateral_raise_howto",
        mediaUrl: "/exercises/ombros/elevacao_unilateral_polia.png",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 97,
        name: "machine_lateral_raise",
        description: "machine_lateral_raise_desc",
        category: "shoulders",
        tags: ["machine", "isolation", "safety", "easy_to_learn"],
        howTo: "machine_lateral_raise_howto",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 98,
        name: "lean_away_lateral_raise",
        description: "lean_away_lateral_raise_desc",
        category: "shoulders",
        tags: ["cables", "stretch", "advanced", "isolation"],
        howTo: "lean_away_lateral_raise_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "advanced"
    },

    // --- ELEVAÇÕES FRONTAIS (FOCO EM PORÇÃO ANTERIOR) ---
    {
        id: 99,
        name: "dumbbell_front_raise",
        description: "dumbbell_front_raise_desc",
        category: "shoulders",
        tags: ["dumbbells", "isolation", "anterior_deltoid"],
        howTo: "dumbbell_front_raise_howto",
        mediaUrl: "/exercises/ombros/elevacao_frontal_alteres.png",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 100,
        name: "barbell_front_raise",
        description: "barbell_front_raise_desc",
        category: "shoulders",
        tags: ["barbell", "isolation", "power", "anterior_deltoid"],
        howTo: "barbell_front_raise_howto",
        mediaUrl: "/exercises/ombros/elevacao_frontal_barra.png",
        equipment: "barbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 101,
        name: "cable_front_raise",
        description: "cable_front_raise_desc",
        category: "shoulders",
        tags: ["cables", "constant_tension", "isolation"],
        howTo: "cable_front_raise_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 102,
        name: "plate_front_raise",
        description: "plate_front_raise_desc",
        category: "shoulders",
        tags: ["plate", "isolation", "grip_strength"],
        howTo: "plate_front_raise_howto",
        mediaUrl: "/exercises/ombros/elevacao_frontal_anilha.png",
        equipment: "none",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- PORÇÃO POSTERIOR (DELTOIDE POSTERIOR) ---
    {
        id: 103,
        name: "rear_delt_dumbbell_fly",
        description: "rear_delt_dumbbell_fly_desc",
        category: "shoulders",
        tags: ["dumbbells", "isolation", "posterior_deltoid", "posture"],
        howTo: "rear_delt_dumbbell_fly_howto",
        mediaUrl: "/exercises/ombros/crucifixo_invertido_anilha.png",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 104,
        name: "rear_delt_machine_fly",
        description: "rear_delt_machine_fly_desc",
        category: "shoulders",
        tags: ["machine", "isolation", "safety", "posterior_deltoid"],
        howTo: "rear_delt_machine_fly_howto",
        mediaUrl: "/exercises/costas/voador_inverso_maquina.png",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 105,
        name: "cable_rear_delt_fly",
        description: "cable_rear_delt_fly_desc",
        category: "shoulders",
        tags: ["cables", "constant_tension", "isolation", "posterior_deltoid"],
        howTo: "cable_rear_delt_fly_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- REMADAS ALTAS (TRAPÉZIO E OMBROS) ---
    {
        id: 106,
        name: "barbell_upright_row",
        description: "barbell_upright_row_desc",
        category: "shoulders",
        tags: ["barbell", "compound", "traps", "shoulders"],
        howTo: "barbell_upright_row_howto",
        mediaUrl: "/exercises/costas/remada_alta_barra.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 107,
        name: "dumbbell_upright_row",
        description: "dumbbell_upright_row_desc",
        category: "shoulders",
        tags: ["dumbbells", "compound", "joint_health"],
        howTo: "dumbbell_upright_row_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 108,
        name: "cable_upright_row",
        description: "cable_upright_row_desc",
        category: "shoulders",
        tags: ["cables", "constant_tension", "compound"],
        howTo: "cable_upright_row_howto",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- CALISTENIA / PESO DO CORPO ---
    {
        id: 109,
        name: "pike_push_up",
        description: "pike_push_up_desc",
        category: "shoulders",
        tags: ["bodyweight", "home", "strength", "basics"],
        howTo: "pike_push_up_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 110,
        name: "handstand_push_up",
        description: "handstand_push_up_desc",
        category: "shoulders",
        tags: ["bodyweight", "advanced", "power", "balance"],
        howTo: "handstand_push_up_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },

    // --- SAÚDE ARTICULAR (MANGUITO ROTADOR) ---
    {
        id: 111,
        name: "cable_external_rotation",
        description: "cable_external_rotation_desc",
        category: "shoulders",
        tags: ["cables", "rehab", "shoulder_health", "rotator_cuff"],
        howTo: "cable_external_rotation_howto",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 112,
        name: "dumbbell_external_rotation",
        description: "dumbbell_external_rotation_desc",
        category: "shoulders",
        tags: ["dumbbells", "rehab", "prehab", "rotator_cuff"],
        howTo: "dumbbell_external_rotation_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    }
];

export const BICEPS_EXERCISES: any[] = [
    {
        id: 130,
        name: "barbell_curl_straight_bar",
        description: "barbell_curl_straight_bar_desc",
        category: "biceps",
        tags: ["barbell", "mass", "isolation", "heavy"],
        howTo: "barbell_curl_straight_bar_howto",
        mediaUrl: "/exercises/biceps/rosca_direta_barra.png",
        equipment: "barbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 131,
        name: "ez_bar_curl",
        description: "ez_bar_curl_desc",
        category: "biceps",
        tags: ["ez_bar", "joint_friendly", "isolation"],
        howTo: "ez_bar_curl_howto",
        equipment: "none",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 130
    },
    {
        id: 132,
        name: "barbell_preacher_curl",
        description: "barbell_preacher_curl_desc",
        category: "biceps",
        tags: ["barbell", "preacher_bench", "strict_form", "peak_contraction"],
        howTo: "barbell_preacher_curl_howto",
        mediaUrl: "/exercises/biceps/rosca_scott_barra.png",
        equipment: "barbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 130
    },
    {
        id: 133,
        name: "drag_curl",
        description: "drag_curl_desc",
        category: "biceps",
        tags: ["barbell", "long_head", "external_focus"],
        howTo: "drag_curl_howto",
        equipment: "barbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 130
    },
    {
        id: 134,
        name: "spider_curl_barbell",
        description: "spider_curl_barbell_desc",
        category: "biceps",
        tags: ["barbell", "incline_bench", "no_momentum", "peak"],
        howTo: "spider_curl_barbell_howto",
        mediaUrl: "/exercises/biceps/rosca_aranha_barra.png",
        equipment: "barbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 130
    },
    {
        id: 135,
        name: "dumbbell_alternate_curl",
        description: "dumbbell_alternate_curl_desc",
        category: "biceps",
        tags: ["dumbbells", "symmetry", "supination"],
        howTo: "dumbbell_alternate_curl_howto",
        mediaUrl: "/exercises/biceps/rosca_alternada_halteres.png",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "alternating",
        level: "intermediate"
    },
    {
        id: 136,
        name: "dumbbell_hammer_curl",
        description: "dumbbell_hammer_curl_desc",
        category: "biceps",
        tags: ["dumbbells", "brachialis", "thickness", "neutral_grip"],
        howTo: "dumbbell_hammer_curl_howto",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 135
    },
    {
        id: 137,
        name: "incline_dumbbell_curl",
        description: "incline_dumbbell_curl_desc",
        category: "biceps",
        tags: ["dumbbells", "maximum_stretch", "long_head"],
        howTo: "incline_dumbbell_curl_howto",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate",
        parentId: 135
    },
    {
        id: 138,
        name: "concentration_curl",
        description: "concentration_curl_desc",
        category: "biceps",
        tags: ["dumbbells", "peak_contraction", "unilateral"],
        howTo: "concentration_curl_howto",
        mediaUrl: "/exercises/biceps/rosca_concentrada_halteres.png",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "unilateral",
        level: "intermediate",
        parentId: 135
    },
    {
        id: 139,
        name: "dumbbell_preacher_curl",
        description: "dumbbell_preacher_curl_desc",
        category: "biceps",
        tags: ["dumbbells", "preacher_bench", "unilateral", "strict_form"],
        howTo: "dumbbell_preacher_curl_howto",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "unilateral",
        level: "intermediate",
        parentId: 135
    },
    {
        id: 140,
        name: "zotterman_curl",
        description: "zotterman_curl_desc",
        category: "biceps",
        tags: ["dumbbells", "advanced", "biceps_forearm"],
        howTo: "zotterman_curl_howto",
        mediaUrl: "/exercises/antebracos/rosca_zottman.png",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 141,
        name: "cross_body_hammer_curl",
        description: "cross_body_hammer_curl_desc",
        category: "biceps",
        tags: ["dumbbells", "brachialis", "inner_focus"],
        howTo: "cross_body_hammer_curl_howto",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 142,
        name: "cable_biceps_curl_straight_bar",
        description: "cable_biceps_curl_straight_bar_desc",
        category: "biceps",
        tags: ["cables", "constant_tension", "pump"],
        howTo: "cable_biceps_curl_straight_bar_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 143,
        name: "cable_rope_hammer_curl",
        description: "cable_rope_hammer_curl_desc",
        category: "biceps",
        tags: ["cables", "rope", "brachialis", "stability"],
        howTo: "cable_rope_hammer_curl_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 144,
        name: "high_cable_biceps_curl",
        description: "high_cable_biceps_curl_desc",
        category: "biceps",
        tags: ["cables", "double_biceps", "maximum_peak"],
        howTo: "high_cable_biceps_curl_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 145,
        name: "bayesian_curl",
        description: "bayesian_curl_desc",
        category: "biceps",
        tags: ["cables", "stretch", "advanced"],
        howTo: "bayesian_curl_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 146,
        name: "cable_single_arm_curl",
        description: "cable_single_arm_curl_desc",
        category: "biceps",
        tags: ["cables", "unilateral", "symmetry"],
        howTo: "cable_single_arm_curl_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 147,
        name: "machine_biceps_curl",
        description: "machine_biceps_curl_desc",
        category: "biceps",
        tags: ["machine", "beginner", "safety"],
        howTo: "machine_biceps_curl_howto",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 148,
        name: "chin_up_biceps_focus",
        description: "chin_up_biceps_focus_desc",
        category: "biceps",
        tags: ["bodyweight", "compound", "strength"],
        howTo: "chin_up_biceps_focus_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    }
];

export const TRICEPS_EXERCISES: any[] = [
    {
        id: 160,
        name: "cable_triceps_pushdown_straight_bar",
        description: "cable_triceps_pushdown_straight_bar_desc",
        category: "triceps",
        tags: ["cables", "isolation", "straight_bar"],
        howTo: "cable_triceps_pushdown_straight_bar_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 161,
        name: "cable_triceps_pushdown_v_bar",
        description: "cable_triceps_pushdown_v_bar_desc",
        category: "triceps",
        tags: ["cables", "isolation", "v_bar"],
        howTo: "cable_triceps_pushdown_v_bar_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 162,
        name: "cable_rope_pushdown",
        description: "cable_rope_pushdown_desc",
        category: "triceps",
        tags: ["cables", "rope", "peak_contraction"],
        howTo: "cable_rope_pushdown_howto",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 163,
        name: "overhead_cable_extension_rope",
        description: "overhead_cable_extension_rope_desc",
        category: "triceps",
        tags: ["cables", "long_head", "stretch"],
        howTo: "overhead_cable_extension_rope_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 164,
        name: "single_arm_cable_pushdown",
        description: "single_arm_cable_pushdown_desc",
        category: "triceps",
        tags: ["cables", "unilateral", "symmetry"],
        howTo: "single_arm_cable_pushdown_howto",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 165,
        name: "cable_skull_crusher",
        description: "cable_skull_crusher_desc",
        category: "triceps",
        tags: ["cables", "skull_crusher", "constant_tension"],
        howTo: "cable_skull_crusher_howto",
        mediaUrl: "/exercises/triceps/mergulho_graviton.png",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 166,
        name: "barbell_skull_crusher",
        description: "barbell_skull_crusher_desc",
        category: "triceps",
        tags: ["barbell", "mass", "skull_crusher"],
        howTo: "barbell_skull_crusher_howto",
        mediaUrl: "/exercises/triceps/mergulho_banco.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 167,
        name: "ez_bar_skull_crusher",
        description: "ez_bar_skull_crusher_desc",
        category: "triceps",
        tags: ["ez_bar", "joint_friendly", "skull_crusher"],
        howTo: "ez_bar_skull_crusher_howto",
        mediaUrl: "/exercises/triceps/triceps_testa_barra.png",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 168,
        name: "dumbbell_skull_crusher",
        description: "dumbbell_skull_crusher_desc",
        category: "triceps",
        tags: ["dumbbells", "symmetry", "skull_crusher"],
        howTo: "dumbbell_skull_crusher_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 169,
        name: "close_grip_barbell_bench_press",
        description: "close_grip_barbell_bench_press_desc",
        category: "triceps",
        tags: ["barbell", "compound", "heavy_load"],
        howTo: "close_grip_barbell_bench_press_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 170,
        name: "overhead_dumbbell_extension_seated",
        description: "overhead_dumbbell_extension_seated_desc",
        category: "triceps",
        tags: ["dumbbells", "long_head", "mass"],
        howTo: "overhead_dumbbell_extension_seated_howto",
        mediaUrl: "/exercises/triceps/triceps_frances_halteres.png",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 171,
        name: "overhead_dumbbell_extension_single_arm",
        description: "overhead_dumbbell_extension_single_arm_desc",
        category: "triceps",
        tags: ["dumbbells", "unilateral", "stretch"],
        howTo: "overhead_dumbbell_extension_single_arm_howto",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 172,
        name: "dumbbell_kickback",
        description: "dumbbell_kickback_desc",
        category: "triceps",
        tags: ["dumbbells", "kickback", "isolation"],
        howTo: "dumbbell_kickback_howto",
        mediaUrl: "/exercises/triceps/triceps_coice_polia.png",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 173,
        name: "tate_press",
        description: "tate_press_desc",
        category: "triceps",
        tags: ["dumbbells", "advanced", "lateral_head"],
        howTo: "tate_press_howto",
        mediaUrl: "/exercises/triceps/triceps_testa_polia.png",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 174,
        name: "triceps_dips_parallel_bars",
        description: "triceps_dips_parallel_bars_desc",
        category: "triceps",
        tags: ["bodyweight", "compound", "power"],
        howTo: "triceps_dips_parallel_bars_howto",
        mediaUrl: "/exercises/triceps/triceps_pulley_corda.png",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 175,
        name: "bench_dips",
        description: "bench_dips_desc",
        category: "triceps",
        tags: ["bodyweight", "bench", "beginner"],
        howTo: "bench_dips_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 176,
        name: "diamond_push_ups",
        description: "diamond_push_ups_desc",
        category: "triceps",
        tags: ["bodyweight", "push_up", "home"],
        howTo: "diamond_push_ups_howto",
        mediaUrl: "/exercises/triceps/triceps_frances_polia.png",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 177,
        name: "machine_triceps_extension",
        description: "machine_triceps_extension_desc",
        category: "triceps",
        tags: ["machine", "isolation", "safety"],
        howTo: "machine_triceps_extension_howto",
        mediaUrl: "/exercises/triceps/triceps_katana_polia.png",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 178,
        name: "machine_triceps_dip",
        description: "machine_triceps_dip_desc",
        category: "triceps",
        tags: ["machine", "compound", "stability"],
        howTo: "machine_triceps_dip_howto",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    }
];

export const FOREARM_EXERCISES: any[] = [
    // --- BARRAS E HALTERES ---
    {
        id: 190,
        name: "barbell_wrist_curl",
        description: "barbell_wrist_curl_desc",
        category: "forearms",
        tags: ["barbell", "flexors", "isolation", "mass"],
        howTo: "barbell_wrist_curl_howto",
        mediaUrl: "/exercises/antebracos/flexao_punho_supinado_barra.png",
        equipment: "barbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 191,
        name: "barbell_reverse_wrist_curl",
        description: "barbell_reverse_wrist_curl_desc",
        category: "forearms",
        tags: ["barbell", "extensors", "isolation"],
        howTo: "barbell_reverse_wrist_curl_howto",
        equipment: "barbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 192,
        name: "dumbbell_wrist_curl",
        description: "dumbbell_wrist_curl_desc",
        category: "forearms",
        tags: ["dumbbells", "flexors", "unilateral", "symmetry"],
        howTo: "dumbbell_wrist_curl_howto",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 193,
        name: "dumbbell_reverse_wrist_curl",
        description: "dumbbell_reverse_wrist_curl_desc",
        category: "forearms",
        tags: ["dumbbells", "extensors", "unilateral"],
        howTo: "dumbbell_reverse_wrist_curl_howto",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 194,
        name: "standing_behind_back_wrist_curl",
        description: "standing_behind_back_wrist_curl_desc",
        category: "forearms",
        tags: ["barbell", "flexors", "heavy"],
        howTo: "standing_behind_back_wrist_curl_howto",
        mediaUrl: "/exercises/antebracos/rosca_inversa_polia.png",
        equipment: "barbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 195,
        name: "dumbbell_radial_deviation",
        description: "dumbbell_radial_deviation_desc",
        category: "forearms",
        tags: ["dumbbells", "stability", "rehab"],
        howTo: "dumbbell_radial_deviation_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 196,
        name: "dumbbell_ulnar_deviation",
        description: "dumbbell_ulnar_deviation_desc",
        category: "forearms",
        tags: ["dumbbells", "stability", "strength"],
        howTo: "dumbbell_ulnar_deviation_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- CABOS E ACESSÓRIOS ---
    {
        id: 197,
        name: "cable_wrist_curl",
        description: "cable_wrist_curl_desc",
        category: "forearms",
        tags: ["cables", "flexors", "constant_tension"],
        howTo: "cable_wrist_curl_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 198,
        name: "cable_reverse_wrist_curl",
        description: "cable_reverse_wrist_curl_desc",
        category: "forearms",
        tags: ["cables", "extensors", "constant_tension"],
        howTo: "cable_reverse_wrist_curl_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 199,
        name: "wrist_roller",
        description: "wrist_roller_desc",
        category: "forearms",
        tags: ["accessory", "endurance", "pump", "mass"],
        howTo: "wrist_roller_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- PEGADA E SUSTENTAÇÃO (GRIP STRENGTH) ---
    {
        id: 200,
        name: "farmers_walk",
        description: "farmers_walk_desc",
        category: "forearms",
        tags: ["dumbbells", "grip_strength", "compound", "functional"],
        howTo: "farmers_walk_howto",
        mediaUrl: "/exercises/cardio_e_multiarticulares/farmer_walker.png",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 201,
        name: "plate_pinch_hold",
        description: "plate_pinch_hold_desc",
        category: "forearms",
        tags: ["plates", "grip_strength", "fingers"],
        howTo: "plate_pinch_hold_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 202,
        name: "dead_hang",
        description: "dead_hang_desc",
        category: "forearms",
        tags: ["bodyweight", "grip_strength", "endurance"],
        howTo: "dead_hang_howto",
        mediaUrl: "/exercises/cardio_e_multiarticulares/suspensao_barra.png",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 203,
        name: "towel_pull_up_hang",
        description: "towel_pull_up_hang_desc",
        category: "forearms",
        tags: ["bodyweight", "towel", "advanced", "grip"],
        howTo: "towel_pull_up_hang_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },

    // --- ROTAÇÃO ---
    {
        id: 204,
        name: "dumbbell_pronation_supination",
        description: "dumbbell_pronation_supination_desc",
        category: "forearms",
        tags: ["dumbbells", "rotation", "mobility"],
        howTo: "dumbbell_pronation_supination_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    }
];

export const QUADRICEPS_EXERCISES: any[] = [
    // --- AGACHAMENTOS (FORÇA BASE) ---
    {
        id: 220,
        name: "barbell_back_squat",
        description: "barbell_back_squat_desc",
        category: "quadriceps",
        tags: ["barbell", "compound", "mass", "strength"],
        howTo: "barbell_back_squat_howto",
        mediaUrl: "/exercises/quadriceps/agachamento_livre_barra.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 221,
        name: "barbell_front_squat",
        description: "barbell_front_squat_desc",
        category: "quadriceps",
        tags: ["barbell", "compound", "quad_dominant", "core"],
        howTo: "barbell_front_squat_howto",
        mediaUrl: "/exercises/quadriceps/agachamento_livre_halteres.png",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 222,
        name: "dumbbell_goblet_squat",
        description: "dumbbell_goblet_squat_desc",
        category: "quadriceps",
        tags: ["dumbbells", "beginner", "mobility"],
        howTo: "dumbbell_goblet_squat_howto",
        mediaUrl: "/exercises/quadriceps/agachamento_taca_globet.png",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 223,
        name: "smith_machine_squat",
        description: "smith_machine_squat_desc",
        category: "quadriceps",
        tags: ["smith_machine", "stability", "isolation_focus"],
        howTo: "smith_machine_squat_howto",
        equipment: "smith",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },

    // --- PRENSAS E MÁQUINAS ---
    {
        id: 224,
        name: "leg_press_45",
        description: "leg_press_45_desc",
        category: "quadriceps",
        tags: ["machine", "heavy", "mass"],
        howTo: "leg_press_45_howto",
        mediaUrl: "/exercises/quadriceps/agachamento_smith2.png",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 225,
        name: "hack_squat_machine",
        description: "hack_squat_machine_desc",
        category: "quadriceps",
        tags: ["machine", "quad_dominant", "mechanical_advantage"],
        howTo: "hack_squat_machine_howto",
        mediaUrl: "/exercises/quadriceps/agachamento_hack.png",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 226,
        name: "leg_extension",
        description: "leg_extension_desc",
        category: "quadriceps",
        tags: ["machine", "isolation", "definition", "pump"],
        howTo: "leg_extension_howto",
        mediaUrl: "/exercises/quadriceps/legpress_90.png",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 227,
        name: "v_squat_machine",
        description: "v_squat_machine_desc",
        category: "quadriceps",
        tags: ["machine", "compound", "power"],
        howTo: "v_squat_machine_howto",
        mediaUrl: "/exercises/quadriceps/cadeira_extensora.png",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },

    // --- UNILATERAIS E AVANÇOS ---
    {
        id: 228,
        name: "bulgarian_split_squat",
        description: "bulgarian_split_squat_desc",
        category: "quadriceps",
        tags: ["dumbbells", "unilateral", "advanced", "hypertrophy"],
        howTo: "bulgarian_split_squat_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "advanced"
    },
    {
        id: 229,
        name: "barbell_walking_lunge",
        description: "barbell_walking_lunge_desc",
        category: "quadriceps",
        tags: ["barbell", "unilateral", "functional", "balance"],
        howTo: "barbell_walking_lunge_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 230,
        name: "dumbbell_walking_lunge",
        description: "dumbbell_walking_lunge_desc",
        category: "quadriceps",
        tags: ["dumbbells", "unilateral", "stability"],
        howTo: "dumbbell_walking_lunge_howto",
        mediaUrl: "/exercises/quadriceps/afundo_halteres.png",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 231,
        name: "step_up",
        description: "step_up_desc",
        category: "quadriceps",
        tags: ["dumbbells", "unilateral", "strength", "box"],
        howTo: "step_up_howto",
        mediaUrl: "/exercises/posterior de coxa/agachamento_bulgaro.png",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 232,
        name: "sissy_squat",
        description: "sissy_squat_desc",
        category: "quadriceps",
        tags: ["bodyweight", "isolation", "stretch"],
        howTo: "sissy_squat_howto",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- VARIAÇÕES DE FORÇA E POTÊNCIA ---
    {
        id: 233,
        name: "zercher_squat",
        description: "zercher_squat_desc",
        category: "quadriceps",
        tags: ["barbell", "advanced", "core_strength"],
        howTo: "zercher_squat_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 234,
        name: "landmine_squat",
        description: "landmine_squat_desc",
        category: "quadriceps",
        tags: ["landmine", "joint_friendly", "stability"],
        howTo: "landmine_squat_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 235,
        name: "dumbbell_reverse_lunge",
        description: "dumbbell_reverse_lunge_desc",
        category: "quadriceps",
        tags: ["dumbbells", "unilateral", "knee_friendly"],
        howTo: "dumbbell_reverse_lunge_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "intermediate"
    }
];

export const HAMSTRING_EXERCISES: any[] = [
    // --- EXTENSÃO DE QUADRIL (FORÇA E ALONGAMENTO) ---
    {
        id: 250,
        name: "barbell_stiff_leg_deadlift",
        description: "barbell_stiff_leg_deadlift_desc",
        category: "hamstrings",
        tags: ["barbell", "mass", "stretch", "compound"],
        howTo: "barbell_stiff_leg_deadlift_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 251,
        name: "dumbbell_stiff_leg_deadlift",
        description: "dumbbell_stiff_leg_deadlift_desc",
        category: "hamstrings",
        tags: ["dumbbells", "symmetry", "stretch"],
        howTo: "dumbbell_stiff_leg_deadlift_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 252,
        name: "barbell_romanian_deadlift",
        description: "barbell_romanian_deadlift_desc",
        category: "hamstrings",
        tags: ["barbell", "heavy", "posterior_chain"],
        howTo: "barbell_romanian_deadlift_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 253,
        name: "good_morning_barbell",
        description: "good_morning_barbell_desc",
        category: "hamstrings",
        tags: ["barbell", "stretch", "advanced"],
        howTo: "good_morning_barbell_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },

    // --- FLEXÃO DE JOELHO (MÁQUINAS) ---
    {
        id: 254,
        name: "lying_leg_curl_machine",
        description: "lying_leg_curl_machine_desc",
        category: "hamstrings",
        tags: ["machine", "isolation", "pump"],
        howTo: "lying_leg_curl_machine_howto",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 255,
        name: "seated_leg_curl_machine",
        description: "seated_leg_curl_machine_desc",
        category: "hamstrings",
        tags: ["machine", "isolation", "maximum_contraction"],
        howTo: "seated_leg_curl_machine_howto",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 256,
        name: "standing_single_leg_curl_machine",
        description: "standing_single_leg_curl_machine_desc",
        category: "hamstrings",
        tags: ["machine", "unilateral", "isolation"],
        howTo: "standing_single_leg_curl_machine_howto",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "unilateral",
        level: "beginner"
    },

    // --- PESO CORPORAL E CALISTENIA ---
    {
        id: 257,
        name: "nordic_hamstring_curl",
        description: "nordic_hamstring_curl_desc",
        category: "hamstrings",
        tags: ["bodyweight", "advanced", "eccentric_strength"],
        howTo: "nordic_hamstring_curl_howto",
        mediaUrl: "/exercises/posterior de coxa/stiff.png",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 258,
        name: "sliding_leg_curl_towel",
        description: "sliding_leg_curl_towel_desc",
        category: "hamstrings",
        tags: ["bodyweight", "home", "isolation"],
        howTo: "sliding_leg_curl_towel_howto",
        mediaUrl: "/exercises/posterior de coxa/levantamento_terra_sumo.png",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 259,
        name: "stability_ball_leg_curl",
        description: "stability_ball_leg_curl_desc",
        category: "hamstrings",
        tags: ["accessory", "stability", "core"],
        howTo: "stability_ball_leg_curl_howto",
        equipment: "none",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 260,
        name: "glute_ham_raise",
        description: "glute_ham_raise_desc",
        category: "hamstrings",
        tags: ["machine", "bodyweight", "power"],
        howTo: "glute_ham_raise_howto",
        mediaUrl: "/exercises/posterior de coxa/mesa_flexora.png",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- UNILATERAIS E VARIAÇÕES ---
    {
        id: 261,
        name: "single_leg_romanian_deadlift_dumbbell",
        description: "single_leg_romanian_deadlift_dumbbell_desc",
        category: "hamstrings",
        tags: ["dumbbells", "unilateral", "balance"],
        howTo: "single_leg_romanian_deadlift_dumbbell_howto",
        mediaUrl: "/exercises/posterior de coxa/elevacao_quadril_unilateral.png",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 262,
        name: "cable_pull_through",
        description: "cable_pull_through_desc",
        category: "hamstrings",
        tags: ["cables", "glutes_hamstrings", "constant_tension"],
        howTo: "cable_pull_through_howto",
        mediaUrl: "/exercises/posterior de coxa/elevacao_pelvica_maquina.png",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 263,
        name: "dumbbell_leg_curl_lying",
        description: "dumbbell_leg_curl_lying_desc",
        category: "hamstrings",
        tags: ["dumbbells", "home", "isolation"],
        howTo: "dumbbell_leg_curl_lying_howto",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 264,
        name: "kettlebell_swing",
        description: "kettlebell_swing_desc",
        category: "hamstrings",
        tags: ["kettlebell", "explosive", "posterior_chain"],
        howTo: "kettlebell_swing_howto",
        mediaUrl: "/exercises/posterior de coxa/kettlebell_swing.png",
        equipment: "kettlebell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    }
];

export const GLUTE_EXERCISES: any[] = [
    // --- CONSTRUTORES DE MASSA (EXTENSÃO DE QUADRIL) ---
    {
        id: 280,
        name: "barbell_hip_thrust",
        description: "barbell_hip_thrust_desc",
        category: "glutes",
        tags: ["barbell", "heavy", "mass", "power"],
        howTo: "barbell_hip_thrust_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 281,
        name: "dumbbell_hip_thrust",
        description: "dumbbell_hip_thrust_desc",
        category: "glutes",
        tags: ["dumbbells", "hypertrophy", "home"],
        howTo: "dumbbell_hip_thrust_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 282,
        name: "barbell_glute_bridge",
        description: "barbell_glute_bridge_desc",
        category: "glutes",
        tags: ["barbell", "isolation", "shorter_range"],
        howTo: "barbell_glute_bridge_howto",
        equipment: "barbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 283,
        name: "machine_hip_thrust",
        description: "machine_hip_thrust_desc",
        category: "glutes",
        tags: ["machine", "stability", "constant_tension"],
        howTo: "machine_hip_thrust_howto",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },

    // --- ABDUÇÃO E GLÚTEO MÉDIO/MÍNIMO ---
    {
        id: 284,
        name: "seated_hip_abduction_machine",
        description: "seated_hip_abduction_machine_desc",
        category: "glutes",
        tags: ["machine", "isolation", "outer_glute"],
        howTo: "seated_hip_abduction_machine_howto",
        mediaUrl: "/exercises/posterior de coxa/cadeira_abdutora.png",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 285,
        name: "cable_hip_abduction",
        description: "cable_hip_abduction_desc",
        category: "glutes",
        tags: ["cables", "unilateral", "stability"],
        howTo: "cable_hip_abduction_howto",
        mediaUrl: "/exercises/posterior de coxa/abdução_polia.png",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 286,
        name: "banded_clamshells",
        description: "banded_clamshells_desc",
        category: "glutes",
        tags: ["resistance_band", "rehab", "activation", "home"],
        howTo: "banded_clamshells_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 287,
        name: "lateral_band_walk",
        description: "lateral_band_walk_desc",
        category: "glutes",
        tags: ["resistance_band", "activation", "functional"],
        howTo: "lateral_band_walk_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- CHUTES E EXTENSÕES (KICKBACKS) ---
    {
        id: 288,
        name: "cable_glute_kickback",
        description: "cable_glute_kickback_desc",
        category: "glutes",
        tags: ["cables", "unilateral", "shaping"],
        howTo: "cable_glute_kickback_howto",
        mediaUrl: "/exercises/posterior de coxa/gluteo_coice_polia.png",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 289,
        name: "machine_glute_kickback",
        description: "machine_glute_kickback_desc",
        category: "glutes",
        tags: ["machine", "unilateral", "strength"],
        howTo: "machine_glute_kickback_howto",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "unilateral",
        level: "beginner"
    },
    {
        id: 290,
        name: "quadruped_hip_extension_donkey_kicks",
        description: "quadruped_hip_extension_donkey_kicks_desc",
        category: "glutes",
        tags: ["bodyweight", "home", "activation"],
        howTo: "quadruped_hip_extension_donkey_kicks_howto",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 291,
        name: "fire_hydrants",
        description: "fire_hydrants_desc",
        category: "glutes",
        tags: ["bodyweight", "outer_glute", "home"],
        howTo: "fire_hydrants_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },

    // --- VARIAÇÕES COMPOSTAS E FUNCIONAIS ---
    {
        id: 292,
        name: "barbell_sumo_deadlift",
        description: "barbell_sumo_deadlift_desc",
        category: "glutes",
        tags: ["barbell", "heavy", "compound", "power"],
        howTo: "barbell_sumo_deadlift_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 293,
        name: "dumbbell_sumo_squat",
        description: "dumbbell_sumo_squat_desc",
        category: "glutes",
        tags: ["dumbbells", "inner_thigh", "glutes"],
        howTo: "dumbbell_sumo_squat_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 294,
        name: "cable_glute_medially_rotated_kickback",
        description: "cable_glute_medially_rotated_kickback_desc",
        category: "glutes",
        tags: ["cables", "advanced", "upper_glute"],
        howTo: "cable_glute_medially_rotated_kickback_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 295,
        name: "frog_pumps",
        description: "frog_pumps_desc",
        category: "glutes",
        tags: ["bodyweight", "high_rep", "pump"],
        howTo: "frog_pumps_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 296,
        name: "curtsy_lunge",
        description: "curtsy_lunge_desc",
        category: "glutes",
        tags: ["dumbbells", "bodyweight", "unilateral", "functional"],
        howTo: "curtsy_lunge_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 297,
        name: "hyperextension_45_degree_glute_focus",
        description: "hyperextension_45_degree_glute_focus_desc",
        category: "glutes",
        tags: ["machine", "posterior_chain", "stretch"],
        howTo: "hyperextension_45_degree_glute_focus_howto",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    }
];

export const CALF_EXERCISES: any[] = [
    // --- EM PÉ (FOCO NO GASTROCNÊMIO) ---
    {
        id: 310,
        name: "standing_barbell_calf_raise",
        description: "standing_barbell_calf_raise_desc",
        category: "calves",
        tags: ["barbell", "heavy", "mass"],
        howTo: "standing_barbell_calf_raise_howto",
        equipment: "barbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 311,
        name: "standing_machine_calf_raise",
        description: "standing_machine_calf_raise_desc",
        category: "calves",
        tags: ["machine", "isolation", "strength"],
        howTo: "standing_machine_calf_raise_howto",
        mediaUrl: "/exercises/panturrilhas/gemeos_panturrilha_maquina.png",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 312,
        name: "dumbbell_single_leg_calf_raise",
        description: "dumbbell_single_leg_calf_raise_desc",
        category: "calves",
        tags: ["dumbbells", "unilateral", "symmetry"],
        howTo: "dumbbell_single_leg_calf_raise_howto",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 313,
        name: "smith_machine_calf_raise",
        description: "smith_machine_calf_raise_desc",
        category: "calves",
        tags: ["smith_machine", "stability", "mass"],
        howTo: "smith_machine_calf_raise_howto",
        equipment: "smith",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },

    // --- SENTADO (FOCO NO SÓLEO) ---
    {
        id: 314,
        name: "seated_machine_calf_raise",
        description: "seated_machine_calf_raise_desc",
        category: "calves",
        tags: ["machine", "isolation", "soleus"],
        howTo: "seated_machine_calf_raise_howto",
        mediaUrl: "/exercises/panturrilhas/gemeos_sentado_maquina.png",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 315,
        name: "seated_dumbbell_calf_raise",
        description: "seated_dumbbell_calf_raise_desc",
        category: "calves",
        tags: ["dumbbells", "home", "isolation"],
        howTo: "seated_dumbbell_calf_raise_howto",
        equipment: "dumbbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 316,
        name: "seated_barbell_calf_raise",
        description: "seated_barbell_calf_raise_desc",
        category: "calves",
        tags: ["barbell", "strength", "soleus"],
        howTo: "seated_barbell_calf_raise_howto",
        equipment: "barbell",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- PRENSAS E VARIAÇÕES ---
    {
        id: 317,
        name: "leg_press_calf_press",
        description: "leg_press_calf_press_desc",
        category: "calves",
        tags: ["machine", "heavy", "constant_tension"],
        howTo: "leg_press_calf_press_howto",
        mediaUrl: "/exercises/panturrilhas/extensao_panturrilha_maquina.png",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 318,
        name: "donkey_calf_raise",
        description: "donkey_calf_raise_desc",
        category: "calves",
        tags: ["machine", "bodyweight", "old_school", "stretch"],
        howTo: "donkey_calf_raise_howto",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 319,
        name: "hack_squat_calf_press",
        description: "hack_squat_calf_press_desc",
        category: "calves",
        tags: ["machine", "isolation", "strength"],
        howTo: "hack_squat_calf_press_howto",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- PESO CORPORAL E FUNCIONAL ---
    {
        id: 320,
        name: "bodyweight_standing_calf_raise",
        description: "bodyweight_standing_calf_raise_desc",
        category: "calves",
        tags: ["bodyweight", "beginner", "home"],
        howTo: "bodyweight_standing_calf_raise_howto",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 321,
        name: "stair_calf_raise",
        description: "stair_calf_raise_desc",
        category: "calves",
        tags: ["bodyweight", "stretch", "home"],
        howTo: "stair_calf_raise_howto",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 322,
        name: "tibialis_raise",
        description: "tibialis_raise_desc",
        category: "calves",
        tags: ["bodyweight", "prehab", "shin"],
        howTo: "tibialis_raise_howto",
        mediaUrl: "/exercises/panturrilhas/tibial_anterior.png",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 323,
        name: "farmer_walk_on_toes",
        description: "farmer_walk_on_toes_desc",
        category: "calves",
        tags: ["dumbbells", "functional", "endurance"],
        howTo: "farmer_walk_on_toes_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    }
];

export const ADDUCTOR_EXERCISES: any[] = [
    // --- MÁQUINAS E POLIAS ---
    {
        id: 340,
        name: "seated_adduction_machine",
        description: "seated_adduction_machine_desc",
        category: "adductors",
        tags: ["machine", "isolation", "inner_thigh"],
        howTo: "seated_adduction_machine_howto",
        mediaUrl: "/exercises/quadriceps/cadeira_adutora.png",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 341,
        name: "cable_hip_adduction",
        description: "cable_hip_adduction_desc",
        category: "adductors",
        tags: ["cables", "unilateral", "stability"],
        howTo: "cable_hip_adduction_howto",
        mediaUrl: "/exercises/quadriceps/adutor_unilateral_polia.png",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 342,
        name: "standing_adduction_machine",
        description: "standing_adduction_machine_desc",
        category: "adductors",
        tags: ["machine", "unilateral", "standing"],
        howTo: "standing_adduction_machine_howto",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "beginner"
    },

    // --- PESO LIVRE (COMPOSTOS COM FOCO EM ADUTOR) ---
    {
        id: 343,
        name: "barbell_sumo_squat_adductor_focus",
        description: "barbell_sumo_squat_adductor_focus_desc",
        category: "adductors",
        tags: ["barbell", "heavy", "compound"],
        howTo: "barbell_sumo_squat_adductor_focus_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 344,
        name: "barbell_sumo_deadlift_adductor_focus",
        description: "barbell_sumo_deadlift_adductor_focus_desc",
        category: "adductors",
        tags: ["barbell", "heavy", "compound", "posterior_chain", "power"],
        howTo: "barbell_sumo_deadlift_adductor_focus_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 345,
        name: "side_lunge",
        description: "side_lunge_desc",
        category: "adductors",
        tags: ["bodyweight", "dumbbells", "functional", "stretch"],
        howTo: "side_lunge_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- PESO CORPORAL E SOLO (CALISTENIA / PILATES) ---
    {
        id: 346,
        name: "copenhagen_plank",
        description: "copenhagen_plank_desc",
        category: "adductors",
        tags: ["bodyweight", "advanced", "stability"],
        howTo: "copenhagen_plank_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 347,
        name: "lying_leg_adduction_side_lying",
        description: "lying_leg_adduction_side_lying_desc",
        category: "adductors",
        tags: ["bodyweight", "home", "isolation"],
        howTo: "lying_leg_adduction_side_lying_howto",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 348,
        name: "seated_band_adduction",
        description: "seated_band_adduction_desc",
        category: "adductors",
        tags: ["resistance_band", "home", "activation"],
        howTo: "seated_band_adduction_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 349,
        name: "ball_squeeze_bridge",
        description: "ball_squeeze_bridge_desc",
        category: "adductors",
        tags: ["accessory", "stability", "activation"],
        howTo: "ball_squeeze_bridge_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    }
];

export const ABDUCTOR_EXERCISES: any[] = [
    // --- MÁQUINAS E POLIAS ---
    {
        id: 360,
        name: "seated_abduction_machine",
        description: "seated_abduction_machine_desc",
        category: "abductors",
        tags: ["machine", "isolation", "glute_medius"],
        howTo: "seated_abduction_machine_howto",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 361,
        name: "cable_standing_hip_abduction",
        description: "cable_standing_hip_abduction_desc",
        category: "abductors",
        tags: ["cables", "unilateral", "stability"],
        howTo: "cable_standing_hip_abduction_howto",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 362,
        name: "cable_lying_hip_abduction",
        description: "cable_lying_hip_abduction_desc",
        category: "abductors",
        tags: ["cables", "isolation", "constant_tension"],
        howTo: "cable_lying_hip_abduction_howto",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- PESO CORPORAL E SOLO ---
    {
        id: 363,
        name: "side_lying_leg_raise",
        description: "side_lying_leg_raise_desc",
        category: "abductors",
        tags: ["bodyweight", "home", "isolation"],
        howTo: "side_lying_leg_raise_howto",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 364,
        name: "clamshells",
        description: "clamshells_desc",
        category: "abductors",
        tags: ["bodyweight", "rehab", "activation"],
        howTo: "clamshells_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    // {
    //     id: 365,
    //     name: "fire_hydrants",
    //     description: "fire_hydrants_desc",
    //     category: "abductors",
    //     tags: ["bodyweight", "mobility", "home"],
    //     howTo: "fire_hydrants_howto"
    // },

    // --- COM RESISTANCE BANDS (MINI-BANDS) ---
    {
        id: 366,
        name: "banded_lateral_walk",
        description: "banded_lateral_walk_desc",
        category: "abductors",
        tags: ["bands", "activation", "functional"],
        howTo: "banded_lateral_walk_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 367,
        name: "banded_monster_walk",
        description: "banded_monster_walk_desc",
        category: "abductors",
        tags: ["bands", "stability", "glutes"],
        howTo: "banded_monster_walk_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 368,
        name: "banded_seated_abduction",
        description: "banded_seated_abduction_desc",
        category: "abductors",
        tags: ["bands", "isolation", "high_rep"],
        howTo: "banded_seated_abduction_howto",
        equipment: "none",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- VARIAÇÕES FUNCIONAIS E AVANÇADAS ---
    {
        id: 369,
        name: "curtsy_lunge_bodyweight",
        description: "curtsy_lunge_bodyweight_desc",
        category: "abductors",
        tags: ["bodyweight", "dynamic", "balance"],
        howTo: "curtsy_lunge_bodyweight_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 370,
        name: "side_plank_with_leg_lift",
        description: "side_plank_with_leg_lift_desc",
        category: "abductors",
        tags: ["bodyweight", "advanced", "core"],
        howTo: "side_plank_with_leg_lift_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    }
];

export const CORE_EXERCISES: any[] = [
    // --- ESTABILIZAÇÃO ESTÁTICA (ISOMETRIA) ---
    {
        id: 390,
        name: "plank",
        description: "plank_desc",
        category: "core",
        tags: ["bodyweight", "static", "beginner"],
        howTo: "plank_howto",
        mediaUrl: "/exercises/core/prancha_isometrica.png",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 391,
        name: "side_plank",
        description: "side_plank_desc",
        category: "core",
        tags: ["bodyweight", "obliques", "static"],
        howTo: "side_plank_howto",
        mediaUrl: "/exercises/cardio_e_multiarticulares/prancha_lateral_abducao_quadril.png",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 392,
        name: "hollow_body_hold",
        description: "hollow_body_hold_desc",
        category: "core",
        tags: ["bodyweight", "gymnastics", "advanced"],
        howTo: "hollow_body_hold_howto",
        mediaUrl: "/exercises/core/prancha_copenhague.png",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },

    // --- DINÂMICOS FLEXÃO (RETO ABDOMINAL) ---
    {
        id: 393,
        name: "crunch",
        description: "crunch_desc",
        category: "core",
        tags: ["bodyweight", "isolation", "beginner"],
        howTo: "crunch_howto",
        mediaUrl: "/exercises/core/abdominal_supra.png",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 394,
        name: "leg_raise",
        description: "leg_raise_desc",
        category: "core",
        tags: ["bodyweight", "lower_abs", "dynamic"],
        howTo: "leg_raise_howto",
        mediaUrl: "/exercises/core/elevacao_pernas.png",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 395,
        name: "hanging_knee_raise",
        description: "hanging_knee_raise_desc",
        category: "core",
        tags: ["bodyweight", "pull_up_bar", "dynamic"],
        howTo: "hanging_knee_raise_howto",
        mediaUrl: "/exercises/core/abdominal_obliquo.png",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 396,
        name: "v_ups",
        description: "v_ups_desc",
        category: "core",
        tags: ["bodyweight", "explosive", "advanced"],
        howTo: "v_ups_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 397,
        name: "bicycle_crunch",
        description: "bicycle_crunch_desc",
        category: "core",
        tags: ["bodyweight", "obliques", "dynamic"],
        howTo: "bicycle_crunch_howto",
        equipment: "bodyweight",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },

    // --- DINÂMICOS ROTACIONAIS E ANTI-ROTAÇÃO ---
    {
        id: 398,
        name: "russian_twist",
        description: "russian_twist_desc",
        category: "core",
        tags: ["bodyweight", "dumbbells", "rotation"],
        howTo: "russian_twist_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 399,
        name: "pallof_press",
        description: "pallof_press_desc",
        category: "core",
        tags: ["cables", "anti_rotation", "stability"],
        howTo: "pallof_press_howto",
        mediaUrl: "/exercises/core/pallof_press_polia.png",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 400,
        name: "cable_woodchop",
        description: "cable_woodchop_desc",
        category: "core",
        tags: ["cables", "power", "rotation"],
        howTo: "cable_woodchop_howto",
        equipment: "cable",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- ESTABILIZAÇÃO DINÂMICA (ANTI-EXTENSÃO) ---
    {
        id: 401,
        name: "ab_wheel_rollout",
        description: "ab_wheel_rollout_desc",
        category: "core",
        tags: ["accessory", "anti_extension", "advanced"],
        howTo: "ab_wheel_rollout_howto",
        mediaUrl: "/exercises/core/abdominal_roda.png",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 402,
        name: "dead_bug",
        description: "dead_bug_desc",
        category: "core",
        tags: ["bodyweight", "rehab", "coordination"],
        howTo: "dead_bug_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 403,
        name: "bird_dog",
        description: "bird_dog_desc",
        category: "core",
        tags: ["bodyweight", "back_health", "stability"],
        howTo: "bird_dog_howto",
        mediaUrl: "/exercises/core/lenhador_polia.png",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 404,
        name: "mountain_climbers",
        description: "mountain_climbers_desc",
        category: "core",
        tags: ["bodyweight", "cardio", "dynamic"],
        howTo: "mountain_climbers_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- MÁQUINAS E PESOS ---
    {
        id: 405,
        name: "cable_crunch",
        description: "cable_crunch_desc",
        category: "core",
        tags: ["cables", "heavy", "hypertrophy"],
        howTo: "cable_crunch_howto",
        mediaUrl: "/exercises/core/abdominal_polia.png",
        equipment: "cable",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 406,
        name: "machine_torso_rotation",
        description: "machine_torso_rotation_desc",
        category: "core",
        tags: ["machine", "obliques", "isolation"],
        howTo: "machine_torso_rotation_howto",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },

    // --- LOMBAR (EXTENSÃO) ---
    {
        id: 407,
        name: "superman",
        description: "superman_desc",
        category: "core",
        tags: ["bodyweight", "lower_back", "home"],
        howTo: "superman_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 408,
        name: "back_extension_machine",
        description: "back_extension_machine_desc",
        category: "core",
        tags: ["machine", "lower_back", "strength"],
        howTo: "back_extension_machine_howto",
        equipment: "machine",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 409,
        name: "toes_to_bar",
        description: "toes_to_bar_desc",
        category: "core",
        tags: ["bodyweight", "crossfit", "advanced"],
        howTo: "toes_to_bar_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    }
];

export const CARDIO_EXERCISES: any[] = [
    // --- MÁQUINAS DE ACADEMIA ---
    {
        id: 420,
        name: "treadmill_running",
        description: "treadmill_running_desc",
        category: "cardio",
        tags: ["machine", "running", "high_intensity"],
        howTo: "treadmill_running_howto",
        mediaUrl: "/exercises/cardio_e_multiarticulares/corrida_esteira.png",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 421,
        name: "treadmill_walking",
        description: "treadmill_walking_desc",
        category: "cardio",
        tags: ["machine", "walking", "low_impact"],
        howTo: "treadmill_walking_howto",
        mediaUrl: "/exercises/cardio_e_multiarticulares/corrida_bicicleta.png",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 422,
        name: "elliptical_trainer",
        description: "elliptical_trainer_desc",
        category: "cardio",
        tags: ["machine", "low_impact", "full_body"],
        howTo: "elliptical_trainer_howto",
        mediaUrl: "/exercises/cardio_e_multiarticulares/eliptico.png",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 423,
        name: "stationary_bike",
        description: "stationary_bike_desc",
        category: "cardio",
        tags: ["machine", "cycling", "low_impact"],
        howTo: "stationary_bike_howto",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 424,
        name: "stair_climber",
        description: "stair_climber_desc",
        category: "cardio",
        tags: ["machine", "glutes", "high_intensity"],
        howTo: "stair_climber_howto",
        mediaUrl: "/exercises/cardio_e_multiarticulares/subir_escada.png",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 425,
        name: "rowing_machine",
        description: "rowing_machine_desc",
        category: "cardio",
        tags: ["machine", "full_body", "stamina"],
        howTo: "rowing_machine_howto",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 426,
        name: "assault_bike",
        description: "assault_bike_desc",
        category: "cardio",
        tags: ["machine", "hiit", "explosive"],
        howTo: "assault_bike_howto",
        equipment: "machine",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- PESO CORPORAL / HIIT ---
    {
        id: 427,
        name: "jumping_jacks",
        description: "jumping_jacks_desc",
        category: "cardio",
        tags: ["bodyweight", "home", "warm_up"],
        howTo: "jumping_jacks_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 428,
        name: "burpees",
        description: "burpees_desc",
        category: "cardio",
        tags: ["bodyweight", "full_body", "hiit"],
        howTo: "burpees_howto",
        mediaUrl: "/exercises/cardio_e_multiarticulares/burpee.png",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 429,
        name: "jump_rope",
        description: "jump_rope_desc",
        category: "cardio",
        tags: ["accessory", "coordination", "agility"],
        howTo: "jump_rope_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 430,
        name: "high_knees",
        description: "high_knees_desc",
        category: "cardio",
        tags: ["bodyweight", "running", "dynamic"],
        howTo: "high_knees_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 431,
        name: "box_jumps",
        description: "box_jumps_desc",
        category: "cardio",
        tags: ["accessory", "explosive", "plyometrics"],
        howTo: "box_jumps_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- AO AR LIVRE / OUTROS ---
    {
        id: 432,
        name: "outdoor_running",
        description: "outdoor_running_desc",
        category: "cardio",
        tags: ["outdoor", "running", "endurance"],
        howTo: "outdoor_running_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 433,
        name: "swimming",
        description: "swimming_desc",
        category: "cardio",
        tags: ["outdoor", "full_body", "low_impact"],
        howTo: "swimming_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 434,
        name: "cycling_outdoor",
        description: "cycling_outdoor_desc",
        category: "cardio",
        tags: ["outdoor", "cycling", "legs"],
        howTo: "cycling_outdoor_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 435,
        name: "battle_ropes",
        description: "battle_ropes_desc",
        category: "cardio",
        tags: ["accessory", "arms", "hiit"],
        howTo: "battle_ropes_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    }
];

export const STRETCHING_EXERCISES: any[] = [
    // --- PESCOÇO E CERVICAL ---
    {
        id: 450,
        name: "neck_lateral_stretch",
        description: "neck_lateral_stretch_desc",
        category: "stretching",
        tags: ["neck", "static", "beginner"],
        howTo: "neck_lateral_stretch_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "beginner"
    },
    {
        id: 451,
        name: "neck_forward_flexion",
        description: "neck_forward_flexion_desc",
        category: "stretching",
        tags: ["neck", "static", "relief"],
        howTo: "neck_forward_flexion_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- OMBROS E PEITORAL ---
    {
        id: 452,
        name: "cross_body_shoulder_stretch",
        description: "cross_body_shoulder_stretch_desc",
        category: "stretching",
        tags: ["shoulders", "static", "classic"],
        howTo: "cross_body_shoulder_stretch_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 453,
        name: "doorway_chest_stretch",
        description: "doorway_chest_stretch_desc",
        category: "stretching",
        tags: ["chest", "posture", "static"],
        howTo: "doorway_chest_stretch_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 454,
        name: "overhead_triceps_stretch",
        description: "overhead_triceps_stretch_desc",
        category: "stretching",
        tags: ["arms", "triceps", "static"],
        howTo: "overhead_triceps_stretch_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- COSTAS E CORE ---
    {
        id: 455,
        name: "childs_pose",
        description: "childs_pose_desc",
        category: "stretching",
        tags: ["back", "relaxation", "yoga"],
        howTo: "childs_pose_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 456,
        name: "cat_cow_stretch",
        description: "cat_cow_stretch_desc",
        category: "stretching",
        tags: ["spine", "mobility", "dynamic"],
        howTo: "cat_cow_stretch_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 457,
        name: "cobra_stretch",
        description: "cobra_stretch_desc",
        category: "stretching",
        tags: ["abs", "spine", "static"],
        howTo: "cobra_stretch_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 458,
        name: "lying_spinal_twist",
        description: "lying_spinal_twist_desc",
        category: "stretching",
        tags: ["back", "mobility", "static"],
        howTo: "lying_spinal_twist_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- QUADRIL E GLÚTEOS ---
    {
        id: 459,
        name: "pigeon_pose",
        description: "pigeon_pose_desc",
        category: "stretching",
        tags: ["glutes", "hips", "advanced"],
        howTo: "pigeon_pose_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 460,
        name: "kneeling_hip_flexor_stretch",
        description: "kneeling_hip_flexor_stretch_desc",
        category: "stretching",
        tags: ["hips", "psoas", "posture"],
        howTo: "kneeling_hip_flexor_stretch_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 461,
        name: "butterfly_stretch",
        description: "butterfly_stretch_desc",
        category: "stretching",
        tags: ["adductors", "hips", "seated"],
        howTo: "butterfly_stretch_howto",
        equipment: "none",
        mechanics: "isolation",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- MEMBROS INFERIORES ---
    {
        id: 462,
        name: "standing_quadriceps_stretch",
        description: "standing_quadriceps_stretch_desc",
        category: "stretching",
        tags: ["quads", "legs", "static"],
        howTo: "standing_quadriceps_stretch_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 463,
        name: "seated_hamstring_stretch",
        description: "seated_hamstring_stretch_desc",
        category: "stretching",
        tags: ["hamstrings", "legs", "seated"],
        howTo: "seated_hamstring_stretch_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 464,
        name: "standing_calf_stretch",
        description: "standing_calf_stretch_desc",
        category: "stretching",
        tags: ["calves", "legs", "static"],
        howTo: "standing_calf_stretch_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 465,
        name: "worlds_greatest_stretch",
        description: "worlds_greatest_stretch_desc",
        category: "stretching",
        tags: ["full_body", "mobility", "dynamic"],
        howTo: "worlds_greatest_stretch_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- ANTEBRAÇO E MÃOS ---
    {
        id: 466,
        name: "wrist_extensor_stretch",
        description: "wrist_extensor_stretch_desc",
        category: "stretching",
        tags: ["forearms", "wrists", "static"],
        howTo: "wrist_extensor_stretch_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    }
];

export const FULL_BODY_EXERCISES: any[] = [
    // --- LEVANTAMENTOS OLÍMPICOS E DERIVADOS ---
    {
        id: 480,
        name: "barbell_clean_and_press",
        description: "barbell_clean_and_press_desc",
        category: "full_body",
        tags: ["barbell", "power", "explosive"],
        howTo: "barbell_clean_and_press_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 481,
        name: "barbell_snatch",
        description: "barbell_snatch_desc",
        category: "full_body",
        tags: ["barbell", "olympic", "advanced"],
        howTo: "barbell_snatch_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 482,
        name: "barbell_thruster",
        description: "barbell_thruster_desc",
        category: "full_body",
        tags: ["barbell", "hiit", "metabolic"],
        howTo: "barbell_thruster_howto",
        equipment: "barbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },

    // --- DINÂMICOS COM HALTERES E KETTLEBELLS ---
    // {
    //     id: 483,
    //     name: "kettlebell_swing",
    //     description: "kettlebell_swing_desc",
    //     category: "full_body",
    //     tags: ["kettlebell", "posterior_chain", "power"],
    //     howTo: "kettlebell_swing_howto"
    // },
    {
        id: 484,
        name: "dumbbell_man_makers",
        description: "dumbbell_man_makers_desc",
        category: "full_body",
        tags: ["dumbbells", "advanced", "strength"],
        howTo: "dumbbell_man_makers_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },
    {
        id: 485,
        name: "dumbbell_snatch_unilateral",
        description: "dumbbell_snatch_unilateral_desc",
        category: "full_body",
        tags: ["dumbbells", "explosive", "unilateral"],
        howTo: "dumbbell_snatch_unilateral_howto",
        equipment: "dumbbell",
        mechanics: "compound",
        executionMode: "unilateral",
        level: "intermediate"
    },
    {
        id: 486,
        name: "turkish_get_up",
        description: "turkish_get_up_desc",
        category: "full_body",
        tags: ["kettlebell", "stability", "advanced"],
        howTo: "turkish_get_up_howto",
        equipment: "kettlebell",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "advanced"
    },

    // --- MOVIMENTOS DE CARGA E LOCOMOÇÃO ---
    // {
    //     id: 487,
    //     name: "farmers_walk",
    //     description: "farmers_walk_desc",
    //     category: "full_body",
    //     tags: ["heavy", "grip", "functional"],
    //     howTo: "farmers_walk_howto"
    // },
    {
        id: 488,
        name: "bear_crawl",
        description: "bear_crawl_desc",
        category: "full_body",
        tags: ["bodyweight", "mobility", "core"],
        howTo: "bear_crawl_howto",
        equipment: "bodyweight",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 489,
        name: "medicine_ball_slam",
        description: "medicine_ball_slam_desc",
        category: "full_body",
        tags: ["medicine_ball", "explosive", "power"],
        howTo: "medicine_ball_slam_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    },
    {
        id: 490,
        name: "tire_flip",
        description: "tire_flip_desc",
        category: "full_body",
        tags: ["heavy", "strongman", "functional"],
        howTo: "tire_flip_howto",
        equipment: "none",
        mechanics: "compound",
        executionMode: "bilateral",
        level: "intermediate"
    }
];


export const DEFAULT_EXERCISES: any[] = [
    ...CHEST_EXERCISES,
    ...BACK_EXERCISES,
    ...SHOULDERS_EXERCISES,
    ...BICEPS_EXERCISES,
    ...TRICEPS_EXERCISES,
    ...FOREARM_EXERCISES,
    ...QUADRICEPS_EXERCISES,
    ...HAMSTRING_EXERCISES,
    ...GLUTE_EXERCISES,
    ...CALF_EXERCISES,
    ...ADDUCTOR_EXERCISES,
    ...ABDUCTOR_EXERCISES,
    ...CORE_EXERCISES,
    ...CARDIO_EXERCISES,
    ...STRETCHING_EXERCISES,
    ...FULL_BODY_EXERCISES
];