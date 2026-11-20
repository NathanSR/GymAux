import { db } from '../config/db';
import { SyncOperation } from '../config/types';
import { createClient } from '../lib/supabase/client';
import { withTimeout } from '@/lib/utils/timeout';
import { getStoredActiveAuthUserId } from '@/utils/activeAuthUser';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toValidUUIDOrNull(val: any): string | null {
    if (typeof val === 'string' && UUID_REGEX.test(val.trim())) {
        return val.trim();
    }
    return null;
}

function countSetsInGroups(groups: any): number {
    if (!Array.isArray(groups)) return 0;
    return groups.reduce((acc, g) => {
        if (!g || !Array.isArray(g.exercises)) return acc;
        return acc + g.exercises.reduce((eAcc: number, ex: any) => {
            return eAcc + (Array.isArray(ex?.sets) ? ex.sets.length : 0);
        }, 0);
    }, 0);
}

function notifyQueueChanged() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gymaux-sync-queue-changed'));
    }
}

export class SyncManager {
    private static isSyncing = false;
    private static activeSyncPromise: Promise<void> | null = null;
    private static pendingAfterSync = false;

    private static readonly CHUNK_SIZE = 3;
    private static readonly OP_TIMEOUT_MS = 12_000; // Resiliente para 3G/4G de academia

