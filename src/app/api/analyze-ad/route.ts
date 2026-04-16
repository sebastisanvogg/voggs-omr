import { NextResponse, type NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import { isAcceptedMime, UPLOAD_LIMITS, analysisResultSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getMockAnalysisResult, analyzeAdLive } from "@/lib/analyzer";
import { extractFrames } from "@/lib/video-frames";

export const runtime = "nodejs";

// Allow up to 60 seconds for live analysis (video frame extraction + Claude API)
export const maxDuration = 60;

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
      {
        error: `Datei zu groß (max. ${Math.round(UPLOAD_LIMITS.maxBytes / 1024 / 1024)} MB).`,
      },
      { status: 413 }
    );
  }

  // Optional metadata
  const brand = (formData.get("brand") as string | null) ?? undefined;
  const audience = (formData.get("audience") as string | null) ?? undefined;

  // --- Analyze ---
  const mode = process.env.ANALYZER_MODE ?? "mock";

  if (mode === "live") {
    try {
      const isVideo = file.type.startsWith("video/");
      let images: Array<{ base64: string; mimeType: string }>;

      if (isVideo) {
        // Write video to temp file, extract frames, clean up
        const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ad-upload-"));
        const tmpFile = path.join(tmpDir, `upload${extFromMime(file.type)}`);
        const buf = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(tmpFile, buf);

        images = await extractFrames(tmpFile);

        // Cleanup temp file
        await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});

        if (images.length === 0) {
          return NextResponse.json(
            { error: "Video konnte nicht verarbeitet werden. Versuche ein anderes Format." },
            { status: 422 }
          );
        }
      } else {
        // Image: read directly as base64
        const buf = Buffer.from(await file.arrayBuffer());
        images = [{ base64: buf.toString("base64"), mimeType: file.type }];
      }

      const result = await analyzeAdLive({ images, brand, audience });

      return NextResponse.json({
        ok: true,
        analysis: result,
        meta: { mode, brand, audience, remaining: rl.remaining },
      });
    } catch (err) {
      console.error("[analyze-ad] Live analysis failed:", err);
      return NextResponse.json(
        {
          error:
            err instanceof Error
              ? err.message
              : "Analyse fehlgeschlagen. Bitte erneut versuchen.",
        },
        { status: 500 }
      );
    }
  }

  // --- Mock mode ---
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
    meta: { mode, brand, audience, remaining: rl.remaining },
  });
}

function extFromMime(mime: string): string {
  if (mime === "video/quicktime") return ".mov";
  if (mime === "video/mp4") return ".mp4";
  return ".bin";
}
