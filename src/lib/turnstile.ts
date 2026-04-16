import "server-only";

/**
 * Server-side Cloudflare Turnstile token verification.
 *
 * When `TURNSTILE_SECRET_KEY` is not set, verification is skipped
 * (dev/mock mode — always returns true).
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileVerifyResult {
  verified: boolean;
  error?: string;
}

export async function verifyTurnstileToken(
  token: string | undefined,
  ip?: string
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // No secret configured → skip verification (dev mode)
  if (!secret) {
    return { verified: true };
  }

  // Secret configured but no token provided → reject
  if (!token) {
    return { verified: false, error: "Turnstile token missing." };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
      ...(ip ? { remoteip: ip } : {}),
    });

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) {
      return { verified: false, error: `Turnstile API returned ${res.status}` };
    }

    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };

    if (!data.success) {
      return {
        verified: false,
        error: `Turnstile failed: ${data["error-codes"]?.join(", ") ?? "unknown"}`,
      };
    }

    return { verified: true };
  } catch (err) {
    console.error("[turnstile] Verification error:", err);
    // Fail open in case of network issues to not block legit users
    return { verified: true };
  }
}
