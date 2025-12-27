import { Exercise } from "./types"; // Ajuste o import para onde está sua interface

export const CHEST_EXERCISES: Exercise[] = [
    {
        name: "chest_bench_press",
        description: "chest_bench_press_desc",
        category: "chest",
        tags: ["compound", "barbell", "chest", "power"],
        mediaUrl: "/exercises/bench-press.gif"
    },
    {
        name: "chest_incline_dumbbell_press",
        description: "chest_incline_dumbbell_press_desc",
        category: "chest",
        tags: ["compound", "dumbbells", "upper_chest"],
        mediaUrl: "/exercises/incline-db.gif"
    },
    {
        name: "chest_push_up",
        description: "chest_push_up_desc",
        category: "chest",
        tags: ["calisthenics", "bodyweight", "basic"],
        mediaUrl: "/exercises/push-up.gif"
    },
    {
        name: "chest_cable_fly",
        description: "chest_cable_fly_desc",
        category: "chest",
        tags: ["isolation", "cables", "tension"],
        mediaUrl: "/exercises/cable-fly.gif"
    },
    {
        name: "chest_dips",
        description: "chest_dips_desc",
        category: "chest",
        tags: ["compound", "bodyweight", "lower_chest"],
        mediaUrl: "/exercises/dips.gif"
    },
    {
        name: "chest_decline_bench_press",
        description: "chest_decline_bench_press_desc",
        category: "chest",
        tags: ["compound", "barbell", "lower_chest"],
        mediaUrl: "/exercises/decline-press.gif"
    },
    {
        name: "chest_dumbbell_fly",
        description: "chest_dumbbell_fly_desc",
        category: "chest",
        tags: ["isolation", "dumbbells", "stretch"],
        mediaUrl: "/exercises/db-fly.gif"
    },
    {
        name: "chest_machine_chest_press",
        description: "chest_machine_chest_press_desc",
        category: "chest",
        tags: ["compound", "machine", "control"],
        mediaUrl: "/exercises/machine-press.gif"
    },
    {
        name: "chest_pec_deck",
        description: "chest_pec_deck_desc",
        category: "chest",
        tags: ["isolation", "machine", "inner_chest"],
        mediaUrl: "/exercises/pec-deck.gif"
    },
    {
        name: "chest_dumbbell_pullover",
        description: "chest_dumbbell_pullover_desc",
        category: "chest",
        tags: ["isolation", "dumbbells", "expansion"],
        mediaUrl: "/exercises/pullover.gif"
    },
    {
        name: "chest_incline_barbell_press",
        description: "chest_incline_barbell_press_desc",
        category: "chest",
        tags: ["compound", "barbell", "upper_chest"],
        mediaUrl: "/exercises/incline-barbell.gif"
    },
    {
        name: "chest_low_to_high_cable_fly",
        description: "chest_low_to_high_cable_fly_desc",
        category: "chest",
        tags: ["isolation", "cables", "upper_chest"],
        mediaUrl: "/exercises/low-cable-fly.gif"
    }
];

export const BACK_EXERCISES: Exercise[] = [
    {
        name: "back_pull_up",
        description: "back_pull_up_desc",
        category: "back",
        tags: ["compound", "bodyweight", "pull", "vertical"],
        mediaUrl: "/exercises/pull-up.gif"
    },
    {
        name: "back_lat_pulldown",
        description: "back_lat_pulldown_desc",
        category: "back",
        tags: ["isolation", "cables", "pull", "width"],
        mediaUrl: "/exercises/lat-pulldown.gif"
    },
    {
        name: "back_barbell_row",
        description: "back_barbell_row_desc",
        category: "back",
        tags: ["compound", "barbell", "row", "horizontal"],
        mediaUrl: "/exercises/barbell-row.gif"
    },
    {
        name: "back_seated_row",
        description: "back_seated_row_desc",
        category: "back",
        tags: ["compound", "cables", "row", "thickness"],
        mediaUrl: "/exercises/seated-row.gif"
    },
    {
        name: "back_single_arm_db_row",
        description: "back_single_arm_db_row_desc",
        category: "back",
        tags: ["compound", "dumbbells", "row", "unilateral"],
        mediaUrl: "/exercises/db-row.gif"
    },
    {
        name: "back_deadlift",
        description: "back_deadlift_desc",
        category: "back",
        tags: ["compound", "barbell", "power", "thickness"],
        mediaUrl: "/exercises/deadlift.gif"
    }
];

