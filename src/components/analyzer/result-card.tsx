"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, FileCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AnalysisResult, FindingDimension } from "@/lib/validation";

interface ResultCardProps {
  result: AnalysisResult;
  onRequestReport: () => void;
}

const DIMENSION_LABELS: Record<FindingDimension, string> = {
  hook: "Hook",
  pacing: "Pacing",
  sound: "Sound",
  captions: "Captions",
  cta: "CTA",
  native_feel: "Native-Feel",
};

const VERDICT_LABELS: Record<string, { label: string; color: string }> = {
  ready: { label: "TikTok-ready", color: "text-success" },
  "needs-work": { label: "Hat Potenzial", color: "text-warning" },
  "not-tiktok": { label: "Noch nicht TikTok-tauglich", color: "text-danger" },
};

function scoreColor(score: number): string {
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-warning";
  return "text-danger";
}

function gaugeGradient(score: number): string {
  if (score >= 70) return "from-success/20 to-success/5";
  if (score >= 40) return "from-warning/20 to-warning/5";
  return "from-danger/20 to-danger/5";
}

export function ResultCard({ result, onRequestReport }: ResultCardProps) {
  const [shared, setShared] = useState(false);
  const verdict = VERDICT_LABELS[result.verdict] ?? VERDICT_LABELS["needs-work"];

  const handleShare = async () => {
    const text = `Mein TikTok Ad Score: ${result.confidence_score}/100 — "${verdict.label}". Analysiert mit dem VOGGSMEDIA Ad Analyzer.`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text, url: window.location.href });
      } catch {
        // User cancelled — fine
      }
    } else {
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Score ring */}
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            "relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br",
            gaugeGradient(result.confidence_score)
          )}
        >
          <div className="flex flex-col items-center">
            <span
              className={cn("text-5xl font-bold tabular-nums", scoreColor(result.confidence_score))}
            >
              {result.confidence_score}
            </span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
        <p className={cn("text-lg font-semibold", verdict.color)}>
          {verdict.label}
        </p>
        <p className="text-center text-sm text-muted">
          Zu {result.confidence_score}% funktioniert deine Ad auf TikTok.
        </p>
      </div>

      {/* Findings */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Detail-Analyse
        </h3>
        <div className="divide-y divide-border rounded-lg border border-border bg-surface">
          {result.findings.map((f) => (
            <div key={f.dimension} className="flex items-start gap-3 p-3">
              <span
                className={cn(
                  "mt-0.5 inline-block min-w-[2.5rem] text-center text-sm font-semibold tabular-nums",
                  scoreColor(f.score)
                )}
              >
                {f.score}
              </span>
              <div>
                <p className="text-sm font-medium">
                  {DIMENSION_LABELS[f.dimension] ?? f.dimension}
                </p>
                <p className="text-xs text-muted">{f.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Empfehlungen
        </h3>
        <ul className="space-y-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onRequestReport} className="flex-1" size="lg">
          <FileCheck className="mr-2 h-4 w-4" />
          Vollständigen Report anfragen
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          size="lg"
        >
          <Share2 className="mr-2 h-4 w-4" />
          {shared ? "Kopiert!" : "Score teilen"}
        </Button>
      </div>
    </motion.div>
  );
}
