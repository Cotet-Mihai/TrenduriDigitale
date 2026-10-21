"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AlertTriangle, Eye, Loader2, Maximize2, Minimize2, PenLine } from "lucide-react";
import MarkdownContent from "@/components/markdown-content";
import { countWords } from "@/lib/admin";
import { cn } from "@/lib/utils";

// MDXEditor touches `window` on import, so it only loads in the browser.
const VisualEditorInner = dynamic(() => import("@/components/admin/visual-editor-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" /> Se încarcă editorul…
    </div>
  ),
});

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: Props) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [fullscreen, setFullscreen] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreen]);

  const words = countWords(value);

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden",
        fullscreen && "fixed inset-0 z-50 rounded-none border-0"
      )}
    >
      {/* Mode bar */}
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-1.5 bg-muted/40">
        <div className="flex rounded-lg bg-muted p-0.5">
          {([
            { value: "edit", label: "Scriere", icon: PenLine },
            { value: "preview", label: "Previzualizare", icon: Eye },
          ] as const).map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-colors",
                mode === m.value ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <m.icon className="size-3.5" />
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {words.toLocaleString("ro-RO")} cuvinte · ~{Math.max(1, Math.ceil(words / 200))} min citire
          </span>
          <button
            type="button"
            title={fullscreen ? "Ieși din ecran complet (Esc)" : "Ecran complet"}
            aria-label={fullscreen ? "Ieși din ecran complet" : "Ecran complet"}
            onClick={() => setFullscreen((v) => !v)}
            className="size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {fullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>
        </div>
      </div>

      {parseError && (
        <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          <AlertTriangle className="size-4 shrink-0 mt-px" />
          <span>
            O parte din text nu poate fi afișată în editorul vizual. Comută pe „Markdown” din bara editorului ca să o corectezi.
            <span className="block opacity-70 mt-0.5">{parseError}</span>
          </span>
        </div>
      )}

      {/* Editor stays mounted while previewing so undo history and cursor survive. */}
      <div className={cn("min-h-0 overflow-y-auto", fullscreen ? "flex-1" : "max-h-[78vh]", mode !== "edit" && "hidden")}>
        <VisualEditorInner markdown={value} onChange={onChange} onError={setParseError} />
      </div>
      {mode === "preview" && (
        <div className={cn("overflow-y-auto bg-background", fullscreen ? "flex-1" : "max-h-[78vh] min-h-[60vh]")}>
          <div className="max-w-3xl mx-auto px-6 py-6">
            {value.trim() ? (
              <MarkdownContent content={value} />
            ) : (
              <p className="text-muted-foreground text-sm py-8 text-center">Încă nu ai scris nimic.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
