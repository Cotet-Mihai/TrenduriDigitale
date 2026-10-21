-- Automatic newsletter on publish (lib/newsletter.ts) + one-click unsubscribe (/dezabonare).
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_unsubscribe_token_key
  ON newsletter_subscribers (unsubscribe_token);

-- Set once the article has been emailed, so it is never sent twice.
ALTER TABLE posts ADD COLUMN IF NOT EXISTS newsletter_sent_at timestamptz;

-- One-click unsubscribe from the email link. Visitors have no read/delete rights on the
-- table; this function deletes exactly the row matching the secret token and nothing else.
CREATE OR REPLACE FUNCTION unsubscribe_newsletter(p_token uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM newsletter_subscribers WHERE unsubscribe_token = p_token;
  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION unsubscribe_newsletter(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION unsubscribe_newsletter(uuid) TO anon, authenticated;
