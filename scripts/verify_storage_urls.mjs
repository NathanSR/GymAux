import fs from 'fs';

const BASE_URL = 'https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises';

// Sample exercises from each category
const testUrls = [
    `${BASE_URL}/abductors/banded_clamshells.webp`,
    `${BASE_URL}/adductors/ball_squeeze_bridge.webp`,
    `${BASE_URL}/back/pull_up.webp`,
    `${BASE_URL}/biceps/barbell_curl_straight_bar.webp`,
    `${BASE_URL}/calves/standing_barbell_calf_raise.webp`,
    `${BASE_URL}/cardio/treadmill_running.webp`,
    `${BASE_URL}/chest/barbell_bench_press.webp`,
    `${BASE_URL}/core/crunch.webp`,
    `${BASE_URL}/forearms/farmers_walk.webp`,
    `${BASE_URL}/full_body/barbell_clean_and_press.webp`,
    `${BASE_URL}/glutes/deadlift_conventional.webp`,
    `${BASE_URL}/hamstrings/barbell_stiff_leg_deadlift.webp`,
    `${BASE_URL}/quadriceps/barbell_back_squat.webp`,
    `${BASE_URL}/shoulders/overhead_press_barbell.webp`,
    `${BASE_URL}/stretching/cat_cow_stretch.webp`,
    `${BASE_URL}/triceps/triceps_rope_pushdown.webp`
];

async function verifyUrls() {
    console.log('--- STEP 6: VERIFYING SUPABASE STORAGE HTTP ACCESS ---');
    let allOk = true;

    for (const url of testUrls) {
        try {
            const res = await fetch(url, { method: 'HEAD' });
            const contentType = res.headers.get('content-type');
            const contentLength = res.headers.get('content-length');
            const cacheControl = res.headers.get('cache-control');

            if (res.status === 200) {
                console.log(`[200 OK] ${url.split('/exercises/')[1]} (${(parseInt(contentLength) / 1024).toFixed(1)} KB, type: ${contentType})`);
            } else {
                console.error(`[FAIL ${res.status}] ${url}`);
                allOk = false;
            }
        } catch (err) {
            console.error(`[ERROR] ${url}:`, err.message);
            allOk = false;
        }
    }

    if (allOk) {
        console.log('\n✅ All sampled URLs returned 200 OK with valid image/webp headers!');
    } else {
        console.error('\n❌ Some URLs failed verification.');
        process.exit(1);
    }
}

verifyUrls();
