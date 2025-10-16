import { NextResponse } from "next/server"

// In-memory store for rate limiting (untuk production gunakan Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
    maxRequests: number // Maksimal request
    windowMs: number // Window waktu dalam milidetik
}

/**
 * Generate rate limit key dari IP address dan user identifier
 */
export function limitKey(identifier: string, ipAddress?: string): string {
    const ip = ipAddress || "unknown"
    return `${ip}:${identifier}`
}

/**
 * Check rate limit untuk request
 * @param key - Unique key untuk tracking (gunakan limitKey())
 * @param config - Konfigurasi rate limit
 * @returns Object dengan allowed status dan info
 */
export function rateLimitCheck(
    key: string,
    config: RateLimitConfig = { maxRequests: 10, windowMs: 60000 } // Default: 10 req/minute
): {
    allowed: boolean
    remaining: number
    resetTime: number
    retryAfter?: number
} {
    const now = Date.now()
    const record = rateLimitStore.get(key)

    // Jika tidak ada record atau sudah expired, buat baru
    if (!record || now >= record.resetTime) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + config.windowMs,
        })

        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime: now + config.windowMs,
        }
    }

    // Jika masih dalam window, increment count
    if (record.count < config.maxRequests) {
        record.count++
        rateLimitStore.set(key, record)

        return {
            allowed: true,
            remaining: config.maxRequests - record.count,
            resetTime: record.resetTime,
        }
    }

    // Rate limit exceeded
    return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        retryAfter: Math.ceil((record.resetTime - now) / 1000), // dalam detik
    }
}

/**
 * Cleanup expired entries (jalankan secara periodik)
 */
export function cleanupExpiredEntries() {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
        if (now >= record.resetTime) {
            rateLimitStore.delete(key)
        }
    }
}

/**
 * Middleware helper untuk API routes
 */
export function createRateLimitResponse(
    retryAfter: number,
    message: string = "Terlalu banyak request. Coba lagi nanti."
) {
    return NextResponse.json(
        { error: message, retryAfter },
        {
            status: 429,
            headers: {
                "Retry-After": retryAfter.toString(),
                "X-RateLimit-Remaining": "0",
            },
        }
    )
}

/**
 * Get client IP address dari request
 */
export function getClientIp(request: Request): string {
    // Try various headers for IP address
    const forwardedFor = request.headers.get("x-forwarded-for")
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim()
    }

    const realIp = request.headers.get("x-real-ip")
    if (realIp) {
        return realIp
    }

    const cfConnectingIp = request.headers.get("cf-connecting-ip")
    if (cfConnectingIp) {
        return cfConnectingIp
    }

    return "unknown"
}

// Cleanup expired entries setiap 5 menit
if (typeof setInterval !== "undefined") {
    setInterval(cleanupExpiredEntries, 5 * 60 * 1000)
}

// Preset configurations
export const RateLimitPresets = {
    // Voting: 1 vote per 5 minutes
    VOTING: { maxRequests: 1, windowMs: 5 * 60 * 1000 },

    // Login: 5 attempts per 15 minutes
    LOGIN: { maxRequests: 5, windowMs: 15 * 60 * 1000 },

    // API Standard: 60 requests per minute
    STANDARD: { maxRequests: 60, windowMs: 60 * 1000 },

    // API Strict: 10 requests per minute
    STRICT: { maxRequests: 10, windowMs: 60 * 1000 },

    // Upload: 3 uploads per hour
    UPLOAD: { maxRequests: 3, windowMs: 60 * 60 * 1000 },
}