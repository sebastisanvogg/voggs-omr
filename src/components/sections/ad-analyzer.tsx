"use client";

import { useState, useRef } from "react";
import { UploadBox } from "@/components/analyzer/upload-box";
import { ProgressSteps } from "@/components/analyzer/progress-steps";
import { ResultCard } from "@/components/analyzer/result-card";
import { LeadDialog } from "@/components/lead-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw } from "lucide-react";
import type { AnalysisResult } from "@/lib/validation";

type Phase = "idle" | "ready" | "analyzing" | "done" | "error";

export function AdAnalyzer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [brand, setBrand] = useState("");
  const [audience, setAudience] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);
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
      const form = new FormData();
      form.append("file", file);
      if (brand.trim()) form.append("brand", brand.trim());
      if (audience.trim()) form.append("audience", audience.trim());

      const res = await fetch("/api/analyze-ad", {
        method: "POST",
        body: form,
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(
          (body as Record<string, string>).error ?? `Fehler ${res.status}`
        );
      }

      setResult(body.analysis as AnalysisResult);
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
  };

  return (
    <section
      ref={sectionRef}
      id="analyzer"
      className="scroll-mt-20 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            TikTok Ad Analyzer
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Funktioniert deine Ad auf TikTok?
          </h2>
          <p className="mt-3 text-muted">
            Lade deine Ad hoch und finde es in 30 Sekunden heraus.
            KI-gestützte Analyse nach dem Hook-Trust-CTA Framework.
          </p>
        </div>

        <div className="mt-10 rounded-xl border border-border bg-surface/60 p-6">
          {/* Phase: idle — show upload box */}
          {phase === "idle" && <UploadBox onFile={handleFile} />}

          {/* Phase: ready — file selected, optional fields, start button */}
          {phase === "ready" && file && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-md border border-border bg-surface-2 px-4 py-3 text-sm">
                <Sparkles className="h-5 w-5 text-accent" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)} MB · {file.type}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-muted hover:text-foreground"
                  onClick={reset}
                  aria-label="Datei entfernen"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

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
                Ad analysieren
              </Button>
            </div>
          )}

          {/* Phase: analyzing — progress steps */}
          {phase === "analyzing" && <ProgressSteps />}

          {/* Phase: done — result card */}
          {phase === "done" && result && (
            <ResultCard
              result={result}
              onRequestReport={() => setLeadOpen(true)}
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
              Andere Ad analysieren
            </button>
          </div>
        )}
      </div>

      {/* Lead dialog for report request */}
      <LeadDialog
        open={leadOpen}
        onOpenChange={setLeadOpen}
        defaultInterests={["analyzer_report"]}
        analyzerScore={result?.confidence_score}
      />
    </section>
  );
}
