import fs from 'fs';
import path from 'path';
import { DEFAULT_EXERCISES } from '../config/seeds';
import { generateTagsForExercise } from './updateExerciseTags';
import { generateSqlSeed } from './generate_sql_seed';

const ptPath = path.join(process.cwd(), 'messages', 'pt.json');
const enPath = path.join(process.cwd(), 'messages', 'en.json');
const esPath = path.join(process.cwd(), 'messages', 'es.json');

const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));

const ptTags: Record<string, string> = pt.Tags || {};
const enTags: Record<string, string> = en.Tags || {};
const esTags: Record<string, string> = es.Tags || {};

console.log(`Starting tag generation for ${DEFAULT_EXERCISES.length} exercises...`);

const missingPt: string[] = [];
const missingEn: string[] = [];
const missingEs: string[] = [];

let minTags = 999;
let maxTags = 0;
let totalTagsCount = 0;

const exerciseTagMap: Record<number, string[]> = {};

DEFAULT_EXERCISES.forEach(ex => {
    const tags = generateTagsForExercise(ex);
    exerciseTagMap[ex.id!] = tags;

    if (tags.length < minTags) minTags = tags.length;
    if (tags.length > maxTags) maxTags = tags.length;
    totalTagsCount += tags.length;

    tags.forEach(t => {
        if (!ptTags[t]) missingPt.push(t);
        if (!enTags[t]) missingEn.push(t);
        if (!esTags[t]) missingEs.push(t);
    });
});

console.log(`Summary:`);
console.log(`- Total exercises: ${DEFAULT_EXERCISES.length}`);
console.log(`- Min tags per exercise: ${minTags}`);
console.log(`- Max tags per exercise: ${maxTags}`);
console.log(`- Average tags per exercise: ${(totalTagsCount / DEFAULT_EXERCISES.length).toFixed(2)}`);

const uniqueMissing = Array.from(new Set([...missingPt, ...missingEn, ...missingEs]));
if (uniqueMissing.length > 0) {
    console.log(`⚠️ Missing translation keys found: ${uniqueMissing.join(', ')}`);
} else {
    console.log(`✅ All generated tag keys exist in pt.json, en.json, es.json!`);
}

// Now update seedExercises.ts
const seedPath = path.join(process.cwd(), 'src', 'config', 'seedExercises.ts');
let seedContent = fs.readFileSync(seedPath, 'utf8');

// Replace "tags": [] with updated tags array for each exercise block
let updatedCount = 0;
for (const ex of DEFAULT_EXERCISES) {
    const tags = exerciseTagMap[ex.id!];
    const tagsJson = JSON.stringify(tags, null, 12).replace(/\n/g, '\n        ');
    
    // Replace "tags": [] for exercise id
    // We match block around id: ${ex.id}
    const pattern = new RegExp(`("id":\\s*${ex.id},[\\s\\S]*?"tags":\\s*)\\[\\s*\\]`, 'g');
    if (pattern.test(seedContent)) {
        seedContent = seedContent.replace(pattern, `$1${tagsJson}`);
        updatedCount++;
    } else {
        console.warn(`Could not match tags replacement for exercise ID ${ex.id}`);
    }
}

fs.writeFileSync(seedPath, seedContent, 'utf8');
console.log(`Updated ${updatedCount} exercises in seedExercises.ts.`);

// Regenerate SQL seed
const sqlPath = path.join(process.cwd(), '_temp', 'seed_exercises.sql');
const sqlContent = generateSqlSeed();
fs.writeFileSync(sqlPath, sqlContent, 'utf8');
console.log(`Generated _temp/seed_exercises.sql successfully.`);
