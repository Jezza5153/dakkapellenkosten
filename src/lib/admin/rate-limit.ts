/**
 * Rate Limiter — In-memory sliding window
 * Production-grade: per-IP, per-route buckets with configurable limits.
 * Falls back gracefully — never blocks legitimate admin usage.
 *
 * Usage in API routes:
 *   import { rateLimit } from "@/lib/admin/rate-limit";
 *   const limiter = rateLimit({ maxRequests: 30, windowMs: 60_000 });
 *   // In handler:
 *   const limited = limiter.check(request);
 *   if (limited) return limited; // Returns 429 response
 */

import { NextRequest, NextResponse } from "next/server";

interface RateLimitConfig {
    /** Max requests per window (default: 60) */
    maxRequests?: number;
    /** Window duration in ms (default: 60_000 = 1 minute) */
    windowMs?: number;
    /** Optional key prefix for sub-bucketing (e.g. "export") */
    prefix?: string;
}

interface BucketEntry {
    timestamps: number[];
    lastCleanup: number;
}

// Global in-memory store (works across API calls in the same Node process)
const store = new Map<string, BucketEntry>();

// Periodic cleanup to prevent memory leaks (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastGlobalCleanup = Date.now();

function globalCleanup(windowMs: number) {
    const now = Date.now();
    if (now - lastGlobalCleanup < CLEANUP_INTERVAL) return;
    lastGlobalCleanup = now;

    const cutoff = now - windowMs * 2; // Extra buffer
    for (const [key, entry] of store) {
        if (entry.lastCleanup < cutoff) {
            store.delete(key);
        }
    }
}

function getClientIp(request: NextRequest): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown"
    );
}

export function rateLimit(config: RateLimitConfig = {}) {
    const maxRequests = config.maxRequests ?? 60;
    const windowMs = config.windowMs ?? 60_000;
    const prefix = config.prefix ?? "default";

    return {
        /**
         * Check if a request should be rate-limited.
         * Returns null if allowed, or a 429 response if blocked.
         */
        check(request: NextRequest): NextResponse | null {
            const ip = getClientIp(request);
            const key = `${prefix}:${ip}`;
            const now = Date.now();
            const windowStart = now - windowMs;

            // Run periodic global cleanup
            globalCleanup(windowMs);

            // Get or create bucket
            let entry = store.get(key);
            if (!entry) {
                entry = { timestamps: [], lastCleanup: now };
                store.set(key, entry);
            }

            // Remove expired timestamps
            entry.timestamps = entry.timestamps.filter(t => t > windowStart);
            entry.lastCleanup = now;

            // Check limit
            if (entry.timestamps.length >= maxRequests) {
                const retryAfter = Math.ceil((entry.timestamps[0] + windowMs - now) / 1000);
                return NextResponse.json(
                    {
                        error: "Te veel verzoeken. Probeer het later opnieuw.",
                        retryAfterSeconds: retryAfter,
                    },
                    {
                        status: 429,
                        headers: {
                            "Retry-After": String(retryAfter),
                            "X-RateLimit-Limit": String(maxRequests),
                            "X-RateLimit-Remaining": "0",
                            "X-RateLimit-Reset": String(Math.ceil((entry.timestamps[0] + windowMs) / 1000)),
                        },
                    }
                );
            }

            // Allow request, record timestamp
            entry.timestamps.push(now);

            return null; // Not rate-limited
        },
    };
}

// Pre-configured limiters for common use cases
export const adminApiLimiter = rateLimit({ maxRequests: 60, windowMs: 60_000, prefix: "admin" });
export const exportLimiter = rateLimit({ maxRequests: 5, windowMs: 60_000, prefix: "export" });
export const authLimiter = rateLimit({ maxRequests: 10, windowMs: 60_000, prefix: "auth" });
export const cronLimiter = rateLimit({ maxRequests: 2, windowMs: 60_000, prefix: "cron" });
