"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ExternalLink, Eye, Loader2, RotateCcw, Star, Trash2, X } from "lucide-react";
import { deletePost, savePost } from "@/lib/admin-actions";
import { estimateReadTime, toSlug, type PostInput } from "@/lib/admin";
import { writePreview } from "@/lib/preview";
import { analyzeSeo, DESCRIPTION_MAX, DESCRIPTION_MIN, TITLE_MAX } from "@/lib/seo";
import SeoPanel, { scoreTone } from "@/components/admin/seo-panel";
import type { BlogPost } from "@/lib/types";
import MarkdownEditor from "@/components/admin/markdown-editor";
import CoverImageField from "@/components/admin/cover-image-field";
import TagsField from "@/components/admin/tags-field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  name: string;
}

interface AuthorOption extends Option {
  avatar: string;
  bio: string;
}

interface Props {
  initial: PostInput;
  categories: Option[];
  authors: AuthorOption[];
}

interface Backup {
  post: PostInput;
  at: number;
}


function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}

// Same shape and date format the public article page receives from lib/queries.ts.
function toPreviewPost(post: PostInput, categories: Option[], authors: AuthorOption[]): BlogPost {
  const author = authors.find((a) => a.id === post.authorId);
  return {
    id: post.id ?? "preview",
    slug: post.slug || "articol-nou",
    title: post.title || "Titlul articolului",
    excerpt: post.excerpt,
    content: post.content,
    category: categories.find((c) => c.id === post.categoryId)?.name ?? "Fără categorie",
    categorySlug: "",
    author: { name: author?.name ?? "Autor", avatar: author?.avatar ?? "", bio: author?.bio ?? "" },
    date: new Date(post.publishedAt ?? Date.now()).toLocaleDateString("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    publishedAt: post.publishedAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: post.readTime,
    image: post.imageUrl,
    views: 0,
    featured: post.featured,
    tags: post.tags,
  };
}

function snapshot(post: PostInput): string {
  return JSON.stringify({ ...post, status: undefined });
}

export default function PostEditor({ initial, categories, authors }: Props) {
  const router = useRouter();
  const isNew = !initial.id;
  const backupKey = `td-admin-draft:${initial.id ?? "new"}`;

  const [post, setPost] = useState<PostInput>(initial);
  const [savedSnapshot, setSavedSnapshot] = useState(() => snapshot(initial));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [readTimeTouched, setReadTimeTouched] = useState(
    !isNew && initial.readTime !== estimateReadTime(initial.content)
  );
  const [editorKey, setEditorKey] = useState(0);
  const [backup, setBackup] = useState<Backup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, startSaving] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, startDeleting] = useTransition();

  const dirty = snapshot(post) !== savedSnapshot;
  const published = post.status === "published";
  const previewKey = initial.id ?? "new";

  // Deferred so typing stays smooth on long articles.
  const deferredPost = useDeferredValue(post);
  const seo = useMemo(
    () =>
      analyzeSeo({
        title: deferredPost.title,
        slug: deferredPost.slug,
        excerpt: deferredPost.excerpt,
        content: deferredPost.content,
        keyword: deferredPost.focusKeyword,
        imageUrl: deferredPost.imageUrl,
        slugIsLive: initial.status === "published" && deferredPost.slug === initial.slug,
      }),
    [deferredPost, initial.status, initial.slug]
  );
  const seoTone = scoreTone(seo.score);

  // Keep the private preview tab in sync with what is on screen, saved or not.
  useEffect(() => {
    const t = setTimeout(() => writePreview(previewKey, toPreviewPost(post, categories, authors)), 250);
    return () => clearTimeout(t);
  }, [post, previewKey, categories, authors]);

  function openPreview() {
    writePreview(previewKey, toPreviewPost(post, categories, authors));
    // One named tab, reused on every click.
    window.open(`/admin/previzualizare?k=${encodeURIComponent(previewKey)}`, "td-preview");
  }

  const update = useCallback(<K extends keyof PostInput>(key: K, value: PostInput[K]) => {
    setPost((p) => ({ ...p, [key]: value }));
  }, []);

  // ─── Derived fields ───────────────────────────────────────────────────────

  function onTitleChange(title: string) {
    setPost((p) => ({ ...p, title, slug: slugTouched ? p.slug : toSlug(title) }));
  }

  // Stable callback: the editor may hold on to the first onChange it receives.
  const readTimeTouchedRef = useRef(readTimeTouched);
  useEffect(() => {
    readTimeTouchedRef.current = readTimeTouched;
  }, [readTimeTouched]);
  const onContentChange = useCallback((content: string) => {
    setPost((p) => ({
      ...p,
      content,
      readTime: readTimeTouchedRef.current ? p.readTime : estimateReadTime(content),
    }));
  }, []);

  // ─── Local backup (survives a crashed tab or an accidental close) ────────

  useEffect(() => {
    try {
      const raw = localStorage.getItem(backupKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Backup;
      // Reading browser storage after mount (unavailable during SSR).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (snapshot(parsed.post) !== snapshot(initial)) setBackup(parsed);
      else localStorage.removeItem(backupKey);
    } catch {
      // Storage unavailable — the backup is a convenience only.
    }
  }, [backupKey, initial]);

  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(backupKey, JSON.stringify({ post, at: Date.now() } satisfies Backup));
      } catch {}
    }, 800);
    return () => clearTimeout(t);
  }, [post, dirty, backupKey]);

  function restoreBackup() {
    if (!backup) return;
    // Spread `initial` first so fields added after the backup was written get a value.
    setPost({ ...initial, ...backup.post, id: initial.id });
    setSlugTouched(true);
    setEditorKey((k) => k + 1); // MDXEditor only reads `markdown` on mount
    setBackup(null);
  }

  function discardBackup() {
    try {
      localStorage.removeItem(backupKey);
    } catch {}
    setBackup(null);
  }

  // ─── Unsaved-changes guard ───────────────────────────────────────────────

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // ─── Save / delete ───────────────────────────────────────────────────────

  const save = useCallback(
    (status: PostInput["status"]) => {
      setError(null);
      const toSave: PostInput = {
        ...post,
        status,
        publishedAt: status === "published" ? post.publishedAt ?? new Date().toISOString() : post.publishedAt,
      };
      startSaving(async () => {
        const result = await savePost(toSave);
        if (result.error || !result.id) {
          setError(result.error ?? "Nu am putut salva articolul.");
          return;
        }
        const saved = { ...toSave, id: result.id };
        setPost(saved);
        setSavedSnapshot(snapshot(saved));
        setSavedAt(new Date());
        try {
          localStorage.removeItem(backupKey);
        } catch {}
        if (isNew) router.replace(`/admin/articole/${result.id}`);
        else router.refresh();
      });
    },
    [post, backupKey, isNew, router]
  );

  // Ctrl+S saves without changing the publish state.
  const saveRef = useRef(save);
  const statusRef = useRef(post.status);
  useEffect(() => {
    saveRef.current = save;
    statusRef.current = post.status;
  }, [save, post.status]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current(statusRef.current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function confirmDelete() {
    if (!post.id) return;
    startDeleting(async () => {
      const result = await deletePost(post.id!);
      if (result.error) {
        setError(result.error);
        setDeleteOpen(false);
        return;
      }
      try {
        localStorage.removeItem(backupKey);
      } catch {}
      setSavedSnapshot(snapshot(post)); // lift the unsaved-changes guard
      router.replace("/admin");
    });
  }

  const excerptLength = post.excerpt.length;
  const statusLabel = useMemo(() => {
    if (saving) return "Se salvează…";
    if (dirty) return "Modificări nesalvate";
    if (savedAt) return `Salvat la ${savedAt.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}`;
    return isNew ? "Articol nou" : "Totul e salvat";
  }, [saving, dirty, savedAt, isNew]);

  return (
    <div>
      {/* Action bar */}
      <div className="sticky top-14 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              <ArrowLeft />
              <span className="hidden sm:inline">Articole</span>
            </Link>
            <span
              className={cn(
                "text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0",
                published ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"
              )}
            >
              {published ? "Publicat" : "Ciornă"}
            </span>
            <span className={cn("text-xs truncate", dirty ? "text-amber-700" : "text-muted-foreground")}>
              {statusLabel}
            </span>
            <span className={cn("hidden md:inline text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0", seoTone.className)}>
              SEO {seo.score}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" onClick={openPreview} title="Vezi cum arată pagina, fără să publici">
              <Eye />
              <span className="hidden md:inline">Previzualizează</span>
            </Button>
            {published ? (
              <Button onClick={() => save("published")} disabled={saving || !dirty}>
                {saving ? <Loader2 className="animate-spin" /> : <Check />}
                <span className="hidden sm:inline">Salvează modificările</span>
                <span className="sm:hidden">Salvează</span>
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => save("draft")} disabled={saving}>
                  <span className="hidden sm:inline">Salvează ciorna</span>
                  <span className="sm:hidden">Salvează</span>
                </Button>
                <Button onClick={() => save("published")} disabled={saving}>
                  {saving && <Loader2 className="animate-spin" />}
                  Publică
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {backup && (
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm">
            <span className="text-blue-900">
              Ai o versiune nesalvată din{" "}
              {new Date(backup.at).toLocaleString("ro-RO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}.
            </span>
            <div className="flex gap-2">
              <Button size="sm" onClick={restoreBackup}>
                <RotateCcw /> Restaurează
              </Button>
              <Button size="sm" variant="ghost" onClick={discardBackup}>
                Ignoră
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div role="alert" className="mb-5 flex items-start justify-between gap-3 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} aria-label="Închide">
              <X className="size-4" />
            </button>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8 space-y-6 lg:space-y-0">
          {/* ── Main column ── */}
          <div className="space-y-4 min-w-0">
            <textarea
              value={post.title}
              onChange={(e) => onTitleChange(e.target.value.replace(/\n/g, " "))}
              placeholder="Titlul articolului"
              rows={1}
              className="w-full resize-none bg-transparent outline-none font-heading text-3xl sm:text-4xl leading-tight placeholder:text-muted-foreground/50 [field-sizing:content] overflow-hidden pb-1"
            />
            <p
              className={cn(
                "-mt-3 text-xs",
                post.title.length > TITLE_MAX ? "text-amber-700" : "text-muted-foreground"
              )}
            >
              {post.title.length}/{TITLE_MAX} caractere
              {post.title.length > TITLE_MAX && " · Google va tăia titlul"}
            </p>
            <MarkdownEditor key={editorKey} value={post.content} onChange={onContentChange} />
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-5">
            <Panel title="Imagine principală">
              <CoverImageField value={post.imageUrl} onChange={(url) => update("imageUrl", url)} />
            </Panel>

            <Panel title="Rezumat">
              <textarea
                value={post.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                rows={4}
                placeholder="Una-două fraze care apar sub titlu, pe cardul articolului și în Google."
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-y"
              />
              <p
                className={cn(
                  "text-xs text-right",
                  excerptLength >= DESCRIPTION_MIN && excerptLength <= DESCRIPTION_MAX
                    ? "text-emerald-700"
                    : excerptLength > DESCRIPTION_MAX
                      ? "text-amber-700"
                      : "text-muted-foreground"
                )}
              >
                {excerptLength}/{DESCRIPTION_MAX}
                {excerptLength > DESCRIPTION_MAX
                  ? " · Google va tăia textul"
                  : excerptLength < DESCRIPTION_MIN
                    ? ` · ideal ${DESCRIPTION_MIN}–${DESCRIPTION_MAX}`
                    : " · ideal"}
              </p>
            </Panel>

            <SeoPanel
              report={seo}
              keyword={post.focusKeyword}
              onKeywordChange={(value) => update("focusKeyword", value)}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
            />

            <Panel title="Detalii">
              <Field label="Categorie">
                <select
                  value={post.categoryId}
                  onChange={(e) => update("categoryId", e.target.value)}
                  className="h-9 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Alege o categorie</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Etichete">
                <TagsField value={post.tags} onChange={(tags) => update("tags", tags)} />
              </Field>

              <Field label="Autor">
                <select
                  value={post.authorId}
                  onChange={(e) => update("authorId", e.target.value)}
                  className="h-9 w-full rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Alege autorul</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Adresă (slug)" hint={`trenduridigitale.ro/blog/${post.slug || "…"}`}>
                <Input
                  value={post.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    update("slug", toSlug(e.target.value) + (e.target.value.endsWith("-") ? "-" : ""));
                  }}
                  onBlur={() => update("slug", toSlug(post.slug))}
                  className="h-9 font-mono text-xs"
                />
                {published && slugTouched && post.slug !== initial.slug && !isNew && (
                  <p className="text-xs text-amber-700 mt-1">
                    Schimbarea adresei strică linkurile deja distribuite către acest articol.
                  </p>
                )}
              </Field>

              <Field label="Timp de citire (minute)" hint={readTimeTouched ? undefined : "Calculat automat din text"}>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={post.readTime}
                    onChange={(e) => {
                      setReadTimeTouched(true);
                      update("readTime", Number(e.target.value) || 1);
                    }}
                    className="h-9 w-24"
                  />
                  {readTimeTouched && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-9"
                      onClick={() => {
                        setReadTimeTouched(false);
                        update("readTime", estimateReadTime(post.content));
                      }}
                    >
                      Automat
                    </Button>
                  )}
                </div>
              </Field>

              <Field label="Data publicării" hint={published ? undefined : "Dacă o lași goală, se folosește momentul publicării"}>
                <Input
                  type="datetime-local"
                  value={toLocalInput(post.publishedAt)}
                  onChange={(e) => update("publishedAt", fromLocalInput(e.target.value))}
                  className="h-9"
                />
              </Field>

              <label className="flex items-start gap-3 rounded-lg border border-border/60 p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                <input
                  type="checkbox"
                  checked={post.featured}
                  onChange={(e) => update("featured", e.target.checked)}
                  className="mt-0.5 size-4 accent-blue-600"
                />
                <span>
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <Star className="size-3.5 text-blue-600" /> Articol recomandat
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    Apare mare pe prima pagină (cel mai recent articol recomandat).
                  </span>
                </span>
              </label>
            </Panel>

            {!isNew && (
              <Panel title="Acțiuni">
                {published && (
                  <Link
                    href={`/blog/${initial.slug}`}
                    target="_blank"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                  >
                    <ExternalLink /> Vezi pe site
                  </Link>
                )}
                {published && (
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => save("draft")} disabled={saving}>
                    Retrage publicarea (trece în ciornă)
                  </Button>
                )}
                <Button variant="destructive" size="sm" className="w-full" onClick={() => setDeleteOpen(true)}>
                  <Trash2 /> Șterge articolul
                </Button>
              </Panel>
            )}
          </aside>
        </div>
      </main>

      <Dialog open={deleteOpen} onOpenChange={(open) => !deleting && setDeleteOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ștergi articolul?</DialogTitle>
            <DialogDescription>
              „{post.title || "Fără titlu"}” va fi șters definitiv și nu mai poate fi recuperat.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" disabled={deleting} />}>Renunță</DialogClose>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting && <Loader2 className="animate-spin" />}
              Șterge definitiv
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm space-y-3">
      <h2 className="text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span className="block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground/80 break-all">{hint}</p>}
    </div>
  );
}
