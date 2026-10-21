-- Admin panel: restrict writes to an explicit admin list + image storage bucket.
-- Applied 2026-10-21. Admins are granted separately (not committed):
--   INSERT INTO admin_users (user_id) SELECT id FROM auth.users WHERE email = '<admin email>';
-- Public sign-ups should be turned off under Authentication.

-- ─── Admin list ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_users (
  user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- A user may only see their own row (used by the app to check "am I admin?").
CREATE POLICY "admin_users_select_self"
ON admin_users FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = (SELECT auth.uid()));
$$;

-- ─── Turn "any authenticated user" policies into admin-only ones ────────────

ALTER POLICY "authenticated_all_posts" ON posts
  USING ((SELECT is_admin())) WITH CHECK ((SELECT is_admin()));
ALTER POLICY "authenticated_all_posts" ON posts RENAME TO "admin_all_posts";

ALTER POLICY "authenticated_all_categories" ON categories
  USING ((SELECT is_admin())) WITH CHECK ((SELECT is_admin()));
ALTER POLICY "authenticated_all_categories" ON categories RENAME TO "admin_all_categories";

ALTER POLICY "authenticated_all_authors" ON authors
  USING ((SELECT is_admin())) WITH CHECK ((SELECT is_admin()));
ALTER POLICY "authenticated_all_authors" ON authors RENAME TO "admin_all_authors";

ALTER POLICY "authenticated_all_subscribers" ON newsletter_subscribers
  USING ((SELECT is_admin())) WITH CHECK ((SELECT is_admin()));
ALTER POLICY "authenticated_all_subscribers" ON newsletter_subscribers RENAME TO "admin_all_subscribers";

-- The anon read policy only covers the anon role; logged-in non-admins
-- still need to read published posts.
CREATE POLICY "authenticated_select_published_posts"
ON posts FOR SELECT
TO authenticated
USING (published_at IS NOT NULL);

-- ─── Image storage ───────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('blog-images', 'blog-images', true, 10485760, -- 10 MB
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
ON CONFLICT (id) DO NOTHING;

-- Public bucket: files are served by URL without a SELECT policy.
CREATE POLICY "admin_insert_blog_images" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images' AND (SELECT public.is_admin()));

CREATE POLICY "admin_update_blog_images" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'blog-images' AND (SELECT public.is_admin()));

CREATE POLICY "admin_delete_blog_images" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'blog-images' AND (SELECT public.is_admin()));

-- Lets the admin list uploaded images.
CREATE POLICY "admin_select_blog_images" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'blog-images' AND (SELECT public.is_admin()));
