import { toBlob } from 'html-to-image';

/**
 * Converte um elemento DOM (card do treino) em um Blob de imagem PNG em alta resolução.
 */
export async function generateWorkoutImageBlob(element: HTMLElement): Promise<Blob> {
    try {
        const blob = await toBlob(element, {
            pixelRatio: 2,
            cacheBust: true,
            backgroundColor: '#09090b', // zinc-950
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
import { WorkoutShareData, ShareExerciseItem } from '@/components/share/WorkoutShareCard';

export function mapSessionToShareData(session: Session, userWeight?: number): WorkoutShareData {
    const exercises: ShareExerciseItem[] = [];
    let totalVolume = 0;

    const groups = session.exercisesDone || [];
    groups.forEach((group) => {
        (group.exercises || []).forEach((ex) => {
            const validSets = (ex.sets || []).filter((s) => !s.skipped);
            let bestWeight = 0;
            let bestReps = 0;

            validSets.forEach((s) => {
                const w = s.weight || 0;
                const r = s.reps || 0;
                totalVolume += w * r;
                if (w > bestWeight) bestWeight = w;
                if (r > bestReps) bestReps = r;
            });

            if (validSets.length > 0) {
                exercises.push({
                    name: ex.exerciseName,
                    setsCount: validSets.length,
                    bestWeight: bestWeight > 0 ? bestWeight : undefined,
                    bestReps: bestReps > 0 ? bestReps : undefined
                });
            }
        });
    });

    return {
        workoutName: session.workoutName || 'Treino Finalizado',
        date: session.createdAt || new Date(),
        duration: session.duration || 0,
        weight: userWeight,
        totalVolume: totalVolume > 0 ? Math.round(totalVolume) : undefined,
        exercises
    };
}

export function mapHistoryToShareData(history: History): WorkoutShareData {
    const exercises: ShareExerciseItem[] = [];
    let totalVolume = 0;

    const groups = history.executions || [];
    groups.forEach((group) => {
        (group.exercises || []).forEach((ex) => {
            const validSets = (ex.sets || []).filter((s) => !s.skipped);
            let bestWeight = 0;
            let bestReps = 0;

            validSets.forEach((s) => {
                const w = s.weight || 0;
                const r = s.reps || 0;
                totalVolume += w * r;
                if (w > bestWeight) bestWeight = w;
                if (r > bestReps) bestReps = r;
            });

            if (validSets.length > 0) {
                exercises.push({
                    name: ex.exerciseName,
                    setsCount: validSets.length,
                    bestWeight: bestWeight > 0 ? bestWeight : undefined,
                    bestReps: bestReps > 0 ? bestReps : undefined
                });
            }
        });
    });

    return {
        workoutName: history.workoutName || 'Treino Finalizado',
        date: history.date || new Date(),
        duration: history.duration || 0,
        weight: history.weight,
        totalVolume: totalVolume > 0 ? Math.round(totalVolume) : undefined,
        exercises
    };
}