    /**
     * Deep merge objects for safe payload updates.
     * Preserves richer execution/set progress for `exercises_done` / `executions`.
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
            } else if (
                (key === 'exercises_done' || key === 'executions') &&
                Array.isArray(source[key]) &&
                Array.isArray(target[key])
            ) {
                const sourceSets = countSetsInGroups(source[key]);
                const targetSets = countSetsInGroups(target[key]);
                merged[key] = sourceSets >= targetSets ? source[key] : target[key];
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
        const userId = userIdInput || getStoredActiveAuthUserId() || undefined;

        const existingOps = await db.syncQueue
            .where('entityType')
            .equals(entityType)
            .and(op => String(op.entityId) === String(entityId) && (op.status === 'PENDING' || op.status === 'FAILED'))
            .toArray();

        const pendingCreate = existingOps.find(op => op.action === 'CREATE');
        const pendingUpdates = existingOps.filter(op => op.action === 'UPDATE');

        let resultId: number;

        if (action === 'DELETE') {
            if (pendingCreate) {
                // Created locally and never synced to server -> drop local CREATE & UPDATEs
                await db.syncQueue.delete(pendingCreate.id!);
                for (const u of pendingUpdates) {
                    await db.syncQueue.delete(u.id!);
                }
                notifyQueueChanged();
                return 0;
            } else if (pendingUpdates.length > 0) {
                for (const u of pendingUpdates) {
                    await db.syncQueue.delete(u.id!);
                }
            }
            resultId = (await db.syncQueue.add({
                action,
                entityType,
                entityId,
                payload,
                userId,
                status: 'PENDING',
                createdAt: new Date(),
                retryCount: 0
            })) as number;
        } else if (action === 'UPDATE') {
            if (pendingCreate) {
                const mergedPayload = this.mergePayloads(pendingCreate.payload, payload);
                await db.syncQueue.update(pendingCreate.id!, {
                    payload: mergedPayload,
                    status: 'PENDING',
                    retryCount: 0,
                    errorMessage: undefined,
                    createdAt: pendingCreate.createdAt || new Date()
                });
                resultId = pendingCreate.id!;
            } else if (pendingUpdates.length > 0) {
                const lastUpdate = pendingUpdates[pendingUpdates.length - 1];
                const mergedPayload = this.mergePayloads(lastUpdate.payload, payload);
                await db.syncQueue.update(lastUpdate.id!, {
                    payload: mergedPayload,
                    status: 'PENDING',
                    retryCount: 0,
                    errorMessage: undefined,
                    createdAt: new Date()
                });
                resultId = lastUpdate.id!;
            } else {
                resultId = (await db.syncQueue.add({
                    action,
                    entityType,
                    entityId,
                    payload,
                    userId,
                    status: 'PENDING',
                    createdAt: new Date(),
                    retryCount: 0
                })) as number;
            }
        } else {
            resultId = (await db.syncQueue.add({
                action,
                entityType,
                entityId,
                payload,
                userId,
                status: 'PENDING',
                createdAt: new Date(),
                retryCount: 0
            })) as number;
        }

        notifyQueueChanged();

        // Fire-and-forget processing in background if online
        if (typeof window !== 'undefined' && navigator.onLine) {
            this.processQueue().catch((err) => {
                console.error('[SyncManager] background processQueue error:', err);
            });
        }

        return resultId;
    }

    /**
     * Start processing the sync queue. Coalesces concurrent calls into a single active promise.
     */
    static async processQueue(): Promise<void> {
        if (typeof window !== 'undefined' && !navigator.onLine) return;

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
     * Computes strict dependency priority.
     * CRITICAL: HISTORY (6) ALWAYS runs BEFORE SESSION DELETE (7) so finished
     * workout history is confirmed on the server before the session is deleted!
     */
    private static getOpPriority(op: SyncOperation): number {
        switch (op.entityType) {
            case 'USER': return 1;
            case 'EXERCISE': return 2;
            case 'WORKOUT': return 3;
            case 'SCHEDULE': return 4;
            case 'SESSION': return op.action === 'DELETE' ? 7 : 5;
            case 'HISTORY': return 6;
            default: return 99;
        }
    }

    /**
     * Detects auth / RLS errors that might recover after refreshing the Supabase JWT.
     */
    private static isAuthOrRlsError(code: string, message: string): boolean {
        const lower = message.toLowerCase();
        return (
            code === '42501' ||
            code === 'PGRST301' ||
            lower.includes('jwt') ||
            lower.includes('token') ||
            lower.includes('row-level security') ||
            lower.includes('unauthorized')
        );
    }

    /**
     * Detects permanent schema/syntax errors (never silently deleted — marked FAILED for visibility).
     */
    private static isPermanentSchemaError(code: string, message: string): boolean {
        const permanentCodes = ['22P02', '42703', 'PGRST204', '23502'];
        if (permanentCodes.includes(code)) return true;

        return (
            message.includes('invalid input syntax for type uuid') ||
            message.includes('Could not find the') ||
            (message.includes('column') && message.includes('does not exist'))
        );
    }

    /**
     * Executes a single operation against Supabase, with automatic JWT refresh retry on auth/RLS error.
     */
    private static async processSingleOp(
        op: SyncOperation,
        supabase: any,
        activeUserId: string,
        hasRetriedAuth = false
    ): Promise<{ success: boolean; permanentFailure?: boolean; errorMessage?: string }> {
        const isCrossAccountSafeEntity = ['WORKOUT', 'SCHEDULE', 'EXERCISE'].includes(op.entityType);
        if (!isCrossAccountSafeEntity && op.userId && op.userId !== activeUserId) {
            console.warn(`[SyncManager] Skipping op ${op.id} belonging to user ${op.userId} (active: ${activeUserId})`);
            return { success: false };
        }

        try {
            const sanitizedPayload = this.ensureUserId(op, activeUserId);
            const effectiveUserId = op.userId || activeUserId;
            const sanitizedOp = { ...op, userId: effectiveUserId, payload: sanitizedPayload };

            let success = false;
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
                    return { success: false, permanentFailure: true, errorMessage: `Unknown entityType: ${op.entityType}` };
            }

            return { success };
        } catch (error: any) {
            const errorCode = error?.code || '';
            const errorMessage = error?.message || String(error);

            // Auto-refresh JWT once if session expired while user was offline
            if (!hasRetriedAuth && this.isAuthOrRlsError(errorCode, errorMessage)) {
                try {
                    const { data } = await withTimeout(supabase.auth.refreshSession(), 5000);
                    if (data?.session?.user?.id) {
                        return await this.processSingleOp(op, supabase, data.session.user.id, true);
                    }
                } catch {
                    // Refresh failed — keep in queue as retryable/failed, NEVER silently drop!
                }
            }

            if (this.isPermanentSchemaError(errorCode, errorMessage)) {
                console.warn(`[SyncManager] Permanent schema error for op ${op.id} (${errorCode}), marking FAILED (never dropping silently):`, errorMessage);
                return { success: false, permanentFailure: true, errorMessage };
            }

            console.error(`[SyncManager] Error syncing op ${op.id} (${op.action} ${op.entityType}):`, errorMessage);
            return { success: false, permanentFailure: false, errorMessage };
        }
    }

