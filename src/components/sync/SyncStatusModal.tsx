'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { SyncManager } from '@/services/syncManager';
import { SyncOperation } from '@/config/types';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useTranslations } from 'next-intl';
import {
    Wifi,
    WifiOff,
    CheckCircle2,
    RefreshCw,
    AlertCircle,
    Clock,
    Dumbbell,
    Calendar,
    User,
    Trash2,
    Layers,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SyncStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SyncStatusModal({ isOpen, onClose }: SyncStatusModalProps) {
    const t = useTranslations('OfflineSync');
    const { isOnline } = useNetworkStatus();
    const [items, setItems] = useState<SyncOperation[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isLoadingItems, setIsLoadingItems] = useState(false);

    const loadItems = useCallback(async () => {
        try {
            setIsLoadingItems(true);
            const queue = await SyncManager.getQueueItems();
            setItems(queue);
        } catch (err) {
            console.error('[SyncStatusModal] Error loading queue items:', err);
        } finally {
            setIsLoadingItems(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            loadItems();
            const interval = setInterval(loadItems, 3000);
            return () => clearInterval(interval);
        }
    }, [isOpen, loadItems]);

    const handleSyncNow = async () => {
        if (isSyncing || !isOnline) return;
        setIsSyncing(true);
        try {
            await SyncManager.retryFailed();
            await SyncManager.processQueue();
            await loadItems();
        } catch (err) {
            console.error('[SyncStatusModal] Manual sync error:', err);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleClearFailed = async () => {
        if (window.confirm(t('clearFailedConfirm') || 'Descartar itens com erro?')) {
            await SyncManager.clearFailedOps();
            await loadItems();
        }
    };

    const getEntityIcon = (type: SyncOperation['entityType']) => {
        switch (type) {
            case 'HISTORY':
                return <Activity className="w-4 h-4 text-lime-400" />;
            case 'SESSION':
                return <Dumbbell className="w-4 h-4 text-emerald-400" />;
            case 'WORKOUT':
                return <Layers className="w-4 h-4 text-sky-400" />;
            case 'SCHEDULE':
                return <Calendar className="w-4 h-4 text-amber-400" />;
            case 'USER':
                return <User className="w-4 h-4 text-purple-400" />;
            default:
                return <Dumbbell className="w-4 h-4 text-zinc-400" />;
        }
    };

    const getEntityLabel = (type: SyncOperation['entityType']) => {
        switch (type) {
            case 'HISTORY':
                return t('entityHistory') || 'Histórico de Treino';
            case 'SESSION':
                return t('entitySession') || 'Sessão de Treino';
            case 'WORKOUT':
                return t('entityWorkout') || 'Treino';
            case 'SCHEDULE':
                return t('entitySchedule') || 'Cronograma';
            case 'EXERCISE':
                return t('entityExercise') || 'Exercício';
            case 'USER':
                return t('entityUser') || 'Perfil';
            default:
                return type;
        }
    };

    const getActionLabel = (action: SyncOperation['action']) => {
        switch (action) {
            case 'CREATE':
                return t('actionCreate') || 'Criação';
            case 'UPDATE':
                return t('actionUpdate') || 'Atualização';
            case 'DELETE':
                return t('actionDelete') || 'Remoção';
            default:
                return action;
        }
    };

    const getItemName = (op: SyncOperation): string => {
        if (op.payload?.workout_name) return op.payload.workout_name;
        if (op.payload?.name) return op.payload.name;
        if (op.payload?.workoutName) return op.payload.workoutName;
        return `${getEntityLabel(op.entityType)} #${String(op.entityId).slice(0, 8)}`;
    };

    const formatRelativeTime = (dateInput?: Date | string) => {
        if (!dateInput) return t('justNow') || 'Agora mesmo';
        const date = new Date(dateInput);
        const diffMs = Date.now() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMin < 1) return t('justNow') || 'Agora mesmo';
        if (diffMin < 60) return t('minutesAgo', { count: diffMin }) || `há ${diffMin} min`;
        if (diffHours < 24) return t('hoursAgo', { count: diffHours }) || `há ${diffHours} h`;
        return t('daysAgo', { count: diffDays }) || `há ${diffDays} d`;
    };

    const pendingCount = items.filter(i => i.status === 'PENDING').length;
    const failedCount = items.filter(i => i.status === 'FAILED').length;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('modalTitle') || 'Central de Sincronização'}
            maxWidth="max-w-lg"
        >
            <div className="p-5 sm:p-6 space-y-5 text-zinc-900 dark:text-white">
                {/* Header Status Banner */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl flex items-center justify-center ${
                            isOnline 
                                ? 'bg-lime-500/15 text-lime-600 dark:text-lime-400' 
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        }`}>
                            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                        </div>
                        <div>
                            <div className="text-sm font-bold flex items-center gap-2">
                                <span>{isOnline ? t('statusOnline') || 'Conectado à Nuvem' : t('statusOffline') || 'Modo Offline'}</span>
                                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-lime-500 animate-pulse' : 'bg-amber-500'}`} />
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {isOnline ? 'Pronto para enviar alterações' : 'Alterações serão salvas localmente'}
                            </p>
                        </div>
                    </div>

                    {isOnline && (
                        <button
                            type="button"
                            onClick={handleSyncNow}
                            disabled={isSyncing}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-zinc-950 text-xs font-black transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                            <span>{isSyncing ? (t('syncingBtn') || 'Sincronizando...') : (t('syncNowBtn') || 'Sincronizar')}</span>
                        </button>
                    )}
                </div>

                {/* Queue Summary / Content */}
                <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            {items.length === 0 ? 'Status da Fila' : t('pendingItemsTitle', { count: items.length }) || `${items.length} alterações na fila`}
                        </h3>
                        {failedCount > 0 && (
                            <button
                                type="button"
                                onClick={handleClearFailed}
                                className="text-xs text-rose-500 hover:text-rose-400 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{t('clearFailedBtn') || 'Limpar com erro'}</span>
                            </button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-10 px-4 text-center rounded-3xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/60 flex flex-col items-center justify-center gap-3"
                        >
                            <div className="w-12 h-12 rounded-full bg-lime-500/10 dark:bg-lime-400/10 text-lime-500 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                                    {t('allSyncedTitle') || 'Tudo em dia!'}
                                </h4>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                                    {t('allSyncedDesc') || 'Todas as suas ações locais já foram sincronizadas com o banco de dados com sucesso.'}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => {
                                    const isFailed = item.status === 'FAILED';
                                    return (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className={`p-3.5 rounded-2xl border transition-all ${
                                                isFailed
                                                    ? 'bg-rose-500/10 border-rose-500/30'
                                                    : 'bg-zinc-100/70 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-3 min-w-0">
                                                    <div className="p-2 rounded-xl bg-zinc-200/70 dark:bg-zinc-700/60 shrink-0 mt-0.5">
                                                        {getEntityIcon(item.entityType)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h5 className="text-sm font-bold truncate text-zinc-900 dark:text-zinc-100">
                                                                {getItemName(item)}
                                                            </h5>
                                                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                                                                {getActionLabel(item.action)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                                            <span>{getEntityLabel(item.entityType)}</span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {formatRelativeTime(item.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    {isFailed ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-500/20 text-rose-500 border border-rose-500/30">
                                                            <AlertCircle className="w-3 h-3" />
                                                            {t('statusFailed') || 'Impedimento'}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-400/20">
                                                            <Clock className="w-3 h-3" />
                                                            {t('statusPending') || 'Pendente'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {isFailed && item.errorMessage && (
                                                <div className="mt-2 pt-2 border-t border-rose-500/20 text-xs text-rose-600 dark:text-rose-400/90 font-mono break-all">
                                                    {item.errorMessage}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
