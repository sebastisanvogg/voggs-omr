"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

const STEPS = [
  { label: "Keyframes aus dem Video extrahiert", ms: 1500 },
  { label: "Vision-Modell prüft Hook & Retention", ms: 2200 },
  { label: "Trust-Signale & Social-Proof analysiert", ms: 1800 },
  { label: "Sound · Captions · CTA bewertet", ms: 1600 },
  { label: "Native-Feel & Trend-Fit abgeglichen", ms: 1700 },
  { label: "Empfehlungen werden generiert", ms: 2000 },
] as const;

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
    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      idx = Math.min(idx + 1, STEPS.length - 1);
      setActive(idx);
      if (idx < STEPS.length - 1) {
        timer = setTimeout(tick, STEPS[idx].ms);
      }
    };
    timer = setTimeout(tick, STEPS[0].ms);
    return () => clearTimeout(timer);
  }, [done]);

  return (
    <div className="mx-auto max-w-sm space-y-2.5 py-6">
      <p className="mb-2 text-center text-xs uppercase tracking-widest text-muted-foreground">
        KI-Analyse läuft
      </p>
      {STEPS.map((step, i) => {
        const state: "pending" | "active" | "done" =
          done || i < active ? "done" : i === active ? "active" : "pending";

        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: state === "pending" ? 0.35 : 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
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
                  ? "font-medium text-foreground"
                  : state === "done"
                    ? "text-muted"
                    : "text-muted-foreground"
              }
            >
              {step.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
