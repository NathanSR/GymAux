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
    category: 'Peito' | 'Costas' | 'Pernas' | 'Ombros' | 'Braços' | 'Core';
    tags: string[];    // ex: ['halteres', 'composto']
}

export interface Workout {
    id?: number;
    userId: number;   // Relacionamento com User
    name: string;     // ex: "Treino A - Superior"
    exercises: {
        exerciseId: number;
        sets: number;
        reps: string;
        restTime: number; // em segundos
    }[];
}

export interface TrainingLog {
    id?: number;
    userId: number;
    workoutId: number;
    date: Date;
    workoutName: string;
    exercisesExecuted: {
        name: string;
        sets: {
            reps: number;
            weight: number;
            completed: boolean;
        }[];
    }[];
}