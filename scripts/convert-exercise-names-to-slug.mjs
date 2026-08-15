import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fkoppszkihbgpsottpfq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrb3Bwc3praWhiZ3Bzb3R0cGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzE5MTQsImV4cCI6MjA4OTg0NzkxNH0.3NYOpPale6Nrv9gbJHcgoSAu8zX3Yap2B8PH5dIXHfg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SEEDS_DIR = path.join(process.cwd(), 'src', 'config', 'seeds');

const SEED_FILES = [
    { file: 'chest.ts', constName: 'CHEST_EXERCISES' },
    { file: 'back.ts', constName: 'BACK_EXERCISES' },
    { file: 'shoulders.ts', constName: 'SHOULDERS_EXERCISES' },
    { file: 'biceps.ts', constName: 'BICEPS_EXERCISES' },
    { file: 'triceps.ts', constName: 'TRICEPS_EXERCISES' },
    { file: 'forearms.ts', constName: 'FOREARM_EXERCISES' },
    { file: 'quadriceps.ts', constName: 'QUADRICEPS_EXERCISES' },
    { file: 'hamstrings.ts', constName: 'HAMSTRING_EXERCISES' },
    { file: 'glutes.ts', constName: 'GLUTE_EXERCISES' },
    { file: 'calves.ts', constName: 'CALF_EXERCISES' },
    { file: 'adductors.ts', constName: 'ADDUCTOR_EXERCISES' },
    { file: 'abductors.ts', constName: 'ABDUCTOR_EXERCISES' },
    { file: 'core.ts', constName: 'CORE_EXERCISES' },
    { file: 'cardio.ts', constName: 'CARDIO_EXERCISES' },
    { file: 'stretching.ts', constName: 'STRETCHING_EXERCISES' },
    { file: 'fullBody.ts', constName: 'FULL_BODY_EXERCISES' }
];

function toSnakeCase(str) {
    if (!str) return '';
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

async function convertSeeds() {
    console.log('🔄 Iniciando conversão dos nomes de exercícios para snake_case em inglês...');

    let totalExercises = 0;
    const allConverted = [];

    for (const { file, constName } of SEED_FILES) {
        const filePath = path.join(SEEDS_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.warn(`Arquivo não encontrado: ${filePath}`);
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const jsonMatch = content.match(/=\s*(\[[\s\S]*\]);/);
        if (!jsonMatch) {
            console.error(`Não foi possível extrair array de ${file}`);
            continue;
        }

        let exercises;
        try {
            exercises = JSON.parse(jsonMatch[1]);
        } catch (e) {
            console.error(`Erro ao fazer parse de ${file}:`, e.message);
            continue;
        }

        for (const ex of exercises) {
            const enName = ex.translations?.en?.name;
            const ptName = ex.translations?.pt?.name || ex.name;
            const slug = toSnakeCase(enName || ex.name);

            // Garante que o translations.pt tem o nome legível antes de trocar
            if (!ex.translations) ex.translations = {};
            if (!ex.translations.pt) ex.translations.pt = { name: ptName };
            if (!ex.translations.en && enName) ex.translations.en = { name: enName };

            // Define o name da raiz como o slug em snake_case
            ex.name = slug;
            totalExercises++;
            allConverted.push({ id: ex.id, slug, enName, ptName });
        }

        const newContent = `import { Exercise } from '../types';\n\nexport const ${constName}: Exercise[] = ${JSON.stringify(exercises, null, 4)};\n`;
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`✅ [${file}]: ${exercises.length} exercícios convertidos.`);
    }

    console.log(`\n🎉 Total de ${totalExercises} exercícios atualizados nos arquivos de seed!`);

    // Atualiza o banco no Supabase
    console.log('\n☁️ Sincronizando com a tabela exercises no Supabase...');
    let supabaseSuccess = 0;
    let supabaseErrors = 0;

    for (const item of allConverted) {
        if (!item.id) continue;
        const { error } = await supabase
            .from('exercises')
            .update({ name: item.slug })
            .eq('id', item.id);

        if (error) {
            supabaseErrors++;
            console.error(`❌ Erro no exercício ID ${item.id} (${item.slug}):`, error.message);
        } else {
            supabaseSuccess++;
        }
    }

    console.log(`\n✨ Concluído! ${supabaseSuccess} atualizados no Supabase, ${supabaseErrors} erros.\n`);
}

convertSeeds();
