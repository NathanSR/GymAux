import { toBlob } from 'html-to-image';

/**
 * Converte um elemento DOM (card do treino) em um Blob de imagem PNG em alta resolução.
 */
export async function generateWorkoutImageBlob(element: HTMLElement): Promise<Blob> {
    try {
        const blob = await toBlob(element, {
            pixelRatio: 2,
            cacheBust: false,
            backgroundColor: '#09090b', // zinc-950
            imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
            style: {
                transform: 'scale(1)',
                transformOrigin: 'top left'
            }
        });

        if (!blob) {
            throw new Error('Falha ao gerar o Blob da imagem');
        }

        return blob;
    } catch (error) {
        console.error('[shareUtil] Erro ao gerar imagem do treino:', error);
        throw error;
    }
}

/**
 * Tenta compartilhar a imagem do treino utilizando a Web Share API nativa.
 * Retorna true se compartilhado com sucesso ou false se não for suportado/cancelado.
 */
export async function shareWorkoutImageFile(
    file: File,
    title: string = 'GymAux - Meu Treino Finalizado',
    text: string = 'Treino concluído com sucesso no GymAux! 💪🔥'
): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.share) {
        return false;
    }

    try {
        const shareData = {
            title,
            text,
            files: [file]
        };

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share(shareData);
            return true;
        }

        return false;
    } catch (error: any) {
        if (error?.name === 'AbortError') {
            // Usuário fechou a gaveta de compartilhamento
            return false;
        }
        console.warn('[shareUtil] Web Share API falhou:', error);
        return false;
    }
}

/**
 * Copia a imagem (Blob) para a área de transferência do sistema.
 */
export async function copyImageToClipboard(blob: Blob): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.clipboard || !window.ClipboardItem) {
        return false;
    }

    try {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        return true;
    } catch (error) {
        console.error('[shareUtil] Erro ao copiar imagem para clipboard:', error);
        return false;
    }
}

/**
 * Realiza o download direto da imagem no navegador.
 */
export function downloadImageBlob(blob: Blob, filename: string = 'gymaux-treino.png'): void {
    if (typeof window === 'undefined') return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}

import { Session, History } from '@/config/types';
import { WorkoutShareData, ShareExerciseItem, ShareExerciseGroup } from '@/components/share/WorkoutShareCard';
import { safeParseArray, safeParseObject, safeParseNumber } from '@/utils/jsonUtil';

export function mapSessionToShareData(session: Session, userWeight?: number): WorkoutShareData {
    if (!session) {
        return {
            workoutName: 'Treino Finalizado',
            date: new Date(),
            duration: 0,
            weight: userWeight,
            exercises: [],
            groups: []
        };
    }

    const exercises: ShareExerciseItem[] = [];
    const groups: ShareExerciseGroup[] = [];
    let totalVolume = 0;

    const rawGroups = safeParseArray(session.exercisesDone);
    rawGroups.forEach((g: any) => {
        const group = safeParseObject(g);
        const groupType = group.groupType || 'straight';
        const groupExercises: ShareExerciseItem[] = [];

        const exercisesList = safeParseArray(group.exercises);
        exercisesList.forEach((e: any) => {
            const ex = safeParseObject(e);
            const setsList = safeParseArray(ex.sets);
            const validSets = setsList.filter((s: any) => !s?.skipped);
            let bestWeight = 0;
            let bestReps = 0;
            let hasDropset = false;
            let mainTechnique: string | undefined = undefined;

            validSets.forEach((st: any) => {
                const s = safeParseObject(st);
                const w = safeParseNumber(s.weight, 0);
                const r = safeParseNumber(s.reps, 0);
                totalVolume += w * r;
                if (w > bestWeight) bestWeight = w;
                if (r > bestReps) bestReps = r;

                if (s.technique && s.technique !== 'normal') {
                    mainTechnique = s.technique;
                }

                const dropsetList = safeParseArray(s.dropset);
                if (s.technique === 'drop_set' || dropsetList.length > 0) {
                    hasDropset = true;
                    dropsetList.forEach((d: any) => {
                        const drop = safeParseObject(d);
                        totalVolume += safeParseNumber(drop.weight, 0) * safeParseNumber(drop.reps, 0);
                    });
                }
            });

            if (validSets.length > 0) {
                const item: ShareExerciseItem = {
                    name: ex.exerciseName || 'Exercício',
                    setsCount: validSets.length,
                    bestWeight: bestWeight > 0 ? bestWeight : undefined,
                    bestReps: bestReps > 0 ? bestReps : undefined,
                    hasDropset,
                    technique: mainTechnique,
                    groupType
                };
                groupExercises.push(item);
                exercises.push(item);
            }
        });

        if (groupExercises.length > 0) {
            groups.push({
                groupType,
                exercises: groupExercises
            });
        }
    });

    const rawDate = session?.createdAt ? new Date(session.createdAt) : new Date();
    const validDate = isNaN(rawDate.getTime()) ? new Date() : rawDate;

    return {
        workoutName: session.workoutName || 'Treino Finalizado',
        date: validDate,
        duration: session.duration || 0,
        weight: userWeight,
        totalVolume: totalVolume > 0 ? Math.round(totalVolume) : undefined,
        exercises,
        groups
    };
}

