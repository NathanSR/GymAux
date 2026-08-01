import fs from 'fs';
import path from 'path';
import { DEFAULT_EXERCISES } from '../config/seedExercises';

function escapeSqlString(str: string | null | undefined): string {
    if (str === null || str === undefined) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
}

function formatSqlArray(arr: string[] | null | undefined): string {
    if (!arr || arr.length === 0) return "ARRAY[]::text[]";
    const escapedItems = arr.map(item => `'${item.replace(/'/g, "''")}'`);
    return `ARRAY[${escapedItems.join(', ')}]`;
}

function formatSqlJsonb(obj: any): string {
    if (!obj || (Array.isArray(obj) && obj.length === 0)) return "'[]'::jsonb";
    const jsonString = JSON.stringify(obj).replace(/'/g, "''");
    return `'${jsonString}'::jsonb`;
}

export function generateSqlSeed(): string {
    const header = `-- ========================================================\n` +
        `-- GymAux - Seed Oficial de Exercícios (Gerado Automática)\n` +
        `-- Total de exercícios catalogados: ${DEFAULT_EXERCISES.length}\n` +
        `-- Data: ${new Date().toISOString()}\n` +
        `-- ========================================================\n\n`;

    // Ordena os exercícios: Primeiro os exercícios Pais (parentId == null), depois os exercícios Filhos (variantes)
    const sortedExercises = [...DEFAULT_EXERCISES].sort((a, b) => {
        if (a.parentId === null && b.parentId !== null) return -1;
        if (a.parentId !== null && b.parentId === null) return 1;
        return (a.id || 0) - (b.id || 0);
    });

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

    return header + sqlStatements.join('\n') + '\n';
}

// Se executado diretamente via CLI
if (require.main === module) {
    const outputPath = path.join(process.cwd(), '_temp', 'seed_exercises.sql');
    const sqlContent = generateSqlSeed();
    fs.writeFileSync(outputPath, sqlContent, 'utf8');
    console.log(`[Seed Generator] _temp/seed_exercises.sql gerado com sucesso contendo ${DEFAULT_EXERCISES.length} exercícios!`);
}
