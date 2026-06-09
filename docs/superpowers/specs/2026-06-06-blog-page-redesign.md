# Blog Page Redesign — Design Spec
**Date:** 2026-06-06

## Overview
Redesign `app/blog/[slug]/page.tsx` to match a two-column layout with a sticky sidebar, matching the provided mockup.

## Layout

```
<main>
  Breadcrumb (full-width, border-bottom)
  max-w-6xl container
    grid lg:grid-cols-[1fr_320px] gap-12
      <article> (left column)
        Category badge + H1 + excerpt
        Author row + share icons (visual only)
        Hero image (16/9)
        ReactMarkdown content
        Tags
      <aside class="hidden lg:block"> (right column, sticky)
        Despre autor card
        Cuprins (TableOfContents Client Component)
        Articole similare (compact, max 3)
NewsletterSection (full-width, below grid)
```

- Mobile (`< lg`): sidebar is `hidden` — does not appear anywhere
- Bottom "Articole similare" section removed — replaced by sidebar version

## New Components

### `components/table-of-contents.tsx`
- `"use client"`
- Props: `headings: { id: string; text: string }[]`
- Click handler: `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`
- Renders numbered list with blue dot marker

## Modified Files

### `app/blog/[slug]/page.tsx`
- Add `extractHeadings(content: string)` helper — regex matches `## ` lines → `{ id, text }[]`
- `h2` component in ReactMarkdown receives `id={slugify(text)}` for scroll targets
- Share row: `Linkedin`, `Facebook`, `Twitter`, `Link2` Lucide icons — visual only, no onClick
- Sidebar author: avatar + name + hardcoded role "Editor @ DigitalTrendz" + short bio + "Vezi toate articolele" → `/articole`
- Sidebar related articles: thumbnail 64×64, tiny category badge, 2-line title, read time

## Data Flow
1. `getPostBySlug(slug)` — existing query
2. `getRelatedPosts(slug, categorySlug)` — existing query (max 3)
3. `extractHeadings(post.content)` — local function, zero DB cost
4. `<TableOfContents headings={headings} />` — only Client Component, receives pre-computed array

No new Supabase queries. No new API endpoints.

## Approach
Server Component page + 1 Client Component (`TableOfContents`) for scroll interactivity.
