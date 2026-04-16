import "server-only";

/**
 * Rate limit — 5 analyses per IP per hour.
 *
 * Two backends:
 *   1. **Upstash Redis** — when UPSTASH_REDIS_REST_URL and _TOKEN are set.
 *   2. **In-memory Map** — dev-only fallback. Per-instance, resets on restart.
 *      NOT safe for production (multiple instances = separate counts).
 */

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    return await checkUpstash(ip, upstashUrl, upstashToken);
  }

  return checkInMemory(ip);
}

/* -------------------------------------------------------------------------- */
/*  In-memory fallback                                                         */
/* -------------------------------------------------------------------------- */

const store = new Map<string, { count: number; resetAt: number }>();

function checkInMemory(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

/* -------------------------------------------------------------------------- */
/*  Upstash Redis                                                              */
/* -------------------------------------------------------------------------- */

async function checkUpstash(
  ip: string,
  url: string,
  token: string
): Promise<RateLimitResult> {
  const key = `ratelimit:analyze:${ip}`;
  const windowSec = Math.ceil(WINDOW_MS / 1000);

  // INCR + EXPIRE in a pipeline via REST API
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, windowSec.toString()],
    ]),
  });

  if (!res.ok) {
    // If Redis is unreachable, allow the request (fail open in dev; log in prod)
    console.error("[rate-limit] Upstash call failed:", res.status);
    return { allowed: true, remaining: MAX_REQUESTS };
  }

  // Response shape: [[number, result], ...]
  const body = (await res.json()) as Array<[number, number | string]>;
  const count = typeof body[0]?.[1] === "number" ? body[0][1] : 1;

  return {
    allowed: count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - count),
  };
}
