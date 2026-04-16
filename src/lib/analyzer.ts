import type { AnalysisResult } from "@/lib/validation";

/**
 * Returns a mock analysis result for development / demo purposes.
 *
 * When `ANALYZER_MODE=mock` (or no key is set), the API route uses this
 * instead of calling Anthropic. The scores are semi-random but
 * deterministic enough to be visually interesting.
 */
export function getMockAnalysisResult(): AnalysisResult {
  const base = 55 + Math.floor(Math.random() * 30); // 55–84

  return {
    confidence_score: base,
    verdict: base >= 70 ? "ready" : "needs-work",
    findings: [
      {
        dimension: "hook",
        score: Math.min(100, base + randOffset()),
        comment:
          "Der Hook greift in den ersten 1,5 Sekunden — guter Einstieg mit Bewegung und Text-Overlay.",
      },
      {
        dimension: "pacing",
        score: Math.min(100, base + randOffset()),
        comment:
          "Schnittfrequenz passt zum TikTok-Rhythmus. Kleinere Pausen um Sekunde 8 könnten kürzer sein.",
      },
      {
        dimension: "sound",
        score: Math.min(100, base + randOffset()),
        comment:
          "Hintergrundmusik vorhanden und passend. Voiceover könnte etwas lauter abgemischt sein.",
      },
      {
        dimension: "captions",
        score: Math.min(100, base + randOffset()),
        comment:
          "Captions sind sichtbar und gut positioniert. Font-Größe könnte auf kleineren Screens noch zunehmen.",
      },
      {
        dimension: "cta",
        score: Math.min(100, base + randOffset()),
        comment:
          "CTA ist vorhanden, aber erst spät im Video. Teste einen früheren visuellen Hinweis.",
      },
      {
        dimension: "native_feel",
        score: Math.min(100, base + randOffset()),
        comment:
          "Wirkt überwiegend nativ (Smartphone-Optik). Leichte Brand-Polierung am Ende könnte reduziert werden.",
      },
    ],
    recommendations: [
      "Teste einen stärkeren visuellen Hook in den ersten 0,5 Sekunden — z.B. Texteinblendung oder Gestik.",
      "Verkürze den Mittelteil um 2–3 Sekunden, um die Attention-Kurve flach zu halten.",
      "Platziere den CTA bereits ab Sekunde 10, nicht erst ganz am Ende.",
    ],
  };
}

function randOffset(): number {
  return Math.floor(Math.random() * 20) - 10; // -10 to +10
}
