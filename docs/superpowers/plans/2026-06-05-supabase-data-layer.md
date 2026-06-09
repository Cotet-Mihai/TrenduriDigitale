# Supabase Data Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static `lib/data.ts` with async Supabase query functions and update all consumers so the site reads live data from the database.

**Architecture:** Split into `lib/types.ts` (interfaces) and `lib/queries.ts` (async Supabase functions wrapped in `unstable_cache` with invalidation tags). `app/layout.tsx` becomes async and fetches categories server-side, passing them to `<Navbar>` as a prop. Blog post pages stay SSG; all list pages become dynamic.

**Tech Stack:** Next.js 16 App Router, @supabase/supabase-js 2.x, `unstable_cache` / `revalidateTag` from `next/cache`, TypeScript

**Spec:** `docs/superpowers/specs/2026-06-05-supabase-data-layer-design.md`

---

### Task 1: Create lib/types.ts

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Create the file**

Create `lib/types.ts` with the following content:

```typescript
export interface Author {
  name: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  author: Author;
  date: string;
  readTime: number;
  image: string;
  views: number;
  featured: boolean;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  icon: string;
  description: string;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors from `lib/types.ts` (there will be errors from other files still importing `@/lib/data` — ignore those for now).

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add lib/types.ts with BlogPost, Category, Author interfaces"
```

---

### Task 2: Create lib/queries.ts

**Files:**
- Create: `lib/queries.ts`

- [ ] **Step 1: Create the file**

Create `lib/queries.ts`:

```typescript
import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabase';
import type { BlogPost, Category } from '@/lib/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(row: any): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    content: row.content ?? '',
    category: row.categories?.name ?? '',
    categorySlug: row.categories?.slug ?? '',
    author: {
      name: row.authors?.name ?? '',
      avatar: row.authors?.avatar_url ?? '',
    },
    date: formatDate(row.published_at),
    readTime: row.read_time ?? 0,
    image: row.image_url ?? '',
    views: row.views ?? 0,
    featured: row.featured ?? false,
  };
}

const POST_SELECT =
  'id, slug, title, excerpt, content, published_at, read_time, image_url, views, featured, categories(name, slug), authors(name, avatar_url)';

// ─── Categories ────────────────────────────────────────────────────────────

export const getCategories = unstable_cache(
  async (): Promise<Category[]> => {
    const [{ data: cats, error: catsErr }, { data: posts, error: postsErr }] =
      await Promise.all([
        supabase.from('categories').select('id, name, slug, icon, description').order('name'),
        supabase.from('posts').select('category_id').not('published_at', 'is', null),
      ]);
    if (catsErr) throw catsErr;
    if (postsErr) throw postsErr;

    const counts = (posts ?? []).reduce(
      (acc, p) => { acc[p.category_id] = (acc[p.category_id] || 0) + 1; return acc; },
      {} as Record<string, number>
    );

    return (cats ?? []).map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon ?? '',
      description: cat.description ?? '',
      count: counts[cat.id] || 0,
    }));
  },
  ['getCategories'],
  { tags: ['categories'] }
);

export function getCategoryBySlug(slug: string): Promise<Category | null> {
  return unstable_cache(
    async () => {
      const cats = await getCategories();
      return cats.find((c) => c.slug === slug) ?? null;
    },
    ['getCategoryBySlug', slug],
    { tags: ['categories'] }
  )();
}

// ─── Posts ─────────────────────────────────────────────────────────────────

export const getPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapPost);
  },
  ['getPosts'],
  { tags: ['posts'] }
);

export const getFeaturedPost = unstable_cache(
  async (): Promise<BlogPost | null> => {
    const { data, error } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .not('published_at', 'is', null)
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? mapPost(data) : null;
  },
  ['getFeaturedPost'],
  { tags: ['posts'] }
);

export function getRecentPosts(limit = 10): Promise<BlogPost[]> {
  return unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(POST_SELECT)
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []).map(mapPost);
    },
    ['getRecentPosts', String(limit)],
    { tags: ['posts'] }
  )();
}

export function getPopularPosts(limit = 10): Promise<BlogPost[]> {
  return unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(POST_SELECT)
        .not('published_at', 'is', null)
        .order('views', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []).map(mapPost);
    },
    ['getPopularPosts', String(limit)],
    { tags: ['posts'] }
  )();
}

export function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(POST_SELECT)
        .not('published_at', 'is', null)
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw error;
      return data ? mapPost(data) : null;
    },
    ['getPostBySlug', slug],
    { tags: ['posts', `post-${slug}`] }
  )();
}

export function getRelatedPosts(currentSlug: string, categorySlug: string): Promise<BlogPost[]> {
  return unstable_cache(
    async () => {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();
      if (!cat) return [];

      const { data, error } = await supabase
        .from('posts')
        .select(POST_SELECT)
        .not('published_at', 'is', null)
        .eq('category_id', cat.id)
        .neq('slug', currentSlug)
        .order('published_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return (data ?? []).map(mapPost);
    },
    ['getRelatedPosts', currentSlug, categorySlug],
    { tags: ['posts'] }
  )();
}

export function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  return unstable_cache(
    async () => {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();
      if (!cat) return [];

      const { data, error } = await supabase
        .from('posts')
        .select(POST_SELECT)
        .not('published_at', 'is', null)
        .eq('category_id', cat.id)
        .order('published_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapPost);
    },
    ['getPostsByCategory', categorySlug],
    { tags: ['posts', 'categories'] }
  )();
}

export const getAllPostSlugs = unstable_cache(
  async (): Promise<{ slug: string }[]> => {
    const { data, error } = await supabase
      .from('posts')
      .select('slug')
      .not('published_at', 'is', null);
    if (error) throw error;
    return data ?? [];
  },
  ['getAllPostSlugs'],
  { tags: ['posts'] }
);
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no new errors from `lib/queries.ts`. Errors from other files still importing `@/lib/data` are expected — ignore them.

- [ ] **Step 3: Commit**

```bash
git add lib/queries.ts
git commit -m "feat: add lib/queries.ts with cached Supabase query functions"
```

---

### Task 3: Update type-only imports in components

**Files:**
- Modify: `components/article-card.tsx` (line 5)
- Modify: `components/articles-grid.tsx` (line 8)

- [ ] **Step 1: Update article-card.tsx**

In `components/article-card.tsx`, change line 5:

```typescript
// Before
import type { BlogPost } from "@/lib/data";

