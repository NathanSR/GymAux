import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('c:\\Users\\NathanSR\\Projects\\gymaux-app\\.env.local', 'utf-8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const supabaseKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

const client = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
});

const passwords = ['123456', '12345678', 'teste123', 'teste@123', 'teste1234', 'gymaux123', 'password'];

async function run() {
    for (const p of passwords) {
        const { data, error } = await client.auth.signInWithPassword({
            email: 'teste@teste.com',
            password: p
        });
        if (!error) {
            console.log(`PASSWORD FOUND: "${p}"`);
            return;
        }
    }
    console.log('None of the common passwords matched.');
}

run();
