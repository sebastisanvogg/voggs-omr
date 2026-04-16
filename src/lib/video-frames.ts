import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import Ffmpeg from "fluent-ffmpeg";

// ffmpeg-static ships a binary; tell fluent-ffmpeg where to find it.
// ffmpeg-static only exports via CJS default. Dynamic import works but the
// path must be known synchronously. The require is safe here (server-only,
// Node runtime).
const ffmpegPath = String(require("ffmpeg-static"));
Ffmpeg.setFfmpegPath(ffmpegPath);

const MAX_FRAMES = 6;
const JPEG_QUALITY = 2; // 2 = high quality, 31 = low

/**
 * Extracts up to 6 evenly-spaced key frames from a video file stored at
 * `inputPath`. Returns an array of { base64, mimeType } ready for the
 * Anthropic Vision API.
 *
 * The caller is responsible for cleaning up the temp directory afterwards.
 */
export async function extractFrames(
  inputPath: string
): Promise<Array<{ base64: string; mimeType: "image/jpeg" }>> {
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "vframes-"));

  // Get duration to calculate seek points
  const durationSec = await getVideoDuration(inputPath);
  const frameCount = Math.min(MAX_FRAMES, Math.max(2, Math.ceil(durationSec / 10)));

  // Generate frames at evenly spaced intervals
  const seekPoints: number[] = [];
  for (let i = 0; i < frameCount; i++) {
    seekPoints.push((durationSec / (frameCount + 1)) * (i + 1));
  }

  const outPaths: string[] = [];

  for (let i = 0; i < seekPoints.length; i++) {
    const outPath = path.join(outDir, `frame_${i}.jpg`);
    await extractSingleFrame(inputPath, seekPoints[i], outPath);
    outPaths.push(outPath);
  }

  // Read frames into base64
  const frames: Array<{ base64: string; mimeType: "image/jpeg" }> = [];
  for (const fp of outPaths) {
    try {
      const buf = await fs.readFile(fp);
      frames.push({ base64: buf.toString("base64"), mimeType: "image/jpeg" });
    } catch {
      // Skip frames that failed
    }
  }

  // Cleanup
  await fs.rm(outDir, { recursive: true, force: true }).catch(() => {});

  return frames;
}

function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    Ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata.format?.duration ?? 30;
      resolve(Math.min(duration, 120)); // cap at 2 min to avoid huge processing
    });
  });
}

function extractSingleFrame(
  inputPath: string,
  seekSec: number,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    Ffmpeg(inputPath)
      .seekInput(seekSec)
      .outputOptions([
        "-frames:v 1",
        `-q:v ${JPEG_QUALITY}`,
        "-vf scale=720:-2", // resize to 720px wide, keep aspect ratio
      ])
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .run();
  });
}
