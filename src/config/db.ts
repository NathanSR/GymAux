import Dexie, { type Table } from 'dexie';
import { Exercise, History, User, Workout, Schedule } from './types';
import { DEFAULT_EXERCISES } from "./seedExercises";

// --- Configuração do Banco ---

export class GymDatabase extends Dexie {
    users!: Table<User>;
    exercises!: Table<Exercise>;
    workouts!: Table<Workout>;
    history!: Table<History>;
    schedules!: Table<Schedule>;

    constructor() {
        super('GymAppDB');

        // Definimos os índices (campos que usaremos no .where() ou .orderBy())
        this.version(1).stores({
            users: '++id, name',
            exercises: '++id, name, category, *tags', // * significa que podemos buscar dentro do array de tags
            workouts: '++id, userId, name',
            history: '++id, userId, date, workoutId',
            schedules: '++id, name, userId, active'
        });

        // Esta lógica roda apenas na criação do banco
        this.on('populate', () => {
            this.populateExercises();
        });
    }

    async populateExercises() {
        try {
            await this.exercises.bulkAdd(DEFAULT_EXERCISES);
            console.log("Banco de dados populado com exercícios iniciais.");
        } catch (error) {
            console.error("Erro ao popular exercícios:", error);
        }
    }
}

export const db = new GymDatabase();