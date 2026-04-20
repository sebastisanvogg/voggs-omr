"use client";

import { useState, useRef } from "react";
import { UploadBox } from "@/components/analyzer/upload-box";
import { UploadPreview } from "@/components/analyzer/upload-preview";
import { ProgressSteps } from "@/components/analyzer/progress-steps";
import { ResultCard } from "@/components/analyzer/result-card";
import { OptInDialog } from "@/components/opt-in-dialog";
import { ExitIntentDialog } from "@/components/exit-intent-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import type { AnalysisResult } from "@/lib/validation";

type Phase = "idle" | "ready" | "analyzing" | "done" | "error";

export function AdAnalyzer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [brand, setBrand] = useState("");
  const [audience, setAudience] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [optInOpen, setOptInOpen] = useState(false);
  const [reportUnlocked, setReportUnlocked] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPhase("ready");
    setResult(null);
    setError(null);
  };

  const startAnalysis = async () => {
    if (!file) return;
    setPhase("analyzing");
    setError(null);

    try {
      // Extract frames in the browser and POST only the JPEGs — the video
      // itself never leaves the device, and we sidestep Vercel's 4.5 MB
      // request cap entirely.
      const { extractVideoFramesInBrowser } = await import("@/lib/client-frames");
      const frames = await extractVideoFramesInBrowser(file);
      if (frames.length === 0) {
        throw new Error("Keine Frames aus dem Video extrahiert.");
      }
      const res = await fetch("/api/analyze-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frames,
          mimeType: "image/jpeg",
          brand: brand.trim() || undefined,
          audience: audience.trim() || undefined,
        }),
      });

      const body = await safeParseJson(res);

      if (!res.ok) {
        const fallback =
          res.status === 413
            ? "Datei zu groß für den Server. Versuch ein kleineres Video oder ein Bild."
            : `Analyse fehlgeschlagen (${res.status}).`;
        const serverMsg =
          typeof body === "object" && body && "error" in body
            ? String((body as { error?: unknown }).error)
            : null;
        throw new Error(serverMsg ?? fallback);
      }

      const analysis = (body as { analysis?: AnalysisResult }).analysis;
      if (!analysis) throw new Error("Antwort enthielt kein Analyse-Objekt.");
      setResult(analysis);
      setPhase("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler.");
      setPhase("error");
    }
  };

  const reset = () => {
    setFile(null);
    setPhase("idle");
    setResult(null);
    setError(null);
    setBrand("");
    setAudience("");
    setReportUnlocked(false);
  };

  async function safeParseJson(res: Response): Promise<unknown> {
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      return res.json().catch(() => ({}));
    }
    const text = await res.text().catch(() => "");
    return { error: text.slice(0, 200) || `HTTP ${res.status}` };
  }

  return (
    <section
      ref={sectionRef}
      id="analyzer"
      className="scroll-mt-20 px-6 pb-16"
    >
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-glow">
          {/* Phase: idle — show upload box */}
          {phase === "idle" && <UploadBox onFile={handleFile} />}

          {/* Phase: ready — file selected, optional fields, start button */}
          {phase === "ready" && file && (
            <div className="space-y-4">
              <UploadPreview file={file} onRemove={reset} />

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Brand / Produkt (optional)
                  </label>
                  <Input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="z.B. CARLY"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Zielgruppe (optional)
                  </label>
                  <Input
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="z.B. 25-34, Auto-Enthusiasten"
                  />
                </div>
              </div>

              <Button
                onClick={startAnalysis}
                size="lg"
                className="w-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Video analysieren
              </Button>
            </div>
          )}

          {/* Phase: analyzing — progress steps */}
          {phase === "analyzing" && <ProgressSteps />}

          {/* Phase: done — result card */}
          {phase === "done" && result && (
            <ResultCard
              result={result}
              unlocked={reportUnlocked}
              onRequestReport={() => setOptInOpen(true)}
            />
          )}

          {/* Phase: error */}
          {phase === "error" && (
            <div className="space-y-4 text-center">
              <p className="text-danger">{error}</p>
              <Button variant="outline" onClick={reset}>
                Nochmal versuchen
              </Button>
            </div>
          )}
        </div>

        {/* Restart after result */}
        {phase === "done" && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={reset}
              className="text-sm text-muted hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Anderes Video analysieren
            </button>
          </div>
        )}
      </div>

      <OptInDialog
        open={optInOpen}
        onOpenChange={setOptInOpen}
        params={{
          score: result?.confidence_score,
          verdict: result?.verdict,
          interest: "analyzer_report",
          source: "analyzer",
        }}
        onComplete={() => setReportUnlocked(true)}
        defaultInterests={["analyzer_report"]}
        analyzerScore={result?.confidence_score}
      />

      <ExitIntentDialog
        armed={phase === "done" && result !== null && !reportUnlocked}
        onUnlock={() => setOptInOpen(true)}
      />
    </section>
  );
}
