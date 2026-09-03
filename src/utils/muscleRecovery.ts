import { CategoryType } from '@/config/constants';
import { History, Exercise } from '@/config/types';

/**
 * Lista estrita de grupos musculares anatômicos.
 * Categorias não-musculares (ex: cardio, full_body, stretching) são excluídas.
 */
export const MUSCLE_GROUPS = [
    'chest',
    'back',
    'shoulders',
    'biceps',
    'triceps',
    'forearms',
    'quadriceps',
    'hamstrings',
    'glutes',
    'calves',
    'adductors',
    'abductors',
    'core',
] as const;

export type MuscleGroup = typeof MUSCLE_GROUPS[number];

/** Classificação do estado de recuperação */
export type RecoveryState = 'recovered' | 'recovering' | 'fatigued';

export interface MuscleTriggerExercise {
    exerciseId?: number;
    exerciseName: string;
    setsCount: number;
    isPrimary: boolean;
    trainedAt: Date;
}

export interface MuscleRecoveryItem {
    category: MuscleGroup;
    /** Porcentagem de recuperação de 0 a 100 */
    percentage: number;
    /** Estado fisiológico categorizado */
    state: RecoveryState;
    /** Data do estímulo mais recente que afetou este músculo */
    lastTrainedAt: Date | null;
    /** Horas decorridas desde o último treino (null se não treinado recentemente) */
    hoursSinceLastTrained: number | null;
    /** Horas estimadas restantes para recuperação plena (0 se 100%) */
    estimatedHoursRemaining: number;
    /** Volume acumulado de séries equivalentes nos últimos 7 dias */
    totalEffectiveSets: number;
    /** Exercícios recentes que ativaram este músculo */
    recentExercises: MuscleTriggerExercise[];
    /** Classificação anatômica de porte */
    isLargeMuscle: boolean;
}

export interface MuscleRecoverySummary {
    /** Média geral ponderada de prontidão muscular (0 a 100) */
    overallPercentage: number;
    /** Lista detalhada de todos os 13 grupos musculares ordenados por necessidade de atenção */
    muscles: MuscleRecoveryItem[];
    /** Quantidade de músculos totalmente recuperados (>= 90%) */
    recoveredCount: number;
    /** Quantidade de músculos em recuperação intermediária (65% - 89%) */
    recoveringCount: number;
    /** Quantidade de músculos em fadiga/repouso crítico (< 65%) */
    fatiguedCount: number;
    /** Grupos prioritários para treinar hoje (100% recuperados) */
    readyToTrain: MuscleGroup[];
    /** Grupos que devem ser poupados hoje (em repouso/fadiga) */
    needsRest: MuscleGroup[];
}

/**
 * Músculos de grande porte que demandam maior tempo de reparo tecidual.
 */
const LARGE_MUSCLES: readonly CategoryType[] = [
    'chest',
    'back',
    'shoulders',
    'quadriceps',
    'hamstrings',
    'glutes',
];

/**
 * Retorna o tempo base de recuperação (em horas) com base no tamanho do músculo e volume de séries efetivas.
 */
function calculateRequiredRecoveryHours(isLarge: boolean, effectiveSets: number): number {
    if (effectiveSets <= 0) return 0;

    if (isLarge) {
        // Músculo grande:
        // Leve (1-4 séries): ~36h a 42h
        // Moderado (5-10 séries): ~48h a 60h
        // Intenso (11-16 séries): ~60h a 72h
        // Extremo (>16 séries): até 84h
        const base = 36;
        const additional = Math.min(effectiveSets * 2.8, 48);
        return Math.min(84, Math.round(base + additional));
    } else {
        // Músculo pequeno:
        // Leve (1-4 séries): ~24h a 30h
        // Moderado (5-8 séries): ~36h a 44h
        // Intenso (9-14 séries): ~48h a 56h
        // Extremo (>14 séries): até 60h
        const base = 24;
        const additional = Math.min(effectiveSets * 2.2, 36);
        return Math.min(60, Math.round(base + additional));
    }
}

/**
 * Calcula a curva de prontidão (0 a 100%) dado o tempo decorrido e o tempo total de recuperação necessário.
 */
