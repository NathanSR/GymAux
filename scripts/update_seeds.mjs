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

let totalUpdated = 0;

for (const file of seedFiles) {
    const filePath = path.join(SEEDS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Match each exercise block with name, category and imageUrl
    // Replace "imageUrl": ... with the new url based on category and name
    const updatedContent = content.replace(
        /("name":\s*"([^"]+)",[\s\S]*?"category":\s*"([^"]+)",[\s\S]*?"imageUrl":\s*)"[^"]*"/g,
        (match, prefix, name, category) => {
            totalUpdated++;
            const newUrl = `${BASE_STORAGE_URL}/${category}/${name}.webp`;
            return `${prefix}"${newUrl}"`;
        }
    );

    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log(`Updated ${file}`);
}

console.log(`\nTotal exercise imageUrl fields updated: ${totalUpdated}`);
