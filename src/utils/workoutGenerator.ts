import { Exercise, ExerciseGroup, Workout, PlannedSet } from '@/config/types';
import { CategoryType, EquipmentType } from '@/config/constants';

export type GeneratorScope = 'today' | 'weekly';
export type GeneratorGoal = 'hypertrophy' | 'strength' | 'endurance';
export type GeneratorLevel = 'beginner' | 'intermediate' | 'advanced';
export type GeneratorEquipmentAccess = 'full_gym' | 'dumbbells_only' | 'bodyweight_only';
export type GeneratorTodayFocus =
    | 'chest_triceps'
    | 'back_biceps'
    | 'legs'
    | 'shoulders_arms'
    | 'upper_body'
    | 'lower_body'
    | 'full_body'
    | 'core_cardio';
export type GeneratorDuration = 'min30' | 'min45' | 'min75';

export interface WorkoutGeneratorParams {
    userId: string;
    scope: GeneratorScope;
    goal: GeneratorGoal;
    level: GeneratorLevel;
    equipmentAccess: GeneratorEquipmentAccess;
    todayFocus?: GeneratorTodayFocus;
    duration?: GeneratorDuration;
    weeklyDays?: number; // 2, 3, 4, 5, 6
    availableExercises: Exercise[];
}

interface MuscleSlot {
    category: CategoryType;
    mechanics: 'compound' | 'isolation';
    preferredTags?: string[];
    priority: number; // Menor número = executado primeiro
}

/**
 * Mapeia os equipamentos permitidos com base no acesso escolhido
 */
const getAllowedEquipments = (access: GeneratorEquipmentAccess): EquipmentType[] => {
    switch (access) {
        case 'bodyweight_only':
            return ['bodyweight', 'none'];
        case 'dumbbells_only':
            return ['dumbbell', 'bodyweight', 'none'];
        case 'full_gym':
        default:
            return [
                'barbell',
                'dumbbell',
                'machine',
                'cable',
                'bodyweight',
                'smith',
                'kettlebell',
                'band',
                'plate',
                'medicine_ball',
                'jump_rope',
                'ab_wheel',
                'none'
            ];
    }
};

/**
 * Configuração de Séries, Repetições e Descanso com base no objetivo e mecânica
 */
const getSetTemplate = (
    goal: GeneratorGoal,
    level: GeneratorLevel,
    mechanics: 'compound' | 'isolation'
): { setsCount: number; reps: number; restTime: number } => {
    if (goal === 'strength') {
        if (mechanics === 'compound') {
            const setsCount = level === 'beginner' ? 3 : level === 'intermediate' ? 4 : 5;
            return { setsCount, reps: 5, restTime: 150 };
        } else {
            return { setsCount: 3, reps: 8, restTime: 90 };
        }
    }

    if (goal === 'endurance') {
        if (mechanics === 'compound') {
            return { setsCount: 3, reps: 14, restTime: 60 };
        } else {
            return { setsCount: 3, reps: 16, restTime: 45 };
        }
    }

    // Default: Hypertrophy
    if (mechanics === 'compound') {
        const setsCount = level === 'beginner' ? 3 : 4;
        return { setsCount, reps: 10, restTime: 90 };
    } else {
        const setsCount = level === 'beginner' ? 3 : 3;
        return { setsCount, reps: 12, restTime: 60 };
    }
};

/**
 * Seleciona o melhor exercício correspondente a um slot fisiológico
 */
