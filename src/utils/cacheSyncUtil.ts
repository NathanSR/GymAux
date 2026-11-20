import { db } from '@/config/db';
import { Table } from 'dexie';

export type SyncEntityType = 'SCHEDULE' | 'WORKOUT' | 'EXERCISE' | 'SESSION' | 'HISTORY' | 'USER';

const countExecutedSets = (executions: any): number => {
    if (!Array.isArray(executions)) return 0;
    return executions.reduce((acc, group) => {
        if (!group || !Array.isArray(group.exercises)) return acc;
        return acc + group.exercises.reduce((exAcc: number, ex: any) => {
            return exAcc + (Array.isArray(ex?.sets) ? ex.sets.length : 0);
        }, 0);
    }, 0);
};

async function getPendingEntityIds(entityType: SyncEntityType): Promise<Set<string>> {
    const pendingOps = await db.syncQueue
        .where('entityType')
        .equals(entityType)
        .and(op => op.status === 'PENDING' || op.status === 'FAILED')
        .toArray();
    return new Set(pendingOps.map(op => String(op.entityId)));
}

/**
 * Safely puts remote items into a local Dexie table without overwriting items
 * that have unsynced local mutations (PENDING or FAILED in syncQueue),
 * richer local execution progress, or newer local timestamps.
 *
 * NEVER falls back to blind `table.bulkPut(remoteItems)` on error.
 */
export async function safeBulkPut<T extends { id?: string | number; updatedAt?: Date | string }>(
    table: Table<T, any>,
    remoteItems: T[],
    entityType: SyncEntityType
): Promise<void> {
    if (typeof window === 'undefined' || !remoteItems || remoteItems.length === 0) return;

    try {
        const pendingEntityIds = await getPendingEntityIds(entityType);

        const validItems = remoteItems.filter(item => item && item.id !== undefined && item.id !== null);
        if (validItems.length === 0) return;

        const validIds = validItems.map(item => item.id as any);
        const localRecordsList = await table.bulkGet(validIds);

        const localRecordMap = new Map<string, T>();
        validIds.forEach((id, idx) => {
            const rec = localRecordsList[idx];
            if (rec) {
                localRecordMap.set(String(id), rec);
            }
        });

        const itemsToPut: T[] = [];

        for (const item of validItems) {
            const itemIdStr = String(item.id);

            // Never overwrite an item that has unsynced local mutations
            if (pendingEntityIds.has(itemIdStr)) {
                continue;
            }

            const localRecord = localRecordMap.get(itemIdStr);

            // Never resurrect a session marked as finished locally
            if (entityType === 'SESSION' && localRecord) {
                if ((localRecord as any).isFinishedLocally) {
                    continue;
                }
                const localSetsCount = countExecutedSets((localRecord as any).exercisesDone);
                const remoteSetsCount = countExecutedSets((item as any).exercisesDone);
                if (localSetsCount > remoteSetsCount) {
                    console.warn(`[safeBulkPut] Preserving richer local session ${item.id} (${localSetsCount} sets) over remote (${remoteSetsCount} sets)`);
                    continue;
                }
            }

            // Never overwrite a richer local history record with fewer completed sets
            if (entityType === 'HISTORY' && localRecord) {
                const localSetsCount = countExecutedSets((localRecord as any).executions);
                const remoteSetsCount = countExecutedSets((item as any).executions);
                if (localSetsCount > remoteSetsCount) {
                    console.warn(`[safeBulkPut] Preserving richer local history ${item.id} (${localSetsCount} sets) over remote (${remoteSetsCount} sets)`);
                    continue;
                }
            }

            if (localRecord && localRecord.updatedAt) {
                const localTime = new Date(localRecord.updatedAt).getTime();
                const remoteTime = item.updatedAt ? new Date(item.updatedAt).getTime() : 0;

                if (localTime > remoteTime) {
                    continue;
                }
            }

            itemsToPut.push(item);
        }

        if (itemsToPut.length > 0) {
            await table.bulkPut(itemsToPut);
        }
    } catch (error) {
        // CRITICAL: Never blindly overwrite local data on error.
        console.error(`[cacheSyncUtil] safeBulkPut aborted safely for ${entityType}:`, error);
    }
}

/**
 * Full-collection reconciliation for a specific `userId`:
 * 1. Safely upserts all remote items via `safeBulkPut`.
 * 2. Removes stale local items for that `userId` that no longer exist on the server,
 *    ONLY IF they have NO pending/failed mutations in `db.syncQueue`.
 *
 * Call this ONLY when `remoteItems` represents the COMPLETE (unfiltered) set for `userId`.
 */
export async function safeSyncUserCollection<T extends { id?: string | number; userId?: string; updatedAt?: Date | string; createdAt?: Date | string }>(
    table: Table<T, any>,
    userId: string,
    remoteItems: T[],
    entityType: 'SCHEDULE' | 'WORKOUT'
): Promise<void> {
    if (typeof window === 'undefined' || !userId) return;

    try {
        if (remoteItems.length > 0) {
            await safeBulkPut(table, remoteItems, entityType);
        }

        const pendingEntityIds = await getPendingEntityIds(entityType);
        const remoteIdSet = new Set(remoteItems.map(item => String(item.id)));
        const localItems = await table.where('userId').equals(userId).toArray();

        const idsToRemove: (string | number)[] = [];
        const now = Date.now();

        for (const local of localItems) {
            if (local.id === undefined || local.id === null) continue;
            const idStr = String(local.id);

            if (remoteIdSet.has(idStr)) continue;
            if (pendingEntityIds.has(idStr)) continue;

            // Extra grace window (15s) to protect brand-new local records racing with an in-flight sync
            const createdTime = local.createdAt ? new Date(local.createdAt).getTime() : 0;
            if (createdTime > 0 && now - createdTime < 15_000) continue;

            idsToRemove.push(local.id);
        }

        if (idsToRemove.length > 0) {
            await table.bulkDelete(idsToRemove as any);
        }
    } catch (error) {
        console.error(`[cacheSyncUtil] safeSyncUserCollection aborted safely for ${entityType}:`, error);
    }
}
