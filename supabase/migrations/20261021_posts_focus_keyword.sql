-- Focus keyword used by the admin editor's SEO checks (not rendered on the site).
ALTER TABLE posts ADD COLUMN IF NOT EXISTS focus_keyword text;
