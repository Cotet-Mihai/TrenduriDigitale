import type { BlogPost } from "@/lib/types";

// The editor writes the unsaved article to localStorage; the preview tab (same
// browser, same origin) reads it and re-renders on every `storage` event.
// Nothing leaves the browser, so the preview is private and never published.

export interface PreviewPayload {
  post: BlogPost;
  at: number;
}

const prefix = "td-admin-preview:";

export function writePreview(key: string, post: BlogPost) {
  try {
    localStorage.setItem(prefix + key, JSON.stringify({ post, at: Date.now() } satisfies PreviewPayload));
  } catch {
    // Storage full or blocked — the preview simply won't update.
  }
}

export function readPreview(key: string): PreviewPayload | null {
  try {
    const raw = localStorage.getItem(prefix + key);
    return raw ? (JSON.parse(raw) as PreviewPayload) : null;
  } catch {
    return null;
  }
}

export function subscribePreview(key: string, onChange: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === prefix + key) onChange();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
