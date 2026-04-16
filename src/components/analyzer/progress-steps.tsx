"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

const STEPS = [
  "Hook wird bewertet …",
  "Pacing & Schnitt analysiert …",
  "Sound-Design geprüft …",
  "Captions & Text-Overlays …",
  "TikTok-Native-Score berechnet …",
  "Empfehlungen werden erstellt …",
] as const;

/** Time each step is shown (ms). Total ≈ STEP_MS * STEPS.length. */
const STEP_MS = 1_800;

interface ProgressStepsProps {
  /** When true, all steps show as completed and the spinner disappears. */
  done?: boolean;
}

export function ProgressSteps({ done = false }: ProgressStepsProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (done) {
      setActive(STEPS.length);
      return;
    }
    const id = setInterval(() => {
      setActive((prev) => {
        if (prev >= STEPS.length - 1) return prev; // hold on last
        return prev + 1;
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, [done]);

  return (
    <div className="mx-auto max-w-sm space-y-3 py-6">
      <AnimatePresence mode="wait">
        {STEPS.map((label, i) => {
          const state: "pending" | "active" | "done" =
            done || i < active ? "done" : i === active ? "active" : "pending";

          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: state === "pending" ? 0.35 : 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="flex items-center gap-3 text-sm"
            >
              {state === "active" ? (
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
              ) : state === "done" ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-border" />
              )}
              <span
                className={
                  state === "active"
                    ? "text-foreground font-medium"
                    : state === "done"
                      ? "text-muted"
                      : "text-muted-foreground"
                }
              >
                {label}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
