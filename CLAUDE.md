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

**TrenduriDigitale** is a Romanian digital-trends blog built on Next.js App Router (v16) with no backend. All content lives in `lib/data.ts` as static TypeScript arrays — there is no database or CMS.

### Data layer

`lib/data.ts` exports `BlogPost[]`, `Category[]`, and helper functions (`getPostBySlug`, `getPostsByCategory`, `getRelatedPosts`, `getCategoryBySlug`). Adding or editing articles means editing this file directly.

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
