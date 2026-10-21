"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DESCRIPTION_MAX, SITE_SUFFIX, TITLE_MAX, type SeoCheck, type SeoReport, type SeoStatus } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface Props {
  report: SeoReport;
  keyword: string;
  onKeywordChange: (value: string) => void;
  title: string;
  slug: string;
  excerpt: string;
}

const GROUPS: { id: SeoCheck["group"]; label: string }[] = [
  { id: "google", label: "Cum apare în Google" },
  { id: "keyword", label: "Cuvânt cheie" },
  { id: "content", label: "Conținut" },
  { id: "media", label: "Imagini și linkuri" },
];

const STATUS_ICON: Record<SeoStatus, React.ElementType> = {
  good: CheckCircle2,
  warn: AlertCircle,
  bad: XCircle,
};

const STATUS_COLOR: Record<SeoStatus, string> = {
  good: "text-emerald-600",
  warn: "text-amber-600",
  bad: "text-red-600",
};

export function scoreTone(score: number): { label: string; className: string; bar: string } {
  if (score >= 80) return { label: "Bun", className: "text-emerald-700 bg-emerald-50", bar: "bg-emerald-500" };
  if (score >= 50) return { label: "Acceptabil", className: "text-amber-700 bg-amber-50", bar: "bg-amber-500" };
  return { label: "Slab", className: "text-red-700 bg-red-50", bar: "bg-red-500" };
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1).trimEnd() + " …" : text;
}

export default function SeoPanel({ report, keyword, onKeywordChange, title, slug, excerpt }: Props) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set(["google", "keyword"]));
  const tone = scoreTone(report.score);

  function toggle(group: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">SEO</h2>
        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", tone.className)}>
          {report.score}/100 · {tone.label}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", tone.bar)} style={{ width: `${report.score}%` }} />
      </div>

      {/* Focus keyword */}
      <div className="space-y-1.5">
        <label htmlFor="focus-keyword" className="block text-xs font-medium text-muted-foreground">
          Cuvânt cheie principal
        </label>
        <Input
          id="focus-keyword"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="ex. pixel 9 romania"
          className="h-9"
        />
        <p className="text-[11px] text-muted-foreground/80">
          Ce ar scrie cineva în Google ca să ajungă la articol. Nu apare pe site.
        </p>
      </div>

      {/* Google result preview */}
      <div className="rounded-xl border border-border/60 bg-background p-3 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Previzualizare Google</p>
        <div className="flex items-center gap-2">
          <span className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">TD</span>
          <div className="min-w-0 leading-tight">
            <p className="text-xs text-foreground">TrenduriDigitale</p>
            <p className="text-[11px] text-muted-foreground truncate">trenduridigitale.ro › blog › {slug || "…"}</p>
          </div>
        </div>
        <p className="text-[17px] leading-snug text-[#1a0dab] break-words">
          {truncate((title || "Titlul articolului") + SITE_SUFFIX, TITLE_MAX)}
        </p>
        <p className="text-[13px] leading-snug text-[#4d5156] break-words">
          {excerpt ? truncate(excerpt, DESCRIPTION_MAX) : <span className="italic opacity-70">Adaugă un rezumat — el apare aici.</span>}
        </p>
      </div>

      {/* Checks */}
      <div className="space-y-1">
        {GROUPS.map((group) => {
          const items = report.checks.filter((c) => c.group === group.id);
          if (items.length === 0) return null;
          const issues = items.filter((c) => c.status !== "good").length;
          const open = openGroups.has(group.id);
          return (
            <div key={group.id} className="border-t border-border/60 first:border-t-0">
              <button
                type="button"
                onClick={() => toggle(group.id)}
                className="w-full flex items-center justify-between gap-2 py-2 text-left"
                aria-expanded={open}
              >
                <span className="text-xs font-semibold">{group.label}</span>
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  {issues === 0 ? (
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                  ) : (
                    <span className="text-amber-700">{issues} de îmbunătățit</span>
                  )}
                  <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
                </span>
              </button>
              {open && (
                <ul className="space-y-2.5 pb-3">
                  {items.map((check) => {
                    const Icon = STATUS_ICON[check.status];
                    return (
                      <li key={check.id} className="flex gap-2">
                        <Icon className={cn("size-4 shrink-0 mt-px", STATUS_COLOR[check.status])} />
                        <div className="min-w-0">
                          <p className="text-xs font-medium">{check.label}</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{check.detail}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
