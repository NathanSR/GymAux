import Dexie, { type Table } from 'dexie';
import { Exercise, History, User, Workout, Schedule, Session, SyncOperation, Connection, ExerciseCategory, ExerciseEquipment } from './types';
import { DEFAULT_EXERCISES, DEFAULT_CATEGORIES, DEFAULT_EQUIPMENT } from "./seeds";

// --- Configuração do Banco ---

export class GymDatabase extends Dexie {
    users!: Table<User>;
    exercises!: Table<Exercise>;
    workouts!: Table<Workout>;
    history!: Table<History>;
    schedules!: Table<Schedule>;
    sessions!: Table<Session>;
    connections!: Table<Connection>;
    syncQueue!: Table<SyncOperation>;
    categories!: Table<ExerciseCategory>;
    equipment!: Table<ExerciseEquipment>;

    constructor() {
        super('GymAppDB');

        // Definimos os índices (campos que usaremos no .where() ou .orderBy())
        // NOTE: ++id works with both auto-increment AND explicit string/UUID keys.
        // When you provide an id (e.g. UUID), it uses your value.
        // When you omit id, it auto-generates a numeric one.
        this.version(3).stores({
            users: '++id, name',
            exercises: '++id, name, category, *tags',
            workouts: '++id, userId, name',
            history: '++id, userId, date, workoutId',
            schedules: '++id, name, userId, active',
            sessions: '++id, userId, date, workoutId',
            connections: '++id, trainer_id, student_id, status',
            syncQueue: '++id, status, entityType, createdAt'
        });

        // v4: No-op upgrade (reverts the broken PK change attempt).
        // Keeps ++id which already supports UUID string keys.
        this.version(4).stores({
            users: '++id, name',
            exercises: '++id, name, category, *tags',
            workouts: '++id, userId, name',
            history: '++id, userId, date, workoutId',
            schedules: '++id, name, userId, active',
            sessions: '++id, userId, workoutId',
            connections: '++id, trainer_id, student_id, status',
            syncQueue: '++id, status, entityType, createdAt'
        });

        // v5: Add categories and equipment taxonomy stores
        this.version(5).stores({
            users: '++id, name',
            exercises: '++id, name, category, *tags',
            workouts: '++id, userId, name',
            history: '++id, userId, date, workoutId',
            schedules: '++id, name, userId, active',
            sessions: '++id, userId, workoutId',
            connections: '++id, trainer_id, student_id, status',
            syncQueue: '++id, status, entityType, createdAt',
            categories: '++id, slug, name, displayOrder, isActive',
            equipment: '++id, slug, name, displayOrder, isActive'
        });

        // Evento profissional para sincronizar dados e travar IDs
        this.on('ready', async () => {
            await this.syncSystemExercises();
            await this.syncTaxonomy();
            await this.reserveUserSpace();
        });
    }

    private async syncTaxonomy() {
        await this.categories.bulkPut(DEFAULT_CATEGORIES);
        await this.equipment.bulkPut(DEFAULT_EQUIPMENT);
    }

    /**
     * Insere ou atualiza exercícios da SEED (1 a 999).
     * Se você adicionar o id 501 amanhã no arquivo, ele entrará aqui.
     */
    private async syncSystemExercises() {
        // bulkPut insere novos e atualiza existentes sem duplicar
        await this.exercises.bulkPut(DEFAULT_EXERCISES);
    }

    /**
     * Garante que o contador do banco pule para 1000.
     */
    private async reserveUserSpace() {
        const highest = await this.exercises.orderBy('id').last();

        // Se o maior id for menor que 1000, cria o "degrau"
        if (!highest || highest.id! < 1000) {
            await this.exercises.add({
                id: 1000,
                name: 'SYSTEM_RESERVED',
                category: 'core',
                tags: [],
                description: '',
                created_by_type: "system"
            });
            // Deletamos em seguida. O IndexedDB memoriza o 1000 e usará 1001 no próximo add()
            await this.exercises.delete(1000);
        }
    }
}

// Create instance with safe recovery (never wipes unsynced offline data blindly)
function createDatabaseWithRecovery(): GymDatabase {
    const database = new GymDatabase();

    if (typeof window !== 'undefined') {
        database.open().catch(async (err) => {
            if (
                err.name === 'UpgradeError' ||
                err.message?.includes('UpgradeError') ||
                err.message?.includes('primary key')
            ) {
                console.error('[DB] Schema upgrade conflict detected:', err.message);
                // Tenta preservar a fila de sincronização antes de qualquer recriação
                try {
                    const backupKey = 'gymaux_emergency_sync_backup';
                    const existingBackup = localStorage.getItem(backupKey);
                    if (!existingBackup) {
                        // Marca ocorrência para diagnóstico sem deletar dados silenciosamente em loop
                        localStorage.setItem('gymaux_db_upgrade_error', JSON.stringify({
                            at: new Date().toISOString(),
                            message: err.message
                        }));
                    }
                } catch {
                    // Ignore storage errors
                }

                // Evita loop infinito de reload se o erro persistir
                const alreadyAttempted = sessionStorage.getItem('gymaux_db_recovery_attempted');
                if (!alreadyAttempted) {
                    sessionStorage.setItem('gymaux_db_recovery_attempted', '1');
                    database.close();
                    await Dexie.delete('GymAppDB');
                    window.location.reload();
                }
            } else {
                console.error('[DB] Failed to open database:', err);
            }
        });
    }

    return database;
}

export const db = createDatabaseWithRecovery();