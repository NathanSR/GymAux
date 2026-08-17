import fs from 'fs';

const DB_OUTPUT_FILE = 'C:\\Users\\NathanSR\\.gemini\\antigravity-ide\\brain\\c5bb9992-e95c-4ed2-8a67-c304cd14f4cb\\.system_generated\\steps\\168\\output.txt';
const rawDb = fs.readFileSync(DB_OUTPUT_FILE, 'utf-8');
const outerJson = JSON.parse(rawDb);
const resultStr = outerJson.result;
const startTag = resultStr.indexOf('[{') !== -1 ? resultStr.indexOf('[{') : resultStr.indexOf('[\n{');
const endTag = resultStr.lastIndexOf(']');
const allDbExercises = JSON.parse(resultStr.substring(startTag, endTag + 1));

const systemExercises = allDbExercises.filter(e => e.id < 1000);
console.log(`Testing all ${systemExercises.length} system exercise URLs from DB...`);

const BASE_STORAGE_URL = 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises';

async function testAll() {
    let success = 0;
    let failed = 0;
    const failures = [];

    const CONCURRENCY = 15;
    for (let i = 0; i < systemExercises.length; i += CONCURRENCY) {
        const batch = systemExercises.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map(async ex => {
            const url = `${BASE_STORAGE_URL}/${ex.category}/${ex.name}.webp`;
            try {
                const res = await fetch(url, { method: 'HEAD' });
                if (res.status === 200) {
                    success++;
                } else {
                    failed++;
                    failures.push({ id: ex.id, name: ex.name, category: ex.category, status: res.status, url });
                }
            } catch (err) {
                failed++;
                failures.push({ id: ex.id, name: ex.name, category: ex.category, error: err.message, url });
            }
        }));
    }

    console.log('\n==========================================');
    console.log(`HTTP Verification Complete!`);
    console.log(`Total URLs Tested: ${systemExercises.length}`);
    console.log(`200 OK (Success): ${success}`);
    console.log(`Failed: ${failed}`);
    console.log('==========================================\n');

    if (failures.length > 0) {
        console.log('Failures:', JSON.stringify(failures, null, 2));
    }
}

testAll();