export function mapHistoryToShareData(history: History): WorkoutShareData {
    if (!history) {
        return {
            workoutName: 'Treino Finalizado',
            date: new Date(),
            duration: 0,
            exercises: [],
            groups: []
        };
    }

    const exercises: ShareExerciseItem[] = [];
    const groups: ShareExerciseGroup[] = [];
    let totalVolume = 0;

    const rawGroups = safeParseArray(history.executions);
    rawGroups.forEach((g: any) => {
        const group = safeParseObject(g);
        const groupType = group.groupType || 'straight';
        const groupExercises: ShareExerciseItem[] = [];

        const exercisesList = safeParseArray(group.exercises);
        exercisesList.forEach((e: any) => {
            const ex = safeParseObject(e);
            const setsList = safeParseArray(ex.sets);
            const validSets = setsList.filter((s: any) => !s?.skipped);
            let bestWeight = 0;
            let bestReps = 0;
            let hasDropset = false;
            let mainTechnique: string | undefined = undefined;

            validSets.forEach((st: any) => {
                const s = safeParseObject(st);
                const w = safeParseNumber(s.weight, 0);
                const r = safeParseNumber(s.reps, 0);
                totalVolume += w * r;
                if (w > bestWeight) bestWeight = w;
                if (r > bestReps) bestReps = r;

                if (s.technique && s.technique !== 'normal') {
                    mainTechnique = s.technique;
                }

                const dropsetList = safeParseArray(s.dropset);
                if (s.technique === 'drop_set' || dropsetList.length > 0) {
                    hasDropset = true;
                    dropsetList.forEach((d: any) => {
                        const drop = safeParseObject(d);
                        totalVolume += safeParseNumber(drop.weight, 0) * safeParseNumber(drop.reps, 0);
                    });
                }
            });

            if (validSets.length > 0) {
                const item: ShareExerciseItem = {
                    name: ex.exerciseName || 'Exercício',
                    setsCount: validSets.length,
                    bestWeight: bestWeight > 0 ? bestWeight : undefined,
                    bestReps: bestReps > 0 ? bestReps : undefined,
                    hasDropset,
                    technique: mainTechnique,
                    groupType
                };
                groupExercises.push(item);
                exercises.push(item);
            }
        });

        if (groupExercises.length > 0) {
            groups.push({
                groupType,
                exercises: groupExercises
            });
        }
    });

    const rawDate = history?.date ? new Date(history.date) : new Date();
    const validDate = isNaN(rawDate.getTime()) ? new Date() : rawDate;

    return {
        workoutName: history.workoutName || 'Treino Finalizado',
        date: validDate,
        duration: history.duration || 0,
        weight: history.weight,
        totalVolume: totalVolume > 0 ? Math.round(totalVolume) : undefined,
        exercises,
        groups
    };
}


