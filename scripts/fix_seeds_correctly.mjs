import fs from 'fs';
import path from 'path';

const SEEDS_DIR = 'c:\\Users\\NathanSR\\Projects\\gymaux-app\\src\\config\\seeds';
const BASE_STORAGE_URL = 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises';

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

for (const file of seedFiles) {
    const filePath = path.join(SEEDS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    const startIdx = content.indexOf('[');
    const endIdx = content.lastIndexOf(']');
    if (startIdx === -1 || endIdx === -1) continue;

    const arrayStr = content.substring(startIdx, endIdx + 1);
    const parsed = new Function('return ' + arrayStr)();

    for (const ex of parsed) {
        ex.imageUrl = `${BASE_STORAGE_URL}/${ex.category}/${ex.name}.webp`;
        // Ensure videoUrl is null if it was "null"
        if (ex.videoUrl === 'null' || !ex.videoUrl) {
            ex.videoUrl = null;
        }
    }

    // Serialize to valid TS code
    const prefix = content.substring(0, startIdx);
    const suffix = content.substring(endIdx + 1);

    // Formatted JSON string
    const jsonStr = JSON.stringify(parsed, null, 4);

    fs.writeFileSync(filePath, `${prefix}${jsonStr}${suffix}`, 'utf-8');
    console.log(`Correctly fixed ${file}`);
}
