import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Link2, X, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import NewsletterSection from "@/components/newsletter-section";
import TableOfContents from "@/components/table-of-contents";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/queries";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractHeadings(content: string): { id: string; text: string }[] {
  return content
    .split("\n")
    .filter((line) => /^## /.test(line))
    .map((line) => {
      const text = line.replace(/^## /, "").trim();
      return { id: slugify(text), text };
    });
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} – DigitalTrendz`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, post.categorySlug);
  const headings = extractHeadings(post.content);

  return (
    <main className="flex-1">
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
            <div className="mb-6 space-y-4">
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

              {/* Share buttons — visual only */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground mr-1">Distribuie articolul</span>
                {/* LinkedIn */}
                <button
                  className="w-8 h-8 rounded-md border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </button>
                {/* Facebook */}
                <button
                  className="w-8 h-8 rounded-md border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </button>
                {/* X (Twitter) */}
                <button
                  className="w-8 h-8 rounded-md border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                  aria-label="X / Twitter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {/* Copy link */}
                <button
                  className="w-8 h-8 rounded-md border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                  aria-label="Copiază link"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-md">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Article content */}
            <div className="max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => {
                    const text = [children].flat().join("");
                    const id = slugify(text);
                    return (
                      <h2
                        id={id}
                        className="font-heading text-2xl font-bold mt-10 mb-4 text-foreground"
                      >
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children }) => (
                    <h3 className="font-heading text-xl font-bold mt-8 mb-3 text-foreground">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="font-heading text-lg font-semibold mt-6 mb-2 text-foreground">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="text-[17px] leading-[1.85] text-foreground/75 my-5 tracking-[0.01em]">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-6 space-y-2 pl-6 list-disc marker:text-blue-500">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-6 space-y-2 pl-6 list-decimal marker:text-blue-500 marker:font-bold">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-[17px] leading-[1.75] text-foreground/75 pl-1">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-foreground">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-foreground/90">{children}</em>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-8 pl-6 border-l-4 border-blue-500 bg-blue-50/50 py-4 pr-4 rounded-r-xl text-[17px] italic text-foreground/70 leading-relaxed">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-600 underline decoration-blue-300 underline-offset-2 hover:decoration-blue-600 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mt-10 pt-6 border-t border-border/60 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground">Etichete:</span>
              {[post.category, "Digital", "2024"].map((tag) => (
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
                    <p className="text-xs text-muted-foreground">Senior Editor @ DigitalTrendz</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Pasionat de tehnologie și inovație digitală. Scrie despre {post.category}, marketing
                  digital și transformarea digitală a afacerilor.
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

      <NewsletterSection />
    </main>
  );
}
