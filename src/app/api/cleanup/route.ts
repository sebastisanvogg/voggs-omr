import { NextResponse, type NextRequest } from "next/server";
import { deleteFile, listLocalUploads } from "@/lib/storage";

export const runtime = "nodejs";

/**
 * Cleanup cron — deletes uploaded files older than 24 hours.
 *
 * Protected by a shared secret (`CLEANUP_CRON_SECRET`). On Vercel, wire
 * this as a Cron Job at `/api/cleanup` with schedule `0 * * * *` (hourly)
 * and pass the secret as an Authorization header.
 *
 * In development, call manually:
 *   curl -X POST http://localhost:3000/api/cleanup \
 *     -H "Authorization: Bearer your-secret"
 */

const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: NextRequest) {
  const secret = process.env.CLEANUP_CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  let deleted = 0;

  if (blobToken) {
    // Vercel Blob: list + delete old blobs
    try {
      const { list, del } = await import("@vercel/blob");
      let cursor: string | undefined;
      do {
        const result = await list({ token: blobToken, cursor, limit: 100 });
        const old = result.blobs.filter(
          (b) => Date.now() - new Date(b.uploadedAt).getTime() > MAX_AGE_MS
        );
        if (old.length > 0) {
          await del(
            old.map((b) => b.url),
            { token: blobToken }
          );
          deleted += old.length;
        }
        cursor = result.hasMore ? result.cursor : undefined;
      } while (cursor);
    } catch (err) {
      console.error("[cleanup] Blob cleanup error:", err);
    }
  } else {
    // Local: clean up .data/uploads
    const entries = await listLocalUploads();
    for (const entry of entries) {
      if (entry.ageMs > MAX_AGE_MS) {
        await deleteFile(entry.key);
        deleted++;
      }
    }
  }

  console.log(`[cleanup] Deleted ${deleted} old file(s).`);
  return NextResponse.json({ ok: true, deleted });
}