export const LEGS_EXERCISES: Exercise[] = [
    {
        name: "legs_barbell_back_squat",
        description: "legs_barbell_back_squat_desc",
        category: "legs",
        tags: ["compound", "barbell", "quads", "glutes"],
        mediaUrl: "/exercises/barbell-squat.gif"
    },
    {
        name: "legs_front_squat",
        description: "legs_front_squat_desc",
        category: "legs",
        tags: ["compound", "barbell", "quads", "core"],
        mediaUrl: "/exercises/front-squat.gif"
    },
    {
        name: "legs_leg_press_45",
        description: "legs_leg_press_45_desc",
        category: "legs",
        tags: ["compound", "machine", "quads", "volume"],
        mediaUrl: "/exercises/leg-press.gif"
    },
    {
        name: "legs_hack_squat",
        description: "legs_hack_squat_desc",
        category: "legs",
        tags: ["compound", "machine", "quads", "depth"],
        mediaUrl: "/exercises/hack-squat.gif"
    },
    {
        name: "legs_leg_extension",
        description: "legs_leg_extension_desc",
        category: "legs",
        tags: ["isolation", "machine", "quads", "definition"],
        mediaUrl: "/exercises/leg-extension.gif"
    },
    {
        name: "legs_walking_lunge",
        description: "legs_walking_lunge_desc",
        category: "legs",
        tags: ["compound", "dumbbells", "glutes", "unilateral"],
        mediaUrl: "/exercises/walking-lunge.gif"
    },
    {
        name: "legs_bulgarian_split_squat",
        description: "legs_bulgarian_split_squat_desc",
        category: "legs",
        tags: ["compound", "dumbbells", "quads", "unilateral"],
        mediaUrl: "/exercises/bulgarian-split-squat.gif"
    },
    {
        name: "legs_stiff_leg_deadlift",
        description: "legs_stiff_leg_deadlift_desc",
        category: "legs",
        tags: ["compound", "barbell", "hamstrings", "posterior"],
        mediaUrl: "/exercises/stiff-deadlift.gif"
    },
    {
        name: "legs_lying_leg_curl",
        description: "legs_lying_leg_curl_desc",
        category: "legs",
        tags: ["isolation", "machine", "hamstrings"],
        mediaUrl: "/exercises/lying-leg-curl.gif"
    },
    {
        name: "legs_seated_leg_curl",
        description: "legs_seated_leg_curl_desc",
        category: "legs",
        tags: ["isolation", "machine", "hamstrings"],
        mediaUrl: "/exercises/seated-leg-curl.gif"
    },
    {
        name: "legs_hip_thrust",
        description: "legs_hip_thrust_desc",
        category: "legs",
        tags: ["compound", "barbell", "glutes", "power"],
        mediaUrl: "/exercises/hip-thrust.gif"
    },
    {
        name: "legs_sumo_deadlift",
        description: "legs_sumo_deadlift_desc",
        category: "legs",
        tags: ["compound", "barbell", "adductors", "glutes"],
        mediaUrl: "/exercises/sumo-deadlift.gif"
    },
    {
        name: "legs_standing_calf_raise",
        description: "legs_standing_calf_raise_desc",
        category: "legs",
        tags: ["isolation", "machine", "calves"],
        mediaUrl: "/exercises/standing-calf-raise.gif"
    },
    {
        name: "legs_seated_calf_raise",
        description: "legs_seated_calf_raise_desc",
        category: "legs",
        tags: ["isolation", "machine", "calves", "soleus"],
        mediaUrl: "/exercises/seated-calf-raise.gif"
    },
    {
        name: "legs_goblet_squat",
        description: "legs_goblet_squat_desc",
        category: "legs",
        tags: ["compound", "dumbbells", "quads", "mobility"],
        mediaUrl: "/exercises/goblet-squat.gif"
    }
];

