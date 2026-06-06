"use server";

import { supabase } from "@/lib/supabase";

export async function incrementViews(slug: string): Promise<void> {
  await supabase.rpc("increment_post_views", { post_slug: slug });
}
