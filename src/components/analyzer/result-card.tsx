"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  FileCheck,
  ChevronRight,
  Lock,
  CheckCircle2,
  Info,
  Sparkles,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkedInFollow } from "@/components/linkedin-follow";
import { cn } from "@/lib/utils";
import type { AnalysisResult, FindingDimension } from "@/lib/validation";

interface ResultCardProps {
  result: AnalysisResult;
  onRequestReport: () => void;
  /** When true, show the full findings + recommendations (unlocked state). */
  unlocked?: boolean;
}

const DIMENSION_LABELS: Record<FindingDimension, string> = {
  hook: "Hook",
  trust: "Trust",
  pacing: "Pacing",
  retention: "Retention",
  sound: "Sound",
  captions: "Captions",
  cta: "CTA",
  native_feel: "Native-Feel",
  trend_alignment: "Trend-Fit",
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

const TEASER_COUNT = 3;

function FindingRow({ f }: { f: { dimension: FindingDimension; score: number; comment: string } }) {
  return (
    <div className="flex items-start gap-3 p-3">
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
  );
}

function MethodologyBox() {
  return (
    <div className="rounded-xl border border-border bg-surface-2/40 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <Info className="h-3.5 w-3.5" />
        Worauf basiert die Analyse
      </div>
      <ul className="mt-3 space-y-2 text-xs text-muted">
        <li className="flex gap-2">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          <span>
            <strong className="text-foreground">Claude Vision</strong>{" "}
            analysiert Keyframes deines Videos (bei Bildern das Einzelmotiv).
          </span>
        </li>
        <li className="flex gap-2">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          <span>
            Bewertet auf{" "}
            <strong className="text-foreground">9 TikTok-Performance-Dimensionen</strong>
            {" "}(Hook · Trust · Pacing · Retention · Sound · Captions · CTA ·
            Native-Feel · Trend-Fit).
          </span>
        </li>
        <li className="flex gap-2">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          <span>
            Benchmark: Hook-Trust-CTA Framework aus unserer{" "}
            <strong className="text-foreground">OMR Masterclass</strong> und
            Learnings aus 6-stelligen Tagesbudgets (CARLY, Turtle Beach,
            HelloFresh).
          </span>
        </li>
        <li className="flex gap-2">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          <span>
            Score ist ein gewichteter Durchschnitt: Hook 20% · Trust 15% ·
            Native-Feel 15% · Retention 12% · Pacing/CTA je 10% · Sound 8% ·
            Captions/Trend je 5%.
          </span>
        </li>
      </ul>
    </div>
  );
}

export function ResultCard({ result, onRequestReport, unlocked = false }: ResultCardProps) {
  const [shared, setShared] = useState(false);
  const verdict = VERDICT_LABELS[result.verdict] ?? VERDICT_LABELS["needs-work"];

  const shareText = `Mein TikTok Ad Score: ${result.confidence_score}/100 — "${verdict.label}". Analysiert mit dem VOGGSMEDIA Ad Analyzer aus der OMR Masterclass 2026.`;

  const handleShare = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text: shareText, url: window.location.href });
      } catch {
        // User cancelled — fine
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const shareOnLinkedIn = () => {
    const pageUrl =
      typeof window !== "undefined" ? window.location.href : "https://voggs.net/omr";
    const url =
      "https://www.linkedin.com/sharing/share-offsite/?url=" +
      encodeURIComponent(pageUrl) +
      "&summary=" +
      encodeURIComponent(shareText);
    window.open(url, "_blank", "noopener,noreferrer,width=620,height=720");
  };

  const openFindings = result.findings.slice(0, TEASER_COUNT);
  const lockedFindings = result.findings.slice(TEASER_COUNT);
  const hasGatedContent = lockedFindings.length > 0 || result.recommendations.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Score ring — always visible */}
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

      {unlocked ? (
        <>
          <div className="flex items-center justify-center gap-2 rounded-md bg-success/10 px-3 py-2 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" />
            Report freigeschaltet
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Detail-Analyse
            </h3>
            <div className="divide-y divide-border rounded-lg border border-border bg-surface">
              {result.findings.map((f) => (
                <FindingRow key={f.dimension} f={f} />
              ))}
            </div>
          </div>

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

          <MethodologyBox />
          <LinkedInFollow variant="post_optin" />
        </>
      ) : (
        <>
          {/* First N findings — teaser */}
          {openFindings.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Erste Erkenntnisse
              </h3>
              <div className="divide-y divide-border rounded-lg border border-border bg-surface">
                {openFindings.map((f) => (
                  <FindingRow key={f.dimension} f={f} />
                ))}
              </div>
            </div>
          )}

          {/* Locked section — teaser blur + unlock CTA */}
          {hasGatedContent && (
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none space-y-4 select-none blur-[6px] opacity-60"
              >
                {lockedFindings.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      Weitere Dimensionen
                    </h3>
                    <div className="divide-y divide-border rounded-lg border border-border bg-surface">
                      {lockedFindings.slice(0, 4).map((f) => (
                        <FindingRow key={f.dimension} f={f} />
                      ))}
                    </div>
                  </div>
                )}

                {result.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      Empfehlungen
                    </h3>
                    <ul className="space-y-2">
                      {result.recommendations.slice(0, 3).map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative mx-4 w-full max-w-sm rounded-xl border border-accent/40 bg-surface/95 p-5 text-center shadow-glow backdrop-blur-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Lock className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold">
                    {lockedFindings.length} weitere Dimensionen ·{" "}
                    {result.recommendations.length} Empfehlungen
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Trag deine Mail ein und schalte den vollständigen Report
                    frei.
                  </p>
                  <Button onClick={onRequestReport} size="lg" className="mt-4 w-full">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Report freischalten
                  </Button>
                </div>
              </div>
            </div>
          )}

          <MethodologyBox />
        </>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        {unlocked && (
          <Button
            onClick={shareOnLinkedIn}
            size="sm"
            className="bg-[#0A66C2] text-white hover:bg-[#0958a8]"
          >
            <Linkedin className="mr-2 h-4 w-4" fill="currentColor" strokeWidth={0} />
            Score auf LinkedIn teilen
          </Button>
        )}
        <Button onClick={handleShare} variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          {shared ? "Kopiert!" : "Score kopieren"}
        </Button>
      </div>
    </motion.div>
  );
}
