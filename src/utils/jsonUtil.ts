/**
 * Utility functions for safe JSON parsing, array normalization, and numeric coercion.
 * Guarantees resilience against stringified JSON, null/undefined, and improper types.
 */

export function safeParseJson<T = any>(val: any, fallback?: T): T {
    if (val === null || val === undefined) return (fallback ?? val) as T;
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (!trimmed) return (fallback ?? val) as T;
        try {
            return JSON.parse(trimmed);
        } catch {
            return (fallback ?? val) as T;
        }
    }
    return val as T;
}

export function safeParseArray<T = any>(val: any): T[] {
    if (!val) return [];
    const parsed = safeParseJson(val, []);
    if (Array.isArray(parsed)) return parsed;
    return [];
}

export function safeParseNumber(val: any, fallback: number = 0): number {
    if (val === null || val === undefined || val === '') return fallback;
    const num = Number(val);
    return Number.isNaN(num) ? fallback : num;
}

export function safeParseObject<T extends Record<string, any> = Record<string, any>>(val: any, fallback: T = {} as T): T {
    if (!val) return fallback;
    const parsed = safeParseJson(val, fallback);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed as T;
    }
    return fallback;
}
