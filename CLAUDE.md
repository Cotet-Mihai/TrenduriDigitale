# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev       # start dev server
pnpm build     # production build
pnpm start     # serve production build
pnpm lint      # run ESLint
```

No test suite is configured.

## Architecture

**TrenduriDigitale** is a Romanian digital-trends blog built on Next.js App Router (v16) backed by Supabase (Postgres + Auth + Storage).

### Data layer

- `lib/queries.ts` — public reads via the anon client (`lib/supabase.ts`), wrapped in `unstable_cache` with tags `posts`, `categories`, `post-<slug>`. Only published posts (`published_at IS NOT NULL`) are visible.
- Article bodies are **Markdown** in `posts.content`, rendered by `components/markdown-content.tsx` (shared by the article page and the admin preview).
- Schema/RLS: `docs/superpowers/specs/2026-06-05-supabase-database-design.md`; admin changes in `supabase/migrations/`.

### Admin panel (`/admin`)

- Auth: Supabase email/password via `@supabase/ssr` cookies. `proxy.ts` refreshes the session and redirects anonymous users; every admin page/action re-checks with `getAdminUser()` (`lib/supabase-server.ts`), which requires a row in `admin_users`. RLS (`is_admin()`) is the real guard.
- Writes go through Server Actions in `lib/admin-actions.ts`, which call `updateTag(...)` + `revalidatePath("/", "layout")` so the public site updates immediately.
- Editor: MDXEditor (visual, outputs Markdown) in `components/admin/visual-editor-inner.tsx`, loaded client-only. Keep image resizing disabled — it emits raw HTML that the public renderer drops.
- Images upload from the browser straight to the public Storage bucket `blog-images` (`lib/upload-image.ts`), downscaled to WebP first.
- Navbar/footer are hidden on `/admin` by `components/site-chrome.tsx` (except `/admin/previzualizare`, the private live preview fed from the editor via localStorage — `lib/preview.ts`).
- SEO checks shown in the editor live in `lib/seo.ts` (pure function, thresholds at the top). `posts.focus_keyword` is admin-only; `posts.tags` is rendered under articles and in OG/JSON-LD.

### SEO / AEO output

- Article pages emit `Article` + `BreadcrumbList` JSON-LD; the author points to the `Person` on `/despre#autor`. Use ISO `publishedAt`/`updatedAt` for machine-readable dates — `date` is a Romanian display string and `new Date()` cannot parse most month names.
- `app/llms.txt/route.ts` generates `/llms.txt` from published posts.
- When `BlogPost` gains fields, bump `POST_CACHE_VERSION` in `lib/queries.ts` so stale `unstable_cache` entries are not reused.

### Route structure

| Route | File |
|---|---|
| `/` | `app/page.tsx` |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` |
| `/categorii` | `app/categorii/page.tsx` |
| `/categorii/[slug]` | `app/categorii/[slug]/page.tsx` |
| `/articole`, `/articole/populare`, `/articole/recente` | `app/articole/**/page.tsx` |
| `/resurse/**` | `app/resurse/**/page.tsx` |
| `/contact`, `/despre`, `/termeni`, `/politica-confidentialitate` | `app/*/page.tsx` |

### Components

- `components/navbar.tsx` — client component, sticky header with hover dropdowns and a subscribe modal
- `components/article-card.tsx` — card for a `BlogPost`, links to `/blog/[slug]`
- `components/articles-grid.tsx` — wraps `ArticleCard` in a responsive grid
- `components/newsletter-section.tsx` — full-width newsletter CTA
- `components/contact-form.tsx` — contact form (client component)
- `components/ui/` — shadcn/ui primitives (Button, Dialog, Input, Badge, Avatar, …)

### Styling

Tailwind v4 — configuration is CSS-only (no `tailwind.config.js`). Tokens are defined in `app/globals.css` via `@theme inline`. The design uses two fonts set as CSS variables:

- `font-sans` → Inter (`--font-inter`)
- `font-heading` → DM Serif Display (`--font-dm-serif`)

Use `className="font-heading"` for display/headline text.

### Path alias

`@/*` resolves to the repo root. Use `@/components`, `@/lib`, `@/components/ui`, etc.

## Critical API differences in this Next.js version

### `params` is a Promise

In Next.js 16, dynamic route `params` must be awaited:

```tsx
// correct
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
}
```

### `@base-ui/react` Dialog — `render` prop pattern

The codebase uses `@base-ui/react` (not Radix). `DialogTrigger` does **not** accept children as the trigger; use the `render` prop:

```tsx
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger render={<Button />}>Open</DialogTrigger>
  <DialogContent>…</DialogContent>
</Dialog>
```

### Remote images

`next.config.ts` whitelists `images.unsplash.com` and `randomuser.me`. Add any new hostname there before using `next/image` with it.
