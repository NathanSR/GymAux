import fs from 'fs';
import path from 'path';
import { generateTagsForExercise } from './updateExerciseTags';
import { generateSqlSeed } from './generate_sql_seed';
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
import { Exercise } from '../config/types';

function processExercises(list: Exercise[]): Exercise[] {
    return list.map(ex => ({
        ...ex,
        tags: generateTagsForExercise(ex)
    }));
}

const chest = processExercises(CHEST_EXERCISES);
const back = processExercises(BACK_EXERCISES);
const shoulders = processExercises(SHOULDERS_EXERCISES);
const biceps = processExercises(BICEPS_EXERCISES);
const triceps = processExercises(TRICEPS_EXERCISES);
const forearms = processExercises(FOREARM_EXERCISES);
const quads = processExercises(QUADRICEPS_EXERCISES);
const hams = processExercises(HAMSTRING_EXERCISES);
const glutes = processExercises(GLUTE_EXERCISES);
const calves = processExercises(CALF_EXERCISES);
const adductors = processExercises(ADDUCTOR_EXERCISES);
const abductors = processExercises(ABDUCTOR_EXERCISES);
const core = processExercises(CORE_EXERCISES);
const cardio = processExercises(CARDIO_EXERCISES);
const stretching = processExercises(STRETCHING_EXERCISES);
const fullBody = processExercises(FULL_BODY_EXERCISES);

const fileContent = `import { Exercise } from "./types";

export const CHEST_EXERCISES: Exercise[] = ${JSON.stringify(chest, null, 4)};

export const BACK_EXERCISES: Exercise[] = ${JSON.stringify(back, null, 4)};

export const SHOULDERS_EXERCISES: Exercise[] = ${JSON.stringify(shoulders, null, 4)};

export const BICEPS_EXERCISES: Exercise[] = ${JSON.stringify(biceps, null, 4)};

export const TRICEPS_EXERCISES: Exercise[] = ${JSON.stringify(triceps, null, 4)};

export const FOREARM_EXERCISES: Exercise[] = ${JSON.stringify(forearms, null, 4)};

export const QUADRICEPS_EXERCISES: Exercise[] = ${JSON.stringify(quads, null, 4)};

export const HAMSTRING_EXERCISES: Exercise[] = ${JSON.stringify(hams, null, 4)};

export const GLUTE_EXERCISES: Exercise[] = ${JSON.stringify(glutes, null, 4)};

export const CALF_EXERCISES: Exercise[] = ${JSON.stringify(calves, null, 4)};

export const ADDUCTOR_EXERCISES: Exercise[] = ${JSON.stringify(adductors, null, 4)};

export const ABDUCTOR_EXERCISES: Exercise[] = ${JSON.stringify(abductors, null, 4)};

export const CORE_EXERCISES: Exercise[] = ${JSON.stringify(core, null, 4)};

export const CARDIO_EXERCISES: Exercise[] = ${JSON.stringify(cardio, null, 4)};

export const STRETCHING_EXERCISES: Exercise[] = ${JSON.stringify(stretching, null, 4)};

export const FULL_BODY_EXERCISES: Exercise[] = ${JSON.stringify(fullBody, null, 4)};

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
console.log('✅ Rewrote src/config/seedExercises.ts cleanly!');

// Regenerate SQL seed
const sqlPath = path.join(process.cwd(), '_temp', 'seed_exercises.sql');
const sqlContent = generateSqlSeed();
fs.writeFileSync(sqlPath, sqlContent, 'utf8');
console.log('✅ Regenerated _temp/seed_exercises.sql successfully!');
