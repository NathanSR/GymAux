import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC_DIR = 'C:\\Users\\NathanSR\\Pictures\\Gym\\exercicios';
const DEST_DIR = 'C:\\Users\\NathanSR\\Pictures\\Gym\\exercicios_webp';

const IGNORE_FILES = new Set([
    'back/meadows_row.png',
    'back/remada_meadows.png',
    'calves/extensao_panturrilha_maquina.png',
    'calves/gemeos_sentado_maquina.png',
    'cardio/farmer_walker.png',
    'hamstrings/single_leg_romanian_deadlift_dumbbell.png'
]);

async function convertAll() {
    console.log('--- STEP 1: CONVERTING IMAGES TO WEBP (PARALLEL) ---');
    if (!fs.existsSync(DEST_DIR)) {
        fs.mkdirSync(DEST_DIR, { recursive: true });
    }

    const tasks = [];

    const folders = fs.readdirSync(SRC_DIR);
    for (const folder of folders) {
        const srcFolderPath = path.join(SRC_DIR, folder);
        if (!fs.statSync(srcFolderPath).isDirectory()) continue;

        const destFolderPath = path.join(DEST_DIR, folder);
        if (!fs.existsSync(destFolderPath)) {
            fs.mkdirSync(destFolderPath, { recursive: true });
        }

        const files = fs.readdirSync(srcFolderPath);
        for (const file of files) {
            const relKey = `${folder}/${file}`;
            if (IGNORE_FILES.has(relKey)) {
                continue;
            }

            const srcFilePath = path.join(srcFolderPath, file);
            const stat = fs.statSync(srcFilePath);
            if (!stat.isFile()) continue;

            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            const destFilePath = path.join(destFolderPath, `${baseName}.webp`);

            tasks.push({
                folder,
                file,
                baseName,
                srcFilePath,
                destFilePath,
                originalSize: stat.size
            });
        }
    }

    console.log(`Total images to process: ${tasks.length}`);

    let totalOriginalBytes = 0;
    let totalWebpBytes = 0;
    let completed = 0;

    const CONCURRENCY = 8;
    for (let i = 0; i < tasks.length; i += CONCURRENCY) {
        const batch = tasks.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map(async task => {
            const buffer = await sharp(task.srcFilePath)
                .webp({ quality: 80, effort: 4 })
                .toBuffer();

            fs.writeFileSync(task.destFilePath, buffer);
            totalOriginalBytes += task.originalSize;
            totalWebpBytes += buffer.length;
            completed++;
        }));

        if (completed % 50 === 0 || completed === tasks.length) {
            console.log(`Converted ${completed}/${tasks.length} images...`);
        }
    }

    console.log('\n==========================================');
    console.log(`Successfully converted: ${completed} images`);
    console.log(`Original total size: ${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Optimized WebP total size: ${(totalWebpBytes / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Space saved: ${((1 - totalWebpBytes / totalOriginalBytes) * 100).toFixed(1)}%`);
    console.log(`Destination directory: ${DEST_DIR}`);
    console.log('==========================================\n');
}

convertAll().catch(err => {
    console.error('Conversion failed:', err);
    process.exit(1);
});
