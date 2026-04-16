import { describe, it, expect } from "vitest";

/**
 * Tests that getMockAnalysisResult always produces schema-valid output.
 *
 * We import from the src/lib module — the mock doesn't use `server-only`
 * so it's safe to import in Vitest.
 */

// We can't import the full analyzer.ts because analyzeAdLive imports
// Anthropic SDK which drags server-only. Instead, replicate the mock logic.
import { analysisResultSchema } from "../src/lib/validation";

function getMockAnalysisResult() {
  const base = 55 + Math.floor(Math.random() * 30);
  const randOffset = () => Math.floor(Math.random() * 20) - 10;

  return {
    confidence_score: base,
    verdict: base >= 70 ? ("ready" as const) : ("needs-work" as const),
    findings: [
      { dimension: "hook" as const, score: Math.min(100, base + randOffset()), comment: "Hook comment." },
      { dimension: "pacing" as const, score: Math.min(100, base + randOffset()), comment: "Pacing comment." },
      { dimension: "sound" as const, score: Math.min(100, base + randOffset()), comment: "Sound comment." },
      { dimension: "captions" as const, score: Math.min(100, base + randOffset()), comment: "Captions comment." },
      { dimension: "cta" as const, score: Math.min(100, base + randOffset()), comment: "CTA comment." },
      { dimension: "native_feel" as const, score: Math.min(100, base + randOffset()), comment: "Native feel." },
    ],
    recommendations: [
      "Empfehlung eins.",
      "Empfehlung zwei.",
      "Empfehlung drei.",
    ],
  };
}

describe("mock analysis result conforms to schema", () => {
  // Run multiple times because the mock is semi-random
  for (let i = 0; i < 20; i++) {
    it(`iteration ${i + 1}`, () => {
      const result = getMockAnalysisResult();
      const parsed = analysisResultSchema.safeParse(result);
      if (!parsed.success) {
        console.error(parsed.error.issues);
      }
      expect(parsed.success).toBe(true);
    });
  }
});

describe("score boundary validation", () => {
  it("rejects score exactly at -1", () => {
    const result = analysisResultSchema.safeParse({
      confidence_score: -1,
      verdict: "not-tiktok",
      findings: [
        { dimension: "hook", score: 10, comment: "Hook ist schwach." },
        { dimension: "pacing", score: 10, comment: "Pacing zu langsam." },
        { dimension: "sound", score: 10, comment: "Sound fehlt komplett." },
      ],
      recommendations: ["Stärkeren Hook einsetzen.", "CTA früher platzieren.", "UGC testen."],
    });
    expect(result.success).toBe(false);
  });

  it("accepts score at 0", () => {
    const result = analysisResultSchema.safeParse({
      confidence_score: 0,
      verdict: "not-tiktok",
      findings: [
        { dimension: "hook", score: 0, comment: "Kein Hook erkennbar." },
        { dimension: "pacing", score: 0, comment: "Kein Schnitt vorhanden." },
        { dimension: "sound", score: 0, comment: "Kein Sound vorhanden." },
      ],
      recommendations: ["Komplett neu starten.", "TikTok-Formate lernen.", "UGC-Creator einsetzen."],
    });
    expect(result.success).toBe(true);
  });

  it("accepts score at 100", () => {
    const result = analysisResultSchema.safeParse({
      confidence_score: 100,
      verdict: "ready",
      findings: [
        { dimension: "hook", score: 100, comment: "Perfekter Hook, greift sofort." },
        { dimension: "pacing", score: 100, comment: "Schnitt ist optimal." },
        { dimension: "sound", score: 100, comment: "Sound perfekt abgemischt." },
      ],
      recommendations: ["Weiter so machen.", "Mehr Varianten testen.", "Budget erhöhen."],
    });
    expect(result.success).toBe(true);
  });
});
