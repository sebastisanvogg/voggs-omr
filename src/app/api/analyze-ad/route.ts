import { NextResponse, type NextRequest } from "next/server";
import { isAcceptedMime, UPLOAD_LIMITS, analysisResultSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getMockAnalysisResult, analyzeAdLive } from "@/lib/analyzer";

export const runtime = "nodejs";
export const maxDuration = 60;

interface AnalyzeInput {
  images: Array<{ base64: string; mimeType: string }>;
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
      { status: 429, headers: { "Retry-After": "3600" } }
    );
  }

  // Three supported shapes:
  //   (1) multipart FormData with `file` — dev / small images
  //   (2) JSON `{ frames: [base64…], mimeType: "image/jpeg", … }` —
  //       client-extracted video frames. This is the prod path for videos.
  //   (3) JSON `{ blobUrl, mimeType, … }` — kept for large single-image
  //       uploads that go through Blob client-upload.
  const contentType = req.headers.get("content-type") ?? "";
  let input: AnalyzeInput;
  let brand: string | undefined;
  let audience: string | undefined;

  try {
    if (contentType.startsWith("application/json")) {
      ({ input, brand, audience } = await parseJsonBody(req));
    } else {
      ({ input, brand, audience } = await parseMultipart(req));
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bad request";
    const status =
      msg.includes("zu groß") ? 413 :
      msg.includes("Dateityp") ? 415 :
      400;
    return NextResponse.json({ error: msg }, { status });
  }

  const mode = process.env.ANALYZER_MODE ?? "mock";

  if (mode === "live") {
    try {
      const result = await analyzeAdLive({ images: input.images, brand, audience });
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

  // Mock mode — simulate processing time then return a canned result
  await new Promise((r) => setTimeout(r, 2_500));
  const parsed = analysisResultSchema.safeParse(getMockAnalysisResult());
  if (!parsed.success) {
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

type Parsed = {
  input: AnalyzeInput;
  brand?: string;
  audience?: string;
};

async function parseMultipart(req: NextRequest): Promise<Parsed> {
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

  if (file.type.startsWith("video/")) {
    throw new Error(
      "Videos werden im Browser vor dem Upload aufbereitet — bitte Seite neu laden."
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  return {
    input: {
      images: [{ base64: buf.toString("base64"), mimeType: file.type }],
    },
    brand: (formData.get("brand") as string | null) ?? undefined,
    audience: (formData.get("audience") as string | null) ?? undefined,
  };
}

async function parseJsonBody(req: NextRequest): Promise<Parsed> {
  const body = (await req.json()) as {
    frames?: unknown;
    blobUrl?: string;
    mimeType?: string;
    brand?: string;
    audience?: string;
  };

  if (Array.isArray(body.frames)) {
    const frames = body.frames.filter(
      (f): f is string => typeof f === "string" && f.length > 0
    );
    if (frames.length === 0) {
      throw new Error("Keine Frames erhalten.");
    }
    if (frames.length > 12) {
      throw new Error("Zu viele Frames.");
    }
    return {
      input: {
        images: frames.map((f) => ({ base64: f, mimeType: "image/jpeg" })),
      },
      brand: body.brand,
      audience: body.audience,
    };
  }

  if (typeof body.blobUrl === "string") {
    if (!body.mimeType || !isAcceptedMime(body.mimeType)) {
      throw new Error("Dateityp nicht unterstützt.");
    }
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(body.blobUrl);
    } catch {
      throw new Error("Ungültige blobUrl.");
    }
    if (!parsedUrl.hostname.endsWith(".public.blob.vercel-storage.com")) {
      throw new Error("blobUrl muss auf Vercel Blob zeigen.");
    }
    if (body.mimeType.startsWith("video/")) {
      throw new Error(
        "Videos werden im Browser vor dem Upload aufbereitet — bitte Seite neu laden."
      );
    }

    const res = await fetch(body.blobUrl);
    if (!res.ok) throw new Error(`Datei konnte nicht geladen werden (${res.status}).`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > UPLOAD_LIMITS.maxBytes) {
      throw new Error(
        `Datei zu groß (max. ${Math.round(UPLOAD_LIMITS.maxBytes / 1024 / 1024)} MB).`
      );
    }
    return {
      input: {
        images: [{ base64: buf.toString("base64"), mimeType: body.mimeType }],
      },
      brand: body.brand,
      audience: body.audience,
    };
  }

  throw new Error("Weder frames[] noch blobUrl im Request.");
}
