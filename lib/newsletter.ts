import type { SupabaseClient } from "@supabase/supabase-js";

// Automatic newsletter when an article is first published (called from savePost via after()).
// Sending goes through the Resend HTTP API; until RESEND_API_KEY is set, nothing is sent and
// nothing is marked as sent — but only the draft→published transition ever triggers a send,
// so adding the key later never emails old articles.

const BASE_URL = "https://trenduridigitale.ro";
const RESEND_BATCH_URL = "https://api.resend.com/emails/batch";
const BATCH_SIZE = 100; // Resend batch limit

export function isNewsletterConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function fromAddress(): string {
  return process.env.NEWSLETTER_FROM || "Radu Eftimie de la TrenduriDigitale <newsletter@trenduridigitale.ro>";
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function unsubscribeUrl(token: string): string {
  return `${BASE_URL}/dezabonare?token=${token}`;
}

interface ArticleEmail {
  title: string;
  excerpt: string;
  url: string;
  imageUrl: string;
  category: string;
}

function renderHtml(a: ArticleEmail, unsubscribe: string): string {
  const title = escapeHtml(a.title);
  const excerpt = escapeHtml(a.excerpt);
  return `<!doctype html>
<html lang="ro">
<body style="margin:0;padding:0;background:#f5f5f4;font-family:Arial,Helvetica,sans-serif;color:#1c1917;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:20px 28px;border-bottom:1px solid #e7e5e4;font-size:15px;font-weight:bold;">TrenduriDigitale · articol nou</td></tr>
        ${a.imageUrl ? `<tr><td><a href="${a.url}"><img src="${escapeHtml(a.imageUrl)}" alt="" width="560" style="display:block;width:100%;height:auto;border:0;"></a></td></tr>` : ""}
        <tr><td style="padding:24px 28px 8px;">
          ${a.category ? `<p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#2563eb;">${escapeHtml(a.category)}</p>` : ""}
          <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;font-family:Georgia,serif;">${title}</h1>
          <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#57534e;">${excerpt}</p>
          <a href="${a.url}" style="display:inline-block;background:#1c1917;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;padding:12px 20px;border-radius:10px;">Citește articolul</a>
        </td></tr>
        <tr><td style="padding:24px 28px;font-size:12px;line-height:1.6;color:#78716c;">
          Primești acest email pentru că te-ai abonat la newsletterul trenduridigitale.ro.
          Expeditor: Radu Eftimie, autorul blogului TrenduriDigitale.<br>
          <a href="${unsubscribe}" style="color:#78716c;">Dezabonează-te</a> · un singur click, fără alte întrebări.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function renderText(a: ArticleEmail, unsubscribe: string): string {
  return [
    "TrenduriDigitale · articol nou",
    "",
    a.title,
    "",
    a.excerpt,
    "",
    `Citește articolul: ${a.url}`,
    "",
    "Primești acest email pentru că te-ai abonat la newsletterul trenduridigitale.ro.",
    "Expeditor: Radu Eftimie, autorul blogului TrenduriDigitale.",
    `Dezabonare: ${unsubscribe}`,
  ].join("\n");
}

export async function sendArticleNewsletter(supabase: SupabaseClient, postId: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[newsletter] RESEND_API_KEY missing — skipped article ${postId}`);
    return;
  }

  // Claim the article atomically so a double "Publică" click can never send twice.
  const { data: post, error: claimError } = await supabase
    .from("posts")
    .update({ newsletter_sent_at: new Date().toISOString() })
    .eq("id", postId)
    .is("newsletter_sent_at", null)
    .not("published_at", "is", null)
    .select("slug, title, excerpt, image_url, categories(name)")
    .maybeSingle();
  if (claimError || !post) {
    if (claimError) console.error("[newsletter] claim failed", claimError.message);
    return;
  }

  const { data: subscribers, error: subError } = await supabase
    .from("newsletter_subscribers")
    .select("email, unsubscribe_token")
    .eq("active", true);
  if (subError) {
    console.error("[newsletter] could not load subscribers", subError.message);
    return;
  }
  if (!subscribers?.length) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category = (post as any).categories?.name ?? "";
  const article: ArticleEmail = {
    title: post.title,
    excerpt: post.excerpt ?? "",
    url: `${BASE_URL}/blog/${post.slug}`,
    imageUrl: post.image_url ?? "",
    category,
  };

  const emails = subscribers.map((s) => {
    const unsubscribe = unsubscribeUrl(s.unsubscribe_token);
    return {
      from: fromAddress(),
      to: [s.email],
      subject: post.title,
      html: renderHtml(article, unsubscribe),
      text: renderText(article, unsubscribe),
      headers: {
        // RFC 8058 one-click unsubscribe, shown by Gmail/Outlook next to the sender.
        "List-Unsubscribe": `<${BASE_URL}/api/newsletter/unsubscribe?token=${s.unsubscribe_token}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    };
  });

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const res = await fetch(RESEND_BATCH_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(emails.slice(i, i + BATCH_SIZE)),
    });
    if (!res.ok) {
      console.error(`[newsletter] Resend batch ${i / BATCH_SIZE + 1} failed: ${res.status} ${await res.text()}`);
    }
  }
}
