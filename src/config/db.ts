import Dexie, { type Table } from 'dexie';
import { Exercise, History, User, Workout, Schedule, Session } from './types';
import { DEFAULT_EXERCISES } from "./seedExercises";

// --- Configuração do Banco ---

export class GymDatabase extends Dexie {
    users!: Table<User>;
    exercises!: Table<Exercise>;
    workouts!: Table<Workout>;
    history!: Table<History>;
    schedules!: Table<Schedule>;
    sessions!: Table<Session>;

    constructor() {
        super('GymAppDB');

        // Definimos os índices (campos que usaremos no .where() ou .orderBy())
        this.version(1).stores({
            users: '++id, name',
            exercises: '++id, name, category, *tags', // * significa que podemos buscar dentro do array de tags
            workouts: '++id, userId, name',
            history: '++id, userId, date, workoutId',
            schedules: '++id, name, userId, active',
            sessions: '++id, userId, date, workoutId'
        });

        // Evento profissional para sincronizar dados e travar IDs
        this.on('ready', async () => {
            await this.syncSystemExercises();
            await this.reserveUserSpace();
        });
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
                description: ''
            });
            // Deletamos em seguida. O IndexedDB memoriza o 1000 e usará 1001 no próximo add()
            await this.exercises.delete(1000);
        }
    }
}

export const db = new GymDatabase();