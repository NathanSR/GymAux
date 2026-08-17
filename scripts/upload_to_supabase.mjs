import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// 1. Read env
const envContent = fs.readFileSync('c:\\Users\\NathanSR\\Projects\\gymaux-app\\.env.local', 'utf-8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const supabaseKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

if (!supabaseUrl || !supabaseKey) {
    console.error('Could not find Supabase URL or Anon Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
});

const WEBP_DIR = 'C:\\Users\\NathanSR\\Pictures\\Gym\\exercicios_webp';
const BUCKET = 'exercises';

async function uploadFileWithRetry(filePath, storagePath, maxRetries = 3) {
    const fileBuffer = fs.readFileSync(filePath);
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const { data, error } = await supabase.storage
                .from(BUCKET)
                .upload(storagePath, fileBuffer, {
                    contentType: 'image/webp',
                    cacheControl: '31536000, public',
                    upsert: true
                });

            if (error) {
                if (attempt === maxRetries) throw error;
                await new Promise(r => setTimeout(r, 1000 * attempt));
            } else {
                return data;
            }
        } catch (err) {
            if (attempt === maxRetries) throw err;
            await new Promise(r => setTimeout(r, 1000 * attempt));
        }
    }
}

async function uploadAll() {
    console.log(`--- STEP 3: UPLOADING OPTIMIZED WEBP IMAGES TO SUPABASE STORAGE ---`);
    console.log(`Supabase URL: ${supabaseUrl}`);
    console.log(`Bucket: ${BUCKET}`);
    console.log(`Source dir: ${WEBP_DIR}`);

    const allFiles = [];
    for (const folder of fs.readdirSync(WEBP_DIR)) {
        const folderPath = path.join(WEBP_DIR, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;
        for (const file of fs.readdirSync(folderPath)) {
            if (!file.endsWith('.webp')) continue;
            const fullPath = path.join(folderPath, file);
            const storagePath = `${folder}/${file}`;
            allFiles.push({ fullPath, storagePath, folder, file });
        }
    }

    console.log(`Found ${allFiles.length} .webp files to upload.`);

    let completed = 0;
    let failed = 0;
    const CONCURRENCY = 8;

    for (let i = 0; i < allFiles.length; i += CONCURRENCY) {
        const batch = allFiles.slice(i, i + CONCURRENCY);
        await Promise.all(
            batch.map(async item => {
                try {
                    await uploadFileWithRetry(item.fullPath, item.storagePath);
                    completed++;
                } catch (err) {
                    console.error(`Failed to upload ${item.storagePath}:`, err.message);
                    failed++;
                }
            })
        );

        if (completed % 25 === 0 || completed === allFiles.length) {
            console.log(`Uploaded ${completed}/${allFiles.length} images...`);
        }
    }

    console.log('\n==========================================');
    console.log(`Upload Complete!`);
    console.log(`Successfully uploaded: ${completed} images`);
    console.log(`Failed: ${failed}`);
    console.log('==========================================\n');

    if (failed > 0) {
        process.exit(1);
    }
}

uploadAll().catch(err => {
    console.error('Fatal upload error:', err);
    process.exit(1);
});
