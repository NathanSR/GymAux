import { db } from '../config/db';
import { SyncOperation } from '../config/types';
import { createClient } from '../lib/supabase/client';
import { withTimeout } from '@/lib/utils/timeout';

export class SyncManager {
    private static isSyncing = false;
    /** True when at least one enqueue happened while a sync was already running. */
    private static pendingAfterSync = false;

    /**
     * Enqueue a new mutation for background syncing.
     * Always awaited so callers know the item was persisted to Dexie before returning.
     */
    static async enqueue(
        action: SyncOperation['action'],
        entityType: SyncOperation['entityType'],
        entityId: string | number,
        payload: any
    ): Promise<number> {
        const id = await db.syncQueue.add({
            action,
            entityType,
            entityId,
            payload,
            status: 'PENDING',
            createdAt: new Date(),
            retryCount: 0
        });

        // If a sync is already running, flag it so we re-trigger after it finishes.
        if (this.isSyncing) {
            this.pendingAfterSync = true;
        } else {
            // Fire-and-forget — caller doesn't need to wait for the remote sync.
            this.processQueue().catch((err) => {
                console.error('[SyncManager] processQueue error:', err);
            });
        }

        return id as number;
    }

    /**
     * Start processing the sync queue. Avoids overlapping syncs.
     * After finishing, re-triggers itself once if new items were enqueued mid-run.
     */
    static async processQueue() {
        if (this.isSyncing) return;
        if (typeof window !== 'undefined' && !navigator.onLine) return;

        this.isSyncing = true;
        this.pendingAfterSync = false;

        try {
            const pendingOps = await db.syncQueue
                .where('status')
                .equals('PENDING')
                .sortBy('createdAt');

            if (pendingOps.length === 0) {
                return;
            }

            console.log(`[SyncManager] Processing ${pendingOps.length} pending operations...`);
            const supabase = createClient();

            for (const op of pendingOps) {
                // Abort mid-sync if connectivity drops
                if (typeof window !== 'undefined' && !navigator.onLine) break;

                let success = false;

                try {
                    switch (op.entityType) {
                        case 'HISTORY':
                            success = await this.syncHistory(op, supabase);
                            break;
                        case 'SESSION':
                            success = await this.syncSession(op, supabase);
                            break;
                        case 'WORKOUT':
                            success = await this.syncWorkout(op, supabase);
                            break;
                        case 'SCHEDULE':
                            success = await this.syncSchedule(op, supabase);
                            break;
                        case 'EXERCISE':
                            success = await this.syncExercise(op, supabase);
                            break;
                        default:
                            console.warn(`[SyncManager] Unknown entityType: ${op.entityType}`);
                            success = true; // Drop unknown ops
                    }

                    if (success) {
                        await db.syncQueue.delete(op.id!);
                    }
                } catch (error: any) {
                    console.error(`[SyncManager] Error syncing op ${op.id} (${op.action} ${op.entityType}):`, error?.message || error);
                    await db.syncQueue.update(op.id!, {
                        retryCount: op.retryCount + 1,
                        status: op.retryCount >= 5 ? 'FAILED' : 'PENDING',
                        errorMessage: error?.message || String(error)
                    });
                }
            }
        } finally {
            this.isSyncing = false;

            // If new items were enqueued while we were processing, run again immediately.
            if (this.pendingAfterSync) {
                this.pendingAfterSync = false;
                this.processQueue().catch((err) => {
                    console.error('[SyncManager] re-triggered processQueue error:', err);
                });
            }
        }
    }

    /**
     * Initialize listeners for connectivity changes.
     * NOTE: If OfflineSyncProvider is mounted, it already registers these listeners.
     * Call this only in environments without OfflineSyncProvider (e.g. Service Workers).
     */
    static init() {
        if (typeof window === 'undefined') return;

        // Initial drain of any leftover items from a previous session
        this.processQueue().catch((err) => {
            console.error('[SyncManager] init processQueue error:', err);
        });
    }

    // --- Private Sync Implementations per Entity ---

    private static async syncHistory(op: SyncOperation, supabase: any): Promise<boolean> {
        if (op.action === 'CREATE') {
            const { error } = await withTimeout(supabase.from('history').insert(op.payload), 5000);
            // 23505 = unique_violation — already exists, safe to drop
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const { error } = await withTimeout(supabase.from('history').update(op.payload).eq('id', op.entityId), 5000);
            if (error) throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('history').delete().eq('id', op.entityId), 5000);
            if (error) throw error;
        }
        return true;
    }

    private static async syncSession(op: SyncOperation, supabase: any): Promise<boolean> {
        if (op.action === 'CREATE') {
            const { error } = await withTimeout(supabase.from('sessions').insert(op.payload), 5000);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const { error } = await withTimeout(supabase.from('sessions').update(op.payload).eq('id', op.entityId), 5000);
            // 404 / PGRST116 = row not found; session may have been deleted already — safe to drop
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('sessions').delete().eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }

    private static async syncWorkout(op: SyncOperation, supabase: any): Promise<boolean> {
        if (op.action === 'CREATE') {
            const { error } = await withTimeout(supabase.from('workouts').insert(op.payload), 5000);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const { error } = await withTimeout(supabase.from('workouts').update(op.payload).eq('id', op.entityId), 5000);
            if (error) throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('workouts').delete().eq('id', op.entityId), 5000);
            if (error) throw error;
        }
        return true;
    }

    private static async syncSchedule(op: SyncOperation, supabase: any): Promise<boolean> {
        if (op.action === 'CREATE') {
            const { error } = await withTimeout(supabase.from('schedules').insert(op.payload), 5000);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const { error } = await withTimeout(supabase.from('schedules').update(op.payload).eq('id', op.entityId), 5000);
            if (error) throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('schedules').delete().eq('id', op.entityId), 5000);
            if (error) throw error;
        }
        return true;
    }

    private static async syncExercise(op: SyncOperation, supabase: any): Promise<boolean> {
        if (op.action === 'CREATE') {
            const { error } = await withTimeout(supabase.from('exercises').insert(op.payload), 5000);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const { error } = await withTimeout(supabase.from('exercises').update(op.payload).eq('id', op.entityId), 5000);
            if (error) throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('exercises').delete().eq('id', op.entityId), 5000);
            if (error) throw error;
        }
        return true;
    }
}