export const SHOULDERS_EXERCISES: Exercise[] = [
    {
        name: "shoulders_overhead_press",
        description: "shoulders_overhead_press_desc",
        category: "shoulders",
        tags: ["compound", "barbell", "power", "overhead"],
        mediaUrl: "/exercises/overhead-press.gif"
    },
    {
        name: "shoulders_dumbbell_lateral_raise",
        description: "shoulders_dumbbell_lateral_raise_desc",
        category: "shoulders",
        tags: ["isolation", "dumbbells", "lateral", "width"],
        mediaUrl: "/exercises/lateral-raise.gif"
    },
    {
        name: "shoulders_dumbbell_press",
        description: "shoulders_dumbbell_press_desc",
        category: "shoulders",
        tags: ["compound", "dumbbells", "overhead", "stability"],
        mediaUrl: "/exercises/db-press.gif"
    },
    {
        name: "shoulders_arnold_press",
        description: "shoulders_arnold_press_desc",
        category: "shoulders",
        tags: ["compound", "dumbbells", "rotation", "anterior"],
        mediaUrl: "/exercises/arnold-press.gif"
    },
    {
        name: "shoulders_cable_lateral_raise",
        description: "shoulders_cable_lateral_raise_desc",
        category: "shoulders",
        tags: ["isolation", "cables", "tension", "lateral"],
        mediaUrl: "/exercises/cable-lateral-raise.gif"
    },
    {
        name: "shoulders_front_raise",
        description: "shoulders_front_raise_desc",
        category: "shoulders",
        tags: ["isolation", "dumbbells", "anterior"],
        mediaUrl: "/exercises/front-raise.gif"
    },
    {
        name: "shoulders_face_pull",
        description: "shoulders_face_pull_desc",
        category: "shoulders",
        tags: ["isolation", "cables", "posterior", "posture"],
        mediaUrl: "/exercises/face-pull.gif"
    },
    {
        name: "shoulders_reverse_fly",
        description: "shoulders_reverse_fly_desc",
        category: "shoulders",
        tags: ["isolation", "machine", "posterior", "deltoid"],
        mediaUrl: "/exercises/reverse-fly.gif"
    },
    {
        name: "shoulders_upright_row",
        description: "shoulders_upright_row_desc",
        category: "shoulders",
        tags: ["compound", "barbell", "traps", "pull"],
        mediaUrl: "/exercises/upright-row.gif"
    },
    {
        name: "shoulders_smith_machine_press",
        description: "shoulders_smith_machine_press_desc",
        category: "shoulders",
        tags: ["compound", "machine", "overhead", "control"],
        mediaUrl: "/exercises/smith-press.gif"
    },
    {
        name: "shoulders_bent_over_lateral_raise",
        description: "shoulders_bent_over_lateral_raise_desc",
        category: "shoulders",
        tags: ["isolation", "dumbbells", "posterior"],
        mediaUrl: "/exercises/bent-over-raise.gif"
    },
    {
        name: "shoulders_machine_lateral_raise",
        description: "shoulders_machine_lateral_raise_desc",
        category: "shoulders",
        tags: ["isolation", "machine", "lateral", "volume"],
        mediaUrl: "/exercises/machine-lateral-raise.gif"
    }
];

