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

interface AnalyzeInput {
  buffer: Buffer;
  mimeType: string;
  brand?: string;
  audience?: string;
}

export async function POST(req: NextRequest) {
  try {
    return await handle(req);
  } catch (err) {
    console.error("[analyze-ad] unhandled error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Interner Fehler. Bitte erneut versuchen.",
      },
      { status: 500 }
    );
  }
}

async function handle(req: NextRequest) {
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

  // --- Parse request (two supported shapes) ---
  // (1) multipart FormData with `file` — used in dev / small files
  // (2) JSON `{ blobUrl, mimeType, brand?, audience? }` — used in prod for
  //     large uploads that would blow past Vercel's 4.5 MB serverless
  //     request cap. The browser uploads directly to Blob, then POSTs the
  //     resulting URL here.
  const contentType = req.headers.get("content-type") ?? "";
  let input: AnalyzeInput;

  try {
    if (contentType.startsWith("application/json")) {
      input = await parseJsonBody(req);
    } else {
      input = await parseMultipart(req);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bad request";
    const status =
      msg.includes("zu groß") ? 413 :
      msg.includes("Dateityp") ? 415 :
      400;
    return NextResponse.json({ error: msg }, { status });
  }

  // --- Analyze ---
  const mode = process.env.ANALYZER_MODE ?? "mock";

  if (mode === "live") {
    try {
      const isVideo = input.mimeType.startsWith("video/");
      let images: Array<{ base64: string; mimeType: string }>;

      if (isVideo) {
        const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ad-upload-"));
        const tmpFile = path.join(tmpDir, `upload${extFromMime(input.mimeType)}`);
        await fs.writeFile(tmpFile, input.buffer);

        images = await extractFrames(tmpFile);

        await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});

        if (images.length === 0) {
          return NextResponse.json(
            { error: "Video konnte nicht verarbeitet werden. Versuche ein anderes Format." },
            { status: 422 }
          );
        }
      } else {
        images = [{ base64: input.buffer.toString("base64"), mimeType: input.mimeType }];
      }

      const result = await analyzeAdLive({
        images,
        brand: input.brand,
        audience: input.audience,
      });

      return NextResponse.json({
        ok: true,
        analysis: result,
        meta: {
          mode,
          brand: input.brand,
          audience: input.audience,
          remaining: rl.remaining,
        },
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
  await new Promise((r) => setTimeout(r, 2_500));
  const raw = getMockAnalysisResult();
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
      brand: input.brand,
      audience: input.audience,
      remaining: rl.remaining,
    },
  });
}

async function parseMultipart(req: NextRequest): Promise<AnalyzeInput> {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Bitte eine Datei hochladen.");
  }
  if (!isAcceptedMime(file.type)) {
    throw new Error("Dateityp nicht unterstützt (MP4, MOV, JPG, PNG, WebP).");
  }
  if (file.size > UPLOAD_LIMITS.maxBytes) {
    throw new Error(
      `Datei zu groß (max. ${Math.round(UPLOAD_LIMITS.maxBytes / 1024 / 1024)} MB).`
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    buffer,
    mimeType: file.type,
    brand: (formData.get("brand") as string | null) ?? undefined,
    audience: (formData.get("audience") as string | null) ?? undefined,
  };
}

async function parseJsonBody(req: NextRequest): Promise<AnalyzeInput> {
  const body = (await req.json()) as {
    blobUrl?: string;
    mimeType?: string;
    brand?: string;
    audience?: string;
  };

  if (!body.blobUrl || typeof body.blobUrl !== "string") {
    throw new Error("blobUrl fehlt.");
  }
  if (!body.mimeType || !isAcceptedMime(body.mimeType)) {
    throw new Error("Dateityp nicht unterstützt (MP4, MOV, JPG, PNG, WebP).");
  }

  // Only accept URLs hosted on the Blob bucket we provisioned.
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(body.blobUrl);
  } catch {
    throw new Error("Ungültige blobUrl.");
  }
  if (!parsedUrl.hostname.endsWith(".public.blob.vercel-storage.com")) {
    throw new Error("blobUrl muss auf Vercel Blob zeigen.");
  }

  const res = await fetch(body.blobUrl);
  if (!res.ok) {
    throw new Error(`Datei konnte nicht geladen werden (status ${res.status}).`);
  }

  const contentLength = Number(res.headers.get("content-length") ?? "0");
  if (contentLength > UPLOAD_LIMITS.maxBytes) {
    throw new Error(
      `Datei zu groß (max. ${Math.round(UPLOAD_LIMITS.maxBytes / 1024 / 1024)} MB).`
    );
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.byteLength > UPLOAD_LIMITS.maxBytes) {
    throw new Error(
      `Datei zu groß (max. ${Math.round(UPLOAD_LIMITS.maxBytes / 1024 / 1024)} MB).`
    );
  }

  return {
    buffer,
    mimeType: body.mimeType,
    brand: body.brand,
    audience: body.audience,
  };
}

function extFromMime(mime: string): string {
  if (mime === "video/quicktime") return ".mov";
  if (mime === "video/mp4") return ".mp4";
  return ".bin";
}
