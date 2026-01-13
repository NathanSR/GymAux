// --- Interfaces para o TypeScript ---

import { CATEGORIES } from "./constants";

export interface User {
    id?: number;
    name: string;
    avatar?: string; // Base64 ou URL
    weight: number;  // em kg
    height: number;  // em cm
    goal?: string;
    createdAt: Date;
}

export type CategoryType = (typeof CATEGORIES)[number];

export interface Exercise {
    id?: number;
    name: string;
    description?: string;
    category: CategoryType;
    tags?: string[];    // ex: ['halteres', 'composto']
    howTo?: string;
    mediaUrl?: string; // Link para GIF ou vídeo educativo
    level?: "beginner" | "intermediate" | "advanced";
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

// export interface Workout {
//     id?: number;
//     userId: number;
//     name: string;
//     description?: string;
//     createdAt: Date;
//     exerciseGroups: ExerciseGroup[]; 
// }
// export interface ExerciseGroup {
//     restBetweenExercises: number; // Descanso entre ex. do mesmo grupo (ex: Agachamento + Búlgaro)
//     restAfterGroup: number;     // Descanso após terminar o bloco todo
//     exercises: WorkoutExercise[];
// }
// export interface WorkoutExercise {
//     exerciseId: number;
//     exerciseName: string;
//     sets: {
//         reps: number; // "10-12" ou 10
//         weight?: number;       // Peso planejado (opcional)
//         restTime: number;      // Descanso após esta série específica
//     }[];
// }

export interface Schedule {
    id?: number;
    name: string;
    userId: number;
    workouts: (number | null)[]; // Cada índice representa um dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
    startDate: Date;
    endDate?: Date;
    active: boolean;
    lastCompleted?: number; // Index do último treino completado em workouts
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
        }[];
    }[];

    weight?: number; // peso do usuário no dia do treino
    description?: string;
    duration?: number; // em ms
    endDate?: Date;
    usingCreatine?: boolean;
}


export interface Session {
    id?: number;
    userId: number;
    workoutId: number;
    workoutName: string; // Snapshot do nome para caso o Workout original mude
    createdAt: Date;
    exercisesToDo: {
        exerciseId: number;      // ID do exercício na tabela 'exercises'
        exerciseName: string;
        sets: number;
        reps: number;
        restTime: number;        // em segundos
    }[];
    exercisesDone: {
        exerciseId: number;
        exerciseName: string; // Snapshot do nome
        sets: {
            reps: number;
            weight?: number;
            rpe?: number; // Rate of Perceived Exertion (1-10)
        }[];
    }[];
    current: {
        step: 'executing' | 'resting' | 'completion';
        exerciseIndex: number;
        setIndex: number;
    },
    duration: number; //ms
    pausedAt: Date | null;
    resumedAt: Date | null;
}