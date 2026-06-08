// Simple in-memory rate limiter using sliding window
// For production, replace with Upstash Redis or Vercel KV

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 10 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

interface RateLimitConfig {
  windowMs: number; // time window in milliseconds
  maxRequests: number; // max requests per window
  identifier?: string; // unique identifier (IP, user ID, etc.)
}

export function rateLimit(config: RateLimitConfig): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  cleanup();

  const { windowMs, maxRequests, identifier = "global" } = config;
  const now = Date.now();

  const entry = store.get(identifier);

  // No previous entry or window expired
  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  // Within window — check limit
  entry.count++;

  if (entry.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

// Apply rate limiting to an API route
export function applyRateLimit(
  request: Request,
  config: Omit<RateLimitConfig, "identifier"> & { identifier?: string }
): Response | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const result = rateLimit({
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
          "Retry-After": String(
            Math.ceil((result.resetAt - Date.now()) / 1000)
          ),
        },
      }
    );
  }

  return null;
}