const selectExerciseForSlot = (
    slot: MuscleSlot,
    candidates: Exercise[],
    alreadySelectedIds: Set<number>,
    level: GeneratorLevel
): Exercise | null => {
    // Filtra por categoria e mecânica que ainda não foram escolhidos
    let pool = candidates.filter(ex => {
        if (!ex.id || alreadySelectedIds.has(ex.id)) return false;
        const matchesCategory = ex.category === slot.category || ex.secondaryMuscles?.includes(slot.category);
        const matchesMechanics = ex.mechanics === slot.mechanics;
        return matchesCategory && matchesMechanics;
    });

    // Se não encontrou compatibilidade exata de mecânica, tenta apenas categoria
    if (pool.length === 0) {
        pool = candidates.filter(ex => {
            if (!ex.id || alreadySelectedIds.has(ex.id)) return false;
            return ex.category === slot.category;
        });
    }

    if (pool.length === 0) return null;

    // Se iniciante, prioriza beginner/intermediate
    if (level === 'beginner') {
        const beginnerPool = pool.filter(ex => ex.level !== 'advanced');
        if (beginnerPool.length > 0) pool = beginnerPool;
    }

    // Se houver preferredTags (ex: horizontal, vertical, incline)
    if (slot.preferredTags && slot.preferredTags.length > 0) {
        const taggedPool = pool.filter(ex => {
            const t = (ex.tags || []).map(tag => tag.toLowerCase());
            const n = ex.name.toLowerCase();
            return slot.preferredTags!.some(pt => t.includes(pt.toLowerCase()) || n.includes(pt.toLowerCase()));
        });
        if (taggedPool.length > 0) pool = taggedPool;
    }

    // Seleciona o primeiro ou sorteia entre os melhores
    const selected = pool[Math.floor(Math.random() * Math.min(pool.length, 3))];
    return selected;
};

/**
 * Constrói a estrutura ExerciseGroup do GymAux para um exercício selecionado
 */
const createExerciseGroup = (
    exercise: Exercise,
    goal: GeneratorGoal,
    level: GeneratorLevel
): ExerciseGroup => {
    const mechanics = exercise.mechanics || 'compound';
    const config = getSetTemplate(goal, level, mechanics);

    const plannedSets: PlannedSet[] = Array.from({ length: config.setsCount }).map(() => ({
        reps: config.reps,
        restTime: config.restTime,
        technique: 'normal',
    }));

    return {
        id: crypto.randomUUID(),
        groupType: 'straight',
        rounds: 1,
        restBetweenRounds: 0,
        restAfterGroup: config.restTime,
        exercises: [
            {
                exerciseId: exercise.id!,
                exerciseName: exercise.name,
                sets: plannedSets,
                restAfterExercise: 0,
                executionMode: exercise.executionMode || 'bilateral',
                variation: exercise.equipment || 'none',
            },
        ],
    };
};

/**
 * Retorna os slots fisiológicos para um treino avulso com base no foco e duração
 */
