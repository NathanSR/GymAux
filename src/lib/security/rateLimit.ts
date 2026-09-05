/**
 * In-Memory Sliding Window / Token Bucket Rate Limiter
 * Provides zero-dependency, sub-millisecond rate limiting for Next.js API routes.
 */

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic cleanup every 5 minutes to avoid memory leaks
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, record] of rateLimitStore.entries()) {
            if (now > record.resetTime) {
                rateLimitStore.delete(key);
            }
        }
    }, 5 * 60 * 1000).unref?.();
}

export interface RateLimitOptions {
    limit: number;       // Maximum requests allowed in the window
    windowMs: number;    // Window duration in milliseconds
}

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
    retryAfterSeconds: number;
}

export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
        // First request or window expired
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + options.windowMs,
        });

        return {
            success: true,
            limit: options.limit,
            remaining: Math.max(0, options.limit - 1),
            reset: Math.ceil((now + options.windowMs) / 1000),
            retryAfterSeconds: 0,
        };
    }

    if (record.count >= options.limit) {
        // Exceeded limit
        const retryAfterSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
        return {
            success: false,
            limit: options.limit,
            remaining: 0,
            reset: Math.ceil(record.resetTime / 1000),
            retryAfterSeconds,
        };
    }

    // Increment count
    record.count += 1;
    return {
        success: true,
        limit: options.limit,
        remaining: options.limit - record.count,
        reset: Math.ceil(record.resetTime / 1000),
        retryAfterSeconds: 0,
    };
}

/**
 * Extracts a sanitized client IP from NextRequest headers
 */
export function getClientIp(headers: Headers): string {
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        // Takes the first IP in the list (client IP) and trims whitespace
        return forwardedFor.split(',')[0].trim();
    }
    const realIp = headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }
    return '127.0.0.1';
}
