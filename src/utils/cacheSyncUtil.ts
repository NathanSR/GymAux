import { db } from '@/config/db';
import { Table } from 'dexie';

/**
 * Safely puts remote items into a local Dexie table without overwriting items
 * that have unsynced local mutations (PENDING or FAILED in syncQueue) or newer local timestamps.
 *
 * @param table Dexie Table instance (e.g. db.schedules)
 * @param remoteItems Array of items fetched from remote source (Supabase)
 * @param entityType Entity type matching syncQueue entityType ('SCHEDULE' | 'WORKOUT' | 'EXERCISE' | 'SESSION' | 'HISTORY')
 */
export async function safeBulkPut<T extends { id?: string | number; updatedAt?: Date | string }>(
    table: Table<T, any>,
    remoteItems: T[],
    entityType: 'SCHEDULE' | 'WORKOUT' | 'EXERCISE' | 'SESSION' | 'HISTORY'
): Promise<void> {
    if (typeof window === 'undefined' || !remoteItems || remoteItems.length === 0) return;

    try {
        // Fetch all pending or failed sync operations for this entity type
        const pendingOps = await db.syncQueue
            .where('entityType')
            .equals(entityType)
            .and(op => op.status === 'PENDING' || op.status === 'FAILED')
            .toArray();

        const pendingEntityIds = new Set(pendingOps.map(op => String(op.entityId)));

        const itemsToPut: T[] = [];

        for (const item of remoteItems) {
            if (!item || item.id === undefined || item.id === null) continue;

            const itemIdStr = String(item.id);

            // Skip remote item if local item has pending sync queue operations
            if (pendingEntityIds.has(itemIdStr)) {
                continue;
            }

            // Check existing local record for timestamp comparison
            const localRecord = await table.get(item.id as any);
            if (localRecord && localRecord.updatedAt) {
                const localTime = new Date(localRecord.updatedAt).getTime();
                const remoteTime = item.updatedAt ? new Date(item.updatedAt).getTime() : 0;

                // Keep local record if it is newer than remote
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
        console.error(`[cacheSyncUtil] safeBulkPut failed for ${entityType}:`, error);
        // Fallback: put items directly
        await table.bulkPut(remoteItems).catch(() => {});
    }
}
