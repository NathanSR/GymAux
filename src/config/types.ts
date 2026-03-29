// --- Interfaces para o TypeScript ---
// --- Modelagem Profissional de Treinos com ExerciseGroups ---

import { CATEGORIES } from "./constants";

// ========================
// BASE ENTITIES
// ========================

export interface User {
    id?: string;
    gymauxId?: string;
    name: string;
    avatar?: string | null;
    weight: number;
    height: number;
    goal?: string;
    role: 'user' | 'trainer' | 'admin';
    createdAt: Date;
}

export type CategoryType = (typeof CATEGORIES)[number];

export interface Exercise {
    id?: number;
    created_by?: string;
    created_by_type: "user" | "system" | "trainer";
    name: string;
    description?: string;
    category: CategoryType;
    tags?: string[];
    howTo?: string;
    mediaUrl?: string;
    level?: "beginner" | "intermediate" | "advanced";
}

// ========================
// WORKOUT PLANNING — Técnicas & Tipos
// ========================

/** Técnicas avançadas de série */
export type SetTechnique =
    | 'normal'
    | 'drop_set'
    | 'rest_pause'
    | 'forced_reps'
    | 'negative'
    | 'isometric'
    | 'tempo'
    | 'cluster'
    | 'to_failure';

/** Tipos de agrupamento de exercícios */
export type GroupType =
    | 'straight'    // Exercício solo (séries retas)
    | 'bi_set'      // 2 exercícios alternados
    | 'tri_set'     // 3 exercícios alternados
    | 'giant_set'   // 4+ exercícios alternados
    | 'circuit'     // Circuito com rounds
    | 'superset';   // Agonista/antagonista

// ========================
// WORKOUT PLANNING — Estruturas
// ========================

/** Configuração de uma série individual (planejamento) */
export interface PlannedSet {
    reps: number;              // Repetições planejadas (0 = até falha)
    weight?: number;           // Peso planejado (kg)
    restTime: number;          // Descanso APÓS esta série (segundos)
    technique?: SetTechnique;  // Técnica especial (default: 'normal')
    notes?: string;            // Nota para esta série (ex: "3-1-2-0 tempo")
}

/** Exercício dentro de um grupo (planejamento) */
export interface WorkoutExercise {
    exerciseId: number;
    exerciseName: string;
    sets: PlannedSet[];         // Cada série é configurada individualmente
    restAfterExercise: number;  // Descanso após este exercício dentro do grupo (seg)
    notes?: string;
}

/** Grupo de exercícios — unidade de organização do treino */
export interface ExerciseGroup {
    groupType: GroupType;
    rounds: number;              // Vezes para repetir o grupo (1 = normal; >1 = circuit)
    restBetweenRounds: number;   // Descanso entre rounds (seg)
    restAfterGroup: number;      // Descanso após o grupo inteiro, antes do próximo grupo (seg)
    exercises: WorkoutExercise[];
    notes?: string;
}

// ========================
// WORKOUT
// ========================

export interface Workout {
    id?: string;
    userId: string;
    createdBy?: string;
    createdByType?: "user" | "system" | "trainer";
    name: string;
    createdAt: Date;
    exercises: ExerciseGroup[];
    description?: string;
}

// ========================
// EXECUTION — Séries & Exercícios executados (Sessão / Histórico)
// ========================

/** Série executada (registrada na sessão) */
export interface ExecutedSet {
    reps: number;
    weight?: number;
    rpe?: number;              // Rate of Perceived Exertion (1-10)
    skipped?: boolean;
    technique?: SetTechnique;
    notes?: string;
}

/** Exercício executado */
export interface ExecutedExercise {
    exerciseId: number;
    exerciseName: string;
    sets: ExecutedSet[];
}

/** Grupo executado */
export interface ExecutedGroup {
    groupType: GroupType;
    exercises: ExecutedExercise[];
}

// ========================
// SCHEDULE
// ========================

export interface Schedule {
    id?: string;
    name: string;
    userId: string;
    createdBy?: string;
    createdByType?: "user" | "system" | "trainer";
    workouts: (string | null)[];
    startDate: Date;
    endDate?: Date;
    active: boolean;
    lastCompleted?: number;
}

// ========================
// HISTORY
// ========================

export interface History {
    id?: string;
    userId: string;
    workoutId: string;
    workoutName: string;
    date: Date;
    executions?: ExecutedGroup[];
    weight?: number;
    description?: string;
    duration?: number;
    endDate?: Date;
    usingCreatine?: boolean;
}

// ========================
// SESSION
// ========================

export interface Session {
    id?: string;
    userId: string;
    workoutId: string;
    workoutName: string;
    createdAt: Date;
    exercisesToDo: ExerciseGroup[];
    exercisesDone: ExecutedGroup[];
    current: {
        step: 'executing' | 'resting' | 'completion';
        groupIndex: number;     // Índice do grupo atual
        exerciseIndex: number;  // Índice do exercício dentro do grupo
        setIndex: number;       // Índice da série
        roundIndex: number;     // Round atual (para circuits)
    };
    duration: number;
    pausedAt: Date | null;
    resumedAt: Date | null;
}

// ========================
// CONNECTION
// ========================

export interface ConnectionPermissions {
    manage_workouts: boolean;
    manage_schedules: boolean;
    view_history: boolean;
    view_sessions: boolean;
}

export type ConnectionStatus = 'pending' | 'active' | 'revoked';

export interface Connection {
    id: string;
    trainer_id: string;
    student_id: string;
    status: ConnectionStatus;
    permissions: ConnectionPermissions;
    created_at: string;
    updated_at: string;

}