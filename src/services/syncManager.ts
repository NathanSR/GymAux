import { db } from '../config/db';
import { SyncOperation } from '../config/types';
import { createClient } from '../lib/supabase/client';

export class SyncManager {
    private static isSyncing = false;

    /**
     * Enqueue a new mutation for background syncing.
     */
    static async enqueue(
        action: SyncOperation['action'],
        entityType: SyncOperation['entityType'],
        entityId: string | number,
        payload: any
    ): Promise<number> {
        // Enqueue to Dexie
        const id = await db.syncQueue.add({
            action,
            entityType,
            entityId,
            payload,
            status: 'PENDING',
            createdAt: new Date(),
            retryCount: 0
        });

        // Trigger sync process asynchronously
        this.processQueue();

        return id as number;
    }

    /**
     * Start processing the sync queue. Avoids overlapping syncs.
     */
    static async processQueue() {
        if (this.isSyncing) return;
        if (typeof window !== 'undefined' && !navigator.onLine) return;

        this.isSyncing = true;

        try {
            const pendingOps = await db.syncQueue
                .where('status')
                .equals('PENDING')
                .sortBy('createdAt');

            if (pendingOps.length === 0) {
                this.isSyncing = false;
                return;
            }

            const supabase = createClient();

            for (const op of pendingOps) {
                // If offline happens mid-sync, abort
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
                            success = true; // Mark done to drop it
                    }

                    if (success) {
                        // Mark as synced, or delete it
                        await db.syncQueue.delete(op.id!);
                    }
                } catch (error: any) {
                    console.error(`[SyncManager] Error syncing operation ${op.id}:`, error?.message || error);
                    // increment retries, handle fails later
                    await db.syncQueue.update(op.id!, {
                        retryCount: op.retryCount + 1,
                        status: op.retryCount >= 5 ? 'FAILED' : 'PENDING',
                        errorMessage: error.message
                    });
                }
            }
        } finally {
            this.isSyncing = false;
        }
    }

    // --- Private Sync Implementations per Entity ---

    // Note: To be fully implemented based on Supabase tables. 
    // This provides the structural foundation for syncing offline data gracefully.

    private static async syncHistory(op: SyncOperation, supabase: any): Promise<boolean> {
        if (op.action === 'CREATE') {
            const { error } = await supabase.from('history').insert(op.payload);
            // Ignore duplicate key error if it already exists (409 / 23505 usually)
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const { error } = await supabase.from('history').update(op.payload).eq('id', op.entityId);
            if (error) throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await supabase.from('history').delete().eq('id', op.entityId);
            if (error) throw error;
        }
        return true;
    }

    private static async syncSession(op: SyncOperation, supabase: any): Promise<boolean> {
        if (op.action === 'CREATE') {
            const { error } = await supabase.from('sessions').insert(op.payload);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const { error } = await supabase.from('sessions').update(op.payload).eq('id', op.entityId);
            if (error) throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await supabase.from('sessions').delete().eq('id', op.entityId);
            if (error) throw error;
        }
        return true;
    }

    private static async syncWorkout(op: SyncOperation, supabase: any): Promise<boolean> {
        if (op.action === 'CREATE') {
            const { error } = await supabase.from('workouts').insert(op.payload);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const { error } = await supabase.from('workouts').update(op.payload).eq('id', op.entityId);
            if (error) throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await supabase.from('workouts').delete().eq('id', op.entityId);
            if (error) throw error;
        }
        return true;
    }

    private static async syncSchedule(op: SyncOperation, supabase: any): Promise<boolean> {
        if (op.action === 'CREATE') {
            const { error } = await supabase.from('schedules').insert(op.payload);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const { error } = await supabase.from('schedules').update(op.payload).eq('id', op.entityId);
            if (error) throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await supabase.from('schedules').delete().eq('id', op.entityId);
            if (error) throw error;
        }
        return true;
    }

    private static async syncExercise(op: SyncOperation, supabase: any): Promise<boolean> {
        if (op.action === 'CREATE') {
            const { error } = await supabase.from('exercises').insert(op.payload);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const { error } = await supabase.from('exercises').update(op.payload).eq('id', op.entityId);
            if (error) throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await supabase.from('exercises').delete().eq('id', op.entityId);
            if (error) throw error;
        }
        return true;
    }
}
