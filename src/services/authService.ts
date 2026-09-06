import { createClient } from '@/lib/supabase/client';
import { db } from '@/config/db';
import { SyncManager } from './syncManager';
import { withTimeout } from '@/lib/utils/timeout';

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
 * Serviço de autenticação e isolamento multiusuário seguro para Dexie / Supabase.
 */
export const authService = {
    /**
     * Limpa completamente todos os dados do usuário do armazenamento local (Dexie + localStorage).
     * Preserva tabelas e dados globais do sistema (exercícios do catálogo 1..999, taxonomias).
     */
    async clearUserData(): Promise<void> {
        if (typeof window === 'undefined') return;

        try {
            // 1. Limpa todas as tabelas com dados do usuário no Dexie
            await Promise.all([
                db.users.clear(),
                db.workouts.clear(),
                db.history.clear(),
                db.sessions.clear(),
                db.schedules.clear(),
                db.connections.clear(),
                db.syncQueue.clear(),
                // Apaga exercícios customizados criados por usuário (id >= 1000)
                db.exercises.where('id').aboveOrEqual(1000).delete(),
            ]);
        } catch (err) {
            console.warn('[authService] Erro ao limpar tabelas do Dexie:', err);
        }

        try {
            // 2. Limpa chaves de controle do usuário no localStorage
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

        // 1. Se houver pendências na fila de sync
        if (pendingCount > 0) {
            if (isOnline) {
                // Tenta sincronizar a fila dando tempo real (até 15s)
                options?.onProgress?.('syncing');
                try {
                    await withTimeout(SyncManager.processQueue(), 15000);
                } catch (syncErr) {
                    console.warn('[authService] Falha ou timeout ao sincronizar fila antes do logout:', syncErr);
                }

                // Reavalia a fila após tentativa de sync
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
                // Offline e com pendências: NUNCA apaga dados sem confirmação explícita (force: true)
                console.warn(`[authService] Logout abortado (offline): ${pendingCount} operações salvas offline.`);
                return { success: false, reason: 'PENDING_OFFLINE_DATA', pendingCount };
            }
        }

        // 2. Limpa dados locais com segurança
        options?.onProgress?.('clearing');
        await this.clearUserData();

        // 3. Notifica o Supabase para invalidar a sessão nos cookies com fail-fast de 2.5s
        options?.onProgress?.('signing_out');
        try {
            const supabase = createClient();
            await withTimeout(supabase.auth.signOut(), 2500).catch(() => {});
        } catch (err) {
            console.warn('[authService] Erro ao deslogar do Supabase:', err);
        }

        // 4. Notifica redirecionamento
        options?.onProgress?.('redirecting');

        return { success: true };
    },

    /**
     * Guarda defensiva de login: Se o usuário logado for diferente do que estava no cache,
     * executa limpeza preventiva para evitar contaminação cruzada de dados.
     */
    async ensureUserIsolation(currentAuthUserId?: string | null, force: boolean = false): Promise<void> {
        if (typeof window === 'undefined' || !currentAuthUserId) return;

        try {
            const cachedUser = await db.users.toCollection().first();
            if (force || (cachedUser && cachedUser.id !== currentAuthUserId)) {
                console.log(`[authService] Isolamento acionado (cached: ${cachedUser?.id} -> novo: ${currentAuthUserId}, force: ${force}). Limpando dados locais...`);
                await this.clearUserData();
            }
        } catch (err) {
            console.warn('[authService] Erro na verificação de isolamento:', err);
        }
    }
};
