/**
 * Client-side UTM / source extraction.
 *
 * Call `getTrackingParams()` after mount to read from `window.location.search`
 * and `document.referrer`. Values are pre-filled into the lead form's hidden
 * fields.
 */

export interface TrackingParams {
  source?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  referrer?: string;
}

export function getTrackingParams(): TrackingParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);

  const src = params.get("src") ?? undefined;
  const utm = {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
    term: params.get("utm_term") ?? undefined,
    content: params.get("utm_content") ?? undefined,
  };

  const hasUtm = Object.values(utm).some(Boolean);

  return {
    source: src,
    utm: hasUtm ? utm : undefined,
    referrer: document.referrer || undefined,
  };
}
