// src/middleware/rateLimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
    ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "60 s") });
}

export const limitKey = (key: string) => `rl:${key}`;

export async function rateLimitCheck(key: string) {
    if (!ratelimit) {
        // simple in-memory fallback (dev only)
        // naive: not persistent across instances; production must use redis
        (global as any).__rl_cache = (global as any).__rl_cache || {};
        const cache = (global as any).__rl_cache;
        const now = Date.now();
        cache[key] = cache[key] || [];
        // keep last minute
        cache[key] = cache[key].filter((t: number) => now - t < 60000);
        if (cache[key].length >= 10) throw new Error("rate_limited");
        cache[key].push(now);
        return;
    }
    const { success } = await ratelimit.limit(key);
    if (!success) throw new Error("rate_limited");
}
