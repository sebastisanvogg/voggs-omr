import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import Ffmpeg from "fluent-ffmpeg";

// ffmpeg-static ships a binary; tell fluent-ffmpeg where to find it.
// We intentionally do NOT depend on ffprobe here — on Vercel's serverless
// runtime ffprobe adds a second native binary dependency that can fail to
// bundle. Instead we seek to fixed timestamps and silently drop seeks that
// land past the end of the video.
const ffmpegPath = String(require("ffmpeg-static"));
Ffmpeg.setFfmpegPath(ffmpegPath);

function verifyFfmpegBinary(): void {
  const existsSync = require("node:fs").existsSync as (p: string) => boolean;
  if (!existsSync(ffmpegPath)) {
    throw new Error(
      `ffmpeg-Binary wurde im Deployment nicht gefunden (erwartet unter ${ffmpegPath}).`
    );
  }
}

const JPEG_QUALITY = 2; // 2 = high quality, 31 = low

// Seek points (seconds). A 30-second ad will produce frames from the first
// five; a 5-second ad will produce frames from the first two. ffmpeg returns
// a non-zero error for seeks past the end — we swallow those.
const SEEK_POINTS = [0.5, 2, 5, 10, 20, 45] as const;

/**
 * Extracts up to 6 key frames from a video file. Returns base64-encoded JPEGs
 * ready for the Anthropic Vision API. The caller owns the temp dir cleanup
 * for the input file; we manage our own scratch dir internally.
 */
export async function extractFrames(
  inputPath: string
): Promise<Array<{ base64: string; mimeType: "image/jpeg" }>> {
  verifyFfmpegBinary();

  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "vframes-"));
  const errors: string[] = [];

  try {
    const frames: Array<{ base64: string; mimeType: "image/jpeg" }> = [];
    for (let i = 0; i < SEEK_POINTS.length; i++) {
      const outPath = path.join(outDir, `frame_${i}.jpg`);
      const result = await extractSingleFrame(inputPath, SEEK_POINTS[i], outPath);
      if (!result.ok) {
        errors.push(`seek=${SEEK_POINTS[i]}s: ${result.error}`);
        continue;
      }
      try {
        const buf = await fs.readFile(outPath);
        if (buf.length > 0) {
          frames.push({ base64: buf.toString("base64"), mimeType: "image/jpeg" });
        }
      } catch (err) {
        errors.push(
          `seek=${SEEK_POINTS[i]}s: read failed: ${(err as Error).message}`
        );
      }
    }

    if (frames.length === 0) {
      // Surface the real ffmpeg error to the caller (and server logs) so we
      // can distinguish binary-missing / bad-format / zero-length-video.
      console.error("[video-frames] all seeks failed:", errors);
      throw new Error(
        `ffmpeg-Extraktion fehlgeschlagen. Details: ${errors.join(" | ").slice(0, 500)}`
      );
    }

    return frames;
  } finally {
    await fs.rm(outDir, { recursive: true, force: true }).catch(() => {});
  }
}

interface FrameResult {
  ok: boolean;
  error?: string;
}

function extractSingleFrame(
  inputPath: string,
  seekSec: number,
  outputPath: string
): Promise<FrameResult> {
  return new Promise((resolve) => {
    Ffmpeg(inputPath)
      .seekInput(seekSec)
      .outputOptions([
        "-frames:v 1",
        `-q:v ${JPEG_QUALITY}`,
        "-vf scale=720:-2",
      ])
      .output(outputPath)
      .on("end", () => resolve({ ok: true }))
      .on("error", (err: Error) =>
        resolve({ ok: false, error: err.message.slice(0, 140) })
      )
      .run();
  });
}
