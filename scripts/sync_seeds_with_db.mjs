import fs from 'fs';
import path from 'path';

const DB_OUTPUT_FILE = 'C:\\Users\\NathanSR\\.gemini\\antigravity-ide\\brain\\c5bb9992-e95c-4ed2-8a67-c304cd14f4cb\\.system_generated\\steps\\168\\output.txt';
const rawDb = fs.readFileSync(DB_OUTPUT_FILE, 'utf-8');
const outerJson = JSON.parse(rawDb);
const resultStr = outerJson.result;
const startTag = resultStr.indexOf('[{') !== -1 ? resultStr.indexOf('[{') : resultStr.indexOf('[\n{');
const endTag = resultStr.lastIndexOf(']');
const allDbExercises = JSON.parse(resultStr.substring(startTag, endTag + 1));

const dbMapById = new Map(allDbExercises.map(e => [e.id, e]));
const BASE_STORAGE_URL = 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises';

const SEEDS_DIR = 'c:\\Users\\NathanSR\\Projects\\gymaux-app\\src\\config\\seeds';
const seedFiles = [
    'abductors.ts',
    'adductors.ts',
    'back.ts',
    'biceps.ts',
    'calves.ts',
    'cardio.ts',
    'chest.ts',
    'core.ts',
    'forearms.ts',
    'fullBody.ts',
    'glutes.ts',
    'hamstrings.ts',
    'quadriceps.ts',
    'shoulders.ts',
    'stretching.ts',
    'triceps.ts'
];

let totalUpdated = 0;

for (const file of seedFiles) {
    const filePath = path.join(SEEDS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Parse each exercise block by finding objects { "id": X, ... }
    // We can replace "name": "...", and "imageUrl": "..." for each exercise block
    const updatedContent = content.replace(
        /(\{\s*"id":\s*(\d+),[\s\S]*?"name":\s*)"([^"]+)"([\s\S]*?"imageUrl":\s*)"[^"]*"/g,
        (match, p1, idStr, oldName, p2) => {
            const id = parseInt(idStr);
            const dbEx = dbMapById.get(id);
            if (!dbEx) {
                return match;
            }
            const correctName = dbEx.name;
            const correctUrl = `${BASE_STORAGE_URL}/${dbEx.category}/${dbEx.name}.webp`;
            totalUpdated++;
            return `${p1}"${correctName}"${p2}"${correctUrl}"`;
        }
    );

    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log(`Updated ${file}`);
}

console.log(`\nTotal exercises synchronized in seed files: ${totalUpdated}`);
