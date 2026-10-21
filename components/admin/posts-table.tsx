"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, ExternalLink, FileText, Loader2, Pencil, Search, Star, Trash2 } from "lucide-react";
import type { AdminPostRow } from "@/lib/admin";
import { deletePost } from "@/lib/admin-actions";
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

type Filter = "all" | "published" | "draft";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Toate" },
  { value: "published", label: "Publicate" },
  { value: "draft", label: "Ciorne" },
];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" });
}

export default function PostsTable({ posts }: { posts: AdminPostRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [toDelete, setToDelete] = useState<AdminPostRow | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, startDelete] = useTransition();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (filter === "published" && !p.publishedAt) return false;
      if (filter === "draft" && p.publishedAt) return false;
      return !q || p.title.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q);
    });
  }, [posts, query, filter]);

  function confirmDelete() {
    if (!toDelete) return;
    setDeleteError(null);
    startDelete(async () => {
      const result = await deletePost(toDelete.id);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setToDelete(null);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between p-3 border-b border-border/60">
        <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors",
                filter === f.value ? "bg-background shadow-sm font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută după titlu sau categorie"
            className="pl-8 h-9"
          />
        </div>
      </div>

      {/* Rows */}
      {visible.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <FileText className="size-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">
            {posts.length === 0 ? "Încă nu ai niciun articol." : "Niciun articol nu corespunde căutării."}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {visible.map((post) => (
            <li key={post.id} className="flex items-center gap-4 px-3 sm:px-4 py-3 hover:bg-muted/30 transition-colors">
              <Link href={`/admin/articole/${post.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                <div className="size-14 sm:w-20 sm:h-14 rounded-lg bg-muted overflow-hidden shrink-0">
                  {post.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.imageUrl} alt="" className="size-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {post.publishedAt ? (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Publicat
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        Ciornă
                      </span>
                    )}
                    {post.featured && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        <Star className="size-3 fill-current" /> Recomandat
                      </span>
                    )}
                    {post.categoryName && (
                      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        {post.categoryName}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold leading-snug truncate">{post.title || "Fără titlu"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                    <span>
                      {post.publishedAt ? `Publicat ${formatDate(post.publishedAt)}` : `Modificat ${formatDate(post.updatedAt)}`}
                    </span>
                    {post.publishedAt && (
                      <span className="inline-flex items-center gap-1">
                        <Eye className="size-3" />
                        {post.views.toLocaleString("ro-RO")}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-0.5 shrink-0">
                <Link
                  href={`/admin/articole/${post.id}`}
                  className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                  aria-label="Editează"
                  title="Editează"
                >
                  <Pencil />
                </Link>
                {post.publishedAt && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "hidden sm:inline-flex")}
                    aria-label="Vezi pe site"
                    title="Vezi pe site"
                  >
                    <ExternalLink />
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Șterge"
                  title="Șterge"
                  onClick={() => {
                    setDeleteError(null);
                    setToDelete(post);
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={toDelete !== null} onOpenChange={(open) => !open && !deleting && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ștergi articolul?</DialogTitle>
            <DialogDescription>
              „{toDelete?.title}” va fi șters definitiv și nu mai poate fi recuperat.
            </DialogDescription>
          </DialogHeader>
          {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
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
