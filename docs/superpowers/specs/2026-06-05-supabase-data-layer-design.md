# TrenduriDigitale — Supabase Data Layer Design

**Date:** 2026-06-05
**Status:** Approved
**Scope:** Replace static `lib/data.ts` with Supabase query functions. No UI changes.

## Context

The database schema, RLS, and seed data are live (see `2026-06-05-supabase-database-design.md`). This spec covers replacing the static TypeScript arrays in `lib/data.ts` with async Supabase queries, wiring up caching with `unstable_cache`, and updating all consumers.

---

## Approach

Split `lib/data.ts` into two files: `lib/types.ts` (interfaces only) and `lib/queries.ts` (async Supabase functions with caching). Update all pages and `app/layout.tsx` to use the new layer.

---

## File Structure

### New files

**`lib/types.ts`** — TypeScript interfaces, moved from `lib/data.ts`:
```typescript
export interface Author {
  name: string;
  avatar: string;        // maps from avatar_url
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;      // from categories.name (JOIN)
  categorySlug: string;  // NEW — from categories.slug (JOIN)
  author: Author;
  date: string;          // formatted from published_at → "15 Mai 2024"
  readTime: number;      // from read_time
  image: string;         // from image_url
  views: number;
  featured: boolean;
}

export interface Category {
  name: string;
  slug: string;
  count: number;         // COUNT(*) from posts JOIN
  icon: string;
  description: string;
}
```

**`lib/queries.ts`** — async Supabase query functions with `unstable_cache`:

| Function | Cache tags | Description |
|---|---|---|
| `getCategories()` | `['categories']` | All 5 categories with post count |
| `getCategoryBySlug(slug)` | `['categories']` | Single category by slug |
| `getPosts()` | `['posts']` | All published posts, newest first |
| `getFeaturedPost()` | `['posts']` | First post where featured=true |
| `getRecentPosts(limit?)` | `['posts']` | Latest N posts (default 3) |
| `getPopularPosts(limit?)` | `['posts']` | Top N posts by views |
| `getPostBySlug(slug)` | `['posts', 'post-{slug}']` | Single post with author + category |
| `getRelatedPosts(slug, catSlug)` | `['posts']` | Up to 3 posts in same category |
| `getPostsByCategory(catSlug)` | `['posts', 'categories']` | All posts in a category |
| `getAllPostSlugs()` | `['posts']` | Used by generateStaticParams |

### Deleted files

- `lib/data.ts` — replaced by `lib/types.ts` + `lib/queries.ts`

### Modified files

**`app/layout.tsx`** — becomes `async`, fetches categories, passes to Navbar:
```tsx
const categories = await getCategories();
return <Navbar categories={categories} />;
```

**`components/navbar.tsx`** — receives `categories: Category[]` as prop instead of importing from data:
```tsx
export default function Navbar({ categories }: { categories: Category[] }) { ... }
```

**`app/blog/[slug]/page.tsx`** — SSG: `generateStaticParams` calls `getAllPostSlugs()`; page uses `getPostBySlug()` + `getRelatedPosts()`

**`app/page.tsx`** — dynamic: uses `getFeaturedPost()`, `getRecentPosts()`, `getCategories()`

**`app/categorii/page.tsx`** — dynamic: uses `getCategories()`

**`app/categorii/[slug]/page.tsx`** — dynamic: uses `getCategoryBySlug()` + `getPostsByCategory()`

**`app/articole/page.tsx`** — dynamic: uses `getPosts()`

**`app/articole/populare/page.tsx`** — dynamic: uses `getPopularPosts()`

**`app/articole/recente/page.tsx`** — dynamic: uses `getRecentPosts()`

**`components/article-card.tsx`** — import type updated from `@/lib/data` → `@/lib/types`

**`components/articles-grid.tsx`** — import type updated from `@/lib/data` → `@/lib/types`

---

## Caching Strategy

All query functions use `unstable_cache` from `next/cache`. Cache persists across requests until explicitly invalidated.

```typescript
import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabase';

export const getCategories = unstable_cache(
  async () => { /* supabase query */ },
  ['categories'],
  { tags: ['categories'] }
);
```

**Cache invalidation from admin panel (future):**
```typescript
import { revalidateTag } from 'next/cache';
revalidateTag('posts');       // when any post is added/edited/deleted
revalidateTag('categories');  // when any category is changed
```

---

## Rendering Strategy

| Route | Strategy | Reason |
|---|---|---|
| `/blog/[slug]` | SSG (`generateStaticParams`) | Max SEO, stable per-article content |
| `/` | Dynamic | Featured + lists change with new content |
| `/categorii` | Dynamic | Category counts change |
| `/categorii/[slug]` | Dynamic | Post list changes |
| `/articole` | Dynamic | Full post list |
| `/articole/populare` | Dynamic | Sorted by views, changes frequently |
| `/articole/recente` | Dynamic | Sorted by date |

For SSG: `getAllPostSlugs()` runs `SELECT slug FROM posts WHERE published_at IS NOT NULL`. Posts added after build are served dynamically on first request and then cached.

---

## Type Mapping (DB → TypeScript)

| DB column | TS field | Notes |
|---|---|---|
| `posts.id` | `id` | uuid string |
| `posts.slug` | `slug` | |
| `posts.title` | `title` | |
| `posts.excerpt` | `excerpt` | |
| `posts.content` | `content` | Markdown |
| `categories.name` | `category` | via JOIN |
| `categories.slug` | `categorySlug` | via JOIN, new field |
| `authors.name` | `author.name` | via JOIN |
| `authors.avatar_url` | `author.avatar` | via JOIN |
| `posts.published_at` | `date` | formatted "15 Mai 2024" |
| `posts.read_time` | `readTime` | |
| `posts.image_url` | `image` | |
| `posts.views` | `views` | |
| `posts.featured` | `featured` | |

**Date formatting helper** (in `lib/queries.ts`):
```typescript
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ro-RO', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}
```

---

## What This Spec Does NOT Cover

- Admin panel for creating/editing posts
- `revalidateTag()` call sites (depends on admin panel)
- Newsletter subscription form wiring (separate feature)
- `increment_post_views` call from blog post page (can be added later)
