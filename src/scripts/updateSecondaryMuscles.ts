import fs from 'fs';
import path from 'path';
import { Exercise, CategoryType } from '../config/types';
import {
    CHEST_EXERCISES,
    BACK_EXERCISES,
    SHOULDERS_EXERCISES,
    BICEPS_EXERCISES,
    TRICEPS_EXERCISES,
    FOREARM_EXERCISES,
    QUADRICEPS_EXERCISES,
    HAMSTRING_EXERCISES,
    GLUTE_EXERCISES,
    CALF_EXERCISES,
    ADDUCTOR_EXERCISES,
    ABDUCTOR_EXERCISES,
    CORE_EXERCISES,
    CARDIO_EXERCISES,
    STRETCHING_EXERCISES,
    FULL_BODY_EXERCISES,
    DEFAULT_EXERCISES
} from '../config/seedExercises';
import { generateSqlSeed } from './generate_sql_seed';

export function computeSecondaryMuscles(ex: Exercise): CategoryType[] {
    const cat = ex.category;
    const name = ex.name.toLowerCase();

    switch (cat) {
        case 'chest': {
            if (name.includes('pullover')) return ['back', 'triceps', 'core'];
            if (name.includes('fly') || name.includes('crossover') || name.includes('pec_deck') || name.includes('voador') || name.includes('crucifixo')) return ['shoulders'];
            if (name.includes('svendsen') || name.includes('plate_press')) return ['shoulders'];
            if (name.includes('push_up') || name.includes('flexão') || name.includes('dips') || name.includes('paralelas')) return ['triceps', 'shoulders', 'core'];
            return ['triceps', 'shoulders'];
        }

        case 'back': {
            if (name.includes('shrug') || name.includes('encolhimento')) return ['shoulders', 'forearms'];
            if (name.includes('face_pull')) return ['shoulders'];
            if (name.includes('straight_arm_pulldown')) return ['triceps', 'core'];
            if (name.includes('deadlift') || name.includes('rack_pull')) return ['hamstrings', 'glutes', 'core', 'forearms'];
            if (name.includes('extension') || name.includes('good_morning') || name.includes('superman')) return ['glutes', 'hamstrings', 'core'];
            if (name.includes('pull_up') || name.includes('chin_up') || name.includes('pulldown') || name.includes('puxada')) {
                if (name.includes('chin_up')) return ['biceps', 'forearms', 'shoulders'];
                return ['biceps', 'forearms', 'shoulders', 'core'];
            }
            if (name.includes('row') || name.includes('remada')) {
                if (name.includes('seal') || name.includes('supported') || name.includes('seated') || name.includes('one_arm') || name.includes('serrote') || name.includes('single_arm')) return ['biceps', 'forearms', 'shoulders'];
                return ['biceps', 'forearms', 'shoulders', 'core'];
            }
            return ['biceps', 'forearms', 'shoulders'];
        }

        case 'shoulders': {
            if (name.includes('press') || name.includes('desenvolvimento') || name.includes('ohp') || name.includes('pike') || name.includes('handstand')) return ['triceps', 'chest', 'core'];
            if (name.includes('lateral_raise') || name.includes('elevação_lateral')) return ['back'];
            if (name.includes('front_raise') || name.includes('elevação_frontal')) return ['chest'];
            if (name.includes('rear_delt') || name.includes('crucifixo_invertido')) return ['back'];
            if (name.includes('upright_row') || name.includes('remada_alta')) return ['biceps', 'back', 'forearms'];
            if (name.includes('rotation') || name.includes('rotação')) return ['back'];
            return ['triceps', 'back'];
        }

        case 'biceps': {
            if (name.includes('chin_up')) return ['back', 'forearms', 'core'];
            return ['forearms'];
        }

        case 'triceps': {
            if (name.includes('pushdown') || name.includes('pulley')) return ['forearms'];
            if (name.includes('skull') || name.includes('testa')) return ['forearms', 'shoulders'];
            if (name.includes('overhead') || name.includes('francês')) return ['shoulders', 'core'];
            if (name.includes('bench') || name.includes('supino') || name.includes('dips') || name.includes('paralelas') || name.includes('mergulho')) return ['chest', 'shoulders'];
            if (name.includes('tate')) return ['chest'];
            if (name.includes('kickback') || name.includes('coice')) return ['shoulders'];
            return ['forearms', 'shoulders'];
        }

        case 'forearms': {
            if (name.includes('farmer')) return ['core', 'shoulders', 'back', 'calves'];
            if (name.includes('hang') || name.includes('pinch')) return ['core', 'back', 'shoulders'];
            return ['biceps'];
        }

        case 'quadriceps': {
            if (name.includes('extension') || name.includes('extensora')) return ['core'];
            if (name.includes('sissy')) return ['core'];
            if (name.includes('box_jump') || name.includes('sled')) return ['glutes', 'calves', 'hamstrings', 'core'];
            if (name.includes('deadlift')) return ['glutes', 'hamstrings', 'back', 'forearms', 'core'];
            if (name.includes('lunge') || name.includes('passada') || name.includes('afundo') || name.includes('split_squat') || name.includes('step_up') || name.includes('pistol') || name.includes('shrimp')) return ['glutes', 'hamstrings', 'calves', 'core'];
            return ['glutes', 'hamstrings', 'calves', 'core'];
        }

        case 'hamstrings': {
            if (name.includes('stiff') || name.includes('rdl') || name.includes('romanian')) return ['glutes', 'back', 'core', 'forearms'];
            if (name.includes('good_morning')) return ['glutes', 'back', 'core'];
            if (name.includes('curl') || name.includes('flexora')) return ['calves', 'glutes'];
            if (name.includes('nordic') || name.includes('glute_ham') || name.includes('ghr')) return ['glutes', 'calves', 'core'];
            if (name.includes('swing')) return ['glutes', 'back', 'core', 'shoulders'];
            return ['glutes', 'calves', 'core'];
        }

        case 'glutes': {
            if (name.includes('thrust') || name.includes('bridge')) return ['hamstrings', 'quadriceps', 'core'];
            if (name.includes('abduct') || name.includes('clamshell') || name.includes('band_walk')) return ['abductors', 'core'];
            if (name.includes('kickback') || name.includes('donkey') || name.includes('hydrant')) return ['hamstrings', 'core'];
            if (name.includes('sumo')) return ['adductors', 'quadriceps', 'hamstrings', 'core'];
            return ['hamstrings', 'core'];
        }

        case 'calves': {
            if (name.includes('tibialis')) return ['calves'];
            if (name.includes('farmer')) return ['forearms', 'core', 'shoulders'];
            if (name.includes('leg_press') || name.includes('hack') || name.includes('donkey')) return ['quadriceps', 'hamstrings'];
            return ['quadriceps'];
        }

        case 'adductors': {
            if (name.includes('sumo')) return ['glutes', 'quadriceps', 'hamstrings', 'core'];
            if (name.includes('lunge')) return ['glutes', 'quadriceps', 'core'];
            return ['glutes', 'core'];
        }

        case 'abductors': {
            if (name.includes('lunge')) return ['glutes', 'quadriceps', 'core'];
            return ['glutes', 'core'];
        }

        case 'core': {
            if (name.includes('plank') || name.includes('hold') || name.includes('dragon_flag') || name.includes('hollow')) return ['shoulders', 'glutes', 'quadriceps'];
            if (name.includes('raise') || name.includes('toes_to_bar') || name.includes('captain')) return ['quadriceps', 'forearms'];
            if (name.includes('twist') || name.includes('woodchop') || name.includes('pallof') || name.includes('rotation')) return ['shoulders', 'back'];
            if (name.includes('rollout')) return ['shoulders', 'back', 'chest'];
            if (name.includes('extension') || name.includes('superman')) return ['glutes', 'hamstrings'];
            return ['quadriceps'];
        }

        case 'cardio': {
            if (name.includes('burpee')) return ['chest', 'quadriceps', 'triceps', 'shoulders', 'core'];
            if (name.includes('rowing')) return ['back', 'biceps', 'quadriceps', 'hamstrings', 'core'];
            if (name.includes('swimming')) return ['full_body', 'back', 'shoulders', 'core'];
            if (name.includes('rope')) return ['calves', 'quadriceps', 'shoulders', 'core'];
            if (name.includes('bike') || name.includes('cycling')) return ['quadriceps', 'hamstrings', 'calves', 'glutes'];
            return ['quadriceps', 'calves', 'glutes', 'hamstrings', 'core'];
        }

        case 'stretching': {
            if (name.includes('chest')) return ['shoulders'];
            if (name.includes('triceps')) return ['shoulders'];
            if (name.includes('shoulder')) return ['back'];
            if (name.includes('quadriceps')) return ['quadriceps'];
            if (name.includes('hamstring')) return ['hamstrings'];
            if (name.includes('calf')) return ['calves'];
            if (name.includes('flexor') || name.includes('butterfly')) return ['adductors', 'glutes'];
            return ['core', 'back'];
        }

        case 'full_body': {
            if (name.includes('snatch')) return ['shoulders', 'back', 'quadriceps', 'glutes', 'core'];
            if (name.includes('clean')) return ['back', 'quadriceps', 'glutes', 'hamstrings', 'core'];
            if (name.includes('burpee')) return ['chest', 'quadriceps', 'back', 'core', 'shoulders'];
            return ['quadriceps', 'shoulders', 'triceps', 'glutes', 'core'];
        }

        default:
            return [];
    }
}

