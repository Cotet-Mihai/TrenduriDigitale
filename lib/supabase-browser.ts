import { createBrowserClient } from "@supabase/ssr";

// Session-aware client for admin Client Components (image uploads go straight to Storage).
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