    /**
     * Core execution loop of the sync queue.
     * Groups by strict dependency priority level so higher-priority stages ALWAYS finish
     * before dependent stages start (e.g. WORKOUT before SESSION, HISTORY before SESSION DELETE).
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

            const activeUserId = await this.resolveUserId(supabase);
            if (!activeUserId) {
                console.warn('[SyncManager] No authenticated user found, deferring sync.');
                return;
            }

            // Group ops by strict priority bucket
            const buckets = new Map<number, SyncOperation[]>();
            for (const op of pendingOps) {
                const p = this.getOpPriority(op);
                if (!buckets.has(p)) buckets.set(p, []);
                buckets.get(p)!.push(op);
            }

            const sortedPriorities = Array.from(buckets.keys()).sort((a, b) => a - b);

            for (const priority of sortedPriorities) {
                if (typeof window !== 'undefined' && !navigator.onLine) break;

                const stageOps = buckets.get(priority)!.sort((a, b) => {
                    const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return tA - tB;
                });

                // Track if any HISTORY CREATE failed so we don't execute SESSION DELETE in the next stage
                let historyStageHadFailure = false;

                for (let i = 0; i < stageOps.length; i += this.CHUNK_SIZE) {
                    if (typeof window !== 'undefined' && !navigator.onLine) break;

                    const chunk = stageOps.slice(i, i + this.CHUNK_SIZE);
                    const results = await Promise.allSettled(
                        chunk.map(op => this.processSingleOp(op, supabase, activeUserId))
                    );

                    const idsToDelete: number[] = [];

                    for (let j = 0; j < chunk.length; j++) {
                        const op = chunk[j];
                        const res = results[j];

                        if (res.status === 'fulfilled') {
                            const { success, permanentFailure, errorMessage } = res.value;
                            if (success) {
                                if (op.id) idsToDelete.push(op.id);
                            } else if (permanentFailure) {
                                if (op.entityType === 'HISTORY') historyStageHadFailure = true;
                                await db.syncQueue.update(op.id!, {
                                    status: 'FAILED',
                                    retryCount: (op.retryCount || 0) + 1,
                                    errorMessage: errorMessage || 'Permanent sync error'
                                });
                            } else if (errorMessage) {
                                if (op.entityType === 'HISTORY') historyStageHadFailure = true;
                                const newRetryCount = (op.retryCount || 0) + 1;
                                await db.syncQueue.update(op.id!, {
                                    retryCount: newRetryCount,
                                    status: newRetryCount >= 8 ? 'FAILED' : 'PENDING',
                                    errorMessage
                                });
                            }
                        } else {
                            if (op.entityType === 'HISTORY') historyStageHadFailure = true;
                            const errorMessage = String(res.reason);
                            const newRetryCount = (op.retryCount || 0) + 1;
                            await db.syncQueue.update(op.id!, {
                                retryCount: newRetryCount,
                                status: newRetryCount >= 8 ? 'FAILED' : 'PENDING',
                                errorMessage
                            });
                        }
                    }

                    if (idsToDelete.length > 0) {
                        await db.syncQueue.bulkDelete(idsToDelete);
                    }
                }

                // Safety barrier: if HISTORY CREATE failed, do NOT delete the corresponding SESSION yet!
                if (priority === 6 && historyStageHadFailure) {
                    console.warn('[SyncManager] History sync had failures — deferring SESSION DELETE stage to protect user data.');
                    break;
                }
            }

            notifyQueueChanged();
        } finally {
            this.isSyncing = false;

            if (this.pendingAfterSync) {
                this.pendingAfterSync = false;
                await this.processQueue().catch((err) => {
                    console.error('[SyncManager] re-triggered processQueue error:', err);
                });
            }
        }
    }

    static init() {
        if (typeof window === 'undefined') return;

        this.processQueue().catch((err) => {
            console.error('[SyncManager] init processQueue error:', err);
        });
    }

    static async getPendingCount(): Promise<number> {
        if (typeof window === 'undefined') return 0;
        const pending = await db.syncQueue.where('status').equals('PENDING').count();
        const failed = await db.syncQueue.where('status').equals('FAILED').count();
        return pending + failed;
    }

    static async getQueueItems(): Promise<SyncOperation[]> {
        if (typeof window === 'undefined') return [];
        return await db.syncQueue.orderBy('createdAt').reverse().toArray();
    }

    static async clearFailedOps(): Promise<void> {
        if (typeof window === 'undefined') return;
        const failedOps = await db.syncQueue.where('status').equals('FAILED').toArray();
        const ids = failedOps.map(op => op.id!).filter(Boolean);
        if (ids.length > 0) {
            await db.syncQueue.bulkDelete(ids);
            notifyQueueChanged();
        }
    }

    static async resetFailedOps(): Promise<number> {
        if (typeof window === 'undefined') return 0;
        const failedOps = await db.syncQueue.where('status').equals('FAILED').toArray();
        if (failedOps.length === 0) return 0;
        await db.syncQueue.where('status').equals('FAILED').modify({
            status: 'PENDING',
            retryCount: 0,
            errorMessage: undefined
        });
        notifyQueueChanged();
        return failedOps.length;
    }

    /**
     * Auto-recovers transient FAILED operations (timeouts, network drops, expired JWTs)
     * when the device comes back online, without requiring manual user action.
     */
    static async resetTransientFailedOps(): Promise<number> {
        if (typeof window === 'undefined') return 0;
        const failedOps = await db.syncQueue.where('status').equals('FAILED').toArray();
        const transientIds = failedOps
            .filter(op => !this.isPermanentSchemaError('', op.errorMessage || ''))
            .map(op => op.id!)
            .filter(Boolean);

        if (transientIds.length === 0) return 0;

        await Promise.all(
            transientIds.map(id =>
                db.syncQueue.update(id, {
                    status: 'PENDING',
                    retryCount: 0,
                    errorMessage: undefined
                })
            )
        );
        notifyQueueChanged();
        return transientIds.length;
    }

