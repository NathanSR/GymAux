import fs from 'fs';
import path from 'path';

const SEEDS_DIR = path.join(process.cwd(), 'src', 'config', 'seeds');

const SEED_FILES = [
    'chest.ts',
    'back.ts',
    'shoulders.ts',
    'biceps.ts',
    'triceps.ts',
    'forearms.ts',
    'quadriceps.ts',
    'hamstrings.ts',
    'glutes.ts',
    'calves.ts',
    'adductors.ts',
    'abductors.ts',
    'core.ts',
    'cardio.ts',
    'stretching.ts',
    'fullBody.ts'
];

function escapeSql(str) {
    if (str === null || str === undefined) return 'NULL';
    return "'" + str.replace(/'/g, "''") + "'";
}

function escapeJson(obj) {
    if (!obj) return "'{}'::jsonb";
    const str = JSON.stringify(obj);
    return "'" + str.replace(/'/g, "''") + "'::jsonb";
}

function escapeArray(arr) {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return "'{}'::text[]";
    const escapedItems = arr.map(item => `"${item.replace(/"/g, '\\"')}"`);
    return `'{${escapedItems.join(',')}}'::text[]`;
}

function generateSql() {
    let allExercises = [];

    for (const file of SEED_FILES) {
        const filePath = path.join(SEEDS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const match = content.match(/=\s*(\[[\s\S]*\]);/);
        if (match) {
            const exercises = JSON.parse(match[1]);
            allExercises = allExercises.concat(exercises);
        }
    }

    console.log(`Carregados ${allExercises.length} exercícios dos seeds.`);

    const statements = allExercises.map(ex => {
        const id = ex.id;
        const name = escapeSql(ex.name);
        const category = escapeSql(ex.category);
        const equipment = escapeSql(ex.equipment || 'none');
        const executionMode = escapeSql(ex.executionMode || 'bilateral');
        const mechanics = escapeSql(ex.mechanics || 'compound');
        const level = escapeSql(ex.level || 'beginner');
        const parentId = ex.parentId ? ex.parentId : 'NULL';
        const imageUrl = escapeSql(ex.imageUrl && ex.imageUrl !== 'null' ? ex.imageUrl : null);
        const videoUrl = escapeSql(ex.videoUrl && ex.videoUrl !== 'null' ? ex.videoUrl : null);
        const createdByType = escapeSql(ex.created_by_type || 'system');
        const secondaryMuscles = escapeArray(ex.secondaryMuscles);
        const gallery = escapeJson(ex.gallery || []);
        const translations = escapeJson(ex.translations || {});

        return `UPDATE exercises SET
    name = ${name},
    category = ${category},
    equipment = ${equipment},
    execution_mode = ${executionMode},
    mechanics = ${mechanics},
    level = ${level},
    parent_id = ${parentId},
    image_url = ${imageUrl},
    video_url = ${videoUrl},
    created_by_type = ${createdByType},
    secondary_muscles = ${secondaryMuscles},
    gallery = ${gallery},
    translations = ${translations}
WHERE id = ${id};`;
    });

    // Divide em blocos de 50 para execução via SQL
    const chunkSize = 50;
    const chunks = [];
    for (let i = 0; i < statements.length; i += chunkSize) {
        chunks.push(statements.slice(i, i + chunkSize).join('\n'));
    }

    fs.writeFileSync(path.join(process.cwd(), '_temp', 'sync_exercises.json'), JSON.stringify(chunks, null, 2));
    console.log(`Gerados ${chunks.length} chunks de SQL em _temp/sync_exercises.json`);
}

generateSql();
