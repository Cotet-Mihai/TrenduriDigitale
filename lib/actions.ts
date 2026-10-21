"use server";

import { supabase } from "@/lib/supabase";

export async function incrementViews(slug: string): Promise<void> {
  await supabase.rpc("increment_post_views", { post_slug: slug });
}

export async function subscribeEmail(email: string): Promise<{ error?: string }> {
  const clean = email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(clean) || clean.length > 254) return { error: "invalid_email" };

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: clean });

  if (error) {
    if (error.code === "23505") return { error: "already_subscribed" };
    return { error: "unknown" };
  }
  return {};
}

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // honeypot — hidden from people, filled by bots
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactMessage(input: ContactInput): Promise<{ error?: string }> {
  // Bots that fill the hidden field get a fake success so they don't retry.
  if (input.website) return {};

  const name = input.name.trim();
  const email = input.email.trim();
  const subject = input.subject.trim();
  const message = input.message.trim();

  if (!name || name.length > 120) return { error: "Completează numele (maximum 120 de caractere)." };
  if (!EMAIL_PATTERN.test(email) || email.length > 254) return { error: "Adresa de email nu pare corectă." };
  if (subject.length > 200) return { error: "Subiectul e prea lung (maximum 200 de caractere)." };
  if (!message || message.length > 5000) return { error: "Scrie un mesaj (maximum 5.000 de caractere)." };

  // No .select(): visitors may insert but never read messages back (RLS).
  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, email, subject: subject || null, message });

  if (error) return { error: "Mesajul nu a putut fi trimis. Încearcă din nou sau scrie-ne la redactia@trenduridigitale.ro." };
  return {};
}
