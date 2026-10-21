-- Article tags, edited in the admin panel and shown under each article.
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';
