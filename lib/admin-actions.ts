"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { sendArticleNewsletter } from "@/lib/newsletter";
import { createSupabaseServerClient, getAdminUser } from "@/lib/supabase-server";
import { isAllowedCoverImage, SLUG_PATTERN, type PostInput } from "@/lib/admin";

// ─── Auth ──────────────────────────────────────────────────────────────────

export async function login(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Completează emailul și parola." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email sau parolă greșite." };

  if (!(await getAdminUser())) {
    await supabase.auth.signOut();
    return { error: "Contul nu are drepturi de administrator." };
  }

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ─── Posts ─────────────────────────────────────────────────────────────────

const MAX_TAGS = 8;

// Trims, drops empties and case-insensitive duplicates, caps count and length.
function normalizeTags(tags: string[] | undefined): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of tags ?? []) {
    const tag = raw.trim().replace(/\s+/g, " ").slice(0, 40);
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
    if (out.length === MAX_TAGS) break;
  }
  return out;
}

function invalidatePublicSite(slugs: string[]) {
  updateTag("posts");
  updateTag("categories");
  slugs.forEach((slug) => updateTag(`post-${slug}`));
  revalidatePath("/", "layout");
}

export async function savePost(
  input: PostInput
): Promise<{ error?: string; id?: string; slug?: string }> {
  if (!(await getAdminUser())) return { error: "Sesiunea a expirat. Autentifică-te din nou." };

  const title = input.title.trim();
  const slug = input.slug.trim();
  const publishing = input.status === "published";

  if (!title) return { error: "Articolul are nevoie de un titlu." };
  if (!SLUG_PATTERN.test(slug))
    return { error: "Slug-ul poate conține doar litere mici, cifre și cratime." };
  if (input.imageUrl && !isAllowedCoverImage(input.imageUrl))
    return { error: "Imaginea principală trebuie încărcată aici sau să fie de pe Unsplash." };
  if (publishing) {
    if (!input.excerpt.trim()) return { error: "Adaugă un rezumat înainte de publicare." };
    if (!input.categoryId) return { error: "Alege o categorie înainte de publicare." };
    if (!input.authorId) return { error: "Alege un autor înainte de publicare." };
    if (!input.imageUrl) return { error: "Adaugă o imagine principală înainte de publicare." };
    if (!input.content.trim()) return { error: "Articolul nu are conținut." };
  }

  const supabase = await createSupabaseServerClient();

  let previousSlug: string | null = null;
  let wasPublished = false;
  if (input.id) {
    const { data } = await supabase.from("posts").select("slug, published_at").eq("id", input.id).maybeSingle();
    previousSlug = data?.slug ?? null;
    wasPublished = Boolean(data?.published_at);
  }

  const row = {
    title,
    slug,
    excerpt: input.excerpt.trim(),
    content: input.content,
    category_id: input.categoryId || null,
    author_id: input.authorId || null,
    image_url: input.imageUrl || null,
    featured: input.featured,
    focus_keyword: input.focusKeyword.trim() || null,
    tags: normalizeTags(input.tags),
    read_time: Math.max(1, Math.round(input.readTime) || 1),
    published_at: publishing ? input.publishedAt ?? new Date().toISOString() : null,
  };

  const { data, error } = input.id
    ? await supabase.from("posts").update(row).eq("id", input.id).select("id, slug").single()
    : await supabase.from("posts").insert(row).select("id, slug").single();

  if (error) {
    if (error.code === "23505") return { error: "Există deja un articol cu acest slug." };
    return { error: `Nu am putut salva articolul: ${error.message}` };
  }

  invalidatePublicSite([slug, ...(previousSlug && previousSlug !== slug ? [previousSlug] : [])]);

  // Email subscribers only on the first draft→published transition, after the response is sent.
  const postId = data.id;
  if (publishing && !wasPublished) {
    after(() => sendArticleNewsletter(supabase, postId));
  }

  return { id: data.id, slug: data.slug };
}

export async function deletePost(id: string): Promise<{ error?: string }> {
  if (!(await getAdminUser())) return { error: "Sesiunea a expirat. Autentifică-te din nou." };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("posts").delete().eq("id", id).select("slug").single();
  if (error) return { error: `Nu am putut șterge articolul: ${error.message}` };

  invalidatePublicSite([data.slug]);
  return {};
}

// ─── Contact messages ──────────────────────────────────────────────────────

export async function setMessageRead(id: string, read: boolean): Promise<{ error?: string }> {
  if (!(await getAdminUser())) return { error: "Sesiunea a expirat. Autentifică-te din nou." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("contact_messages").update({ read }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin", "layout");
  return {};
}

export async function deleteMessage(id: string): Promise<{ error?: string }> {
  if (!(await getAdminUser())) return { error: "Sesiunea a expirat. Autentifică-te din nou." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin", "layout");
  return {};
}

// ─── Newsletter ────────────────────────────────────────────────────────────

export async function deleteSubscriber(id: string): Promise<{ error?: string }> {
  if (!(await getAdminUser())) return { error: "Sesiunea a expirat. Autentifică-te din nou." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/newsletter");
  return {};
}
