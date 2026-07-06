/**
 * No-op Migration script.
 * Dexie.js has been deprecated and replaced by RxDB (with automated client-side replication).
 */
export async function migrateLocalData() {
    return Promise.resolve();
}
