"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ExitIntentDialogProps {
  /** Gate: only arm the listeners when the user has something to lose. */
  armed: boolean;
  /** Called when the user clicks the unlock CTA in the popup. */
  onUnlock: () => void;
}

const STORAGE_KEY = "voggs-exit-shown-v1";

/**
 * Shows a one-shot "wait — unlock your report" prompt when the user signals
 * they are about to leave the tab. Triggers:
 *   - Desktop: `mouseleave` off the top of the viewport
 *   - Mobile: `visibilitychange` to hidden (tab switch / app switch)
 *
 * Armed only after the analyzer result is visible AND the report is still
 * locked. Only fires once per browser via localStorage.
 */
export function ExitIntentDialog({ armed, onUnlock }: ExitIntentDialogProps) {
  const [open, setOpen] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!armed || firedRef.current) return;
    if (typeof window === "undefined") return;

    try {
      if (window.localStorage.getItem(STORAGE_KEY)) {
        firedRef.current = true;
        return;
      }
    } catch {
      // localStorage might be disabled — carry on in-memory.
    }

    const trigger = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      setOpen(true);
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") trigger();
    };

    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [armed]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Sparkles className="h-5 w-5" />
          </div>
          <DialogTitle className="mt-3 text-center text-xl">
            Warte — 1 Klick und du hast den Report.
          </DialogTitle>
          <DialogDescription className="text-center">
            Du siehst nur die ersten 3 Dimensionen. Trag deine Mail ein und wir
            schicken dir den kompletten Report inkl. Empfehlungen.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-2">
          <Button
            size="lg"
            onClick={() => {
              setOpen(false);
              onUnlock();
            }}
          >
            Report jetzt freischalten
          </Button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Nein, danke
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
