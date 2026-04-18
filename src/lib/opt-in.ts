/**
 * Opt-in routing helper.
 *
 * When NEXT_PUBLIC_PERSPECTIVE_FUNNEL_URL is set, all report/audit CTAs
 * redirect there with score + interest + UTM params attached, so leads
 * land in Perspective with full context. When unset, callers fall back
 * to the native <LeadDialog>.
 */

import type { Interest } from "@/lib/validation";

export interface OptInParams {
  score?: number;
  verdict?: string;
  interest?: Interest;
  /** Free-form source tag (e.g. "analyzer", "audit_cta", "hero"). */
  source?: string;
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function resolveFunnelBase(params: OptInParams): string | undefined {
  // Interest-specific funnel overrides let you A/B test or route leads to
  // differently-tuned Perspective funnels (e.g. a light-touch Report funnel
  // vs. a qualifying Audit funnel). Falls through to the generic URL.
  if (params.interest === "analyzer_report") {
    const specific = process.env.NEXT_PUBLIC_PERSPECTIVE_REPORT_URL;
    if (specific) return specific;
  }
  if (params.interest === "account_audit" || params.interest === "creative_audit") {
    const specific = process.env.NEXT_PUBLIC_PERSPECTIVE_AUDIT_URL;
    if (specific) return specific;
  }
  return process.env.NEXT_PUBLIC_PERSPECTIVE_FUNNEL_URL;
}

export function getPerspectiveUrl(params: OptInParams = {}): string | null {
  const base = resolveFunnelBase(params);
  if (!base) return null;

  let url: URL;
  try {
    url = new URL(base);
  } catch {
    return null;
  }

  if (params.score != null) url.searchParams.set("score", String(params.score));
  if (params.verdict) url.searchParams.set("verdict", params.verdict);
  if (params.interest) url.searchParams.set("interest", params.interest);
  if (params.source) url.searchParams.set("source", params.source);

  if (typeof window !== "undefined") {
    const current = new URLSearchParams(window.location.search);
    for (const key of UTM_KEYS) {
      const v = current.get(key);
      if (v) url.searchParams.set(key, v);
    }
    if (!url.searchParams.has("utm_source") && params.source) {
      url.searchParams.set("utm_source", params.source);
    }
  }

  return url.toString();
}

/**
 * Open the Perspective funnel in the same tab if configured, else return
 * `false` so the caller can fall back to the native lead dialog.
 */
export function routeToOptIn(params: OptInParams = {}): boolean {
  const url = getPerspectiveUrl(params);
  if (!url || typeof window === "undefined") return false;
  window.location.href = url;
  return true;
}
