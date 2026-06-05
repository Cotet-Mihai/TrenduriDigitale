# TrenduriDigitale — Supabase Database Design

**Date:** 2026-06-05
**Status:** Approved
**Scope:** Database schema only — no implementation yet

## Context

TrenduriDigitale is a Romanian digital-trends blog built on Next.js App Router. All content currently lives in `lib/data.ts` as static TypeScript arrays. This spec defines the Supabase database schema to replace that static layer and enable a full CMS workflow.

**Out of scope for this spec:** admin panel UI, auth implementation, frontend data-fetching layer.

---

## Approach

Normalized relational schema with 4 tables. Access is controlled via Row Level Security (RLS). Views are a simple integer counter incremented via a Postgres RPC function.

---

## Schema

### `authors`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `name` | `text NOT NULL` | |
| `avatar_url` | `text` | |
| `created_at` | `timestamptz` | `now()` |

### `categories`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `name` | `text NOT NULL` | |
| `slug` | `text NOT NULL UNIQUE` | |
| `icon` | `text` | icon name string (e.g. `"smartphone"`) |
| `description` | `text` | |
| `created_at` | `timestamptz` | `now()` |

### `posts`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `slug` | `text NOT NULL UNIQUE` | |
| `title` | `text NOT NULL` | |
| `excerpt` | `text` | |
| `content` | `text` | Markdown |
| `category_id` | `uuid FK → categories(id)` | |
| `author_id` | `uuid FK → authors(id)` | |
| `published_at` | `timestamptz` | `NULL` = draft |
| `read_time` | `integer` | minutes |
| `image_url` | `text` | |
| `views` | `integer DEFAULT 0` | |
| `featured` | `boolean DEFAULT false` | |
| `created_at` | `timestamptz` | `now()` |
| `updated_at` | `timestamptz` | `now()`, updated via trigger |

### `newsletter_subscribers`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `email` | `text NOT NULL UNIQUE` | |
| `subscribed_at` | `timestamptz` | `now()` |
| `active` | `boolean DEFAULT true` | |

---

## RLS Policies

All tables have RLS enabled.

| Table | anon | authenticated (admin) |
|---|---|---|
| `posts` | SELECT where `published_at IS NOT NULL` | Full CRUD |
| `categories` | SELECT | Full CRUD |
| `authors` | SELECT | Full CRUD |
| `newsletter_subscribers` | INSERT only | Full CRUD |

### Views increment

`anon` cannot UPDATE `posts` directly. Instead, a Postgres function handles the increment:

```sql
CREATE OR REPLACE FUNCTION increment_post_views(post_slug text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE posts SET views = views + 1 WHERE slug = post_slug AND published_at IS NOT NULL;
$$;
```

Called from the frontend via `supabase.rpc('increment_post_views', { post_slug: slug })`.

---

## Indexes

```sql
CREATE INDEX ON posts(category_id);  -- getPostsByCategory
CREATE INDEX ON posts(published_at); -- chronological sort
CREATE INDEX ON posts(featured);     -- homepage featured query
```

`slug` columns on `posts` and `categories` are `UNIQUE` — already indexed automatically.

---

## Data Migration

Existing data from `lib/data.ts` is seeded via SQL in this order (respecting FK dependencies):

1. **`authors`** — insert "Radu Eftimie" with `/logo.png` avatar
2. **`categories`** — 5 existing categories (slug, icon, description preserved)
3. **`posts`** — 12 existing articles; `category_id` and `author_id` resolved via subquery; `published_at` derived from the string `date` field (e.g. `"15 Mai 2024"` → `'2024-05-15'`); `views` preserved from existing data

After migration, `lib/data.ts` will be replaced by Supabase query functions. TypeScript interfaces (`BlogPost`, `Category`, `Author`) are preserved but adjusted to reflect DB types (`id` as uuid string, `category` as object).

---

## What This Spec Does NOT Cover

- Admin panel UI or routing
- Supabase Auth setup (email/password chosen, implementation deferred)
- Frontend data-fetching layer (`lib/data.ts` replacement)
- Deployment / environment variable setup
