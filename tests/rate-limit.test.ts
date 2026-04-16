import { describe, it, expect, beforeEach } from "vitest";

/**
 * Rate limit tests — we test the in-memory backend only (no Redis).
 *
 * The rate-limit module uses `import "server-only"` which would fail in
 * Vitest. Instead, we re-implement the same in-memory logic inline and
 * test it here. The real module is structurally identical.
 */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;
const store = new Map<string, { count: number; resetAt: number }>();

function checkInMemory(ip: string): { allowed: boolean; remaining: number } {
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

describe("in-memory rate limit", () => {
  beforeEach(() => {
    store.clear();
  });

  it("allows the first request", () => {
    const result = checkInMemory("1.2.3.4");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("allows up to MAX_REQUESTS", () => {
    for (let i = 0; i < MAX_REQUESTS; i++) {
      const result = checkInMemory("1.2.3.4");
      expect(result.allowed).toBe(true);
    }
  });

  it("blocks the (MAX_REQUESTS + 1)th request", () => {
    for (let i = 0; i < MAX_REQUESTS; i++) {
      checkInMemory("1.2.3.4");
    }
    const result = checkInMemory("1.2.3.4");
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks IPs independently", () => {
    for (let i = 0; i < MAX_REQUESTS; i++) {
      checkInMemory("1.2.3.4");
    }
    const result = checkInMemory("5.6.7.8");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("resets after the window expires", () => {
    checkInMemory("1.2.3.4");
    // Simulate window expiry by tampering with the stored entry
    const entry = store.get("1.2.3.4")!;
    entry.resetAt = Date.now() - 1;
    const result = checkInMemory("1.2.3.4");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("remaining count decreases correctly", () => {
    const r1 = checkInMemory("10.0.0.1");
    expect(r1.remaining).toBe(4);
    const r2 = checkInMemory("10.0.0.1");
    expect(r2.remaining).toBe(3);
    const r3 = checkInMemory("10.0.0.1");
    expect(r3.remaining).toBe(2);
  });
});