function processArray(exercises: Exercise[]): Exercise[] {
    return exercises.map(ex => ({
        ...ex,
        secondaryMuscles: computeSecondaryMuscles(ex)
    }));
}

function run() {
    const updatedChest = processArray(CHEST_EXERCISES);
    const updatedBack = processArray(BACK_EXERCISES);
    const updatedShoulders = processArray(SHOULDERS_EXERCISES);
    const updatedBiceps = processArray(BICEPS_EXERCISES);
    const updatedTriceps = processArray(TRICEPS_EXERCISES);
    const updatedForearm = processArray(FOREARM_EXERCISES);
    const updatedQuadriceps = processArray(QUADRICEPS_EXERCISES);
    const updatedHamstring = processArray(HAMSTRING_EXERCISES);
    const updatedGlute = processArray(GLUTE_EXERCISES);
    const updatedCalf = processArray(CALF_EXERCISES);
    const updatedAdductor = processArray(ADDUCTOR_EXERCISES);
    const updatedAbductor = processArray(ABDUCTOR_EXERCISES);
    const updatedCore = processArray(CORE_EXERCISES);
    const updatedCardio = processArray(CARDIO_EXERCISES);
    const updatedStretching = processArray(STRETCHING_EXERCISES);
    const updatedFullBody = processArray(FULL_BODY_EXERCISES);

    const fileContent = `import { Exercise } from "./types";

export const CHEST_EXERCISES: Exercise[] = ${JSON.stringify(updatedChest, null, 4)};

export const BACK_EXERCISES: Exercise[] = ${JSON.stringify(updatedBack, null, 4)};

export const SHOULDERS_EXERCISES: Exercise[] = ${JSON.stringify(updatedShoulders, null, 4)};

export const BICEPS_EXERCISES: Exercise[] = ${JSON.stringify(updatedBiceps, null, 4)};

export const TRICEPS_EXERCISES: Exercise[] = ${JSON.stringify(updatedTriceps, null, 4)};

export const FOREARM_EXERCISES: Exercise[] = ${JSON.stringify(updatedForearm, null, 4)};

export const QUADRICEPS_EXERCISES: Exercise[] = ${JSON.stringify(updatedQuadriceps, null, 4)};

export const HAMSTRING_EXERCISES: Exercise[] = ${JSON.stringify(updatedHamstring, null, 4)};

export const GLUTE_EXERCISES: Exercise[] = ${JSON.stringify(updatedGlute, null, 4)};

export const CALF_EXERCISES: Exercise[] = ${JSON.stringify(updatedCalf, null, 4)};

export const ADDUCTOR_EXERCISES: Exercise[] = ${JSON.stringify(updatedAdductor, null, 4)};

export const ABDUCTOR_EXERCISES: Exercise[] = ${JSON.stringify(updatedAbductor, null, 4)};

export const CORE_EXERCISES: Exercise[] = ${JSON.stringify(updatedCore, null, 4)};

export const CARDIO_EXERCISES: Exercise[] = ${JSON.stringify(updatedCardio, null, 4)};

export const STRETCHING_EXERCISES: Exercise[] = ${JSON.stringify(updatedStretching, null, 4)};

export const FULL_BODY_EXERCISES: Exercise[] = ${JSON.stringify(updatedFullBody, null, 4)};

export const DEFAULT_EXERCISES: Exercise[] = [
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
`;

    const seedPath = path.join(process.cwd(), 'src', 'config', 'seedExercises.ts');
    fs.writeFileSync(seedPath, fileContent, 'utf8');
    console.log('[Update Script] src/config/seedExercises.ts atualizado com sucesso!');

    // Gerar SQL seed
    const sqlPath = path.join(process.cwd(), '_temp', 'seed_exercises.sql');
    // importar DEFAULT_EXERCISES atualizado no momento
    const allUpdated = [
        ...updatedChest,
        ...updatedBack,
        ...updatedShoulders,
        ...updatedBiceps,
        ...updatedTriceps,
        ...updatedForearm,
        ...updatedQuadriceps,
        ...updatedHamstring,
        ...updatedGlute,
        ...updatedCalf,
        ...updatedAdductor,
        ...updatedAbductor,
        ...updatedCore,
        ...updatedCardio,
        ...updatedStretching,
        ...updatedFullBody
    ];

    // Gerar a string SQL
    const sqlHeader = `-- ========================================================\n` +
        `-- GymAux - Seed Oficial de Exercícios (Gerado Automática)\n` +
        `-- Total de exercícios catalogados: ${allUpdated.length}\n` +
        `-- Data: ${new Date().toISOString()}\n` +
        `-- ========================================================\n\n`;

    const sortedExercises = [...allUpdated].sort((a, b) => {
        if (a.parentId === null && b.parentId !== null) return -1;
        if (a.parentId !== null && b.parentId === null) return 1;
        return (a.id || 0) - (b.id || 0);
    });

    const escapeSqlString = (str: string | null | undefined): string => {
        if (str === null || str === undefined) return 'NULL';
        return `'${str.replace(/'/g, "''")}'`;
    };

    const formatSqlArray = (arr: string[] | null | undefined): string => {
        if (!arr || arr.length === 0) return "ARRAY[]::text[]";
        const escapedItems = arr.map(item => `'${item.replace(/'/g, "''")}'`);
        return `ARRAY[${escapedItems.join(', ')}]`;
    };

    const formatSqlJsonb = (obj: any): string => {
        if (!obj || (Array.isArray(obj) && obj.length === 0)) return "'[]'::jsonb";
        const jsonString = JSON.stringify(obj).replace(/'/g, "''");
        return `'${jsonString}'::jsonb`;
    };

    const sqlStatements = sortedExercises.map(ex => {
        const id = ex.id;
        const name = escapeSqlString(ex.name);
        const description = escapeSqlString(ex.description);
        const category = escapeSqlString(ex.category);
        const secondaryMuscles = formatSqlArray(ex.secondaryMuscles);
        const tags = formatSqlArray(ex.tags);
        const howTo = escapeSqlString(ex.howTo);
        const imageUrl = escapeSqlString(ex.imageUrl);
        const videoUrl = escapeSqlString(ex.videoUrl);
        const gallery = formatSqlJsonb(ex.gallery || []);
        const level = escapeSqlString(ex.level || 'beginner');
        const equipment = escapeSqlString(ex.equipment || 'none');
        const executionMode = escapeSqlString(ex.executionMode || 'bilateral');
        const mechanics = escapeSqlString(ex.mechanics || 'compound');
        const parentId = ex.parentId !== null && ex.parentId !== undefined ? ex.parentId : 'NULL';
        const visibility = escapeSqlString(ex.visibility || 'public');
        const createdByType = escapeSqlString(ex.created_by_type || 'system');

        return `INSERT INTO exercises (id, name, description, category, secondary_muscles, tags, how_to, image_url, video_url, gallery, level, equipment, execution_mode, mechanics, parent_id, visibility, created_by_type) ` +
            `VALUES (${id}, ${name}, ${description}, ${category}, ${secondaryMuscles}, ${tags}, ${howTo}, ${imageUrl}, ${videoUrl}, ${gallery}, ${level}, ${equipment}, ${executionMode}, ${mechanics}, ${parentId}, ${visibility}, ${createdByType}) ` +
            `ON CONFLICT (id) DO UPDATE SET ` +
            `name = EXCLUDED.name, ` +
            `description = EXCLUDED.description, ` +
            `category = EXCLUDED.category, ` +
            `secondary_muscles = EXCLUDED.secondary_muscles, ` +
            `tags = EXCLUDED.tags, ` +
            `how_to = EXCLUDED.how_to, ` +
            `image_url = EXCLUDED.image_url, ` +
            `video_url = EXCLUDED.video_url, ` +
            `gallery = EXCLUDED.gallery, ` +
            `level = EXCLUDED.level, ` +
            `equipment = EXCLUDED.equipment, ` +
            `execution_mode = EXCLUDED.execution_mode, ` +
            `mechanics = EXCLUDED.mechanics, ` +
            `parent_id = EXCLUDED.parent_id, ` +
            `visibility = EXCLUDED.visibility;`;
    });

    fs.writeFileSync(sqlPath, sqlHeader + sqlStatements.join('\n') + '\n', 'utf8');
    console.log('[Update Script] _temp/seed_exercises.sql atualizado com sucesso!');
}

run();
