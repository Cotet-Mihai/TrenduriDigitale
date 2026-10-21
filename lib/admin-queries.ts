import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { AdminPostRow, PostInput } from "@/lib/admin";

// Uncached on purpose: the admin always sees live data, drafts included.

export async function getAdminPosts(): Promise<AdminPostRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, published_at, updated_at, created_at, views, featured, image_url, categories(name)")
    .order("updated_at", { ascending: false, nullsFirst: false });
  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    categoryName: row.categories?.name ?? "",
    publishedAt: row.published_at,
    updatedAt: row.updated_at ?? row.created_at,
    views: row.views ?? 0,
    featured: row.featured ?? false,
    imageUrl: row.image_url ?? "",
  }));
}

export async function getAdminPost(id: string): Promise<PostInput | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, content, category_id, author_id, image_url, featured, focus_keyword, tags, read_time, published_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt ?? "",
    content: data.content ?? "",
    categoryId: data.category_id ?? "",
    authorId: data.author_id ?? "",
    imageUrl: data.image_url ?? "",
    featured: data.featured ?? false,
    focusKeyword: data.focus_keyword ?? "",
    tags: data.tags ?? [],
    readTime: data.read_time ?? 1,
    status: data.published_at ? "published" : "draft",
    publishedAt: data.published_at,
  };
}

export async function getEditorOptions() {
  const supabase = await createSupabaseServerClient();
  const [{ data: categories, error: catErr }, { data: authors, error: authErr }] = await Promise.all([
    supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
    supabase.from("authors").select("id, name, avatar_url, bio").order("name", { ascending: true }),
  ]);
  if (catErr) throw catErr;
  if (authErr) throw authErr;
  return {
    categories: (categories ?? []) as { id: string; name: string }[],
    authors: (authors ?? []).map((a) => ({
      id: a.id as string,
      name: a.name as string,
      avatar: (a.avatar_url as string | null) ?? "",
      bio: (a.bio as string | null) ?? "",
    })),
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject, message, read, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject ?? "",
    message: m.message,
    read: m.read,
    createdAt: m.created_at,
  }));
}

export async function getUnreadMessageCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("read", false);
  return count ?? 0;
}