// After
import type { BlogPost } from "@/lib/types";
```

- [ ] **Step 2: Update articles-grid.tsx**

In `components/articles-grid.tsx`, change line 8:

```typescript
// Before
import type { BlogPost, Category } from "@/lib/data";

// After
import type { BlogPost, Category } from "@/lib/types";
```

- [ ] **Step 3: Verify build**

```bash
pnpm tsc --noEmit
```

Expected: no errors from these two files.

- [ ] **Step 4: Commit**

```bash
git add components/article-card.tsx components/articles-grid.tsx
git commit -m "feat: update type imports in components to lib/types"
```

---

### Task 4: Update components/navbar.tsx

**Files:**
- Modify: `components/navbar.tsx`

`navbar.tsx` currently imports `categories` at module level from `lib/data` and uses it to build `navItems` outside the component. We need to accept `categories` as a prop and move the navItems construction inside the component.

- [ ] **Step 1: Replace the full file**

Replace `components/navbar.tsx` with:

```typescript
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, Menu, X, ChevronDown, Send, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Category } from "@/lib/types";

function SubscribeModal() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <DialogContent className="sm:max-w-md p-0 overflow-hidden">
      {submitted ? (
        <div className="flex flex-col items-center text-center px-8 py-12">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="font-heading text-2xl mb-2">Te-ai abonat!</h2>
          <p className="text-sm text-muted-foreground">
            Verifică-ți inboxul pentru a confirma abonarea. Bine ai venit în comunitate!
          </p>
        </div>
      ) : (
        <>
          <div className="bg-foreground text-background px-8 pt-8 pb-6">
            <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-background" />
            </div>
            <DialogTitle className="text-background text-xl font-heading mb-1">
              Abonează-te la newsletter
            </DialogTitle>
            <DialogDescription className="text-background/60 text-sm">
              Primești săptămânal cele mai bune articole despre tehnologie, marketing și inovație digitală — direct în inbox.
            </DialogDescription>
          </div>
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Numele tău
              </label>
              <Input
                placeholder="Ion Popescu"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Adresa de email *
              </label>
              <Input
                type="email"
                placeholder="ion@exemplu.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Nu trimitem spam. Te poți dezabona oricând cu un singur click.
            </p>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background hover:bg-foreground/90 gap-2 h-10"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Se procesează...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Abonează-mă acum
                </>
              )}
            </Button>
          </form>
        </>
      )}
    </DialogContent>
  );
}

