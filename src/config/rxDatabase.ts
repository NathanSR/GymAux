import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import {
    userSchema,
    exerciseSchema,
    workoutSchema,
    scheduleSchema,
    historySchema,
    sessionSchema,
    connectionSchema
} from './rxSchema';

// Registrar plugins globais do RxDB
addRxPlugin(RxDBQueryBuilderPlugin);

// Garantir modo desenvolvimento se aplicável
if (process.env.NODE_ENV === 'development') {
    try {
        const { RxDBDevModePlugin } = require('rxdb/plugins/dev-mode');
        addRxPlugin(RxDBDevModePlugin);
    } catch (e) {
        console.warn('[RxDB] DevMode plugin not found, skipping.');
    }
}

let dbPromise: Promise<RxDatabase> | null = null;

async function initDatabase(): Promise<RxDatabase> {
    let storage = getRxStorageDexie();
    
    if (process.env.NODE_ENV === 'development') {
        try {
            const { wrappedValidateAjvStorage } = require('rxdb/plugins/validate-ajv');
            storage = wrappedValidateAjvStorage({ storage });
        } catch (e) {
            console.warn('[RxDB] validate-ajv storage wrapper not found, skipping validation.');
        }
    }

    const db = await createRxDatabase({
        name: 'gymauxdb_rx',
        storage
    });

    // Registrar coleções
    await db.addCollections({
        users: { schema: userSchema },
        exercises: { schema: exerciseSchema },
        workouts: { schema: workoutSchema },
        schedules: { schema: scheduleSchema },
        history: { schema: historySchema },
        sessions: { schema: sessionSchema },
        connections: { schema: connectionSchema }
    });

    // Seeding de exercícios padrões (do sistema)
    try {
        const count = await db.exercises.count().exec();
        if (count === 0) {
            const { DEFAULT_EXERCISES } = await import('./seedExercises');
            // Mapeia os exercícios do sistema com id em formato String para o RxDB
            const mappedExercises = DEFAULT_EXERCISES.map((ex: any) => ({
                ...ex,
                id: String(ex.id),
                updated_at: new Date().toISOString()
            }));
            await db.exercises.bulkInsert(mappedExercises);
            console.log('[RxDB] Exercícios do sistema semeados com sucesso.');
        }
    } catch (err) {
        console.error('[RxDB] Erro no seeding de exercícios:', err);
    }

    return db;
}

export function getDatabase(): Promise<RxDatabase> {
    if (typeof window === 'undefined') {
        // Rejeita imediatamente no lado do servidor para evitar travamento da thread do Next.js
        return Promise.reject(new Error('RxDB cannot be initialized on the server.'));
    }
    if (!dbPromise) {
        dbPromise = initDatabase();
    }
    return dbPromise;
}
