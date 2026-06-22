// Rate limiter with Upstash Redis backend, graceful fallback to in-memory
// Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable Redis

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// --- In-memory fallback ---
interface RateLimitEntry { count: number; resetAt: number; }
const memStore = new Map<string, RateLimitEntry>();
const CLEANUP_INTERVAL = 10 * 60 * 1000;
let lastCleanup = Date.now();

function memCleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of memStore.entries()) {
    if (now > entry.resetAt) memStore.delete(key);
  }
}

function memRateLimit(windowMs: number, maxRequests: number, identifier: string) {
  memCleanup();
  const now = Date.now();
  const entry = memStore.get(identifier);
  if (!entry || now > entry.resetAt) {
    memStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }
  entry.count++;
  return entry.count > maxRequests
    ? { allowed: false, remaining: 0, resetAt: entry.resetAt }
    : { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

// --- Upstash Redis ---
let redis: Redis | null = null;
const ratelimitCache = new Map<string, Ratelimit>();

function getRedisClient(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    redis = new Redis({ url, token });
    return redis;
  } catch { return null; }
}

function getRatelimit(windowMs: number, maxRequests: number): Ratelimit | null {
  const client = getRedisClient();
  if (!client) return null;
  const key = `${windowMs}:${maxRequests}`;
  const cached = ratelimitCache.get(key);
  if (cached) return cached;
  const rl = new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(maxRequests, `${Math.ceil(windowMs / 1000)} s`),
    analytics: true,
  });
  ratelimitCache.set(key, rl);
  return rl;
}

// --- Public API ---
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  identifier?: string;
}

export async function rateLimit(config: RateLimitConfig): Promise<{
  allowed: boolean; remaining: number; resetAt: number;
}> {
  const { windowMs, maxRequests, identifier = "global" } = config;

  const rl = getRatelimit(windowMs, maxRequests);
  if (rl) {
    try {
      const result = await rl.limit(identifier);
      return {
        allowed: result.success,
        remaining: result.remaining,
        resetAt: result.reset,
      };
    } catch {
      // Fall through to in-memory on Redis failure
    }
  }

  return memRateLimit(windowMs, maxRequests, identifier);
}

export async function applyRateLimit(
  request: Request,
  config: Omit<RateLimitConfig, "identifier"> & { identifier?: string }
): Promise<Response | null> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const result = await rateLimit({
    ...config,
    identifier: config.identifier || `rate:${ip}`,
  });

  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }
  return null;
}
