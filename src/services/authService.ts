import { createClient } from '@/lib/supabase/client';
import { db } from '@/config/db';
import { SyncManager } from './syncManager';
import { withTimeout } from '@/lib/utils/timeout';
import {
    getStoredActiveAuthUserId,
    setStoredActiveAuthUserId,
    clearStoredActiveAuthUserId,
} from '@/utils/activeAuthUser';

export type SignOutProgressStep = 'syncing' | 'clearing' | 'signing_out' | 'redirecting';

export interface SignOutOptions {
    force?: boolean;
    onProgress?: (step: SignOutProgressStep) => void;
}

export interface SignOutResult {
    success: boolean;
    reason?: 'PENDING_OFFLINE_DATA';
    pendingCount?: number;
}

/**
 * Purga os caches de páginas autenticadas (HTML/RSC) do Service Worker para evitar
 * vazamento de telas entre contas diferentes no mesmo dispositivo.
 */
async function clearServiceWorkerAuthCaches(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_AUTH_CACHES' });
        }
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(
                keys
                    .filter(k => k.startsWith('gymaux-html-') || k.startsWith('gymaux-rsc-'))
                    .map(k => caches.delete(k))
            );
        }
    } catch (err) {
        console.warn('[authService] Falha ao limpar caches do Service Worker:', err);
    }
}

/**
 * Serviço de autenticação e isolamento multiusuário seguro para Dexie / Supabase.
 */
export const authService = {
    /**
     * Limpa completamente todos os dados do usuário do armazenamento local (Dexie + localStorage + SW auth cache).
     * Preserva tabelas e dados globais do sistema (exercícios do catálogo 1..999, taxonomias).
     */
    async clearUserData(options?: { preserveSyncQueue?: boolean }): Promise<void> {
        if (typeof window === 'undefined') return;

        try {
            const tasks: Promise<any>[] = [
                db.users.clear(),
                db.workouts.clear(),
                db.history.clear(),
                db.sessions.clear(),
                db.schedules.clear(),
                db.connections.clear(),
                // Apaga exercícios customizados criados por usuário (id >= 1000)
                db.exercises.where('id').aboveOrEqual(1000).delete(),
            ];

            if (!options?.preserveSyncQueue) {
                tasks.push(db.syncQueue.clear());
            }

            await Promise.all(tasks);
        } catch (err) {
            console.warn('[authService] Erro ao limpar tabelas do Dexie:', err);
        }

        try {
            clearStoredActiveAuthUserId();
            const keysToRemove: string[] = ['activeUserId', 'gymaux_migrated'];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('gymaux_preloaded_') || key.startsWith('offline_sync_'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(k => localStorage.removeItem(k));
        } catch (err) {
            console.warn('[authService] Erro ao limpar chaves do localStorage:', err);
        }

        await clearServiceWorkerAuthCaches();
    },

    /**
     * Limpeza segura e garantida da sessão no logout com proteção contra perda de dados offline.
     */
    async signOut(options?: SignOutOptions): Promise<SignOutResult> {
        if (typeof window === 'undefined') {
            return { success: true };
        }

        const isOnline = navigator.onLine;
        let pendingCount = 0;

        try {
            pendingCount = await db.syncQueue.count();
        } catch {
            pendingCount = 0;
        }

        if (pendingCount > 0) {
            if (isOnline) {
                options?.onProgress?.('syncing');
                try {
                    await withTimeout(SyncManager.processQueue(), 15000);
                } catch (syncErr) {
                    console.warn('[authService] Falha ou timeout ao sincronizar fila antes do logout:', syncErr);
                }

                try {
                    pendingCount = await db.syncQueue.count();
                } catch {
                    pendingCount = 0;
                }

                if (pendingCount > 0 && !options?.force) {
                    console.warn(`[authService] Logout abortado: ${pendingCount} operações ainda pendentes de sync.`);
                    return { success: false, reason: 'PENDING_OFFLINE_DATA', pendingCount };
                }
            } else if (!options?.force) {
                console.warn(`[authService] Logout abortado (offline): ${pendingCount} operações salvas offline.`);
                return { success: false, reason: 'PENDING_OFFLINE_DATA', pendingCount };
            }
        }

        options?.onProgress?.('clearing');
        await this.clearUserData();

        options?.onProgress?.('signing_out');
        try {
            const supabase = createClient();
            await withTimeout(supabase.auth.signOut(), 2500).catch(() => { });
        } catch (err) {
            console.warn('[authService] Erro ao deslogar do Supabase:', err);
        }

        options?.onProgress?.('redirecting');
        return { success: true };
    },

    /**
     * Guarda defensiva de isolamento multiusuário baseada EXCLUSIVAMENTE na chave
     * dedicada `gymaux_active_auth_user_id` — NUNCA em `db.users.toCollection().first()`.
     *
     * Isso garante que perfis de alunos cacheados em `db.users` jamais acionem limpeza
     * acidental da sessão de treino ou da fila offline do usuário logado.
     */
    async ensureUserIsolation(currentAuthUserId?: string | null, force: boolean = false): Promise<void> {
        if (typeof window === 'undefined' || !currentAuthUserId) return;

        try {
            const storedActiveId = getStoredActiveAuthUserId();

            // Mesma conta já ativa: garante a chave gravada e NUNCA apaga dados locais
            if (storedActiveId === currentAuthUserId) {
                return;
            }

            // Troca real de conta (havia outro usuário autenticado anteriormente)
            if (storedActiveId && storedActiveId !== currentAuthUserId) {
                console.log(`[authService] Troca de conta detectada (${storedActiveId} -> ${currentAuthUserId}). Isolando cache local...`);
                // Se houver pendências na syncQueue da conta anterior, preserva apenas se offline?
                // Em troca explícita de conta, limpar caches de visualização evita vazamento entre usuários.
                await this.clearUserData();
                setStoredActiveAuthUserId(currentAuthUserId);
                return;
            }

            // Primeira execução após upgrade (storedActiveId ainda null):
            // Verifica se o próprio usuário já existe no Dexie ou se só existem dados de outra conta.
            if (!storedActiveId) {
                const selfInDexie = await db.users.get(currentAuthUserId);
                const pendingCount = await db.syncQueue.count();

                if (selfInDexie) {
                    // Conta atual já estava no Dexie — apenas registra a chave sem apagar nada!
                    setStoredActiveAuthUserId(currentAuthUserId);
                    return;
                }

                if (force && pendingCount === 0) {
                    // Login limpo em dispositivo sem pendências
                    const hasAnyUser = (await db.users.count()) > 0;
                    if (hasAnyUser) {
                        await this.clearUserData();
                    }
                }

                setStoredActiveAuthUserId(currentAuthUserId);
            }
        } catch (err) {
            console.warn('[authService] Erro na verificação de isolamento:', err);
        }
    }
};
