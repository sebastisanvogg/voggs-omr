/**
 * Client-side video frame extraction.
 *
 * We intentionally do this in the browser instead of server-side ffmpeg:
 * Vercel's file-tracing for pnpm-managed native binaries is unreliable and
 * the upload-then-extract round trip wastes bandwidth. Instead the browser
 * seeks through the video element and paints each requested timestamp onto
 * a canvas, returning base64-encoded JPEGs ready for the Claude Vision API.
 *
 * Size budget: 6 frames × ~90 KB JPEG = ~540 KB raw = ~720 KB after base64.
 * Well under Vercel's 4.5 MB serverless request cap, so the frames can be
 * POSTed directly in JSON without needing Blob storage.
 */

const SEEK_POINTS: readonly number[] = [0.5, 2, 5, 10, 20, 45];

const MAX_WIDTH = 720;
const JPEG_QUALITY = 0.82;

interface ExtractOptions {
  /** JPEG quality, 0–1. Default 0.82. */
  quality?: number;
  /** Max output width in pixels. Default 720. */
  maxWidth?: number;
}

export async function extractVideoFramesInBrowser(
  file: File,
  options: ExtractOptions = {}
): Promise<string[]> {
  const quality = options.quality ?? JPEG_QUALITY;
  const maxWidth = options.maxWidth ?? MAX_WIDTH;

  const url = URL.createObjectURL(file);
  try {
    const video = await loadVideo(url);
    const duration = isFinite(video.duration) ? video.duration : 60;
    const targets = SEEK_POINTS.filter((t) => t < duration - 0.1);
    if (targets.length === 0) targets.push(Math.max(0.1, duration / 2));

    const canvas = document.createElement("canvas");
    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context nicht verfügbar.");

    const frames: string[] = [];
    for (const t of targets) {
      await seekTo(video, t);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      const base64 = dataUrl.split(",")[1];
      if (base64) frames.push(base64);
    }
    return frames;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.src = url;

    const done = () => {
      cleanup();
      resolve(video);
    };
    const fail = () => {
      cleanup();
      reject(
        new Error(
          "Video konnte nicht gelesen werden. Format wird vom Browser nicht unterstützt (probier MP4 / MOV)."
        )
      );
    };
    const cleanup = () => {
      video.removeEventListener("loadeddata", done);
      video.removeEventListener("error", fail);
    };

    video.addEventListener("loadeddata", done);
    video.addEventListener("error", fail);
  });
}

function seekTo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      video.removeEventListener("seeked", done);
      // Extra frame hop: some browsers raise `seeked` before the visible
      // frame is decoded. A rAF ensures the canvas picks up the correct frame.
      requestAnimationFrame(() => resolve());
    };
    video.addEventListener("seeked", done);
    video.currentTime = time;
  });
}
