import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { UPLOAD_LIMITS, isAcceptedMime } from "@/lib/validation";

/**
 * Issues short-lived tokens for client-side direct-to-Blob uploads.
 *
 * Why: Vercel Hobby serverless functions cap request bodies at 4.5 MB.
 * Users uploading TikTok videos (typically 10–40 MB) blow past that, so
 * the browser uploads directly to Vercel Blob and only sends the resulting
 * URL to `/api/analyze-ad`.
 *
 * Security:
 *   - allowedContentTypes: only MIME types we accept in the analyzer
 *   - maximumSizeInBytes: server-side enforced (client can't override)
 *   - Path prefix "uploads/" keeps analyzer files in a predictable bucket
 *     for the cleanup cron.
 */
export async function POST(req: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage not configured on this deployment." },
      { status: 503 }
    );
  }

  const body = (await req.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // clientPayload is a string we sent from the browser — here we
        // pass the original mime type so we can double-check it.
        const ct = typeof clientPayload === "string" ? clientPayload : "";
        if (ct && !isAcceptedMime(ct)) {
          throw new Error("Dateityp nicht unterstützt.");
        }
        return {
          allowedContentTypes: [...UPLOAD_LIMITS.acceptedMime],
          maximumSizeInBytes: UPLOAD_LIMITS.maxBytes,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ originalPath: pathname }),
        };
      },
      onUploadCompleted: async () => {
        // Hook for future lead-attribution / tracking. Intentionally empty.
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Upload-Token konnte nicht erstellt werden.",
      },
      { status: 400 }
    );
  }
}
