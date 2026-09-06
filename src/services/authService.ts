import { createClient } from '@/lib/supabase/client';
import { db } from '@/config/db';
import { SyncManager } from './syncManager';
import { withTimeout } from '@/lib/utils/timeout';

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
     * Limpeza segura, instantânea e completa da sessão local no logout.
     */
    async signOut(): Promise<void> {
        // 1. Limpa imediatamente dados locais (Dexie e localStorage) para isolamento instantâneo
        const localCleanPromise = this.clearUserData();

        // 2. Se houver pendências na fila de sync e houver conexão, tenta flush rápido (máx 300ms)
        if (typeof window !== 'undefined' && navigator.onLine) {
            try {
                const pendingCount = await db.syncQueue.count();
                if (pendingCount > 0) {
                    await withTimeout(SyncManager.processQueue(), 300).catch(() => {});
                }
            } catch {
                // Ignora falhas de sync antes do logout
            }
        }

        // 3. Notifica o Supabase para invalidar a sessão nos cookies com fail-fast de 1s
        try {
            const supabase = createClient();
            await withTimeout(supabase.auth.signOut(), 1000).catch(() => {});
        } catch (err) {
            console.warn('[authService] Erro ao deslogar do Supabase:', err);
        }

        // Garante conclusão da limpeza local antes de finalizar
        await localCleanPromise;
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

