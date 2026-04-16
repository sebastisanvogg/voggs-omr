"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, Film, ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { UPLOAD_LIMITS, isAcceptedMime } from "@/lib/validation";

interface UploadBoxProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

const ACCEPT_STRING = UPLOAD_LIMITS.acceptedMime.join(",");
const MAX_MB = Math.round(UPLOAD_LIMITS.maxBytes / 1024 / 1024);

export function UploadBox({ onFile, disabled = false }: UploadBoxProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((file: File): boolean => {
    if (!isAcceptedMime(file.type)) {
      setError(`Dateityp nicht unterstützt. Erlaubt: MP4, MOV, JPG, PNG, WebP.`);
      return false;
    }
    if (file.size > UPLOAD_LIMITS.maxBytes) {
      setError(`Datei zu groß (max. ${MAX_MB} MB).`);
      return false;
    }
    setError(null);
    return true;
  }, []);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      if (validate(file)) onFile(file);
    },
    [onFile, validate]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles, disabled]
  );

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label="Ad-Datei hochladen"
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
          dragActive
            ? "border-accent bg-accent/5"
            : "border-border hover:border-border-strong hover:bg-surface-2/50",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_STRING}
          onChange={(e) => handleFiles(e.target.files)}
          className="sr-only"
          disabled={disabled}
        />

        <div className="flex items-center gap-2 text-muted">
          <Upload className="h-5 w-5" />
          <Film className="h-5 w-5" />
          <ImageIcon className="h-5 w-5" />
        </div>

        <p className="text-sm font-medium text-foreground">
          Datei hierher ziehen oder <span className="text-accent">durchsuchen</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Video (MP4, MOV) oder Bild (JPG, PNG, WebP) — max. {MAX_MB} MB
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Deine Datei wird einmalig analysiert und nach 24 Stunden gelöscht.
        Keine dauerhafte Speicherung.{" "}
        <a href="/datenschutz" className="underline">
          Mehr Infos
        </a>
        .
      </p>
    </div>
  );
}
