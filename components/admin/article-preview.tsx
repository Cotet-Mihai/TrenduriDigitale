"use client";

import { useSyncExternalStore } from "react";
import { Eye } from "lucide-react";
import ArticleView from "@/components/article-view";
import NewsletterSection from "@/components/newsletter-section";
import { readPreview, subscribePreview, type PreviewPayload } from "@/lib/preview";

const BASE_URL = "https://trenduridigitale.ro";

// Cache the parsed payload per raw value so useSyncExternalStore gets a stable snapshot.
let lastRaw: string | null = null;
let lastPayload: PreviewPayload | null = null;

function getSnapshot(key: string): PreviewPayload | null {
  const payload = readPreview(key);
  const raw = payload ? JSON.stringify(payload) : null;
  if (raw !== lastRaw) {
    lastRaw = raw;
    lastPayload = payload;
  }
  return lastPayload;
}

export default function ArticlePreview({ previewKey }: { previewKey: string }) {
  const payload = useSyncExternalStore(
    (onChange) => subscribePreview(previewKey, onChange),
    () => getSnapshot(previewKey),
    () => null
  );

  if (!payload) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-24 bg-background">
        <div className="text-center max-w-sm">
          <Eye className="size-8 mx-auto mb-3 text-muted-foreground/50" />
          <h1 className="font-heading text-2xl mb-2">Nimic de previzualizat</h1>
          <p className="text-sm text-muted-foreground">
            Deschide previzualizarea din editorul unui articol, cu butonul „Previzualizează”.
          </p>
        </div>
      </main>
    );
  }

  const { post } = payload;

  return (
    <main className="flex-1 bg-background">
      <ArticleView post={post} related={[]} canonicalUrl={`${BASE_URL}/blog/${post.slug}`} />
      <NewsletterSection />

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-zinc-900 text-white text-xs font-medium pl-3 pr-4 py-2 shadow-lg">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
        </span>
        Previzualizare privată · se actualizează pe măsură ce scrii
      </div>
    </main>
  );
}
