"use server";

import { supabase } from "@/lib/supabase";

export async function incrementViews(slug: string): Promise<void> {
  await supabase.rpc("increment_post_views", { post_slug: slug });
}

export async function subscribeEmail(email: string): Promise<{ error?: string }> {
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });

  if (error) {
    if (error.code === "23505") return { error: "already_subscribed" };
    return { error: "unknown" };
  }
  return {};
}
