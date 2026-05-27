import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import ArticleCard from "@/components/article-card";
import NewsletterSection from "@/components/newsletter-section";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/lib/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} – DigitalTrendz`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, post.category);
  const fallbackRelated = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const displayRelated = relatedPosts.length > 0 ? relatedPosts : fallbackRelated;

  const contentParagraphs = post.content
    .trim()
    .split("\n\n")
    .filter(Boolean);

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Înapoi la articole
          </Link>
        </div>
      </div>

      {/* Article header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category + meta */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author + actions row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{post.author.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
                  <span className="text-muted-foreground/40">·</span>
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
                <Share2 className="w-3.5 h-3.5" />
                Distribuie
              </Button>
              <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
                <Bookmark className="w-3.5 h-3.5" />
                Salvează
              </Button>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Article content */}
        <div className="prose prose-neutral max-w-none">
          {contentParagraphs.map((paragraph, i) => {
            const trimmed = paragraph.trim();

            if (trimmed.startsWith("## ")) {
              return (
                <h2 key={i} className="font-heading text-2xl mt-10 mb-4">
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }

            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={i} className="font-heading text-xl mt-6 mb-3">
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }

            if (trimmed.startsWith("- ") || trimmed.includes("\n- ")) {
              const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
              return (
                <ul key={i} className="list-disc list-inside space-y-1.5 my-4 text-muted-foreground">
                  {items.map((item, j) => (
                    <li key={j} className="text-base leading-relaxed">
                      {item.replace(/^- \*\*(.+?)\*\*/, (_, bold) => bold)}
                      {item.replace(/^- \*\*[^*]+\*\* – /, "").replace(/^- /, "")}
                    </li>
                  ))}
                </ul>
              );
            }

            if (/^\d+\./.test(trimmed)) {
              const items = trimmed.split("\n").filter((l) => /^\d+\./.test(l));
              return (
                <ol key={i} className="list-decimal list-inside space-y-1.5 my-4 text-muted-foreground">
                  {items.map((item, j) => (
                    <li key={j} className="text-base leading-relaxed">
                      {item.replace(/^\d+\. /, "")}
                    </li>
                  ))}
                </ol>
              );
            }

            return (
              <p key={i} className="text-base leading-relaxed text-foreground/80 my-4">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-10 pt-6 border-t border-border/60 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Etichete:</span>
          {[post.category, "Digital", "2024"].map((tag) => (
            <span key={tag} className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground hover:bg-muted/80 cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>

        {/* Author bio */}
        <div className="mt-10 p-6 bg-muted/40 rounded-2xl border border-border/60">
          <div className="flex items-start gap-4">
            <Avatar className="w-14 h-14 shrink-0">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="text-lg">
                {post.author.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-base">{post.author.name}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Redactor specializat în {post.category}, cu experiență de peste 5 ani în industria digitală. Pasionat de tehnologie și inovație.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related articles */}
      {displayRelated.length > 0 && (
        <section className="border-t border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-xl font-bold">Articole similare</h2>
              <Link
                href="/articole"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Toate articolele <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayRelated.map((related) => (
                <ArticleCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}

      <NewsletterSection />
    </main>
  );
}
