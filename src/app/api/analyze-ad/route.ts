import { NextResponse, type NextRequest } from "next/server";
import { isAcceptedMime, UPLOAD_LIMITS, analysisResultSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getMockAnalysisResult } from "@/lib/analyzer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // --- Rate limit ---
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const rl = await checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          "Du hast das Limit von 5 Analysen pro Stunde erreicht. Probier es später nochmal.",
      },
      {
        status: 429,
        headers: { "Retry-After": "3600" },
      }
    );
  }

  // --- Parse multipart ---
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Bitte eine Datei hochladen." },
      { status: 400 }
    );
  }

  if (!isAcceptedMime(file.type)) {
    return NextResponse.json(
      { error: "Dateityp nicht unterstützt (MP4, MOV, JPG, PNG, WebP)." },
      { status: 415 }
    );
  }

  if (file.size > UPLOAD_LIMITS.maxBytes) {
    return NextResponse.json(
      { error: `Datei zu groß (max. ${Math.round(UPLOAD_LIMITS.maxBytes / 1024 / 1024)} MB).` },
      { status: 413 }
    );
  }

  // Optional metadata
  const brand = formData.get("brand") as string | null;
  const audience = formData.get("audience") as string | null;

  // --- Analyze ---
  const mode = process.env.ANALYZER_MODE ?? "mock";

  if (mode === "live") {
    // Live analysis is wired in a later commit (Step 8).
    // For now, fall through to mock.
    // TODO: wire Anthropic analysis here
  }

  // Simulate processing latency so the progress animation feels natural
  await new Promise((r) => setTimeout(r, 2_500));

  const raw = getMockAnalysisResult();

  // Validate output (belt-and-suspenders — even mock should conform)
  const parsed = analysisResultSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("[analyze-ad] Output validation failed:", parsed.error);
    return NextResponse.json(
      { error: "Interner Fehler bei der Analyse." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    analysis: parsed.data,
    meta: {
      mode,
      brand: brand ?? undefined,
      audience: audience ?? undefined,
      remaining: rl.remaining,
    },
  });
}
