"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LeadDialog } from "@/components/lead-dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { getPerspectiveUrl, type OptInParams } from "@/lib/opt-in";
import type { Interest } from "@/lib/validation";

interface OptInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  params?: OptInParams;
  onComplete?: () => void;
  defaultInterests?: Interest[];
  analyzerScore?: number;
}

/**
 * Embeds the Perspective lead funnel in an iframe.
 *
 * Completion detection ONLY fires when the Perspective thank-you page posts
 * an explicit completion message. Example snippet on the thank-you page:
 *
 *   <script>
 *     window.parent.postMessage(
 *       { type: "perspective_complete", page: "page_sj8557" },
 *       "*"
 *     );
 *   </script>
 *
 * Earlier versions of this component also auto-closed on the 2nd iframe
 * `onload` and on any postMessage containing words like "submit" — that was
 * WRONG. Multi-step Perspective funnels reload on each step and emit
 * intermediate events; those heuristics killed the iframe mid-funnel and the
 * lead never reached Perspective. Keep detection strict.
 *
 * A manual "Formular abgesendet"-button appears as a last-resort fallback
 * after 25s. Cancel ("Abbrechen") closes without unlocking.
 */
const COMPLETION_PAGE_IDS = ["page_sj8557"] as const;
const MANUAL_FALLBACK_DELAY_MS = 25_000;

function isCompletionMessage(data: unknown): boolean {
  if (data == null) return false;
  const serialized =
    typeof data === "object" ? JSON.stringify(data) : String(data);
  if (/perspective_complete|funnel_complete|voggs_unlock/i.test(serialized)) {
    return true;
  }
  for (const id of COMPLETION_PAGE_IDS) {
    if (serialized.includes(id)) return true;
  }
  return false;
}

export function OptInDialog({
  open,
  onOpenChange,
  params,
  onComplete,
  defaultInterests,
  analyzerScore,
}: OptInDialogProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showManualFallback, setShowManualFallback] = useState(false);
  const completedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const url = getPerspectiveUrl(params);

  const markCompleted = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setCompleted(true);
  };

  const scheduleAutoClose = (delayMs = 1200) => {
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    autoCloseTimer.current = setTimeout(() => onOpenChange(false), delayMs);
  };

  useEffect(() => {
    if (open) {
      setIframeLoaded(false);
      setCompleted(false);
      setShowManualFallback(false);
      completedRef.current = false;
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
      fallbackTimer.current = setTimeout(() => {
        setShowManualFallback(true);
      }, MANUAL_FALLBACK_DELAY_MS);
    } else {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
        autoCloseTimer.current = null;
      }
      if (fallbackTimer.current) {
        clearTimeout(fallbackTimer.current);
        fallbackTimer.current = null;
      }
      if (completedRef.current) {
        onComplete?.();
      }
    }
  }, [open, onComplete]);

  useEffect(() => {
    if (!open) return;
    const onMessage = (event: MessageEvent) => {
      if (process.env.NODE_ENV === "development") {
        console.log("[OptInDialog] postMessage:", event.origin, event.data);
      }
      if (!event.origin.includes("perspectivefunnel.com")) return;
      if (isCompletionMessage(event.data)) {
        markCompleted();
        scheduleAutoClose(1200);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open, onOpenChange]);

  // Same-origin URL check: only triggers if the user configured Perspective
  // to redirect to our own domain on final submit (optional setup).
  const handleIframeLoad = () => {
    setIframeLoaded(true);
    if (process.env.NODE_ENV === "development") {
      console.log("[OptInDialog] iframe onload");
    }
    try {
      const iframeHref = iframeRef.current?.contentWindow?.location?.href;
      if (iframeHref) {
        for (const id of COMPLETION_PAGE_IDS) {
          if (iframeHref.includes(id)) {
            markCompleted();
            scheduleAutoClose(1200);
            return;
          }
        }
      }
    } catch {
      // Cross-origin — expected. Rely on postMessage from the thank-you page.
    }
  };

  if (!url) {
    return (
      <LeadDialog
        open={open}
        onOpenChange={onOpenChange}
        defaultInterests={defaultInterests}
        analyzerScore={analyzerScore}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden rounded-none border-0 p-0 sm:h-auto sm:max-h-[94vh] sm:max-w-[580px] sm:rounded-lg sm:border">
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          {!iframeLoaded && (
            <div className="flex h-full min-h-[420px] w-full items-center justify-center">
              <div className="h-8 w-8 animate-pulse-ring rounded-full bg-accent/30" />
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={url}
            title="Report freischalten"
            onLoad={handleIframeLoad}
            className={
              "h-full min-h-[420px] w-full border-0 bg-surface sm:h-[min(86vh,720px)] " +
              (iframeLoaded ? "block" : "hidden")
            }
          />
        </div>
        <div className="flex flex-col gap-2 border-t border-border bg-surface-2/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            {completed
              ? "Geschafft — Report wird gleich angezeigt."
              : "Dein Report wird nach dem Absenden automatisch angezeigt."}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Abbrechen
            </button>
            {showManualFallback && !completed && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  markCompleted();
                  onOpenChange(false);
                }}
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                Formular abgesendet
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