interface NavbarProps {
  categories: Category[];
}

export default function Navbar({ categories }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems = [
    { label: "Acasă", href: "/" },
    {
      label: "Articole",
      href: "/articole",
      children: [
        { label: "Toate articolele", href: "/articole" },
        { label: "Cele mai citite", href: "/articole/populare" },
        { label: "Recente", href: "/articole/recente" },
      ],
    },
    {
      label: "Categorii",
      href: "/categorii",
      children: categories.map((cat) => ({
        label: cat.name,
        href: `/categorii/${cat.slug}`,
      })),
    },
    {
      label: "Resurse",
      href: "/resurse",
      children: [
        { label: "Ghiduri", href: "/resurse/ghiduri" },
        { label: "Studii de caz", href: "/resurse/studii-de-caz" },
        { label: "Tools & Softwares", href: "/resurse/tools" },
      ],
    },
    { label: "Despre", href: "/despre" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center h-20 overflow-hidden">
            <Image
              src="/logo-text.png"
              alt="TrenduriDigitale"
              width={500}
              height={125}
              style={{ filter: "invert(1)", height: "120px", width: "auto" }}
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-accent">
                    {item.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-md hover:bg-accent"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent transition-colors">
              <Search className="w-4 h-4 text-foreground/70" />
            </button>
            <Dialog>
              <DialogTrigger
                render={
                  <Button className="hidden md:flex bg-foreground text-background hover:bg-foreground/90 text-sm gap-1.5 h-9 px-4" />
                }
              >
                <Mail className="w-3.5 h-3.5" /> Abonează-te
              </DialogTrigger>
              <SubscribeModal />
            </Dialog>
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Dialog>
                <DialogTrigger
                  render={
                    <Button className="w-full bg-foreground text-background gap-1.5" />
                  }
                >
                  <Mail className="w-3.5 h-3.5" /> Abonează-te
                </DialogTrigger>
                <SubscribeModal />
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: `navbar.tsx` compiles cleanly. `app/layout.tsx` will error (it still passes no `categories` prop) — that's fixed in the next task.

- [ ] **Step 3: Commit**

```bash
git add components/navbar.tsx
git commit -m "feat: navbar accepts categories prop instead of importing from data"
```

---

### Task 5: Update app/layout.tsx

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace the file**

Replace `app/layout.tsx` with:

```typescript
import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import { getCategories } from "@/lib/queries";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrenduriDigitale – Trenduri în tehnologie, marketing și inovație",
  description: "Sursa ta de inspirație pentru tot ce e nou în tehnologie, marketing și inovație digitală.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html
      lang="ro"
      className={`${inter.variable} ${dmSerifDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar categories={categories} />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: layout errors resolve. Remaining errors are from pages still importing `@/lib/data`.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: layout fetches categories from Supabase and passes to Navbar"
```

---

### Task 6: Update app/page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace the file**

Replace `app/page.tsx` with:

```typescript
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, ChevronRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ArticleCard from "@/components/article-card";
import NewsletterSection from "@/components/newsletter-section";
import { getFeaturedPost, getRecentPosts, getCategories } from "@/lib/queries";
import { getCategoryIcon, categoryIconHoverMap } from "@/lib/category-icons";

export default async function HomePage() {
  const [featured, recent, categories] = await Promise.all([
    getFeaturedPost(),
    getRecentPosts(7),
    getCategories(),
  ]);

  const displayFeatured = featured ?? recent[0];
  const others = recent.filter((p) => p.id !== displayFeatured?.id);
  const recommended = others.slice(0, 3);
  const latest = others.slice(3, 6);

  if (!displayFeatured) return null;

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Trending acum
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl leading-tight">
              {displayFeatured.title}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-lg">
              {displayFeatured.excerpt}
            </p>
            <div className="flex items-center gap-5">
              <Link
                href={`/blog/${displayFeatured.slug}`}
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

          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
            <Image
              src={displayFeatured.image}
              alt={displayFeatured.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className="bg-white/95 text-foreground text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-sm">
                {displayFeatured.category}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Articole recomandate */}
      {recommended.length > 0 && (
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
            {recommended.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Categorii + Ultimele articole */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/40">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-5">Categorii populare</h2>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categorii/${cat.slug}`}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/60 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                      {getCategoryIcon(cat.icon, `w-4 h-4 transition-[color,filter] duration-300 ease-out [filter:drop-shadow(0_0_0px_transparent)] ${categoryIconHoverMap[cat.icon] ?? ""} group-hover:[filter:drop-shadow(0_0_5px_currentColor)]`)}
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

          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold mb-5">Ultimele articole</h2>
            <div className="space-y-7">
              {latest.map((post) => (
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

      <NewsletterSection />
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: homepage fetches data from Supabase"
```

---

### Task 7: Update app/blog/[slug]/page.tsx

**Files:**
- Modify: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Replace the file**

Replace `app/blog/[slug]/page.tsx` with:

```typescript
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import ArticleCard from "@/components/article-card";
import NewsletterSection from "@/components/newsletter-section";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/queries";

interface PageProps {
  params: Promise<{ slug: string }>;
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
    title: `${post.title} – TrenduriDigitale`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug, post.categorySlug);

  const contentParagraphs = post.content
    .trim()
    .split("\n\n")
    .filter(Boolean);

  return (
    <main className="flex-1">
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

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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

        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

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

        <div className="flex items-center gap-2 mt-10 pt-6 border-t border-border/60 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Etichete:</span>
          {[post.category, "Digital", "2024"].map((tag) => (
            <span key={tag} className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground hover:bg-muted/80 cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>

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

      {relatedPosts.length > 0 && (
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
              {relatedPosts.map((related) => (
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
```

- [ ] **Step 2: Commit**

```bash
git add app/blog/[slug]/page.tsx
git commit -m "feat: blog post page uses Supabase (SSG with cached queries)"
```

---

### Task 8: Update app/categorii/page.tsx

**Files:**
- Modify: `app/categorii/page.tsx`

- [ ] **Step 1: Replace the file**

Replace `app/categorii/page.tsx` with:

```typescript
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories, getPosts } from "@/lib/queries";
import { getCategoryIcon, categoryIconHoverMap } from "@/lib/category-icons";

export const metadata = {
  title: "Categorii – TrenduriDigitale",
  description: "Explorează articolele organizate pe categorii: AI, Marketing Digital, Social Media și multe altele.",
};

export default async function CategoriiPage() {
  const [categories, posts] = await Promise.all([getCategories(), getPosts()]);

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Categorii</h1>
          <p className="text-muted-foreground">
            Găsește rapid conținutul care te interesează, organizat pe teme principale.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const latestPost = posts.find((p) => p.category === cat.name);
            return (
              <Link
                key={cat.slug}
                href={`/categorii/${cat.slug}`}
                className="group block p-6 rounded-2xl border border-border hover:border-foreground/20 hover:shadow-md transition-all bg-card"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                  {getCategoryIcon(cat.icon, `w-6 h-6 transition-[color,filter] duration-300 ease-out [filter:drop-shadow(0_0_0px_transparent)] ${categoryIconHoverMap[cat.icon] ?? ""} group-hover:[filter:drop-shadow(0_0_5px_currentColor)]`)}
                </div>
                <h2 className="font-heading text-xl mb-1 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    {cat.count} articole
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorează <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                {latestPost && (
                  <div className="mt-4 pt-4 border-t border-border/60">
                    <p className="text-xs text-muted-foreground mb-0.5">Ultimul articol</p>
                    <p className="text-xs font-medium line-clamp-1">{latestPost.title}</p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/categorii/page.tsx
git commit -m "feat: categorii page fetches data from Supabase"
```

---

### Task 9: Update app/categorii/[slug]/page.tsx

**Files:**
- Modify: `app/categorii/[slug]/page.tsx`

This page becomes **dynamic** — remove `generateStaticParams`.

- [ ] **Step 1: Replace the file**

Replace `app/categorii/[slug]/page.tsx` with:

```typescript
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArticleCard from "@/components/article-card";
import { getCategoryBySlug, getPostsByCategory } from "@/lib/queries";
import { getCategoryIcon } from "@/lib/category-icons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: `${cat.name} – TrenduriDigitale`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [category, posts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategory(slug),
  ]);

  if (!category) notFound();

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/categorii"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Toate categoriile
        </Link>

        <div className="flex items-start gap-5 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
            {getCategoryIcon(category.icon, "w-6 h-6")}
          </div>
          <div>
            <h1 className="font-heading text-4xl mb-1">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {posts.length} articol{posts.length !== 1 ? "e" : ""} disponibile
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="font-heading text-xl text-muted-foreground mb-2">
              Articole în curs de publicare
            </p>
            <p className="text-sm text-muted-foreground">
              Revino curând pentru conținut nou în această categorie.
            </p>
            <Link
              href="/articole"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline mt-4"
            >
              Vezi toate articolele
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/categorii/[slug]/page.tsx
git commit -m "feat: category detail page uses Supabase (dynamic)"
```

---

### Task 10: Update app/articole pages

**Files:**
- Modify: `app/articole/page.tsx`
- Modify: `app/articole/populare/page.tsx`
- Modify: `app/articole/recente/page.tsx`

- [ ] **Step 1: Replace app/articole/page.tsx**

```typescript
import ArticlesGrid from "@/components/articles-grid";
import { getPosts, getCategories } from "@/lib/queries";

export const metadata = {
  title: "Articole – TrenduriDigitale",
  description: "Toate articolele despre tehnologie, marketing digital, social media și inovație.",
};

export default async function ArticolePage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Toate articolele</h1>
          <p className="text-muted-foreground">
            Explorează întreaga colecție de articole despre lumea digitală.
          </p>
        </div>
        <ArticlesGrid posts={posts} categories={categories} />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Replace app/articole/populare/page.tsx**

```typescript
import ArticlesGrid from "@/components/articles-grid";
import { getPopularPosts, getCategories } from "@/lib/queries";

export const metadata = {
  title: "Cele mai citite – TrenduriDigitale",
};

export default async function ArticolePopularePage() {
  const [posts, categories] = await Promise.all([getPopularPosts(50), getCategories()]);

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Cele mai citite</h1>
          <p className="text-muted-foreground">Articolele care au generat cel mai mult interes în comunitate.</p>
        </div>
        <ArticlesGrid posts={posts} categories={categories} defaultSort="popular" />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Replace app/articole/recente/page.tsx**

```typescript
import ArticlesGrid from "@/components/articles-grid";
import { getRecentPosts, getCategories } from "@/lib/queries";

export const metadata = {
  title: "Articole recente – TrenduriDigitale",
};

export default async function ArticoleRecentePage() {
  const [posts, categories] = await Promise.all([getRecentPosts(50), getCategories()]);

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Articole recente</h1>
          <p className="text-muted-foreground">Ultimele articole publicate, proaspete din redacție.</p>
        </div>
        <ArticlesGrid posts={posts} categories={categories} defaultSort="recent" />
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/articole/page.tsx app/articole/populare/page.tsx app/articole/recente/page.tsx
git commit -m "feat: articole pages fetch data from Supabase"
```

---

### Task 11: Delete lib/data.ts and verify build

**Files:**
- Delete: `lib/data.ts`

- [ ] **Step 1: Delete lib/data.ts**

```bash
git rm lib/data.ts
```

- [ ] **Step 2: Run TypeScript check**

```bash
pnpm tsc --noEmit
```

Expected: **zero errors**. If any errors appear, they will point to remaining `@/lib/data` imports — fix each one by updating the import to `@/lib/types` or `@/lib/queries` as appropriate.

- [ ] **Step 3: Run production build**

```bash
pnpm build
```

Expected: build succeeds, all routes generated, no TypeScript errors. The build output should show:
- `/blog/[slug]` as SSG (static)
- All other pages as dynamic (λ)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: remove lib/data.ts — site fully connected to Supabase"
```

---

## What's Next (out of scope for this plan)

- Call `supabase.rpc('increment_post_views', { post_slug: slug })` from `app/blog/[slug]/page.tsx` (requires a Server Action or client-side effect)
- Admin panel with `revalidateTag('posts')` / `revalidateTag('categories')` after mutations
- Newsletter subscription form wiring to `newsletter_subscribers` table
- Vercel env vars: `vercel env add NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
