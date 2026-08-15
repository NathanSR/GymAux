import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fkoppszkihbgpsottpfq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrb3Bwc3praWhiZ3Bzb3R0cGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzE5MTQsImV4cCI6MjA4OTg0NzkxNH0.3NYOpPale6Nrv9gbJHcgoSAu8zX3Yap2B8PH5dIXHfg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ROOT_DIR = process.cwd();
const TEMP_DIR = path.join(ROOT_DIR, '_temp');
const OPTIMIZED_DIR = path.join(TEMP_DIR, 'optimized');

async function processDirectory(subDir, bucketName) {
    const inputDir = path.join(TEMP_DIR, 'images', subDir);
    const outputDir = path.join(OPTIMIZED_DIR, bucketName);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

    console.log(`\n========================================`);
    console.log(`🚀 Processando ${files.length} imagens para o bucket '${bucketName}'...`);
    console.log(`========================================`);

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    for (const file of files) {
        const inputFilePath = path.join(inputDir, file);
        const fileBase = path.parse(file).name;
        // Fix filename spelling if needed: 'sholders' -> 'shoulders' / keep slug consistent
        let slug = fileBase;
        if (bucketName === 'categories' && slug === 'sholders') {
            slug = 'shoulders';
        }
        const outputFileName = `${slug}.webp`;
        const outputFilePath = path.join(outputDir, outputFileName);

        const originalStats = fs.statSync(inputFilePath);
        totalOriginalSize += originalStats.size;

        // Convert to WebP with Sharp (preserving alpha transparency, resizing to max 800x800)
        const optimizedBuffer = await sharp(inputFilePath)
            .resize(800, 800, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({
                quality: 85,
                effort: 6,
                alphaQuality: 90
            })
            .toBuffer();

        fs.writeFileSync(outputFilePath, optimizedBuffer);
        const optStats = fs.statSync(outputFilePath);
        totalOptimizedSize += optStats.size;

        const origMB = (originalStats.size / (1024 * 1024)).toFixed(2);
        const optKB = (optStats.size / 1024).toFixed(1);
        const saving = ((1 - optStats.size / originalStats.size) * 100).toFixed(1);

        console.log(`📸 [${file}] -> [${outputFileName}]: ${origMB} MB -> ${optKB} KB (-${saving}%)`);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(outputFileName, optimizedBuffer, {
                contentType: 'image/webp',
                upsert: true
            });

        if (error) {
            console.error(`❌ Erro ao enviar ${outputFileName} para Supabase:`, error.message);
        } else {
            console.log(`   ✅ Supabase Storage: ${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${outputFileName}`);
        }
    }

    const totalOrigMB = (totalOriginalSize / (1024 * 1024)).toFixed(2);
    const totalOptMB = (totalOptimizedSize / (1024 * 1024)).toFixed(2);
    const totalSaving = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);

    console.log(`\n🎉 Total '${bucketName}': ${totalOrigMB} MB -> ${totalOptMB} MB (Economia de ${totalSaving}%)`);
}

async function run() {
    try {
        await processDirectory('categories', 'categories');
        await processDirectory('equipaments', 'equipments');
        console.log('\n✨ Todas as imagens foram convertidas e enviadas para o Supabase Storage com sucesso!\n');
    } catch (err) {
        console.error('❌ Erro durante o processo:', err);
    }
}

run();
