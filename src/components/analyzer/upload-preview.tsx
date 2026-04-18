"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Film, ImageIcon, RotateCcw } from "lucide-react";

interface UploadPreviewProps {
  file: File;
  onRemove: () => void;
}

/**
 * Shows a thumbnail + filename confirmation after a file is selected but
 * before analysis starts. Images render directly; videos get a single
 * frame-grab at 0.5s so the user can confirm "yes, that's my creative".
 */
export function UploadPreview({ file, onRemove }: UploadPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVideo = file.type.startsWith("video/");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Capture a frame at 0.5s for the video thumbnail (UI only; the real
  // backend keyframe extraction happens server-side).
  useEffect(() => {
    if (!isVideo || !previewUrl) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const onLoaded = () => {
      video.currentTime = Math.min(0.5, video.duration * 0.05);
    };
    const onSeeked = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("seeked", onSeeked);
    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [isVideo, previewUrl]);

  const sizeMb = (file.size / 1024 / 1024).toFixed(1);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-2">
      <div className="flex items-start gap-3 p-3">
        <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md bg-background sm:h-24 sm:w-16">
          {isVideo ? (
            <>
              <video
                ref={videoRef}
                src={previewUrl ?? undefined}
                muted
                playsInline
                preload="metadata"
                className="sr-only"
              />
              <canvas
                ref={canvasRef}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40">
                <Film className="h-5 w-5 text-white/90" />
              </div>
            </>
          ) : previewUrl ? (
            <Image
              src={previewUrl}
              alt="Upload-Vorschau"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-5 w-5 text-muted" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {sizeMb} MB · {isVideo ? "Video" : "Bild"} · {file.type.split("/")[1]?.toUpperCase()}
          </p>
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
            Bereit zur Analyse
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-md p-1.5 text-muted hover:bg-surface hover:text-foreground"
          aria-label="Datei entfernen"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
