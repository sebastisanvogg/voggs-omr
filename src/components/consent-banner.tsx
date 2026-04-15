"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * STUB — not a production-grade consent manager.
 *
 * This banner exists to satisfy the "datenschutz first" acceptance criterion
 * and to give the user a UI surface to dismiss before integrating a proper
 * CMP (e.g. Cookiebot, Usercentrics, Klaro).
 *
 * What this STUB does:
 *   - Shows a dismissable bar on first visit
 *   - Persists choice in localStorage under `voggs-consent-v1`
 *
 * What this STUB does NOT do:
 *   - Block any third-party scripts (the salespage doesn't load any)
 *   - Distinguish granular consent categories
 *   - Integrate with Google Consent Mode v2 / TCF
 *
 * TODO: before going live with tracking pixels, replace with a real CMP.
 */

const STORAGE_KEY = "voggs-consent-v1";

type ConsentChoice = "all" | "essential";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage may be unavailable (private mode); fail open.
      setVisible(true);
    }
  }, []);

  const decide = (choice: ConsentChoice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie-Hinweis"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50",
        "border-t border-border bg-surface/95 backdrop-blur",
        "px-4 py-4 sm:px-6"
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Wir nutzen ausschließlich technisch notwendige Cookies. Es findet
          kein Tracking durch Drittanbieter statt.{" "}
          <a href="/datenschutz" className="text-foreground underline underline-offset-4">
            Datenschutz
          </a>
          .
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => decide("essential")}
            className={cn(
              "rounded-md border border-border px-4 py-2 text-sm",
              "hover:border-border-strong hover:bg-surface-2 transition-colors"
            )}
          >
            Nur essenziell
          </button>
          <button
            type="button"
            onClick={() => decide("all")}
            className={cn(
              "rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground",
              "hover:bg-accent-hover transition-colors"
            )}
          >
            OK, verstanden
          </button>
        </div>
      </div>
    </div>
  );
}