export const ARMS_EXERCISES: Exercise[] = [
    // BÍCEPS
    {
        name: "arms_barbell_curl",
        description: "arms_barbell_curl_desc",
        category: "arms",
        tags: ["isolation", "barbell", "biceps", "mass"],
        mediaUrl: "/exercises/barbell-curl.gif"
    },
    {
        name: "arms_dumbbell_curl",
        description: "arms_dumbbell_curl_desc",
        category: "arms",
        tags: ["isolation", "dumbbells", "biceps", "unilateral"],
        mediaUrl: "/exercises/db-curl.gif"
    },
    {
        name: "arms_hammer_curl",
        description: "arms_hammer_curl_desc",
        category: "arms",
        tags: ["isolation", "dumbbells", "biceps", "brachialis"],
        mediaUrl: "/exercises/hammer-curl.gif"
    },
    {
        name: "arms_preacher_curl",
        description: "arms_preacher_curl_desc",
        category: "arms",
        tags: ["isolation", "barbell", "biceps", "peak"],
        mediaUrl: "/exercises/preacher-curl.gif"
    },
    {
        name: "arms_cable_curl",
        description: "arms_cable_curl_desc",
        category: "arms",
        tags: ["isolation", "cables", "biceps", "tension"],
        mediaUrl: "/exercises/cable-curl.gif"
    },
    {
        name: "arms_incline_db_curl",
        description: "arms_incline_db_curl_desc",
        category: "arms",
        tags: ["isolation", "dumbbells", "biceps", "stretch"],
        mediaUrl: "/exercises/incline-curl.gif"
    },
    // TRÍCEPS
    {
        name: "arms_triceps_pushdown",
        description: "arms_triceps_pushdown_desc",
        category: "arms",
        tags: ["isolation", "cables", "triceps", "definition"],
        mediaUrl: "/exercises/triceps-pushdown.gif"
    },
    {
        name: "arms_skull_crusher",
        description: "arms_skull_crusher_desc",
        category: "arms",
        tags: ["isolation", "barbell", "triceps", "mass"],
        mediaUrl: "/exercises/skull-crusher.gif"
    },
    {
        name: "arms_overhead_db_extension",
        description: "arms_overhead_db_extension_desc",
        category: "arms",
        tags: ["isolation", "dumbbells", "triceps", "stretch"],
        mediaUrl: "/exercises/overhead-ext.gif"
    },
    {
        name: "arms_dips",
        description: "arms_dips_desc",
        category: "arms",
        tags: ["compound", "bodyweight", "triceps", "power"],
        mediaUrl: "/exercises/dips.gif"
    },
    {
        name: "arms_close_grip_bench_press",
        description: "arms_close_grip_bench_press_desc",
        category: "arms",
        tags: ["compound", "barbell", "triceps", "heavy"],
        mediaUrl: "/exercises/close-grip-bench.gif"
    },
    {
        name: "arms_rope_pushdown",
        description: "arms_rope_pushdown_desc",
        category: "arms",
        tags: ["isolation", "cables", "triceps", "long-head"],
        mediaUrl: "/exercises/rope-pushdown.gif"
    },
    // ANTEBRAÇO E PULSO
    {
        name: "arms_reverse_curl",
        description: "arms_reverse_curl_desc",
        category: "arms",
        tags: ["isolation", "barbell", "forearms", "brachioradialis"],
        mediaUrl: "/exercises/reverse-curl.gif"
    },
    {
        name: "arms_wrist_curl",
        description: "arms_wrist_curl_desc",
        category: "arms",
        tags: ["isolation", "barbell", "forearms", "flexors"],
        mediaUrl: "/exercises/wrist-curl.gif"
    },
    {
        name: "arms_reverse_wrist_curl",
        description: "arms_reverse_wrist_curl_desc",
        category: "arms",
        tags: ["isolation", "dumbbells", "forearms", "extensors"],
        mediaUrl: "/exercises/reverse-wrist-curl.gif"
    }
];

export const CORE_EXERCISES: Exercise[] = [
    {
        name: "core_plank",
        description: "core_plank_desc",
        category: "core",
        tags: ["isometric", "bodyweight", "stability", "full-core"],
        mediaUrl: "/exercises/plank.gif"
    },
    {
        name: "core_crunch",
        description: "core_crunch_desc",
        category: "core",
        tags: ["isolation", "bodyweight", "upper-abs"],
        mediaUrl: "/exercises/crunch.gif"
    },
    {
        name: "core_hanging_leg_raise",
        description: "core_hanging_leg_raise_desc",
        category: "core",
        tags: ["compound", "bodyweight", "lower-abs", "grip"],
        mediaUrl: "/exercises/hanging-leg-raise.gif"
    },
    {
        name: "core_russian_twist",
        description: "core_russian_twist_desc",
        category: "core",
        tags: ["isolation", "dumbbells", "obliques", "rotation"],
        mediaUrl: "/exercises/russian-twist.gif"
    },
    {
        name: "core_cable_crunch",
        description: "core_cable_crunch_desc",
        category: "core",
        tags: ["isolation", "cables", "upper-abs", "heavy"],
        mediaUrl: "/exercises/cable-crunch.gif"
    },
    {
        name: "core_ab_wheel_rollout",
        description: "core_ab_wheel_rollout_desc",
        category: "core",
        tags: ["compound", "accessory", "stability", "advanced"],
        mediaUrl: "/exercises/ab-wheel.gif"
    },
    {
        name: "core_side_plank",
        description: "core_side_plank_desc",
        category: "core",
        tags: ["isometric", "bodyweight", "obliques", "stability"],
        mediaUrl: "/exercises/side-plank.gif"
    },
    {
        name: "core_bicycle_crunch",
        description: "core_bicycle_crunch_desc",
        category: "core",
        tags: ["isolation", "bodyweight", "obliques", "coordination"],
        mediaUrl: "/exercises/bicycle-crunch.gif"
    },
    {
        name: "core_leg_raise_on_floor",
        description: "core_leg_raise_on_floor_desc",
        category: "core",
        tags: ["isolation", "bodyweight", "lower-abs"],
        mediaUrl: "/exercises/leg-raise.gif"
    },
    {
        name: "core_hyperextension",
        description: "core_hyperextension_desc",
        category: "core",
        tags: ["isolation", "machine", "lower-back", "posterior"],
        mediaUrl: "/exercises/hyperextension.gif"
    },
    {
        name: "core_woodchopper",
        description: "core_woodchopper_desc",
        category: "core",
        tags: ["compound", "cables", "obliques", "functional"],
        mediaUrl: "/exercises/woodchopper.gif"
    },
    {
        name: "core_dead_bug",
        description: "core_dead_bug_desc",
        category: "core",
        tags: ["isometric", "bodyweight", "stability", "rehab"],
        mediaUrl: "/exercises/dead-bug.gif"
    }
];

