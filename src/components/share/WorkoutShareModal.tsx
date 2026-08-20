'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Share2, Download, Copy, Loader2, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import { WorkoutShareCard, WorkoutShareData } from './WorkoutShareCard';
import {
    generateWorkoutImageBlob,
    shareWorkoutImageFile,
    copyImageToClipboard,
    downloadImageBlob
} from '@/utils/shareUtil';
import { toast } from 'react-toastify';

interface WorkoutShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: WorkoutShareData | null;
}

export function WorkoutShareModal({ isOpen, onClose, data }: WorkoutShareModalProps) {
    const t = useTranslations('Share');
    const cardRef = useRef<HTMLDivElement>(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const activeData: WorkoutShareData = data || {
        workoutName: t('workoutCompleted'),
        date: new Date(),
        duration: 0,
        exercises: [],
        groups: []
    };

    const dataKey = useMemo(() => {
        if (!data) return '';
        return `${data.workoutName}-${new Date(data.date).getTime()}-${data.exercises?.length || 0}`;
    }, [data?.workoutName, data?.date, data?.exercises?.length]);

    // Cleanup de URLs de objeto de preview para evitar memory leaks
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Gerar a imagem quando o modal for aberto
    useEffect(() => {
        if (!isOpen) {
            setImageBlob(null);
            setPreviewUrl(null);
            setCopied(false);
            return;
        }

        let isMounted = true;

        const processImage = async () => {
            try {
                setIsGenerating(true);
                // Pequeno delay para garantir que o DOM do cardRef foi completamente renderizado com estilos e imagens
                await new Promise((res) => setTimeout(res, 250));

                if (!cardRef.current || !isMounted) return;

                const blob = await generateWorkoutImageBlob(cardRef.current);
                if (!isMounted) return;

                const createdUrl = URL.createObjectURL(blob);
                setImageBlob(blob);
                setPreviewUrl(createdUrl);
            } catch (err) {
                console.error('[WorkoutShareModal] Erro ao gerar preview da imagem:', err);
                toast.error(t('shareError'));
            } finally {
                if (isMounted) {
                    setIsGenerating(false);
                }
            }
        };

        processImage();

        return () => {
            isMounted = false;
        };
    }, [isOpen, dataKey, t]);

    if (!isOpen) return null;

    const handleShare = async () => {
        if (!imageBlob) return;

        const file = new File([imageBlob], `gymaux-${Date.now()}.png`, { type: 'image/png' });
        const shareTitle = t.has('shareTitle') ? t('shareTitle', { workout: activeData.workoutName }) : `GymAux - ${activeData.workoutName}`;
        const shareText = t.has('shareText') ? t('shareText', { workout: activeData.workoutName }) : `GymAux • ${activeData.workoutName}`;

        const shared = await shareWorkoutImageFile(
            file,
            shareTitle,
            shareText
        );

        if (shared) {
            toast.success(t('sharedSuccess'));
        } else {
            // Fallback: cópia ou download direto
            const copiedSuccess = await copyImageToClipboard(imageBlob);
            if (copiedSuccess) {
                toast.info(t('imageCopied'));
            } else {
                downloadImageBlob(imageBlob, `gymaux-${activeData.workoutName.toLowerCase().replace(/\s+/g, '-')}.png`);
                toast.success(t('imageDownloaded'));
            }
        }
    };

    const handleCopy = async () => {
        if (!imageBlob) return;
        const success = await copyImageToClipboard(imageBlob);
        if (success) {
            setCopied(true);
            toast.success(t('imageCopied'));
            setTimeout(() => setCopied(false), 2500);
        } else {
            toast.error(t('shareError'));
        }
    };

    const handleDownload = () => {
        if (!imageBlob) return;
        const filename = `gymaux-${activeData.workoutName.toLowerCase().replace(/\s+/g, '-')}.png`;
        downloadImageBlob(imageBlob, filename);
        toast.success(t('imageDownloaded'));
    };

    return (
        <>
            {/* Elemento Oculto Renderizado para Captura de Alta Definição do html-to-image */}
            <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none z-[-1]">
                <WorkoutShareCard ref={cardRef} data={activeData} />
            </div>

            {/* Modal Interativo de Preview & Ações */}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={t('shareModalTitle')}
                maxWidth="max-w-md"
                zIndex="z-[250]"
            >
                <div className="p-5 sm:p-6 space-y-5 flex flex-col items-center">
                    {/* Área de Preview da Imagem Gerada (Adaptável à Altura Real com Teto 9:16) */}
                    <div className="w-full flex items-center justify-center min-h-[220px] max-h-[500px] bg-zinc-900/60 rounded-[28px] border border-zinc-800/80 p-3 overflow-hidden relative shadow-inner">
                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center space-y-3 py-16 text-zinc-400">
                                <Loader2 className="w-8 h-8 animate-spin text-lime-400" />
                                <span className="text-xs font-bold uppercase tracking-wider">{t('generatingCard')}</span>
                            </div>
                        ) : previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="GymAux Workout Share Card"
                                className="max-h-[460px] w-auto max-w-full object-contain rounded-2xl shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-300"
                            />
                        ) : (
                            <div className="text-xs text-zinc-500">{t('shareError')}</div>
                        )}
                    </div>

                    {/* Botões de Ação */}
                    <div className="w-full space-y-2.5 pt-1">
                        <button
                            type="button"
                            onClick={handleShare}
                            disabled={isGenerating || !imageBlob}
                            className="w-full py-3.5 bg-lime-400 text-zinc-950 rounded-[20px] font-black uppercase tracking-wider text-xs hover:bg-lime-500 transition-all shadow-lg shadow-lime-500/10 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>{t('shareViaApp')}</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={isGenerating || !imageBlob}
                                className="py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-[18px] font-extrabold uppercase tracking-wider text-[11px] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-zinc-700/50"
                            >
                                <Download className="w-4 h-4 text-lime-400" />
                                <span>{t('saveToGallery')}</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleCopy}
                                disabled={isGenerating || !imageBlob}
                                className="py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-[18px] font-extrabold uppercase tracking-wider text-[11px] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-zinc-700/50"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-lime-400" />
                                        <span>{t('copied')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 text-lime-400" />
                                        <span>{t('copyImage')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
