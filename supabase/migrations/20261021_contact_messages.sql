-- Messages from the public contact form, read in the admin panel (/admin/mesaje).
-- Retention: deleted after 12 months (see lib/admin-queries.ts and the privacy policy).
CREATE TABLE IF NOT EXISTS contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email      text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  subject    text CHECK (subject IS NULL OR char_length(subject) <= 200),
  message    text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 5000),
  read       boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages (created_at DESC);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Visitors can only submit; they can never read messages back.
CREATE POLICY "anon_insert_contact_messages"
ON contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (read = false);

CREATE POLICY "admin_all_contact_messages"
ON contact_messages FOR ALL
TO authenticated
USING ((SELECT is_admin()))
WITH CHECK ((SELECT is_admin()));