export const CARDIO_EXERCISES: Exercise[] = [
    {
        name: "cardio_treadmill_running",
        description: "cardio_treadmill_running_desc",
        category: "cardio",
        tags: ["machine", "running", "stamina", "high-intensity"],
        mediaUrl: "/exercises/treadmill.gif"
    },
    {
        name: "cardio_stationary_bike",
        description: "cardio_stationary_bike_desc",
        category: "cardio",
        tags: ["machine", "cycling", "low-impact", "endurance"],
        mediaUrl: "/exercises/stationary-bike.gif"
    },
    {
        name: "cardio_elliptical",
        description: "cardio_elliptical_desc",
        category: "cardio",
        tags: ["machine", "low-impact", "full-body", "steady-state"],
        mediaUrl: "/exercises/elliptical.gif"
    },
    {
        name: "cardio_stair_climber",
        description: "cardio_stair_climber_desc",
        category: "cardio",
        tags: ["machine", "glutes", "intense", "stamina"],
        mediaUrl: "/exercises/stair-climber.gif"
    },
    {
        name: "cardio_rowing_machine",
        description: "cardio_rowing_machine_desc",
        category: "cardio",
        tags: ["machine", "full-body", "power", "hiit"],
        mediaUrl: "/exercises/rowing-machine.gif"
    },
    {
        name: "cardio_jump_rope",
        description: "cardio_jump_rope_desc",
        category: "cardio",
        tags: ["accessory", "agility", "high-intensity", "fat-burn"],
        mediaUrl: "/exercises/jump-rope.gif"
    },
    {
        name: "cardio_burpees",
        description: "cardio_burpees_desc",
        category: "cardio",
        tags: ["bodyweight", "hiit", "explosive", "full-body"],
        mediaUrl: "/exercises/burpees.gif"
    },
    {
        name: "cardio_jumping_jacks",
        description: "cardio_jumping_jacks_desc",
        category: "cardio",
        tags: ["bodyweight", "warm-up", "agility"],
        mediaUrl: "/exercises/jumping-jacks.gif"
    },
    {
        name: "cardio_mountain_climbers",
        description: "cardio_mountain_climbers_desc",
        category: "cardio",
        tags: ["bodyweight", "core", "hiit", "fast-paced"],
        mediaUrl: "/exercises/mountain-climbers.gif"
    },
    {
        name: "cardio_battle_ropes",
        description: "cardio_battle_ropes_desc",
        category: "cardio",
        tags: ["accessory", "power", "arms", "hiit"],
        mediaUrl: "/exercises/battle-ropes.gif"
    },
    {
        name: "cardio_box_jumps",
        description: "cardio_box_jumps_desc",
        category: "cardio",
        tags: ["accessory", "explosive", "legs", "plyometric"],
        mediaUrl: "/exercises/box-jumps.gif"
    },
    {
        name: "cardio_swimming",
        description: "cardio_swimming_desc",
        category: "cardio",
        tags: ["full-body", "low-impact", "endurance", "water"],
        mediaUrl: "/exercises/swimming.gif"
    }
];

export const DEFAULT_EXERCISES: Exercise[] = [
    ...CHEST_EXERCISES,
    ...BACK_EXERCISES,
    ...LEGS_EXERCISES,
    ...SHOULDERS_EXERCISES,
    ...ARMS_EXERCISES,
    ...CORE_EXERCISES,
    ...CARDIO_EXERCISES
];