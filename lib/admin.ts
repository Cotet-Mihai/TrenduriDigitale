// Helpers shared by the admin editor (client) and admin Server Actions.

export interface PostInput {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  authorId: string;
  imageUrl: string;
  featured: boolean;
  focusKeyword: string;
  tags: string[];
  readTime: number;
  status: "draft" | "published";
  publishedAt: string | null; // ISO; null on a draft
}

export interface AdminPostRow {
  id: string;
  slug: string;
  title: string;
  categoryName: string;
  publishedAt: string | null;
  updatedAt: string | null;
  views: number;
  featured: boolean;
  imageUrl: string;
}

export function toSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Cover images go through next/image, which only serves hosts whitelisted in next.config.ts.
const COVER_IMAGE_HOSTS = ["images.unsplash.com", "sbwxamcznkchnhpealbv.supabase.co"];

export function isAllowedCoverImage(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && COVER_IMAGE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

export function countWords(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~`|-]/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

// ~200 words per minute, matching the existing articles.
export function estimateReadTime(markdown: string): number {
  return Math.max(1, Math.ceil(countWords(markdown) / 200));
}
