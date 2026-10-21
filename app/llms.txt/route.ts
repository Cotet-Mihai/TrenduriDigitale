import { getAuthors, getCategories, getPosts } from "@/lib/queries";

// llms.txt (https://llmstxt.org): a plain Markdown map of the site for AI assistants
// and answer engines. Regenerated from the published posts.
export const revalidate = 600;

const BASE_URL = "https://trenduridigitale.ro";

function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export async function GET() {
  const [posts, categories, authors] = await Promise.all([getPosts(), getCategories(), getAuthors()]);
  const author = authors[0];

  const lines = [
    "# TrenduriDigitale",
    "",
    "> Blog românesc de tehnologie: știri, opinii și analize despre smartphone-uri, gadgeturi, hardware, internet, social media și inteligență artificială. Fără clickbait, scris din experiență proprie.",
    "",
    "Limba conținutului: română.",
    ...(author ? [`Autor: ${author.name}${author.bio ? ` — ${oneLine(author.bio)}` : ""} (${BASE_URL}/despre#autor).`] : []),
    "",
    "## Articole",
    "",
    ...posts.map(
      (p) => `- [${oneLine(p.title)}](${BASE_URL}/blog/${p.slug}): ${oneLine(p.excerpt)} (${p.category}, ${p.publishedAt.slice(0, 10)})`
    ),
    "",
    "## Categorii",
    "",
    ...categories
      .filter((c) => c.count > 0)
      .map((c) => `- [${c.name}](${BASE_URL}/categorii/${c.slug})${c.description ? `: ${oneLine(c.description)}` : ""}`),
    "",
    "## Despre",
    "",
    `- [Despre TrenduriDigitale și autor](${BASE_URL}/despre)`,
    `- [Contact](${BASE_URL}/contact)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