const getTodaySlots = (focus: GeneratorTodayFocus, duration: GeneratorDuration): MuscleSlot[] => {
    const slotsMap: Record<GeneratorTodayFocus, MuscleSlot[]> = {
        chest_triceps: [
            { category: 'chest', mechanics: 'compound', preferredTags: ['reto', 'barbell', 'halter', 'press'], priority: 1 },
            { category: 'chest', mechanics: 'compound', preferredTags: ['inclinado', 'incline'], priority: 2 },
            { category: 'chest', mechanics: 'isolation', preferredTags: ['crucifixo', 'voador', 'crossover'], priority: 3 },
            { category: 'shoulders', mechanics: 'isolation', preferredTags: ['lateral', 'elevação'], priority: 4 },
            { category: 'triceps', mechanics: 'isolation', preferredTags: ['corda', 'polia', 'pulley'], priority: 5 },
            { category: 'triceps', mechanics: 'isolation', preferredTags: ['testa', 'frances', 'overhead'], priority: 6 },
            { category: 'core', mechanics: 'isolation', priority: 7 },
        ],
        back_biceps: [
            { category: 'back', mechanics: 'compound', preferredTags: ['puxada', 'barra fixa', 'lat pulldown', 'vertical'], priority: 1 },
            { category: 'back', mechanics: 'compound', preferredTags: ['remada', 'row', 'horizontal'], priority: 2 },
            { category: 'back', mechanics: 'isolation', preferredTags: ['pullover', 'crucifixo invertido'], priority: 3 },
            { category: 'shoulders', mechanics: 'isolation', preferredTags: ['posterior', 'rear delt'], priority: 4 },
            { category: 'biceps', mechanics: 'isolation', preferredTags: ['rosca direta', 'barra', 'halter'], priority: 5 },
            { category: 'biceps', mechanics: 'isolation', preferredTags: ['martelo', 'hammer', 'scott'], priority: 6 },
            { category: 'forearms', mechanics: 'isolation', priority: 7 },
        ],
        legs: [
            { category: 'quadriceps', mechanics: 'compound', preferredTags: ['agachamento', 'squat', 'leg press'], priority: 1 },
            { category: 'hamstrings', mechanics: 'compound', preferredTags: ['stiff', 'rdl', 'terra', 'deadlift'], priority: 2 },
            { category: 'quadriceps', mechanics: 'isolation', preferredTags: ['extensora', 'leg extension'], priority: 3 },
            { category: 'hamstrings', mechanics: 'isolation', preferredTags: ['flexora', 'leg curl'], priority: 4 },
            { category: 'glutes', mechanics: 'compound', preferredTags: ['elevacao pelvica', 'hip thrust', 'afundo'], priority: 5 },
            { category: 'calves', mechanics: 'isolation', preferredTags: ['panturrilha', 'calf'], priority: 6 },
            { category: 'core', mechanics: 'isolation', priority: 7 },
        ],
        shoulders_arms: [
            { category: 'shoulders', mechanics: 'compound', preferredTags: ['desenvolvimento', 'press'], priority: 1 },
            { category: 'shoulders', mechanics: 'isolation', preferredTags: ['elevação lateral', 'lateral raise'], priority: 2 },
            { category: 'shoulders', mechanics: 'isolation', preferredTags: ['posterior', 'crucifixo inverso'], priority: 3 },
            { category: 'biceps', mechanics: 'isolation', preferredTags: ['rosca', 'curl'], priority: 4 },
            { category: 'triceps', mechanics: 'isolation', preferredTags: ['triceps', 'pushdown'], priority: 5 },
            { category: 'biceps', mechanics: 'isolation', preferredTags: ['martelo', 'inclinado'], priority: 6 },
            { category: 'triceps', mechanics: 'isolation', preferredTags: ['testa', 'frances'], priority: 7 },
        ],
        upper_body: [
            { category: 'chest', mechanics: 'compound', preferredTags: ['supino', 'press'], priority: 1 },
            { category: 'back', mechanics: 'compound', preferredTags: ['puxada', 'pulldown'], priority: 2 },
            { category: 'shoulders', mechanics: 'compound', preferredTags: ['desenvolvimento'], priority: 3 },
            { category: 'back', mechanics: 'compound', preferredTags: ['remada', 'row'], priority: 4 },
            { category: 'chest', mechanics: 'isolation', preferredTags: ['crucifixo', 'voador'], priority: 5 },
            { category: 'triceps', mechanics: 'isolation', priority: 6 },
            { category: 'biceps', mechanics: 'isolation', priority: 7 },
        ],
        lower_body: [
            { category: 'quadriceps', mechanics: 'compound', preferredTags: ['agachamento', 'leg press'], priority: 1 },
            { category: 'hamstrings', mechanics: 'compound', preferredTags: ['stiff', 'rdl'], priority: 2 },
            { category: 'quadriceps', mechanics: 'isolation', preferredTags: ['extensora'], priority: 3 },
            { category: 'hamstrings', mechanics: 'isolation', preferredTags: ['flexora'], priority: 4 },
            { category: 'glutes', mechanics: 'isolation', priority: 5 },
            { category: 'calves', mechanics: 'isolation', priority: 6 },
            { category: 'core', mechanics: 'isolation', priority: 7 },
        ],
        full_body: [
            { category: 'quadriceps', mechanics: 'compound', preferredTags: ['agachamento', 'leg press'], priority: 1 },
            { category: 'chest', mechanics: 'compound', preferredTags: ['supino', 'press'], priority: 2 },
            { category: 'back', mechanics: 'compound', preferredTags: ['puxada', 'remada'], priority: 3 },
            { category: 'hamstrings', mechanics: 'compound', preferredTags: ['stiff', 'flexora'], priority: 4 },
            { category: 'shoulders', mechanics: 'isolation', preferredTags: ['elevação lateral'], priority: 5 },
            { category: 'biceps', mechanics: 'isolation', priority: 6 },
            { category: 'triceps', mechanics: 'isolation', priority: 7 },
            { category: 'core', mechanics: 'isolation', priority: 8 },
        ],
        core_cardio: [
            { category: 'core', mechanics: 'compound', preferredTags: ['prancha', 'plank'], priority: 1 },
            { category: 'cardio', mechanics: 'compound', priority: 2 },
            { category: 'core', mechanics: 'isolation', preferredTags: ['crunch', 'abdominal'], priority: 3 },
            { category: 'cardio', mechanics: 'isolation', priority: 4 },
            { category: 'core', mechanics: 'isolation', preferredTags: ['infra', 'elevação de pernas'], priority: 5 },
            { category: 'stretching', mechanics: 'isolation', priority: 6 },
        ],
    };

    const allSlots = slotsMap[focus] || slotsMap.full_body;

    // Limita o número de exercícios pela duração
    const limit = duration === 'min30' ? 4 : duration === 'min45' ? 6 : 8;
    return allSlots.slice(0, limit);
};

