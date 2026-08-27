import { createClient } from '@/lib/supabase/client';
import { db } from '@/config/db';
import { SyncManager } from './syncManager';

/**
 * Serviço de autenticação e isolamento multiusuário seguro para Dexie / Supabase.
 */
export const authService = {
    /**
     * Limpeza segura e completa da sessão local no logout.
     * Preserva tabelas globais do sistema (exercícios padrão, taxonomias).
     */
    async signOut(): Promise<void> {
        try {
            // 1. Se estiver online, tenta enviar pendências finais rapidamente
            if (typeof window !== 'undefined' && navigator.onLine) {
                await SyncManager.processQueue().catch(() => {});
            }
        } catch {
            // Ignora falhas de sync antes do logout
        }

        try {
            const supabase = createClient();
            await supabase.auth.signOut();
        } catch (err) {
            console.error('[authService] Erro ao deslogar do Supabase:', err);
        }

        if (typeof window !== 'undefined') {
            try {
                // Limpa apenas tabelas de dados específicos do usuário anterior
                await Promise.all([
                    db.users.clear(),
                    db.workouts.clear(),
                    db.history.clear(),
                    db.sessions.clear(),
                    db.schedules.clear(),
                    db.connections.clear(),
                    db.syncQueue.clear(),
                ]);
            } catch (err) {
                console.warn('[authService] Erro ao limpar tabelas do Dexie:', err);
            }
        }
    },

    /**
     * Guarda defensiva de login: Se o usuário logado for diferente do que estava no cache,
     * executa limpeza preventiva para evitar contaminação cruzada de dados.
     */
    async ensureUserIsolation(currentAuthUserId?: string | null): Promise<void> {
        if (typeof window === 'undefined' || !currentAuthUserId) return;

        try {
            const cachedUser = await db.users.toCollection().first();
            if (cachedUser && cachedUser.id !== currentAuthUserId) {
                console.log('[authService] Usuário diferente detectado. Executando limpeza defensiva...');
                await Promise.all([
                    db.users.clear(),
                    db.workouts.clear(),
                    db.history.clear(),
                    db.sessions.clear(),
                    db.schedules.clear(),
                    db.connections.clear(),
                    db.syncQueue.clear(),
                ]);
            }
        } catch (err) {
            console.warn('[authService] Erro na verificação de isolamento:', err);
        }
    }
};
