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

            // Validate auth before processing — avoids "user not found" / RLS errors
            const userId = await this.resolveUserId(supabase);
            if (!userId) {
                console.warn('[SyncManager] No authenticated user found, deferring sync.');
                return;
            }

            for (const op of pendingOps) {
                // Abort mid-sync if connectivity drops
                if (typeof window !== 'undefined' && !navigator.onLine) break;

                let success = false;

                try {
                    // Inject/validate user_id in payload for entity types that require it
                    const sanitizedPayload = this.ensureUserId(op, userId);

                    const sanitizedOp = { ...op, payload: sanitizedPayload };

                    switch (op.entityType) {
                        case 'HISTORY':
                            success = await this.syncHistory(sanitizedOp, supabase);
                            break;
                        case 'SESSION':
                            success = await this.syncSession(sanitizedOp, supabase);
                            break;
                        case 'WORKOUT':
                            success = await this.syncWorkout(sanitizedOp, supabase);
                            break;
                        case 'SCHEDULE':
                            success = await this.syncSchedule(sanitizedOp, supabase);
                            break;
                        case 'EXERCISE':
                            success = await this.syncExercise(sanitizedOp, supabase);
                            break;
                        default:
                            console.warn(`[SyncManager] Unknown entityType: ${op.entityType}`);
                            success = true; // Drop unknown ops
                    }

                    if (success) {
                        await db.syncQueue.delete(op.id!);
                    }
                } catch (error: any) {
                    const errorCode = error?.code || '';
                    const errorMessage = error?.message || String(error);

                    // Handle non-retryable errors — drop the operation
                    if (this.isNonRetryable(errorCode, errorMessage)) {
                        console.warn(`[SyncManager] Non-retryable error for op ${op.id}, dropping:`, errorMessage);
                        await db.syncQueue.delete(op.id!);
                        continue;
                    }

                    console.error(`[SyncManager] Error syncing op ${op.id} (${op.action} ${op.entityType}):`, errorMessage);
                    const newRetryCount = op.retryCount + 1;
                    await db.syncQueue.update(op.id!, {
                        retryCount: newRetryCount,
                        status: newRetryCount >= 8 ? 'FAILED' : 'PENDING',
                        errorMessage
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

    /**
     * Get the count of pending + failed operations in the queue.
     */
    static async getPendingCount(): Promise<number> {
        if (typeof window === 'undefined') return 0;
        const pending = await db.syncQueue.where('status').equals('PENDING').count();
        const failed = await db.syncQueue.where('status').equals('FAILED').count();
        return pending + failed;
    }

    /**
     * Retry all FAILED operations by resetting them to PENDING.
     */
    static async retryFailed(): Promise<void> {
        if (typeof window === 'undefined') return;
        const failedOps = await db.syncQueue.where('status').equals('FAILED').toArray();
        for (const op of failedOps) {
            await db.syncQueue.update(op.id!, {
                status: 'PENDING',
                retryCount: 0,
                errorMessage: undefined
            });
        }
        // Trigger processing
        this.processQueue().catch(() => {});
    }

    // --- Private Helpers ---

    /**
     * Resolve the current user ID from Supabase auth.
     * Falls back to getSession if getUser fails (e.g., network issues).
     */
    private static async resolveUserId(supabase: any): Promise<string | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.id) return user.id;
        } catch {
            // getUser failed
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) return session.user.id;
        } catch {
            // getSession failed
        }

        // Last resort: check Dexie user cache
        if (typeof window !== 'undefined') {
            const cached = await (await import('../config/db')).db.users.toCollection().first();
            if (cached?.id) return cached.id;
        }

        return null;
    }

    /**
     * Ensures that payloads contain the correct user_id.
     * This prevents the "user not found" RLS violations.
     */
    private static ensureUserId(op: SyncOperation, userId: string): any {
        const payload = { ...op.payload };

        if (op.action === 'DELETE') return payload;

        // Entity types that require user_id
        const userIdFields: Record<string, string> = {
            'HISTORY': 'user_id',
            'SESSION': 'user_id',
            'WORKOUT': 'user_id',
            'SCHEDULE': 'user_id',
            'EXERCISE': 'created_by',
        };

        const field = userIdFields[op.entityType];
        if (field && !payload[field]) {
            payload[field] = userId;
        }

        return payload;
    }

    /**
     * Detect errors that should not be retried (e.g., constraint violations that won't self-resolve).
     */
    private static isNonRetryable(code: string, message: string): boolean {
        // 23503 = foreign key violation (referenced record doesn't exist)
        // 42501 = insufficient privilege (RLS permanent block)
        // PGRST301 = JWT expired, but we re-resolve auth each cycle so skip
        const nonRetryableCodes = ['23503', '42501'];
        if (nonRetryableCodes.includes(code)) return true;

        // "row-level security" permanent blocks
        if (message.includes('row-level security') || message.includes('violates row-level security')) {
            return true;
        }

        return false;
    }

    // --- Private Sync Implementations per Entity ---

    private static async syncHistory(op: SyncOperation, supabase: any): Promise<boolean> {
        if (op.action === 'CREATE') {
            const { error } = await withTimeout(supabase.from('history').insert(op.payload), 5000);
            // 23505 = unique_violation — already exists, safe to drop
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const { error } = await withTimeout(supabase.from('history').update(op.payload).eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('history').delete().eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
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
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('workouts').delete().eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }

    private static async syncSchedule(op: SyncOperation, supabase: any): Promise<boolean> {
        if (op.action === 'CREATE') {
            const { error } = await withTimeout(supabase.from('schedules').insert(op.payload), 5000);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const { error } = await withTimeout(supabase.from('schedules').update(op.payload).eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('schedules').delete().eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }

    private static async syncExercise(op: SyncOperation, supabase: any): Promise<boolean> {
        if (op.action === 'CREATE') {
            const { error } = await withTimeout(supabase.from('exercises').insert(op.payload), 5000);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const { error } = await withTimeout(supabase.from('exercises').update(op.payload).eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('exercises').delete().eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }
}
