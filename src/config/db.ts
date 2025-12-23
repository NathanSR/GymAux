import Dexie, { type Table } from 'dexie';
import { Exercise, TrainingLog, User, Workout } from './types';

// --- Configuração do Banco ---

export class GymDatabase extends Dexie {
    users!: Table<User>;
    exercises!: Table<Exercise>;
    workouts!: Table<Workout>;
    history!: Table<TrainingLog>;

    constructor() {
        super('GymAppDB');

        // Definimos os índices (campos que usaremos no .where() ou .orderBy())
        this.version(1).stores({
            users: '++id, name',
            exercises: '++id, name, category, *tags', // * significa que podemos buscar dentro do array de tags
            workouts: '++id, userId, name',
            history: '++id, userId, date, workoutId'
        });
    }
}

export const db = new GymDatabase();