/**
 * Define as rotinas e slots de divisões semanais (PPL, Upper/Lower, FullBody)
 */
interface RoutineDayDefinition {
    name: string;
    description: string;
    slots: MuscleSlot[];
}

const getWeeklySplitDefinitions = (days: number): RoutineDayDefinition[] => {
    switch (days) {
        case 2:
            return [
                {
                    name: 'Treino A - Full Body (Força & Base)',
                    description: 'Estímulo completo com foco em agachamento, supino e puxada vertical',
                    slots: [
                        { category: 'quadriceps', mechanics: 'compound', priority: 1 },
                        { category: 'chest', mechanics: 'compound', priority: 2 },
                        { category: 'back', mechanics: 'compound', priority: 3 },
                        { category: 'hamstrings', mechanics: 'isolation', priority: 4 },
                        { category: 'shoulders', mechanics: 'isolation', priority: 5 },
                        { category: 'core', mechanics: 'isolation', priority: 6 },
                    ],
                },
                {
                    name: 'Treino B - Full Body (Posterior & Densidade)',
                    description: 'Estímulo completo com foco em posterior, remada e braços',
                    slots: [
                        { category: 'hamstrings', mechanics: 'compound', priority: 1 },
                        { category: 'back', mechanics: 'compound', priority: 2 },
                        { category: 'chest', mechanics: 'compound', priority: 3 },
                        { category: 'quadriceps', mechanics: 'isolation', priority: 4 },
                        { category: 'biceps', mechanics: 'isolation', priority: 5 },
                        { category: 'triceps', mechanics: 'isolation', priority: 6 },
                    ],
                },
            ];

        case 3:
            return [
                {
                    name: 'Treino A - Push (Peito, Ombro & Tríceps)',
                    description: 'Foco total na cadeia anterior de empurrar',
                    slots: [
                        { category: 'chest', mechanics: 'compound', priority: 1 },
                        { category: 'chest', mechanics: 'compound', priority: 2 },
                        { category: 'shoulders', mechanics: 'compound', priority: 3 },
                        { category: 'shoulders', mechanics: 'isolation', priority: 4 },
                        { category: 'triceps', mechanics: 'isolation', priority: 5 },
                        { category: 'triceps', mechanics: 'isolation', priority: 6 },
                    ],
                },
                {
                    name: 'Treino B - Pull (Costas, Deltoide Posterior & Bíceps)',
                    description: 'Foco na cadeia posterior de puxar e pegada',
                    slots: [
                        { category: 'back', mechanics: 'compound', priority: 1 },
                        { category: 'back', mechanics: 'compound', priority: 2 },
                        { category: 'back', mechanics: 'isolation', priority: 3 },
                        { category: 'shoulders', mechanics: 'isolation', priority: 4 },
                        { category: 'biceps', mechanics: 'isolation', priority: 5 },
                        { category: 'biceps', mechanics: 'isolation', priority: 6 },
                    ],
                },
                {
                    name: 'Treino C - Legs & Core (Membros Inferiores & Abdômen)',
                    description: 'Quadríceps, posterior, glúteos, panturrilhas e abdômen',
                    slots: [
                        { category: 'quadriceps', mechanics: 'compound', priority: 1 },
                        { category: 'hamstrings', mechanics: 'compound', priority: 2 },
                        { category: 'quadriceps', mechanics: 'isolation', priority: 3 },
                        { category: 'hamstrings', mechanics: 'isolation', priority: 4 },
                        { category: 'calves', mechanics: 'isolation', priority: 5 },
                        { category: 'core', mechanics: 'isolation', priority: 6 },
                    ],
                },
            ];

        case 4:
            return [
                {
                    name: 'Treino A - Upper 1 (Superiores - Foco Peito & Puxada)',
                    description: 'Ênfase em supinos e puxadas verticais',
                    slots: [
                        { category: 'chest', mechanics: 'compound', priority: 1 },
                        { category: 'back', mechanics: 'compound', priority: 2 },
                        { category: 'shoulders', mechanics: 'isolation', priority: 3 },
                        { category: 'chest', mechanics: 'isolation', priority: 4 },
                        { category: 'triceps', mechanics: 'isolation', priority: 5 },
                        { category: 'biceps', mechanics: 'isolation', priority: 6 },
                    ],
                },
                {
                    name: 'Treino B - Lower 1 (Inferiores - Foco Quadríceps)',
                    description: 'Ênfase em agachamentos e cadeia anterior de pernas',
                    slots: [
                        { category: 'quadriceps', mechanics: 'compound', priority: 1 },
                        { category: 'hamstrings', mechanics: 'compound', priority: 2 },
                        { category: 'quadriceps', mechanics: 'isolation', priority: 3 },
                        { category: 'calves', mechanics: 'isolation', priority: 4 },
                        { category: 'core', mechanics: 'isolation', priority: 5 },
                    ],
                },
                {
                    name: 'Treino C - Upper 2 (Superiores - Foco Costas & Desenvolvimento)',
                    description: 'Ênfase em remadas horizontais e desenvolvimentos',
                    slots: [
                        { category: 'back', mechanics: 'compound', priority: 1 },
                        { category: 'chest', mechanics: 'compound', priority: 2 },
                        { category: 'shoulders', mechanics: 'compound', priority: 3 },
                        { category: 'back', mechanics: 'isolation', priority: 4 },
                        { category: 'biceps', mechanics: 'isolation', priority: 5 },
                        { category: 'triceps', mechanics: 'isolation', priority: 6 },
                    ],
                },
                {
                    name: 'Treino D - Lower 2 (Inferiores - Foco Posterior & Glúteos)',
                    description: 'Ênfase em stiff/RDL, glúteos e flexão de joelho',
                    slots: [
                        { category: 'hamstrings', mechanics: 'compound', priority: 1 },
                        { category: 'quadriceps', mechanics: 'compound', priority: 2 },
                        { category: 'hamstrings', mechanics: 'isolation', priority: 3 },
                        { category: 'glutes', mechanics: 'isolation', priority: 4 },
                        { category: 'calves', mechanics: 'isolation', priority: 5 },
                    ],
                },
            ];

        case 5:
        case 6:
        default:
            return [
                {
                    name: 'Treino A - Push (Peito, Ombro & Tríceps)',
                    description: 'Foco em cadeia de empurrar',
                    slots: [
                        { category: 'chest', mechanics: 'compound', priority: 1 },
                        { category: 'chest', mechanics: 'compound', priority: 2 },
                        { category: 'shoulders', mechanics: 'compound', priority: 3 },
                        { category: 'shoulders', mechanics: 'isolation', priority: 4 },
                        { category: 'triceps', mechanics: 'isolation', priority: 5 },
                    ],
                },
                {
                    name: 'Treino B - Pull (Costas & Bíceps)',
                    description: 'Foco em dorsais, trapézio e bíceps',
                    slots: [
                        { category: 'back', mechanics: 'compound', priority: 1 },
                        { category: 'back', mechanics: 'compound', priority: 2 },
                        { category: 'shoulders', mechanics: 'isolation', priority: 3 },
                        { category: 'biceps', mechanics: 'isolation', priority: 4 },
                        { category: 'biceps', mechanics: 'isolation', priority: 5 },
                    ],
                },
                {
                    name: 'Treino C - Legs (Pernas Completo)',
                    description: 'Quadríceps, posterior e panturrilha',
                    slots: [
                        { category: 'quadriceps', mechanics: 'compound', priority: 1 },
                        { category: 'hamstrings', mechanics: 'compound', priority: 2 },
                        { category: 'quadriceps', mechanics: 'isolation', priority: 3 },
                        { category: 'hamstrings', mechanics: 'isolation', priority: 4 },
                        { category: 'calves', mechanics: 'isolation', priority: 5 },
                    ],
                },
                {
                    name: 'Treino D - Upper (Superiores Geral & Core)',
                    description: 'Estímulo metabólico de superiores',
                    slots: [
                        { category: 'chest', mechanics: 'compound', priority: 1 },
                        { category: 'back', mechanics: 'compound', priority: 2 },
                        { category: 'shoulders', mechanics: 'isolation', priority: 3 },
                        { category: 'triceps', mechanics: 'isolation', priority: 4 },
                        { category: 'biceps', mechanics: 'isolation', priority: 5 },
                        { category: 'core', mechanics: 'isolation', priority: 6 },
                    ],
                },
                {
                    name: 'Treino E - Lower (Inferiores & Glúteos)',
                    description: 'Estímulo complementar de inferiores',
                    slots: [
                        { category: 'quadriceps', mechanics: 'compound', priority: 1 },
                        { category: 'hamstrings', mechanics: 'compound', priority: 2 },
                        { category: 'glutes', mechanics: 'compound', priority: 3 },
                        { category: 'calves', mechanics: 'isolation', priority: 4 },
                        { category: 'core', mechanics: 'isolation', priority: 5 },
                    ],
                },
            ];
    }
};

