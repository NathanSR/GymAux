// --- Interfaces para o TypeScript ---

export interface User {
    id?: number;
    name: string;
    avatar?: string; // Base64 ou URL
    weight: number;  // em kg
    height: number;  // em cm
    goal?: string;
    createdAt: Date;
}

export interface Exercise {
    id?: number;
    name: string;
    description: string;
    mediaUrl?: string; // Link para GIF ou vídeo educativo
    category: "chest" | "back" | "legs" | "shoulders" | "arms" | "core" | "cardio";
    tags: string[];    // ex: ['halteres', 'composto']
}

export interface Workout {
    id?: number;
    userId: number;
    name: string;
    createdAt: Date;
    exercises: {
        exerciseId: number;      // ID do exercício na tabela 'exercises'
        exerciseName: string;
        sets: number;
        reps: number;
        restTime: number;        // em segundos
    }[];
    description?: string;
}

export interface Schedule {
    id?: number;
    name: string;
    userId: number;
    workouts: (number | null)[]; // Cada índice representa um dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
    startDate: Date;
    endDate?: Date;
    active: boolean;
    lastCompleted: number; // Index do último treino completado em workouts
}

export interface History {
    id?: number;
    userId: number;
    workoutId: number;
    workoutName: string; // Snapshot do nome para caso o Workout original mude
    date: Date;
    executions?: {
        exerciseId: number;
        exerciseName: string; // Snapshot do nome
        sets: {
            reps: number;
            weight?: number;
            rpe?: number; // Rate of Perceived Exertion (1-10)
            completed: boolean;
        }[];
    }[];
    weight?: number; // peso do usuário no dia do treino
    description?: string;
    completed?: boolean;
}