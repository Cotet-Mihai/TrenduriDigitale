import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronRight, Eye, ImageIcon } from "lucide-react";
import ShareButtons from "@/components/share-buttons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import TableOfContents from "@/components/table-of-contents";
import MarkdownContent, { slugify } from "@/components/markdown-content";
import type { BlogPost } from "@/lib/types";

export function extractHeadings(content: string): { id: string; text: string }[] {
  const counts: Record<string, number> = {};
  return content
    .split("\n")
    .filter((line) => /^## /.test(line))
    .map((line) => {
      const raw = line.replace(/^## /, "").trim();
      const text = raw
        .replace(/!\[.*?\]\(.*?\)/g, "")        // strip images
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")      // strip links, keep text
        .trim();
      const base = slugify(text);
      counts[base] = (counts[base] ?? 0) + 1;
      const id = counts[base] === 1 ? base : `${base}-${counts[base]}`;
      return { id, text };
    });
}

interface ArticleViewProps {
  post: BlogPost;
  related: BlogPost[];
  canonicalUrl: string;
}

// Breadcrumb + article + sidebar. Shared by the public article page and the admin live preview.
export default function ArticleView({ post, related, canonicalUrl }: ArticleViewProps) {
  const headings = [
    { id: "introducere", text: "Introducere" },
    ...extractHeadings(post.content),
  ];

  return (
    <>
    {/* Breadcrumb */}
    <div className="border-b border-border/40 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">
            Acasă
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/articole" className="hover:text-foreground transition-colors">
            Articole
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-foreground/70 truncate max-w-[300px]">{post.title}</span>
        </nav>
      </div>
    </div>

    {/* Main grid */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-14">

        {/* ── Left column: article ── */}
        <article>
          {/* Category + title + excerpt */}
          <div id="introducere" className="mb-6 space-y-4 scroll-mt-24">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.6rem] leading-tight">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Author row + share */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border/60 mb-8">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback className="text-xs">
                  {post.author.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{post.author.name}</span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-muted-foreground">{post.date}</span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-muted-foreground">{post.readTime} min read</span>
              </div>
            </div>

            <ShareButtons url={canonicalUrl} title={post.title} />
          </div>

          {/* Hero image */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-md">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              // Only reachable from the admin preview of a post without a cover yet.
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground text-sm">
                <ImageIcon className="size-8 opacity-50" />
                Imaginea principală apare aici
              </div>
            )}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-full">
              <Eye className="w-3.5 h-3.5" />
              <span>{post.views.toLocaleString("ro-RO")} vizualizări</span>
            </div>
          </div>

          {/* Article content */}
          <div className="max-w-none">
            <MarkdownContent content={post.content} />
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mt-10 pt-6 border-t border-border/60 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Etichete:</span>
            {Array.from(new Set([post.category, "Digital", "2024"])).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground hover:bg-muted/80 cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>

        {/* ── Right column: sidebar (desktop only) ── */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8">

            {/* Despre autor */}
            <div className="p-5 rounded-2xl border border-border/60 bg-card">
              <h3 className="font-bold text-base mb-4">Despre autor</h3>
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12 shrink-0">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">Senior Editor @ TrenduriDigitale</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {post.author.bio || `Pasionat de tehnologie și inovație digitală. Scrie despre ${post.category}.`}
              </p>
              <Link
                href="/articole"
                className={
                  buttonVariants({ variant: "outline", size: "sm" }) +
                  " w-full text-xs justify-center"
                }
              >
                Vezi toate articolele
              </Link>
            </div>

            {/* Cuprins */}
            {headings.length > 0 && (
              <div className="p-5 rounded-2xl border border-border/60 bg-card">
                <TableOfContents headings={headings} />
              </div>
            )}

            {/* Articole similare */}
            {related.length > 0 && (
              <div>
                <h3 className="font-bold text-base mb-4">Articole similare</h3>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r.id} href={`/blog/${r.slug}`} className="flex gap-3 group">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={r.image}
                          alt={r.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 block mb-0.5">
                          {r.category}
                        </span>
                        <p className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {r.title}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{r.readTime} min read</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>

      </div>
    </div>
    </>
  );
}