/**
 * Função Principal de Geração Automática
 */
export const WorkoutGenerator = {
    /**
     * Gera treinos (seja 1 avulso ou múltiplos para a rotina semanal)
     */
    generate(params: WorkoutGeneratorParams): Workout[] {
        const {
            userId,
            scope,
            goal,
            level,
            equipmentAccess,
            todayFocus = 'chest_triceps',
            duration = 'min45',
            weeklyDays = 3,
            availableExercises,
        } = params;

        const allowedEquipments = getAllowedEquipments(equipmentAccess);

        // Filtra exercícios que batem estritamente com os equipamentos permitidos
        const filteredPool = availableExercises.filter(ex => {
            if (!ex.equipment || ex.equipment === 'none') return true;
            return allowedEquipments.includes(ex.equipment);
        });

        // Caso 1: Treino de Hoje
        if (scope === 'today') {
            const slots = getTodaySlots(todayFocus, duration);
            // Ordena slots estritamente: compostos primeiro, prioridade crescente
            slots.sort((a, b) => {
                if (a.mechanics !== b.mechanics) {
                    return a.mechanics === 'compound' ? -1 : 1;
                }
                return a.priority - b.priority;
            });

            const selectedIds = new Set<number>();
            const groups: ExerciseGroup[] = [];

            for (const slot of slots) {
                const ex = selectExerciseForSlot(slot, filteredPool, selectedIds, level);
                if (ex && ex.id) {
                    selectedIds.add(ex.id);
                    groups.push(createExerciseGroup(ex, goal, level));
                }
            }

            const focusNames: Record<GeneratorTodayFocus, string> = {
                chest_triceps: 'Peito & Tríceps',
                back_biceps: 'Costas & Bíceps',
                legs: 'Pernas & Glúteos',
                shoulders_arms: 'Ombros & Braços',
                upper_body: 'Superiores Completo',
                lower_body: 'Inferiores Completo',
                full_body: 'Full Body',
                core_cardio: 'Abdômen & Cardio',
            };

            const workoutName = `${focusNames[todayFocus] || 'Treino'} (${duration.replace('min', '')}min)`;

            return [
                {
                    id: crypto.randomUUID(),
                    userId,
                    createdBy: userId,
                    createdByType: 'user',
                    name: workoutName,
                    description: `Treino gerado automaticamente com foco em ${focusNames[todayFocus]} (${goal}).`,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    exercises: groups,
                },
            ];
        }

        // Caso 2: Rotina Semanal Completa
        const splitDefs = getWeeklySplitDefinitions(weeklyDays);
        const workouts: Workout[] = [];

        for (const def of splitDefs) {
            const selectedIds = new Set<number>();
            const groups: ExerciseGroup[] = [];

            // Ordena slots: compostos primeiro
            const sortedSlots = [...def.slots].sort((a, b) => {
                if (a.mechanics !== b.mechanics) {
                    return a.mechanics === 'compound' ? -1 : 1;
                }
                return a.priority - b.priority;
            });

            for (const slot of sortedSlots) {
                const ex = selectExerciseForSlot(slot, filteredPool, selectedIds, level);
                if (ex && ex.id) {
                    selectedIds.add(ex.id);
                    groups.push(createExerciseGroup(ex, goal, level));
                }
            }

            workouts.push({
                id: crypto.randomUUID(),
                userId,
                createdBy: userId,
                createdByType: 'user',
                name: def.name,
                description: `${def.description} — Objetivo: ${goal}`,
                createdAt: new Date(),
                updatedAt: new Date(),
                exercises: groups,
            });
        }

        return workouts;
    },
};