    static async retryFailed(autoProcess = true): Promise<void> {
        await this.resetFailedOps();
        if (autoProcess) {
            await this.processQueue().catch(() => {});
        }
    }

    // --- Private Helpers ---

    private static async resolveUserId(supabase: any): Promise<string | null> {
        // Fast path 1: local session stored in browser (instant, 0ms)
        try {
            const { data: { session } } = await withTimeout(supabase.auth.getSession(), 1000);
            if (session?.user?.id) return session.user.id;
        } catch {
            // getSession timed out or failed
        }

        // Fast path 2: dedicated active auth user ID (NEVER db.users.first())
        const storedId = getStoredActiveAuthUserId();
        if (storedId) return storedId;

        // Fallback: network getUser
        try {
            const { data: { user } } = await withTimeout(supabase.auth.getUser(), 3000);
            if (user?.id) return user.id;
        } catch {
            // getUser network failure/timeout
        }

        return null;
    }

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
        return {
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
    }

    private static cleanSessionInsertPayload(payload: any, activeUserId: string): any {
        if (!payload || typeof payload !== 'object') return payload;
        return {
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
    }

    private static cleanWorkoutInsertPayload(payload: any, activeUserId: string): any {
        if (!payload || typeof payload !== 'object') return payload;
        return {
            id: toValidUUIDOrNull(payload.id) || crypto.randomUUID(),
            user_id: toValidUUIDOrNull(payload.user_id || payload.userId) || activeUserId,
            created_by: toValidUUIDOrNull(payload.created_by || payload.createdBy) || activeUserId,
            created_by_type: payload.created_by_type || payload.createdByType || 'user',
            name: payload.name || 'Treino sem nome',
            description: payload.description || null,
            exercises: payload.exercises || [],
            created_at: payload.created_at ? (payload.created_at instanceof Date ? payload.created_at.toISOString() : payload.created_at) : new Date().toISOString(),
        };
    }

    private static cleanScheduleInsertPayload(payload: any, activeUserId: string): any {
        if (!payload || typeof payload !== 'object') return payload;
        return {
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
        if (typeof payload.id === 'number' && payload.id < 100000) {
            cleaned.id = payload.id;
        }
        return cleaned;
    }

    private static cleanExerciseUpdatePayload(payload: any): any {
        if (!payload || typeof payload !== 'object') return payload;
        const cleaned = { ...payload };
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
            const { error } = await withTimeout(supabase.from('history').insert(payload), this.OP_TIMEOUT_MS);
            if (error) {
                if (error.code === '23505') return true;
                if (error.code === '23503' && payload.workout_id) {
                    console.warn(`[SyncManager] FK violation on workout_id for history ${op.entityId}, retrying with workout_id = null`);
                    const fallbackPayload = { ...payload, workout_id: null };
                    const { error: fallbackError } = await withTimeout(supabase.from('history').insert(fallbackPayload), this.OP_TIMEOUT_MS);
                    if (fallbackError && fallbackError.code !== '23505') throw fallbackError;
                    return true;
                }
                throw error;
            }
        } else if (op.action === 'UPDATE') {
            const payload = this.cleanUpdatePayload(op.payload);
            const { error } = await withTimeout(supabase.from('history').update(payload).eq('id', op.entityId), this.OP_TIMEOUT_MS);
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('history').delete().eq('id', op.entityId), this.OP_TIMEOUT_MS);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }

    private static async syncSession(op: SyncOperation, supabase: any, activeUserId: string): Promise<boolean> {
        if (op.action === 'CREATE') {
            const payload = this.cleanSessionInsertPayload(op.payload, activeUserId);
            const { error } = await withTimeout(supabase.from('sessions').insert(payload), this.OP_TIMEOUT_MS);
            if (error) {
                if (error.code === '23505') return true;
                if (error.code === '23503' && payload.workout_id) {
                    const fallbackPayload = { ...payload, workout_id: null };
                    const { error: fallbackError } = await withTimeout(supabase.from('sessions').insert(fallbackPayload), this.OP_TIMEOUT_MS);
                    if (fallbackError && fallbackError.code !== '23505') throw fallbackError;
                    return true;
                }
                throw error;
            }
        } else if (op.action === 'UPDATE') {
            const payload = this.cleanUpdatePayload(op.payload);
            const { error } = await withTimeout(supabase.from('sessions').update(payload).eq('id', op.entityId), this.OP_TIMEOUT_MS);
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('sessions').delete().eq('id', op.entityId), this.OP_TIMEOUT_MS);
            if (error && error.code !== 'PGRST116') throw error;

            // Delete locally only after remote confirmation (and AFTER HISTORY CREATE stage succeeded!)
            if (typeof window !== 'undefined') {
                await db.sessions.delete(op.entityId as string).catch(() => {});
            }
        }
        return true;
    }

