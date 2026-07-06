import { replicateRxCollection, RxReplicationState } from 'rxdb/plugins/replication';
import { RxDatabase } from 'rxdb';
import { createClient } from '../lib/supabase/client';

// --- Conversão Recursiva CamelCase <-> snake_case ---

function camelToSnake(obj: any): any {
    if (Array.isArray(obj)) return obj.map(camelToSnake);
    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc: any, key) => {
            // Não converter estruturas JSON aninhadas complexas que devem manter o formato
            if (['exercises', 'executions', 'current', 'permissions', 'exercisesToDo', 'exercisesDone'].includes(key)) {
                const mappedKey = key === 'exercisesToDo' ? 'exercises_to_do' : key === 'exercisesDone' ? 'exercises_done' : key;
                acc[mappedKey] = obj[key];
                return acc;
            }
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            acc[snakeKey] = camelToSnake(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}

function snakeToCamel(obj: any): any {
    if (Array.isArray(obj)) return obj.map(snakeToCamel);
    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc: any, key) => {
            if (['exercises', 'executions', 'current', 'permissions', 'exercises_to_do', 'exercises_done'].includes(key)) {
                const mappedKey = key === 'exercises_to_do' ? 'exercisesToDo' : key === 'exercises_done' ? 'exercisesDone' : key;
                acc[mappedKey] = obj[key];
                return acc;
            }
            const camelKey = key.replace(/([-_][a-z])/g, group =>
                group.toUpperCase().replace('-', '').replace('_', '')
            );
            acc[camelKey] = snakeToCamel(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}

export class SyncReplicator {
    private static replications: RxReplicationState<any, any>[] = [];

    /**
     * Inicializa a replicação para todas as coleções.
     */
    static async start(db: RxDatabase) {
        this.stop(); // Interrompe qualquer replicação ativa anterior

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.warn('[SyncReplicator] Usuário não autenticado no Supabase. Replicação adiada.');
            return;
        }

        console.log('[SyncReplicator] Iniciando replicação para o usuário:', user.id);

        const collections = ['users', 'exercises', 'workouts', 'schedules', 'history', 'sessions', 'connections'];

        for (const colName of collections) {
            const collection = db[colName];
            if (!collection) continue;

            const tableName = this.getTableName(colName);

            const replicationState = replicateRxCollection({
                collection,
                replicationIdentifier: `supabase-sync-${colName}-${user.id}`,
                live: true,
                pull: {
                    handler: async (lastCheckpoint, batchSize) => {
                        const lastUpdatedAt = lastCheckpoint ? (lastCheckpoint as any).updated_at : '1970-01-01T00:00:00Z';
                        
                        let query = supabase
                            .from(tableName as any)
                            .select()
                            .gt('updated_at', lastUpdatedAt)
                            .order('updated_at', { ascending: true })
                            .limit(batchSize);

                        // Exercícios compartilhados ou públicos não são filtrados por user_id
                        if (colName !== 'exercises') {
                            query = query.eq('user_id', user.id) as any;
                        }

                        const { data, error } = await query;

                        if (error) {
                            console.error(`[SyncReplicator] Erro ao puxar dados de ${colName}:`, error.message);
                            return { documents: [], checkpoint: lastCheckpoint };
                        }

                        if (!data || data.length === 0) {
                            return { documents: [], checkpoint: lastCheckpoint };
                        }

                                                const documents = data.map(doc => this.mapToRxDB(colName, doc));
                        const lastDoc = data[data.length - 1] as any;

                        return {
                            documents,
                            checkpoint: {
                                id: lastDoc.id,
                                updated_at: lastDoc.updated_at
                            }
                        };
                    },
                    batchSize: 50
                },
                push: {
                    handler: async (rows) => {
                        const conflicts: any[] = [];
                        for (const row of rows) {
                            const doc = row.newDocumentState;
                            const mappedDoc = this.mapToSupabase(colName, doc, user.id);

                            if (doc._deleted) {
                                const { error } = await supabase
                                    .from(tableName as any)
                                    .delete()
                                    .eq('id', doc.id);
                                if (error) {
                                    console.error(`[SyncReplicator] Erro ao deletar no Supabase (${colName}):`, error.message);
                                }
                            } else {
                                const { error } = await supabase
                                    .from(tableName as any)
                                    .upsert(mappedDoc);
                                if (error) {
                                    console.error(`[SyncReplicator] Erro ao salvar no Supabase (${colName}):`, error.message);
                                }
                            }
                        }
                        return conflicts;
                    },
                    batchSize: 50
                }
            });

            // Log de eventos de status da replicação
            replicationState.error$.subscribe(err => {
                console.error(`[SyncReplicator] Erro na replicação da coleção ${colName}:`, err);
            });

            this.replications.push(replicationState);
        }
    }

    /**
     * Cancela todas as conexões ativas de replicação (usado no logout).
     */
    static stop() {
        if (this.replications.length > 0) {
            console.log('[SyncReplicator] Parando replicações ativas...');
            this.replications.forEach(rep => rep.cancel());
            this.replications = [];
        }
    }

    private static getTableName(colName: string): string {
        switch (colName) {
            case 'users': return 'profiles';
            case 'exercises': return 'exercises';
            case 'workouts': return 'workouts';
            case 'schedules': return 'schedules';
            case 'history': return 'history';
            case 'sessions': return 'sessions';
            case 'connections': return 'connections';
            default: throw new Error(`Coleção desconhecida: ${colName}`);
        }
    }

    private static mapToRxDB(colName: string, doc: any): any {
        const camelDoc = snakeToCamel(doc);
        if (colName === 'exercises') {
            camelDoc.id = String(camelDoc.id);
        }
        return camelDoc;
    }

    private static mapToSupabase(colName: string, doc: any, userId: string): any {
        const snakeDoc = camelToSnake(doc);
        
        // Remover metadados do RxDB que não existem nas tabelas do Postgres
        delete snakeDoc._deleted;
        delete snakeDoc._attachments;
        delete snakeDoc._rev;
        
        if (colName !== 'exercises' && colName !== 'connections') {
            snakeDoc.user_id = userId;
        }
        if (colName === 'exercises') {
            snakeDoc.id = Number(snakeDoc.id);
            snakeDoc.created_by = userId;
        }
        
        // Garante que o timestamp de atualização local reflita a alteração
        snakeDoc.updated_at = new Date().toISOString();
        
        return snakeDoc;
    }
}