function computeRecoveryPercentage(hoursElapsed: number, requiredHours: number, effectiveSets: number): number {
    if (requiredHours <= 0 || hoursElapsed >= requiredHours) {
        return 100;
    }

    // Nível inicial de prontidão logo após o término do treino (t = 0):
    // Varia de 15% (treino muito pesado) a 45% (treino bem leve)
    const initialReadiness = Math.max(15, 50 - (effectiveSets * 2.5));
    const progressRatio = Math.min(1, Math.max(0, hoursElapsed / requiredHours));

    // Curva suave de síntese proteica e restauração energética
    const recoveredDelta = (100 - initialReadiness) * Math.pow(progressRatio, 1.05);
    const finalPercentage = Math.round(initialReadiness + recoveredDelta);

    return Math.min(100, Math.max(0, finalPercentage));
}

/**
 * Algoritmo Fisiológico Local-First:
 * Computa o descanso de cada um dos 13 grupos musculares anatômicos com base no histórico recente.
 */
export function calculateMuscleRecovery(
    historyList: History[] = [],
    exercises: Exercise[] = [],
    now: Date = new Date()
): MuscleRecoverySummary {
    const nowTime = now.getTime();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    // Cria mapa de busca rápida de exercícios por ID
    const exerciseMap = new Map<number, Exercise>();
    for (const ex of exercises) {
        if (ex.id !== undefined) {
            exerciseMap.set(ex.id, ex);
        }
    }

    // Filtra históricos dos últimos 7 dias que tenham data válida
    const recentHistory = historyList.filter(h => {
        const rawDate = h.endDate || h.date;
        if (!rawDate) return false;
        const time = new Date(rawDate).getTime();
        return !isNaN(time) && nowTime - time <= SEVEN_DAYS_MS && time <= nowTime;
    });

    // Estrutura acumuladora temporária para cada grupo muscular
    interface MuscleAccumulator {
        effectiveSets: number;
        lastTrainedAt: Date | null;
        exercises: MuscleTriggerExercise[];
    }

    const accumulators: Record<MuscleGroup, MuscleAccumulator> = Object.fromEntries(
        MUSCLE_GROUPS.map(group => [
            group,
            { effectiveSets: 0, lastTrainedAt: null, exercises: [] }
        ])
    ) as unknown as Record<MuscleGroup, MuscleAccumulator>;

    // Analisa cada treino do mais recente para o mais antigo ou ponderando o tempo
    for (const hist of recentHistory) {
        const workoutDate = new Date(hist.endDate || hist.date);
        const hoursAgo = (nowTime - workoutDate.getTime()) / (1000 * 60 * 60);

        if (!hist.executions || !Array.isArray(hist.executions)) continue;

        for (const group of hist.executions) {
            if (!group?.exercises || !Array.isArray(group.exercises)) continue;

            for (const executedEx of group.exercises) {
                const exMeta = exerciseMap.get(executedEx.exerciseId);
                if (!exMeta) continue;

                // Conta apenas séries válidas (não puladas)
                const validSetsCount = (executedEx.sets || []).filter(s => !s.skipped).length;
                if (validSetsCount <= 0) continue;

                // Fator de decaimento temporal do estímulo no acúmulo de volume:
                // Estímulos ocorridos há mais de 4 dias têm peso reduzido no volume acumulado
                const timeDecay = Math.max(0.2, 1 - (hoursAgo / 168));

                // 1. Músculo Primário
                const primaryCategory = exMeta.category as MuscleGroup;
                if (MUSCLE_GROUPS.includes(primaryCategory)) {
                    const acc = accumulators[primaryCategory];
                    acc.effectiveSets += validSetsCount * 1.0 * timeDecay;
                    if (!acc.lastTrainedAt || workoutDate.getTime() > acc.lastTrainedAt.getTime()) {
                        acc.lastTrainedAt = workoutDate;
                    }
                    acc.exercises.push({
                        exerciseId: executedEx.exerciseId,
                        exerciseName: executedEx.exerciseName || exMeta.name,
                        setsCount: validSetsCount,
                        isPrimary: true,
                        trainedAt: workoutDate,
                    });
                }

                // 2. Músculos Secundários (Sinergistas com 40% do estímulo)
                if (exMeta.secondaryMuscles && Array.isArray(exMeta.secondaryMuscles)) {
                    for (const secCat of exMeta.secondaryMuscles) {
                        const secGroup = secCat as MuscleGroup;
                        if (MUSCLE_GROUPS.includes(secGroup) && secGroup !== primaryCategory) {
                            const acc = accumulators[secGroup];
                            acc.effectiveSets += validSetsCount * 0.4 * timeDecay;
                            if (!acc.lastTrainedAt || workoutDate.getTime() > acc.lastTrainedAt.getTime()) {
                                acc.lastTrainedAt = workoutDate;
                            }
                            acc.exercises.push({
                                exerciseId: executedEx.exerciseId,
                                exerciseName: executedEx.exerciseName || exMeta.name,
                                setsCount: validSetsCount,
                                isPrimary: false,
                                trainedAt: workoutDate,
                            });
                        }
                    }
                }
            }
        }
    }

    // Calcula os itens finais para os 13 grupos musculares
    const muscles: MuscleRecoveryItem[] = MUSCLE_GROUPS.map(group => {
        const acc = accumulators[group];
        const isLarge = LARGE_MUSCLES.includes(group);

        // Se nunca foi treinado recentemente, está 100% recuperado
        if (!acc.lastTrainedAt || acc.effectiveSets <= 0) {
            return {
                category: group,
                percentage: 100,
                state: 'recovered',
                lastTrainedAt: null,
                hoursSinceLastTrained: null,
                estimatedHoursRemaining: 0,
                totalEffectiveSets: 0,
                recentExercises: [],
                isLargeMuscle: isLarge,
            };
        }

        const hoursElapsed = Math.max(0, (nowTime - acc.lastTrainedAt.getTime()) / (1000 * 60 * 60));
        const requiredHours = calculateRequiredRecoveryHours(isLarge, acc.effectiveSets);
        const percentage = computeRecoveryPercentage(hoursElapsed, requiredHours, acc.effectiveSets);

        const hoursRemaining = percentage >= 100
            ? 0
            : Math.max(0, Math.round(requiredHours - hoursElapsed));

        let state: RecoveryState = 'recovered';
        if (percentage < 65) {
            state = 'fatigued';
        } else if (percentage < 90) {
            state = 'recovering';
        }

        // Deduplica e ordena os exercícios recentes
        const uniqueExercisesMap = new Map<string, MuscleTriggerExercise>();
        for (const ex of acc.exercises) {
            const key = ex.exerciseId ? `id-${ex.exerciseId}` : ex.exerciseName;
            const existing = uniqueExercisesMap.get(key);
            if (existing) {
                existing.setsCount += ex.setsCount;
            } else {
                uniqueExercisesMap.set(key, { ...ex });
            }
        }

        const sortedRecentExercises = Array.from(uniqueExercisesMap.values())
            .sort((a, b) => b.trainedAt.getTime() - a.trainedAt.getTime());

        return {
            category: group,
            percentage,
            state,
            lastTrainedAt: acc.lastTrainedAt,
            hoursSinceLastTrained: Math.round(hoursElapsed),
            estimatedHoursRemaining: hoursRemaining,
            totalEffectiveSets: Math.round(acc.effectiveSets * 10) / 10,
            recentExercises: sortedRecentExercises,
            isLargeMuscle: isLarge,
        };
    });

    // Ordena: primeiro os músculos que mais precisam de atenção (menor percentual),
    // depois os totalmente descansados
    muscles.sort((a, b) => a.percentage - b.percentage);

    // Contadores e métricas agregadas
    const recovered = muscles.filter(m => m.percentage >= 90);
    const recovering = muscles.filter(m => m.percentage >= 65 && m.percentage < 90);
    const fatigued = muscles.filter(m => m.percentage < 65);

    const overallPercentage = Math.round(
        muscles.reduce((sum, m) => sum + m.percentage, 0) / muscles.length
    );

    const readyToTrain = recovered.map(m => m.category);
    const needsRest = [...fatigued, ...recovering].map(m => m.category);

    return {
        overallPercentage,
        muscles,
        recoveredCount: recovered.length,
        recoveringCount: recovering.length,
        fatiguedCount: fatigued.length,
        readyToTrain,
        needsRest,
    };
}