    private static async syncWorkout(op: SyncOperation, supabase: any, activeUserId: string): Promise<boolean> {
        if (op.action === 'CREATE') {
            const payload = this.cleanWorkoutInsertPayload(op.payload, activeUserId);
            const { error } = await withTimeout(supabase.from('workouts').insert(payload), this.OP_TIMEOUT_MS);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const payload = this.cleanUpdatePayload(op.payload);
            const { error } = await withTimeout(supabase.from('workouts').update(payload).eq('id', op.entityId), this.OP_TIMEOUT_MS);
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('workouts').delete().eq('id', op.entityId), this.OP_TIMEOUT_MS);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }

    private static async syncSchedule(op: SyncOperation, supabase: any, activeUserId: string): Promise<boolean> {
        if (op.action === 'CREATE') {
            const payload = this.cleanScheduleInsertPayload(op.payload, activeUserId);
            const { error } = await withTimeout(supabase.from('schedules').insert(payload), this.OP_TIMEOUT_MS);
            if (error && error.code !== '23505') throw error;
        } else if (op.action === 'UPDATE') {
            const payload = this.cleanUpdatePayload(op.payload);
            const { error } = await withTimeout(supabase.from('schedules').update(payload).eq('id', op.entityId), this.OP_TIMEOUT_MS);
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('schedules').delete().eq('id', op.entityId), this.OP_TIMEOUT_MS);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }

    private static async syncExercise(op: SyncOperation, supabase: any, activeUserId: string): Promise<boolean> {
        if (op.action === 'CREATE') {
            const payload = this.cleanExerciseInsertPayload(op.payload, activeUserId);
            const { data, error } = await withTimeout(
                supabase.from('exercises').insert(payload).select('id').maybeSingle(),
                this.OP_TIMEOUT_MS
            );
            if (error && error.code !== '23505') throw error;

            // Se o exercício local usava ID temporário (>100000), atualiza para o ID oficial do Postgres
            if (data?.id && typeof op.entityId === 'number' && op.entityId >= 100000 && data.id !== op.entityId) {
                const localEx = await db.exercises.get(op.entityId);
                if (localEx) {
                    await db.exercises.put({ ...localEx, id: data.id });
                    await db.exercises.delete(op.entityId);
                }
            }
        } else if (op.action === 'UPDATE') {
            const payload = this.cleanExerciseUpdatePayload(op.payload);
            const { error } = await withTimeout(supabase.from('exercises').update(payload).eq('id', op.entityId), this.OP_TIMEOUT_MS);
            if (error && error.code !== 'PGRST116') throw error;
        } else if (op.action === 'DELETE') {
            const { error } = await withTimeout(supabase.from('exercises').delete().eq('id', op.entityId), this.OP_TIMEOUT_MS);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }

    private static async syncUser(op: SyncOperation, supabase: any, _activeUserId: string): Promise<boolean> {
        if (op.action === 'UPDATE') {
            const payload = this.cleanUserUpdatePayload(op.payload);
            const { error } = await withTimeout(supabase.from('profiles').update(payload).eq('id', op.entityId), this.OP_TIMEOUT_MS);
            if (error && error.code !== 'PGRST116') throw error;
        }
        return true;
    }
}
