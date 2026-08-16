import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fkoppszkihbgpsottpfq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrb3Bwc3praWhiZ3Bzb3R0cGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzE5MTQsImV4cCI6MjA4OTg0NzkxNH0.3NYOpPale6Nrv9gbJHcgoSAu8zX3Yap2B8PH5dIXHfg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SEEDS_DIR = path.join(process.cwd(), 'src', 'config', 'seeds');
const SEED_FILES = [
    'chest.ts', 'back.ts', 'shoulders.ts', 'biceps.ts', 'triceps.ts',
    'forearms.ts', 'quadriceps.ts', 'hamstrings.ts', 'glutes.ts', 'calves.ts',
    'adductors.ts', 'abductors.ts', 'core.ts', 'cardio.ts', 'stretching.ts', 'fullBody.ts'
];

async function syncViaRpc() {
    console.log('🔄 Carregando todos os exercícios dos arquivos de seed...');
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

    console.log(`📦 Total de ${allExercises.length} exercícios encontrados.`);

    const chunkSize = 50;
    let totalUpdated = 0;

    for (let i = 0; i < allExercises.length; i += chunkSize) {
        const chunk = allExercises.slice(i, i + chunkSize);
        console.log(`🚀 Enviando lote ${Math.floor(i / chunkSize) + 1}/${Math.ceil(allExercises.length / chunkSize)} (${chunk.length} exercícios)...`);
        
        const { data, error } = await supabase.rpc('bulk_sync_exercises', {
            p_exercises: chunk
        });

        if (error) {
            console.error(`❌ Erro no lote:`, error);
        } else {
            console.log(`   ✅ Sucesso! ${data} exercícios sincronizados neste lote.`);
            totalUpdated += data;
        }
    }

    console.log(`\n🎉 Sincronização completa! Total de ${totalUpdated} exercícios atualizados no banco de dados Supabase!\n`);
}

syncViaRpc();
