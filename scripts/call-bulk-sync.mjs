import fs from 'fs';
import path from 'path';

const SEEDS_DIR = path.join(process.cwd(), 'src', 'config', 'seeds');
const SEED_FILES = [
    'chest.ts', 'back.ts', 'shoulders.ts', 'biceps.ts', 'triceps.ts',
    'forearms.ts', 'quadriceps.ts', 'hamstrings.ts', 'glutes.ts', 'calves.ts',
    'adductors.ts', 'abductors.ts', 'core.ts', 'cardio.ts', 'stretching.ts', 'fullBody.ts'
];

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

console.log(`Total de ${allExercises.length} exercícios carregados.`);

// Divide em 4 blocos de ~92 exercícios
const chunkSize = 100;
const queries = [];
for (let i = 0; i < allExercises.length; i += chunkSize) {
    const slice = allExercises.slice(i, i + chunkSize);
    const jsonStr = JSON.stringify(slice).replace(/'/g, "''");
    queries.push(`SELECT bulk_sync_exercises('${jsonStr}'::jsonb);`);
}

for (let i = 0; i < queries.length; i++) {
    fs.writeFileSync(path.join(process.cwd(), '_temp', `bulk_query_${i}.sql`), queries[i]);
}

console.log(`Geradas ${queries.length} queries para execução.`);
