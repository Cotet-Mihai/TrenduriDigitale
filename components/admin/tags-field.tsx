"use client";

import { useState } from "react";
import { X } from "lucide-react";

const MAX_TAGS = 8;

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsField({ value, onChange }: Props) {
  const [draft, setDraft] = useState("");

  function commit(text: string) {
    const parts = text.split(",").map((t) => t.trim().replace(/\s+/g, " ")).filter(Boolean);
    if (parts.length === 0) return;
    const next = [...value];
    for (const tag of parts) {
      if (next.length >= MAX_TAGS) break;
      if (!next.some((t) => t.toLowerCase() === tag.toLowerCase())) next.push(tag.slice(0, 40));
    }
    onChange(next);
    setDraft("");
  }

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-input px-2 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-muted pl-2.5 pr-1 py-0.5 text-xs">
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="rounded-full p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
              aria-label={`Elimină eticheta ${tag}`}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        {value.length < MAX_TAGS && (
          <input
            value={draft}
            onChange={(e) => {
              const v = e.target.value;
              if (v.includes(",")) commit(v);
              else setDraft(v);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commit(draft);
              } else if (e.key === "Backspace" && !draft && value.length > 0) {
                onChange(value.slice(0, -1));
              }
            }}
            onBlur={() => commit(draft)}
            placeholder={value.length === 0 ? "ex. Google, Android, camere foto" : "Adaugă…"}
            className="flex-1 min-w-24 bg-transparent text-sm outline-none py-0.5 placeholder:text-muted-foreground"
          />
        )}
      </div>
      <p className="text-[11px] text-muted-foreground/80">Enter sau virgulă pentru a adăuga · maximum {MAX_TAGS}</p>
    </div>
  );
}
