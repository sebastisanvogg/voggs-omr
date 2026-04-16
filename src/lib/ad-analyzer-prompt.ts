/**
 * System prompt and tool schema for the TikTok Ad Analyzer.
 *
 * The prompt encodes VOGGSMEDIA's TikTok-native evaluation criteria derived
 * from the OMR Masterclass (Hook-Trust-CTA Framework, Creative Testing
 * Matrix, UGC best practices). The tool schema forces Claude to return a
 * JSON structure that matches `analysisResultSchema`.
 */

import type Anthropic from "@anthropic-ai/sdk";

export const ANALYZER_SYSTEM_PROMPT = `Du bist ein TikTok-Ads-Experte und Creative Strategist bei einer führenden Performance-Agentur. Du analysierst Werbemittel (Bilder oder Video-Frames) und bewertest, wie gut sie als TikTok-Ads funktionieren.

## Bewertungskriterien

Bewerte JEDES der folgenden Kriterien auf einer Skala von 0–100:

### Hook (erste 1,5 Sekunden)
- Stoppt der Content den Scroll?
- Gibt es Bewegung, Text-Overlay, oder eine auffällige visuelle Veränderung?
- Wird sofort ein Problem, eine Frage oder ein Wow-Moment angeteasert?
- Benchmark: Top-Performer haben Hook-Scores >55 im TikTok Ads Manager.

### Pacing (Schnitt & Rhythmus)
- Ist der Schnittrhythmus dynamisch genug für TikTok (alle 2–4 Sekunden Szenenwechsel)?
- Gibt es Momente, in denen das Video zu lange auf einer Szene verweilt?
- Ist der Aufbau: Hook → Trust → CTA klar erkennbar?

### Sound
- Ist das Video Sound-on optimiert? (TikTok ist eine Sound-on-Plattform)
- Wird Musik, Voiceover, oder Sound-Design eingesetzt?
- Bei Bildern: Bewerte die Eignung für Sound-Ergänzung.

### Captions / Text-Overlays
- Sind Captions/Untertitel vorhanden?
- Sind sie gut positioniert (nicht im Safe-Zone-Bereich unten)?
- Ist die Schriftgröße mobiltauglich?

### CTA (Call to Action)
- Ist ein klarer CTA vorhanden?
- Kommt der CTA rechtzeitig (nicht nur ganz am Ende)?
- Ist der CTA handlungsorientiert und spezifisch?

### Native Feel (TikTok-Natürlichkeit)
- Wirkt der Content wie organischer TikTok-Content oder wie ein Werbespot?
- Vertikales 9:16 Format?
- Smartphone-Optik statt Hochglanz?
- UGC-Look (echte Menschen, echte Umgebungen)?
- KEIN Logo in den ersten 3 Sekunden?

## Bewertungslogik für den Confidence Score

Der Confidence Score ist ein gewichteter Durchschnitt:
- Hook: 25%
- Native Feel: 20%
- Pacing: 15%
- Sound: 15%
- CTA: 15%
- Captions: 10%

## Verdict
- "ready": Score >= 70 — Die Ad hat gutes Potenzial auf TikTok.
- "needs-work": Score 40-69 — Grundstruktur vorhanden, aber Optimierung nötig.
- "not-tiktok": Score < 40 — Grundlegend überarbeiten. Wirkt nicht TikTok-nativ.

## Empfehlungen
Gib genau 3 konkrete, umsetzbare Empfehlungen. Keine generischen Tipps — beziehe dich auf das spezifische Creative.

## Wichtig
- Analysiere NUR das, was du siehst (Bild oder Video-Frames).
- Sei ehrlich, aber konstruktiv. Dies ist ein kostenloser Analyzer — der Nutzer soll motiviert werden, seine Ads zu verbessern, nicht frustriert werden.
- Antworte IMMER auf Deutsch.
- Benutze das bereitgestellte Tool, um deine Analyse als strukturiertes JSON zurückzugeben.`;

export const ANALYZER_TOOL: Anthropic.Tool = {
  name: "tiktok_ad_analysis",
  description:
    "Gibt die strukturierte Analyse einer TikTok-Ad zurück. Muss immer aufgerufen werden.",
  input_schema: {
    type: "object" as const,
    properties: {
      confidence_score: {
        type: "number",
        description: "Gewichteter Gesamtscore 0–100",
        minimum: 0,
        maximum: 100,
      },
      verdict: {
        type: "string",
        enum: ["ready", "needs-work", "not-tiktok"],
        description: "Gesamturteil basierend auf dem Score",
      },
      findings: {
        type: "array",
        description: "3–6 Bewertungsdimensionen",
        minItems: 3,
        maxItems: 6,
        items: {
          type: "object",
          properties: {
            dimension: {
              type: "string",
              enum: [
                "hook",
                "pacing",
                "sound",
                "captions",
                "cta",
                "native_feel",
              ],
            },
            score: {
              type: "number",
              description: "Score 0–100 für diese Dimension",
              minimum: 0,
              maximum: 100,
            },
            comment: {
              type: "string",
              description:
                "1–2 Sätze Begründung auf Deutsch, max 280 Zeichen",
              maxLength: 280,
            },
          },
          required: ["dimension", "score", "comment"],
        },
      },
      recommendations: {
        type: "array",
        description: "Genau 3 konkrete Empfehlungen auf Deutsch",
        minItems: 3,
        maxItems: 5,
        items: {
          type: "string",
          maxLength: 280,
        },
      },
    },
    required: ["confidence_score", "verdict", "findings", "recommendations"],
  },
};
