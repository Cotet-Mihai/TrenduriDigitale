"use client";

import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, Trash2, Upload } from "lucide-react";
import { ACCEPTED_IMAGE_TYPES, uploadImage } from "@/lib/upload-image";
import { isAllowedCoverImage } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function CoverImageField({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Încărcarea a eșuat.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={cn(
          "relative aspect-[16/9] rounded-xl overflow-hidden border-2 border-dashed transition-colors",
          dragging ? "border-blue-400 bg-blue-50" : value ? "border-transparent" : "border-border bg-muted/40"
        )}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Imagine principală" className="size-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1.5 p-2 bg-gradient-to-t from-black/50 to-transparent">
              <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()} disabled={uploading}>
                <Upload /> Schimbă
              </Button>
              <Button type="button" size="icon-sm" variant="secondary" onClick={() => onChange("")} aria-label="Elimină imaginea">
                <Trash2 />
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="size-full flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ImagePlus className="size-7 opacity-60" />
            <span className="font-medium">Încarcă imaginea principală</span>
            <span className="text-xs opacity-70">sau trage un fișier aici · ideal 1200×675</span>
          </button>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 text-sm font-medium">
            <Loader2 className="size-4 animate-spin" /> Se încarcă…
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {showUrl ? (
        <div className="flex gap-1.5">
          <Input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://…"
            className="h-8 text-xs"
            autoFocus
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              if (isAllowedCoverImage(urlDraft.trim())) {
                setError(null);
                onChange(urlDraft.trim());
                setShowUrl(false);
                setUrlDraft("");
              } else {
                setError("Sunt acceptate doar imagini de pe Unsplash sau încărcate aici.");
              }
            }}
          >
            Folosește
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowUrl(true)}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Link2 className="size-3" /> Folosește o adresă de imagine
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
