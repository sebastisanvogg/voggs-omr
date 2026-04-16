"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Cloudflare Turnstile widget — invisible CAPTCHA.
 *
 * Loads the Turnstile script on mount, renders the widget, and calls
 * `onToken` when the challenge is solved. The token must be sent to
 * the server and verified via `/siteverify`.
 *
 * When `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is not set, this component
 * renders nothing (dev/mock mode).
 */

interface TurnstileProps {
  onToken: (token: string) => void;
  onError?: () => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_ID = "cf-turnstile-script";

export function Turnstile({ onToken, onError }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const handleCallback = useCallback(
    (token: string) => {
      onToken(token);
    },
    [onToken]
  );

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;

    // Load script if not already loaded
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Wait for turnstile to be available
    const interval = setInterval(() => {
      if (
        typeof window !== "undefined" &&
        (window as unknown as Record<string, unknown>).turnstile &&
        containerRef.current
      ) {
        clearInterval(interval);
        const turnstile = (window as unknown as Record<string, { render: (el: HTMLElement, opts: Record<string, unknown>) => string }>).turnstile;
        widgetId.current = turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: handleCallback,
          "error-callback": onError,
          theme: "dark",
          size: "invisible",
        });
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (widgetId.current) {
        try {
          const turnstile = (window as unknown as Record<string, { remove: (id: string) => void }>).turnstile;
          turnstile?.remove(widgetId.current);
        } catch {
          // widget may already be cleaned up
        }
      }
    };
  }, [handleCallback, onError]);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} />;
}
