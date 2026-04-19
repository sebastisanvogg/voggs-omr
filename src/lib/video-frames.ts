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
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "vframes-"));

  try {
    const frames: Array<{ base64: string; mimeType: "image/jpeg" }> = [];
    for (let i = 0; i < SEEK_POINTS.length; i++) {
      const outPath = path.join(outDir, `frame_${i}.jpg`);
      const ok = await extractSingleFrame(inputPath, SEEK_POINTS[i], outPath);
      if (!ok) continue;
      try {
        const buf = await fs.readFile(outPath);
        if (buf.length > 0) {
          frames.push({ base64: buf.toString("base64"), mimeType: "image/jpeg" });
        }
      } catch {
        // Frame missing — past end of video, skip.
      }
    }
    return frames;
  } finally {
    await fs.rm(outDir, { recursive: true, force: true }).catch(() => {});
  }
}

function extractSingleFrame(
  inputPath: string,
  seekSec: number,
  outputPath: string
): Promise<boolean> {
  return new Promise((resolve) => {
    Ffmpeg(inputPath)
      .seekInput(seekSec)
      .outputOptions([
        "-frames:v 1",
        `-q:v ${JPEG_QUALITY}`,
        "-vf scale=720:-2",
      ])
      .output(outputPath)
      .on("end", () => resolve(true))
      .on("error", () => resolve(false))
      .run();
  });
}
