"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

/**
 * Cookie Consent Manager — lightweight, GDPR-compliant.
 *
 * Categories:
 *   - "essential": always on (session, consent state).
 *   - "analytics": optional (currently unused — prepared for GA/Plausible).
 *   - "marketing": optional (currently unused — prepared for TikTok Pixel etc.).
 *
 * Choice is stored in localStorage under `voggs-consent-v2`.
 * The stored value is a JSON object: { essential: true, analytics: boolean, marketing: boolean }.
 *
 * Components/scripts can check consent status via the exported
 * `getConsentState()` function before loading third-party scripts.
 */

const STORAGE_KEY = "voggs-consent-v2";

export interface ConsentState {
  essential: true;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_STATE: ConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
};

export function getConsentState(): ConsentState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      essential: true,
      analytics: parsed.analytics ?? false,
      marketing: parsed.marketing ?? false,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (state: ConsentState) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const acceptAll = () => {
    save({ essential: true, analytics: true, marketing: true });
  };

  const acceptSelected = () => {
    save({ essential: true, analytics, marketing });
  };

  const rejectOptional = () => {
    save({ essential: true, analytics: false, marketing: false });
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie-Einstellungen"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50",
        "border-t border-border bg-surface/95 backdrop-blur-md",
        "px-4 py-5 sm:px-6"
      )}
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Cookie-Einstellungen
            </p>
            <p className="mt-1 text-sm text-muted">
              Wir nutzen Cookies, um die Website zu betreiben und optional
              zur Analyse und Vermarktung. Du kannst selbst entscheiden,
              welche Kategorien du zulässt.{" "}
              <a
                href="/datenschutz"
                className="text-foreground underline underline-offset-4"
              >
                Datenschutzerklärung
              </a>
            </p>

            {showDetails && (
              <div className="mt-4 space-y-3 rounded-md border border-border bg-background/50 p-4">
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="h-4 w-4 rounded accent-accent"
                  />
                  <div>
                    <span className="font-medium text-foreground">
                      Essenziell
                    </span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      (immer aktiv)
                    </span>
                    <p className="text-xs text-muted">
                      Technisch notwendig für die Funktion der Website.
                      Consent-Speicherung, Session-Management.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-4 w-4 rounded accent-accent"
                  />
                  <div>
                    <span className="font-medium text-foreground">
                      Analyse
                    </span>
                    <p className="text-xs text-muted">
                      Hilft uns zu verstehen, wie Besucher die Seite nutzen
                      (z.B. Google Analytics, Plausible).
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="h-4 w-4 rounded accent-accent"
                  />
                  <div>
                    <span className="font-medium text-foreground">
                      Marketing
                    </span>
                    <p className="text-xs text-muted">
                      Ermöglicht Conversion-Tracking und Retargeting (z.B.
                      TikTok Pixel, Meta Pixel).
                    </p>
                  </div>
                </label>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={acceptAll}
                className={cn(
                  "rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground",
                  "hover:bg-accent-hover transition-colors"
                )}
              >
                Alle akzeptieren
              </button>

              {showDetails ? (
                <button
                  type="button"
                  onClick={acceptSelected}
                  className={cn(
                    "rounded-md border border-border px-4 py-2 text-sm",
                    "hover:border-border-strong hover:bg-surface-2 transition-colors"
                  )}
                >
                  Auswahl speichern
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className={cn(
                    "rounded-md border border-border px-4 py-2 text-sm",
                    "hover:border-border-strong hover:bg-surface-2 transition-colors"
                  )}
                >
                  Einstellungen
                </button>
              )}

              <button
                type="button"
                onClick={rejectOptional}
                className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                Nur essenziell
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
