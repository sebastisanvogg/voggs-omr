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
      // Vercel serverless request bodies cap at 4.5 MB on Hobby. Anything
      // larger must go through Blob client-upload (browser → Blob directly),
      // then we POST just the URL to /api/analyze-ad.
      const DIRECT_UPLOAD_LIMIT = 4 * 1024 * 1024;
      let res: Response;

      if (file.size > DIRECT_UPLOAD_LIMIT) {
        const { upload } = await import("@vercel/blob/client");
        const uploadedBlob = await upload(
          `uploads/${Date.now()}-${file.name}`,
          file,
          {
            access: "public",
            handleUploadUrl: "/api/upload",
            clientPayload: file.type,
          }
        );

        res = await fetch("/api/analyze-ad", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blobUrl: uploadedBlob.url,
            mimeType: file.type,
            brand: brand.trim() || undefined,
            audience: audience.trim() || undefined,
          }),
        });
      } else {
        const form = new FormData();
        form.append("file", file);
        if (brand.trim()) form.append("brand", brand.trim());
        if (audience.trim()) form.append("audience", audience.trim());

        res = await fetch("/api/analyze-ad", {
          method: "POST",
          body: form,
        });
      }

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
    setReportUnlocked(false);
  };

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
              Andere Ad analysieren
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
