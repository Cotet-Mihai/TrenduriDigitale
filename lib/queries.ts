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
