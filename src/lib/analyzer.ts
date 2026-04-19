import Anthropic from "@anthropic-ai/sdk";
import { analysisResultSchema, type AnalysisResult } from "@/lib/validation";
import { ANALYZER_SYSTEM_PROMPT, ANALYZER_TOOL } from "@/lib/ad-analyzer-prompt";

/* -------------------------------------------------------------------------- */
/*  Live analysis via Anthropic Claude (Vision + Tool Use)                     */
/* -------------------------------------------------------------------------- */

interface AnalyzeInput {
  /** Base64-encoded images (for image uploads or extracted video frames). */
  images: Array<{ base64: string; mimeType: string }>;
  /** Optional brand / product name provided by the user. */
  brand?: string;
  /** Optional target audience description provided by the user. */
  audience?: string;
}

/**
 * Calls Claude claude-sonnet-4-6 with Vision input and forces a tool call whose
 * schema matches `analysisResultSchema`. Returns the validated result.
 */
export async function analyzeAdLive(input: AnalyzeInput): Promise<AnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set. Set ANALYZER_MODE=mock to bypass.");
  }

  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
  const client = new Anthropic({ apiKey });

  // Build the content array: images + optional text context
  const content: Anthropic.MessageCreateParams["messages"][0]["content"] = [];

  for (const img of input.images) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: img.mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        data: img.base64,
      },
    });
  }

  let userText = "Analysiere diese TikTok-Ad anhand der beschriebenen Kriterien.";
  if (input.brand) userText += `\n\nBrand/Produkt: ${input.brand}`;
  if (input.audience) userText += `\nZielgruppe: ${input.audience}`;
  if (input.images.length > 1) {
    userText += `\n\nDie ${input.images.length} Bilder sind Keyframes aus einem Video (chronologisch). Bewerte das Gesamtvideo basierend auf diesen Frames.`;
  }

  content.push({ type: "text", text: userText });

  const response = await client.messages.create({
    model,
    max_tokens: 2048,
    system: ANALYZER_SYSTEM_PROMPT,
    tools: [ANALYZER_TOOL],
    tool_choice: { type: "tool", name: "tiktok_ad_analysis" },
    messages: [{ role: "user", content }],
  });

  // Extract tool call input
  const toolBlock = response.content.find((b) => b.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    throw new Error("Claude did not return a tool call. Unexpected response shape.");
  }

  // Validate against our Zod schema (belt-and-suspenders).
  const parsed = analysisResultSchema.safeParse(toolBlock.input);
  if (!parsed.success) {
    // Log full details server-side for postmortem, but surface the first
    // issue to the client so we can debug from the UI during OMR setup.
    const issues = parsed.error.issues
      .map(
        (i) => `${i.path.join(".") || "(root)"}: ${i.message}`
      )
      .slice(0, 3)
      .join(" | ");
    console.error(
      "[analyzer] Anthropic output failed validation:",
      parsed.error.issues,
      "— raw input:",
      JSON.stringify(toolBlock.input).slice(0, 2000)
    );
    throw new Error(`Antwort passt nicht zum Schema: ${issues}`);
  }

  return parsed.data;
}

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
        dimension: "trust",
        score: Math.min(100, base + randOffset()),
        comment:
          "Kein sichtbarer Social Proof oder Trust-Signal. Teste Testimonial-Snippet oder Zahlen-Overlay.",
      },
      {
        dimension: "pacing",
        score: Math.min(100, base + randOffset()),
        comment:
          "Schnittfrequenz passt zum TikTok-Rhythmus. Kleinere Pausen um Sekunde 8 könnten kürzer sein.",
      },
      {
        dimension: "retention",
        score: Math.min(100, base + randOffset()),
        comment:
          "Spannungsbogen trägt bis etwa Sekunde 12, danach Drop-Off-Risiko. Reveal früher platzieren.",
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
      {
        dimension: "trend_alignment",
        score: Math.min(100, base + randOffset()),
        comment:
          "Stil ist solide, aber ohne aktuelles TikTok-Format (POV, Reaction, Split-Screen). Ein Trend-Layer kann Reach +30% bringen.",
      },
    ],
    recommendations: [
      "Teste einen stärkeren visuellen Hook in den ersten 0,5 Sekunden — z.B. Texteinblendung oder Gestik.",
      "Baue ein Trust-Element ein: Testimonial-Snippet, konkrete Zahl oder Social-Proof-Overlay (Hook-Trust-CTA).",
      "Verkürze den Mittelteil um 2–3 Sekunden, um die Attention-Kurve flach zu halten.",
      "Platziere den CTA bereits ab Sekunde 10, nicht erst ganz am Ende.",
      "Teste eine Trend-Variante: gleiche Message, aber als POV- oder Talking-Head-Format neu gebaut.",
    ],
  };
}

function randOffset(): number {
  return Math.floor(Math.random() * 20) - 10; // -10 to +10
}
