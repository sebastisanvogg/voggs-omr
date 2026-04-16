import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Upload storage abstraction — two backends:
 *
 * 1. **Vercel Blob** — when `BLOB_READ_WRITE_TOKEN` is set.
 * 2. **Local disk** — saves to `./.data/uploads/` (gitignored).
 *
 * Files are identified by a UUID-based key. The cleanup cron deletes
 * files older than 24 hours (see /api/cleanup/route.ts).
 */

export interface StoredFile {
  key: string;
  url: string;
}

const LOCAL_DIR = path.resolve(process.cwd(), ".data", "uploads");

export async function storeFile(
  file: File,
  key: string
): Promise<StoredFile> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (token) {
    // Dynamic import so Vercel Blob isn't bundled when unused
    const { put } = await import("@vercel/blob");
    const blob = await put(key, file, {
      access: "public",
      addRandomSuffix: false,
      token,
    });
    return { key, url: blob.url };
  }

  // Local fallback
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  const filePath = path.join(LOCAL_DIR, key);
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buf);
  return { key, url: `/uploads/${key}` };
}

/**
 * Delete a stored file. Silently ignores missing files.
 */
export async function deleteFile(key: string): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (token) {
    const { del } = await import("@vercel/blob");
    await del(key, { token }).catch(() => {});
    return;
  }

  const filePath = path.join(LOCAL_DIR, key);
  await fs.rm(filePath, { force: true }).catch(() => {});
}

/**
 * List all local uploads with their age. Used by the cleanup cron.
 * On Vercel Blob, the cleanup uses the Blob list API instead.
 */
export async function listLocalUploads(): Promise<
  Array<{ key: string; ageMs: number }>
> {
  try {
    const files = await fs.readdir(LOCAL_DIR);
    const now = Date.now();
    const entries = await Promise.all(
      files.map(async (name) => {
        const stat = await fs.stat(path.join(LOCAL_DIR, name));
        return { key: name, ageMs: now - stat.mtimeMs };
      })
    );
    return entries;
  } catch {
    return [];
  }
}
