-- Privacy policy promise: contact messages are kept at most 12 months.
-- Runs daily at 03:15 UTC.
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'delete-old-contact-messages',
  '15 3 * * *',
  $$DELETE FROM public.contact_messages WHERE created_at < now() - interval '12 months'$$
);
