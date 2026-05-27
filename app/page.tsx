import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Cpu, TrendingUp, Share2, ShoppingCart, User, ChevronRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ArticleCard from "@/components/article-card";
import NewsletterSection from "@/components/newsletter-section";
import { featuredPost, recommendedPosts, latestPosts, categories } from "@/lib/data";

const categoryIcons: Record<string, React.ReactNode> = {
  "cpu": <Cpu className="w-4 h-4" />,
  "trending-up": <TrendingUp className="w-4 h-4" />,
  "share-2": <Share2 className="w-4 h-4" />,
  "shopping-cart": <ShoppingCart className="w-4 h-4" />,
  "user": <User className="w-4 h-4" />,
};

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Trending acum
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl leading-tight">
              {featuredPost.title}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center gap-5">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className={buttonVariants({ size: "lg" }) + " bg-foreground text-background hover:bg-foreground/90 gap-2 h-11 px-6 rounded-lg"}
              >
                Citește articolul <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                <div className="w-8 h-8 rounded-full border-2 border-foreground/20 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                Vezi video
              </button>
            </div>
          </div>

          {/* Right – hero image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className="bg-white/95 text-foreground text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-sm">
                {featuredPost.category}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Articole recomandate */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-border/40">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-xl font-bold">Articole recomandate</h2>
          <Link
            href="/articole"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Vezi toate articolele <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Categorii + Ultimele articole */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/40">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Categorii populare */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-5">Categorii populare</h2>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categorii/${cat.slug}`}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/60 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                      {categoryIcons[cat.icon]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">{cat.count} articole</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 px-3">
              <Link
                href="/categorii"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Vezi toate categoriile <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Ultimele articole */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold mb-5">Ultimele articole</h2>
            <div className="space-y-7">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-4 items-start">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1 block">
                      {post.category}
                    </span>
                    <h3 className="font-heading text-[17px] leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback className="text-[9px]">
                          {post.author.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{post.author.name}</span>
                      <span className="text-xs text-muted-foreground/40">·</span>
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                      <span className="text-xs text-muted-foreground/40">·</span>
                      <span className="text-xs text-muted-foreground">{post.readTime} min read</span>
                    </div>
                  </div>
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </main>
  );
}
