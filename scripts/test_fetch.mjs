import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('c:\\Users\\NathanSR\\Projects\\gymaux-app\\.env.local', 'utf-8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const supabaseKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();
const serviceKey = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim();

const adminSupabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
});

async function run() {
    const userId = 'b1a902b6-e963-4630-87d9-108100d7b110';
    console.log('Generating link for teste@teste.com:');
    const { data, error } = await adminSupabase.auth.admin.generateLink({
        type: 'magiclink',
        email: 'teste@teste.com'
    });
    console.log('Generated token_hash/data:', data ? 'SUCCESS' : error);

    // Now test client with the user's access token
    const client = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false }
    });
    const { data: sessionData, error: sessionErr } = await client.auth.verifyOtp({
        token_hash: data.properties.hashed_token,
        type: 'magiclink'
    });
    console.log('Session user:', sessionData?.user?.id, 'Error:', sessionErr);

    if (sessionData?.session) {
        console.log('Testing authenticated fetch:');
        const { data: userProfile, error: uErr } = await client.from('profiles').select('*').eq('id', userId).maybeSingle();
        console.log('User profile fetch:', userProfile?.name, userProfile?.email, 'Error:', uErr);

        const { data: userWorkouts, error: wErr } = await client.from('workouts').select('*').eq('user_id', userId);
        console.log('User workouts count:', userWorkouts?.length, 'Error:', wErr);

        const { data: userSchedules, error: sErr } = await client.from('schedules').select('*').eq('user_id', userId);
        console.log('User schedules count:', userSchedules?.length, 'Error:', sErr);
    }
}

run();
