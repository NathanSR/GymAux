import { db } from '../config/db';
import { SyncOperation } from '../config/types';
import { createClient } from '../lib/supabase/client';
import { withTimeout } from '@/lib/utils/timeout';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toValidUUIDOrNull(val: any): string | null {
    if (typeof val === 'string' && UUID_REGEX.test(val.trim())) {
        return val.trim();
    }
    return null;
}

export class SyncManager {
    private static isSyncing = false;
    /** Holds the active processing promise so simultaneous callers await the same completion */
    private static activeSyncPromise: Promise<void> | null = null;
    /** True when at least one enqueue happened while a sync was already running. */
    private static pendingAfterSync = false;

    /**
     * Deep merge objects for safe payload updates.
     */
    private static mergePayloads(target: any, source: any): any {
        if (!target) return source;
        if (!source) return target;
        const merged = { ...target };

        for (const key of Object.keys(source)) {
            if (
                source[key] !== null &&
                typeof source[key] === 'object' &&
                !Array.isArray(source[key]) &&
                !(source[key] instanceof Date)
            ) {
                merged[key] = this.mergePayloads(target[key], source[key]);
            } else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
                // Preserve richer execution/set array if target has more items
                merged[key] = source[key].length >= target[key].length ? source[key] : target[key];
            } else {
                merged[key] = source[key];
            }
        }
        return merged;
    }

    /**
     * Enqueue a new mutation for background syncing with Queue Collapsing (Deduplication).
     * Always awaited so callers know the item was persisted to Dexie before returning.
     */
    static async enqueue(
        action: SyncOperation['action'],
        entityType: SyncOperation['entityType'],
        entityId: string | number,
        payload: any,
        userIdInput?: string
    ): Promise<number> {
        const userId = userIdInput || (typeof window !== 'undefined' ? (await db.users.toCollection().first())?.id : undefined);

        // Queue Collapsing: find existing pending operations for the same entity
        const existingOps = await db.syncQueue
            .where('entityType')
            .equals(entityType)
            .and(op => op.entityId === entityId && (op.status === 'PENDING' || op.status === 'FAILED'))
            .toArray();

        const pendingCreate = existingOps.find(op => op.action === 'CREATE');
        const pendingUpdates = existingOps.filter(op => op.action === 'UPDATE');

        if (action === 'DELETE') {
            if (pendingCreate) {
                // Was created locally and never sent to server -> purge local CREATE and don't send DELETE
                await db.syncQueue.delete(pendingCreate.id!);
                for (const u of pendingUpdates) {
                    await db.syncQueue.delete(u.id!);
                }
                return 0;
            } else if (pendingUpdates.length > 0) {
                // Drop prior updates and replace with single DELETE
                for (const u of pendingUpdates) {
                    await db.syncQueue.delete(u.id!);
                }
            }
        } else if (action === 'UPDATE') {
            if (pendingCreate) {
                // Merge updates into original CREATE payload
                const mergedPayload = this.mergePayloads(pendingCreate.payload, payload);
                await db.syncQueue.update(pendingCreate.id!, {
                    payload: mergedPayload,
                    status: 'PENDING',
                    retryCount: 0,
                    errorMessage: undefined,
                    createdAt: new Date()
                });
                return pendingCreate.id!;
            } else if (pendingUpdates.length > 0) {
                // Merge into most recent UPDATE
                const lastUpdate = pendingUpdates[pendingUpdates.length - 1];
                const mergedPayload = this.mergePayloads(lastUpdate.payload, payload);
                await db.syncQueue.update(lastUpdate.id!, {
                    payload: mergedPayload,
                    status: 'PENDING',
                    retryCount: 0,
                    errorMessage: undefined,
                    createdAt: new Date()
                });
                return lastUpdate.id!;
            }
        }

        const id = await db.syncQueue.add({
            action,
            entityType,
            entityId,
            payload,
            userId,
            status: 'PENDING',
            createdAt: new Date(),
            retryCount: 0
        });

        // Fire-and-forget processing in background if online
        if (typeof window !== 'undefined' && navigator.onLine) {
            this.processQueue().catch((err) => {
                console.error('[SyncManager] background processQueue error:', err);
            });
        }

        return id as number;
    }

    /**
     * Start processing the sync queue. Coalesces concurrent calls into a single active promise.
     */
    static async processQueue(): Promise<void> {
        if (typeof window !== 'undefined' && !navigator.onLine) return;

        // If a sync is already running, register intent to re-check and return the active promise
        if (this.activeSyncPromise) {
            this.pendingAfterSync = true;
            return this.activeSyncPromise;
        }

        this.activeSyncPromise = this.doProcessQueue().finally(() => {
            this.activeSyncPromise = null;
        });

        return this.activeSyncPromise;
    }

    /**
     * Core execution loop of the sync queue.
     */
    private static async doProcessQueue(): Promise<void> {
        if (this.isSyncing) return;
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
            const activeUserId = await this.resolveUserId(supabase);
            if (!activeUserId) {
                console.warn('[SyncManager] No authenticated user found, deferring sync.');
                return;
            }

            for (const op of pendingOps) {
                // Abort mid-sync if connectivity drops
                if (typeof window !== 'undefined' && !navigator.onLine) break;

                // For private entities like HISTORY and SESSION, skip if not matching active user
                // For WORKOUT, SCHEDULE, EXERCISE, trainer can sync on behalf of student via RLS
                const isCrossAccountSafeEntity = ['WORKOUT', 'SCHEDULE', 'EXERCISE'].includes(op.entityType);
                if (!isCrossAccountSafeEntity && op.userId && op.userId !== activeUserId) {
                    console.warn(`[SyncManager] Skipping op ${op.id} belonging to user ${op.userId} (active: ${activeUserId})`);
                    continue;
                }

                let success = false;

                try {
                    // Inject/validate user_id in payload for entity types that require it
                    const sanitizedPayload = this.ensureUserId(op, activeUserId);
                    const effectiveUserId = op.userId || activeUserId;
                    const sanitizedOp = { ...op, userId: effectiveUserId, payload: sanitizedPayload };

                    switch (op.entityType) {
                        case 'HISTORY':
                            success = await this.syncHistory(sanitizedOp, supabase, activeUserId);
                            break;
                        case 'SESSION':
                            success = await this.syncSession(sanitizedOp, supabase, activeUserId);
                            break;
                        case 'WORKOUT':
                            success = await this.syncWorkout(sanitizedOp, supabase, activeUserId);
                            break;
                        case 'SCHEDULE':
                            success = await this.syncSchedule(sanitizedOp, supabase, activeUserId);
                            break;
                        case 'EXERCISE':
                            success = await this.syncExercise(sanitizedOp, supabase, activeUserId);
                            break;
                        case 'USER':
                            success = await this.syncUser(sanitizedOp, supabase, activeUserId);
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

                    // Handle non-retryable errors — drop the invalid operation so queue isn't blocked forever
                    if (this.isNonRetryable(errorCode, errorMessage)) {
                        console.warn(`[SyncManager] Non-retryable error for op ${op.id} (${errorCode}), dropping:`, errorMessage);
                        await db.syncQueue.delete(op.id!);
                        continue;
                    }

                    console.error(`[SyncManager] Error syncing op ${op.id} (${op.action} ${op.entityType}):`, errorMessage);
                    const newRetryCount = (op.retryCount || 0) + 1;
                    await db.syncQueue.update(op.id!, {
                        retryCount: newRetryCount,
                        status: newRetryCount >= 6 ? 'FAILED' : 'PENDING',
                        errorMessage
                    });
                }
            }
        } finally {
            this.isSyncing = false;

            // If new items were enqueued while we were processing, run again immediately.
            if (this.pendingAfterSync) {
                this.pendingAfterSync = false;
                await this.processQueue().catch((err) => {
                    console.error('[SyncManager] re-triggered processQueue error:', err);
                });
            }
        }
    }

    /**
     * Initialize listeners for connectivity changes.
     */
    static init() {
        if (typeof window === 'undefined') return;

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
     * Fetch all items in the queue (pending and failed) for UI display.
     */
    static async getQueueItems(): Promise<SyncOperation[]> {
        if (typeof window === 'undefined') return [];
        return await db.syncQueue.orderBy('createdAt').reverse().toArray();
    }

    /**
     * Clear all operations with status FAILED.
     */
    static async clearFailedOps(): Promise<void> {
        if (typeof window === 'undefined') return;
        const failedOps = await db.syncQueue.where('status').equals('FAILED').toArray();
        for (const op of failedOps) {
            if (op.id) await db.syncQueue.delete(op.id);
        }
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
        await this.processQueue().catch(() => {});
    }

    // --- Private Helpers ---

    /**
     * Resolve the current user ID from Supabase auth.
     */
    private static async resolveUserId(supabase: any): Promise<string | null> {
        try {
            const { data: { user } } = await withTimeout(supabase.auth.getUser(), 1200);
            if (user?.id) return user.id;
        } catch {
            // getUser network failure/timeout
        }

        try {
            const { data: { session } } = await withTimeout(supabase.auth.getSession(), 600);
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
     */
    private static ensureUserId(op: SyncOperation, userId: string): any {
        const payload = { ...op.payload };

        if (op.action === 'DELETE') return payload;

        const userIdFields: Record<string, string> = {
            'HISTORY': 'user_id',
            'SESSION': 'user_id',
            'WORKOUT': 'user_id',
            'SCHEDULE': 'user_id',
            'EXERCISE': 'created_by',
        };

        const field = userIdFields[op.entityType];
        if (field && (!payload[field] || payload[field] === '')) {
            payload[field] = userId;
        }

        return payload;
    }

    /**
     * Detect errors that should not be retried (e.g., constraint violations that won't self-resolve).
     */
    private static isNonRetryable(code: string, message: string): boolean {
        // 23503 = foreign key violation
        // 42501 = insufficient privilege (RLS permanent block)
        // 22P02 = invalid input syntax for type (e.g. invalid UUID)
        // 42703 / PGRST204 = undefined column in schema
        // 23502 = not-null violation
        const nonRetryableCodes = ['23503', '42501', '22P02', '42703', 'PGRST204', '23502'];
        if (nonRetryableCodes.includes(code)) return true;

        if (
            message.includes('row-level security') ||
            message.includes('violates row-level security') ||
            message.includes('invalid input syntax for type uuid') ||
            message.includes('Could not find the') ||
            message.includes('column') && message.includes('does not exist')
        ) {
            return true;
        }

        return false;
    }

    private static cleanUpdatePayload(payload: any): any {
        if (!payload || typeof payload !== 'object') return payload;
        const cleaned = { ...payload };
        delete cleaned.id;
        delete cleaned.user_id;
        delete cleaned.userId;
        delete cleaned.created_by;
        delete cleaned.createdBy;
        delete cleaned.created_by_type;
        delete cleaned.createdByType;
        delete cleaned.updated_at;
        delete cleaned.updatedAt;
        delete cleaned.createdAt;
        delete cleaned.callerId;
        return cleaned;
    }

    private static cleanHistoryInsertPayload(payload: any, activeUserId: string): any {
        if (!payload || typeof payload !== 'object') return payload;
        const cleaned: any = {
            id: toValidUUIDOrNull(payload.id) || crypto.randomUUID(),
            user_id: toValidUUIDOrNull(payload.user_id || payload.userId) || activeUserId,
            workout_id: toValidUUIDOrNull(payload.workout_id || payload.workoutId),
            workout_name: payload.workout_name || payload.workoutName || 'Treino',
            date: payload.date ? (payload.date instanceof Date ? payload.date.toISOString() : payload.date) : new Date().toISOString(),
            end_date: payload.end_date ? (payload.end_date instanceof Date ? payload.end_date.toISOString() : payload.end_date) : undefined,
            duration: typeof payload.duration === 'number' ? Math.max(0, payload.duration) : 0,
            weight: typeof payload.weight === 'number' ? payload.weight : null,
            description: payload.description || null,
            using_creatine: Boolean(payload.using_creatine ?? payload.usingCreatine),
            executions: payload.executions || []
        };
        return cleaned;
    }

    private static cleanSessionInsertPayload(payload: any, activeUserId: string): any {
        if (!payload || typeof payload !== 'object') return payload;
        const cleaned: any = {
            id: toValidUUIDOrNull(payload.id) || crypto.randomUUID(),
            user_id: toValidUUIDOrNull(payload.user_id || payload.userId) || activeUserId,
            workout_id: toValidUUIDOrNull(payload.workout_id || payload.workoutId),
            workout_name: payload.workout_name || payload.workoutName || 'Treino',
            created_at: payload.created_at ? (payload.created_at instanceof Date ? payload.created_at.toISOString() : payload.created_at) : new Date().toISOString(),
            exercises_to_do: payload.exercises_to_do || payload.exercisesToDo || [],
            exercises_done: payload.exercises_done || payload.exercisesDone || [],
            current_step: payload.current_step || payload.current || { step: 'executing', setIndex: 0, exerciseIndex: 0 },
            duration: typeof payload.duration === 'number' ? Math.max(0, payload.duration) : 0,
            paused_at: payload.paused_at ? (payload.paused_at instanceof Date ? payload.paused_at.toISOString() : payload.paused_at) : null,
            resumed_at: payload.resumed_at ? (payload.resumed_at instanceof Date ? payload.resumed_at.toISOString() : payload.resumed_at) : null,
        };
        return cleaned;
    }

    private static cleanWorkoutInsertPayload(payload: any, activeUserId: string): any {
        if (!payload || typeof payload !== 'object') return payload;
        const cleaned: any = {
            id: toValidUUIDOrNull(payload.id) || crypto.randomUUID(),
            user_id: toValidUUIDOrNull(payload.user_id || payload.userId) || activeUserId,
            created_by: toValidUUIDOrNull(payload.created_by || payload.createdBy) || activeUserId,
            created_by_type: payload.created_by_type || payload.createdByType || 'user',
            name: payload.name || 'Treino sem nome',
            description: payload.description || null,
            exercises: payload.exercises || [],
            created_at: payload.created_at ? (payload.created_at instanceof Date ? payload.created_at.toISOString() : payload.created_at) : new Date().toISOString(),
        };
        return cleaned;
    }

    private static cleanScheduleInsertPayload(payload: any, activeUserId: string): any {
        if (!payload || typeof payload !== 'object') return payload;
        const cleaned: any = {
            id: toValidUUIDOrNull(payload.id) || crypto.randomUUID(),
            user_id: toValidUUIDOrNull(payload.user_id || payload.userId) || activeUserId,
            created_by: toValidUUIDOrNull(payload.created_by || payload.createdBy) || activeUserId,
            created_by_type: payload.created_by_type || payload.createdByType || 'user',
            name: payload.name || 'Cronograma',
            workouts: payload.workouts || [],
            start_date: payload.start_date ? (payload.start_date instanceof Date ? payload.start_date.toISOString() : payload.start_date) : new Date().toISOString(),
            end_date: payload.end_date ? (payload.end_date instanceof Date ? payload.end_date.toISOString() : payload.end_date) : null,
            active: payload.active !== undefined ? Boolean(payload.active) : true,
            last_completed: typeof payload.last_completed === 'number' ? payload.last_completed : -1,
            created_at: payload.created_at ? (payload.created_at instanceof Date ? payload.created_at.toISOString() : payload.created_at) : new Date().toISOString(),
        };
        return cleaned;
    }

    private static cleanExerciseInsertPayload(payload: any, activeUserId: string): any {
        if (!payload || typeof payload !== 'object') return payload;
        const cleaned: any = {
            name: payload.name,
            category: payload.category,
            level: payload.level || null,
            created_by_type: payload.created_by_type || 'user',
            created_by: toValidUUIDOrNull(payload.created_by) || activeUserId,
            equipment: payload.equipment || 'none',
            execution_mode: payload.execution_mode || 'bilateral',
            mechanics: payload.mechanics || 'compound',
            parent_id: payload.parent_id || null,
            visibility: payload.visibility || 'private',
            shared_with: payload.shared_with || [],
            image_url: payload.image_url || null,
            video_url: payload.video_url || null,
            gallery: payload.gallery || [],
            secondary_muscles: payload.secondary_muscles || [],
            translations: payload.translations || {},
        };
        // Don't send custom numeric temporary ID so PostgreSQL auto-generates identity ID
        if (typeof payload.id === 'number' && payload.id < 100000) {
            cleaned.id = payload.id;
        }
        return cleaned;
    }

    private static cleanExerciseUpdatePayload(payload: any): any {
        if (!payload || typeof payload !== 'object') return payload;
        const cleaned = { ...payload };
        // Delete local-only fields that do not exist in Supabase exercises schema
        delete cleaned.tags;
        delete cleaned.description;
        delete cleaned.how_to;
        delete cleaned.howTo;
        delete cleaned.id;
        delete cleaned.created_by;
        delete cleaned.created_by_type;
        delete cleaned.updated_at;
        delete cleaned.updatedAt;
        return cleaned;
    }

    private static cleanUserUpdatePayload(payload: any): any {
        if (!payload || typeof payload !== 'object') return payload;
        const cleaned = { ...payload };
        if (cleaned.gymauxId !== undefined) {
            cleaned.gymaux_id = cleaned.gymauxId;
            delete cleaned.gymauxId;
        }
        delete cleaned.id;
        delete cleaned.created_at;
        delete cleaned.createdAt;
        delete cleaned.updated_at;
        delete cleaned.updatedAt;
        delete cleaned.callerId;
        return cleaned;
    }

    // --- Private Sync Implementations per Entity ---

    private static async syncHistory(op: SyncOperation, supabase: any, activeUserId: string): Promise<boolean> {
        if (op.action === 'CREATE') {
            const payload = this.cleanHistoryInsertPayload(op.payload, activeUserId);
            const { error } = await withTimeout(supabase.from('history').insert(payload), 5000);
            if (error) {
                if (error.code === '23505') {
                    // Unique violation / already exists -> safely consider synced
                    return true;
                }
                // 23503 = Foreign key constraint on workout_id failed (e.g. custom or deleted workout).
                // Fallback: save with workout_id = null so user's workout data is NEVER lost!
                if (error.code === '23503' && payload.workout_id) {
                    console.warn(`[SyncManager] FK violation on workout_id for history ${op.entityId}, retrying with workout_id = null`);
                    const fallbackPayload = { ...payload, workout_id: null };
                    const { error: fallbackError } = await withTimeout(supabase.from('history').insert(fallbackPayload), 5000);
                    if (fallbackError && fallbackError.code !== '23505') throw fallbackError;
                    return true;
                }
                throw error;
            }
        } else if (op.action === 'UPDATE') {
            const payload = this.cleanUpdatePayload(op.payload);
            const { error } = await withTimeout(supabase.from('history').update(payload).eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('history').delete().eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }

    private static async syncSession(op: SyncOperation, supabase: any, activeUserId: string): Promise<boolean> {
        if (op.action === 'CREATE') {
            const payload = this.cleanSessionInsertPayload(op.payload, activeUserId);
            const { error } = await withTimeout(supabase.from('sessions').insert(payload), 5000);
            if (error) {
                if (error.code === '23505') return true;
                if (error.code === '23503' && payload.workout_id) {
                    const fallbackPayload = { ...payload, workout_id: null };
                    const { error: fallbackError } = await withTimeout(supabase.from('sessions').insert(fallbackPayload), 5000);
                    if (fallbackError && fallbackError.code !== '23505') throw fallbackError;
                    return true;
                }
                throw error;
            }
        } else if (op.action === 'UPDATE') {
            const payload = this.cleanUpdatePayload(op.payload);
            const { error } = await withTimeout(supabase.from('sessions').update(payload).eq('id', op.entityId), 5000);
            // 404 / PGRST116 = row not found; session may have been deleted already — safe to drop
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('sessions').delete().eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;

            // Delete locally only after remote confirmation
            if (typeof window !== 'undefined') {
                const { db } = await import('../config/db');
                await db.sessions.delete(op.entityId as string).catch(() => {});
            }
        }
        return true;
    }

    private static async syncWorkout(op: SyncOperation, supabase: any, activeUserId: string): Promise<boolean> {
        if (op.action === 'CREATE') {
            const payload = this.cleanWorkoutInsertPayload(op.payload, activeUserId);
            const { error } = await withTimeout(supabase.from('workouts').insert(payload), 5000);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const payload = this.cleanUpdatePayload(op.payload);
            const { error } = await withTimeout(supabase.from('workouts').update(payload).eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('workouts').delete().eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }

    private static async syncSchedule(op: SyncOperation, supabase: any, activeUserId: string): Promise<boolean> {
        if (op.action === 'CREATE') {
            const payload = this.cleanScheduleInsertPayload(op.payload, activeUserId);
            const { error } = await withTimeout(supabase.from('schedules').insert(payload), 5000);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const payload = this.cleanUpdatePayload(op.payload);
            const { error } = await withTimeout(supabase.from('schedules').update(payload).eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('schedules').delete().eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }

    private static async syncExercise(op: SyncOperation, supabase: any, activeUserId: string): Promise<boolean> {
        if (op.action === 'CREATE') {
            const payload = this.cleanExerciseInsertPayload(op.payload, activeUserId);
            const { error } = await withTimeout(supabase.from('exercises').insert(payload), 5000);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const payload = this.cleanExerciseUpdatePayload(op.payload);
            const { error } = await withTimeout(supabase.from('exercises').update(payload).eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('exercises').delete().eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }

    private static async syncUser(op: SyncOperation, supabase: any, _activeUserId: string): Promise<boolean> {
        if (op.action === 'UPDATE') {
            const payload = this.cleanUserUpdatePayload(op.payload);
            const { error } = await withTimeout(supabase.from('profiles').update(payload).eq('id', op.entityId), 5000);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }
}
