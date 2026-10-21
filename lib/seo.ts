import { countWords, toSlug } from "@/lib/admin";

// On-page SEO checks for the admin editor. Thresholds follow common guidance:
// Google shows ~50–60 title characters (~600px) and ~150–160 description characters;
// short keyword slugs; keyword early in title/intro; clear H2 structure; alt text; links.

export const SITE_SUFFIX = " – TrenduriDigitale"; // appended by the root layout's title template
export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 160;

export type SeoStatus = "good" | "warn" | "bad";

export interface SeoCheck {
  id: string;
  group: "google" | "keyword" | "content" | "media";
  label: string;
  status: SeoStatus;
  detail: string;
}

export interface SeoInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  keyword: string;
  imageUrl: string;
  slugIsLive?: boolean; // published under this exact slug — changing it would break existing links
}

export interface SeoReport {
  checks: SeoCheck[];
  score: number; // 0–100
}

const PLACEHOLDER_ALT = "descriere imagine";

function norm(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let i = haystack.indexOf(needle);
  while (i !== -1) {
    count++;
    i = haystack.indexOf(needle, i + needle.length);
  }
  return count;
}

function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~`>|\\]/g, "");
}

function paragraphs(markdown: string): string[] {
  return markdown
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !/^(#|!\[|[-*]\s|\d+\.\s|>|\||```|---)/.test(p));
}

export function analyzeSeo(input: SeoInput): SeoReport {
  const checks: SeoCheck[] = [];
  const add = (c: SeoCheck) => checks.push(c);

  const title = input.title.trim();
  const excerpt = input.excerpt.trim();
  const keyword = norm(input.keyword.trim());
  const content = input.content;
  const text = plainText(content);
  const words = countWords(content);

  // ─── Google: title, description, URL ─────────────────────────────────────

  const tLen = title.length;
  const fullLen = (title + SITE_SUFFIX).length;
  if (!tLen) {
    add({ id: "title", group: "google", label: "Lungimea titlului", status: "bad", detail: "Articolul nu are titlu." });
  } else if (tLen < 25) {
    add({ id: "title", group: "google", label: "Lungimea titlului", status: "warn", detail: `${tLen} caractere — prea scurt. Țintește 40–60 ca să descrii clar subiectul.` });
  } else if (tLen <= TITLE_MAX) {
    add({
      id: "title",
      group: "google",
      label: "Lungimea titlului",
      status: "good",
      detail:
        fullLen > TITLE_MAX
          ? `${tLen}/${TITLE_MAX} caractere. Google poate tăia sufixul „– TrenduriDigitale”, e în regulă.`
          : `${tLen}/${TITLE_MAX} caractere — se vede complet în Google.`,
    });
  } else if (tLen <= 70) {
    add({ id: "title", group: "google", label: "Lungimea titlului", status: "warn", detail: `${tLen}/${TITLE_MAX} caractere — Google va tăia finalul. Pune ideea principală la început.` });
  } else {
    add({ id: "title", group: "google", label: "Lungimea titlului", status: "bad", detail: `${tLen}/${TITLE_MAX} caractere — mult prea lung, Google îl va tăia sau rescrie.` });
  }

  const dLen = excerpt.length;
  if (!dLen) {
    add({ id: "description", group: "google", label: "Descrierea (rezumatul)", status: "bad", detail: "Lipsește rezumatul — Google va alege singur un fragment din text." });
  } else if (dLen < 70) {
    add({ id: "description", group: "google", label: "Descrierea (rezumatul)", status: "bad", detail: `${dLen} caractere — prea scurt. Țintește ${DESCRIPTION_MIN}–${DESCRIPTION_MAX}.` });
  } else if (dLen < DESCRIPTION_MIN) {
    add({ id: "description", group: "google", label: "Descrierea (rezumatul)", status: "warn", detail: `${dLen} caractere — puțin scurt. Țintește ${DESCRIPTION_MIN}–${DESCRIPTION_MAX}.` });
  } else if (dLen <= DESCRIPTION_MAX) {
    add({ id: "description", group: "google", label: "Descrierea (rezumatul)", status: "good", detail: `${dLen}/${DESCRIPTION_MAX} caractere — lungime ideală.` });
  } else if (dLen <= 200) {
    add({ id: "description", group: "google", label: "Descrierea (rezumatul)", status: "warn", detail: `${dLen}/${DESCRIPTION_MAX} caractere — Google va tăia finalul.` });
  } else {
    add({ id: "description", group: "google", label: "Descrierea (rezumatul)", status: "bad", detail: `${dLen}/${DESCRIPTION_MAX} caractere — mult prea lung pentru Google.` });
  }

  const slugWords = input.slug.split("-").filter(Boolean).length;
  if (!input.slug) {
    add({ id: "slug", group: "google", label: "Adresa (slug)", status: "bad", detail: "Lipsește adresa articolului." });
  } else if (input.slugIsLive && (input.slug.length > 60 || slugWords > 6)) {
    add({ id: "slug", group: "google", label: "Adresa (slug)", status: "good", detail: "E lungă, dar articolul e deja publicat — nu o schimba, ai pierde linkurile și poziția din Google." });
  } else if (input.slug.length <= 60 && slugWords <= 6) {
    add({ id: "slug", group: "google", label: "Adresa (slug)", status: "good", detail: "Scurtă și ușor de citit." });
  } else {
    add({ id: "slug", group: "google", label: "Adresa (slug)", status: "warn", detail: `${slugWords} cuvinte — adresele scurte (3–6 cuvinte) arată mai bine în Google. Păstrează doar cuvintele cheie.` });
  }

  // ─── Keyword ─────────────────────────────────────────────────────────────

  if (!keyword) {
    add({
      id: "keyword",
      group: "keyword",
      label: "Cuvânt cheie principal",
      status: "warn",
      detail: "Alege expresia pe care ar căuta-o cineva în Google ca să găsească articolul (ex. „pixel 9 pret romania”).",
    });
  } else {
    const nTitle = norm(title);
    const pos = nTitle.indexOf(keyword);
    add(
      pos === -1
        ? { id: "kw-title", group: "keyword", label: "Cuvântul cheie în titlu", status: "bad", detail: "Titlul nu conține cuvântul cheie." }
        : pos <= nTitle.length / 2
          ? { id: "kw-title", group: "keyword", label: "Cuvântul cheie în titlu", status: "good", detail: "Apare în prima parte a titlului." }
          : { id: "kw-title", group: "keyword", label: "Cuvântul cheie în titlu", status: "warn", detail: "Apare, dar spre final. Mutat la început contează mai mult." }
    );

    add(
      norm(excerpt).includes(keyword)
        ? { id: "kw-desc", group: "keyword", label: "Cuvântul cheie în descriere", status: "good", detail: "Google îl afișează îngroșat în rezultate." }
        : { id: "kw-desc", group: "keyword", label: "Cuvântul cheie în descriere", status: "warn", detail: "Adaugă-l în rezumat — Google îngroașă termenii căutați." }
    );

    if (input.slug.includes(toSlug(keyword))) {
      add({ id: "kw-slug", group: "keyword", label: "Cuvântul cheie în adresă", status: "good", detail: "Adresa conține cuvântul cheie." });
    } else if (!input.slugIsLive) {
      add({ id: "kw-slug", group: "keyword", label: "Cuvântul cheie în adresă", status: "warn", detail: `Ar ajuta o adresă care conține „${toSlug(keyword)}”.` });
    }

    const intro = norm(plainText(content).split(/\s+/).slice(0, 100).join(" "));
    add(
      intro.includes(keyword)
        ? { id: "kw-intro", group: "keyword", label: "Cuvântul cheie în introducere", status: "good", detail: "Apare în primele 100 de cuvinte." }
        : { id: "kw-intro", group: "keyword", label: "Cuvântul cheie în introducere", status: "warn", detail: "Menționează-l în primele 100 de cuvinte." }
    );

    const subheadings = content.match(/^#{2,4}\s+.+$/gm) ?? [];
    add(
      subheadings.some((h) => norm(h).includes(keyword))
        ? { id: "kw-heading", group: "keyword", label: "Cuvântul cheie în subtitluri", status: "good", detail: "Apare în cel puțin un subtitlu." }
        : { id: "kw-heading", group: "keyword", label: "Cuvântul cheie în subtitluri", status: "warn", detail: "Folosește-l (sau o variantă) într-un titlu de secțiune." }
    );

    const occurrences = countOccurrences(norm(text), keyword);
    const kwWords = keyword.split(/\s+/).length;
    const density = words ? (occurrences * kwWords * 100) / words : 0;
    const densityText = `${occurrences} ${occurrences === 1 ? "apariție" : "apariții"} (${density.toFixed(1)}%)`;
    if (occurrences === 0) {
      add({ id: "kw-density", group: "keyword", label: "Frecvența cuvântului cheie", status: "bad", detail: "Nu apare deloc în text." });
    } else if (density < 0.5) {
      add({ id: "kw-density", group: "keyword", label: "Frecvența cuvântului cheie", status: "warn", detail: `${densityText} — folosește-l natural de câteva ori în plus.` });
    } else if (density <= 2.5) {
      add({ id: "kw-density", group: "keyword", label: "Frecvența cuvântului cheie", status: "good", detail: `${densityText} — natural.` });
    } else {
      add({ id: "kw-density", group: "keyword", label: "Frecvența cuvântului cheie", status: density > 3.5 ? "bad" : "warn", detail: `${densityText} — prea des, poate părea forțat. Folosește sinonime.` });
    }
  }

  // ─── Content ────────────────────────────────────────────────────────────

  if (words >= 600) {
    add({ id: "length", group: "content", label: "Lungimea articolului", status: "good", detail: `${words.toLocaleString("ro-RO")} cuvinte.` });
  } else if (words >= 300) {
    add({ id: "length", group: "content", label: "Lungimea articolului", status: "warn", detail: `${words} cuvinte — articolele de 600+ cuvinte acoperă subiectul mai bine.` });
  } else {
    add({ id: "length", group: "content", label: "Lungimea articolului", status: "bad", detail: `${words} cuvinte — prea puțin conținut ca Google să-l considere util.` });
  }

  const h1Count = (content.match(/^#\s+/gm) ?? []).length;
  const h2Count = (content.match(/^##\s+/gm) ?? []).length;
  if (h1Count > 0) {
    add({ id: "headings", group: "content", label: "Structura cu subtitluri", status: "bad", detail: "Textul conține „Titlu 1”. Titlul articolului e deja H1 — folosește Titlu 2 pentru secțiuni." });
  } else if (h2Count >= 2) {
    add({ id: "headings", group: "content", label: "Structura cu subtitluri", status: "good", detail: `${h2Count} secțiuni (Titlu 2) — apar și în cuprins.` });
  } else if (h2Count === 1 || words < 300) {
    add({ id: "headings", group: "content", label: "Structura cu subtitluri", status: "warn", detail: "Împarte textul în cel puțin 2 secțiuni cu „Titlu 2”." });
  } else {
    add({ id: "headings", group: "content", label: "Structura cu subtitluri", status: "bad", detail: "Nicio secțiune. Folosește „Titlu 2” ca să structurezi textul." });
  }

  const sentences = text.split(/[.!?…]+(?:\s|$)/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length >= 3);
  const avgSentence = sentences.length ? Math.round(words / sentences.length) : 0;
  const longParagraphs = paragraphs(content).filter((p) => p.split(/\s+/).length > 150).length;
  if (words < 50) {
    // Too little text to judge readability.
  } else if (avgSentence > 25 || longParagraphs > 2) {
    add({ id: "readability", group: "content", label: "Lizibilitate", status: "warn", detail: [avgSentence > 25 && `fraze lungi (în medie ${avgSentence} cuvinte)`, longParagraphs > 0 && `${longParagraphs} paragrafe de peste 150 de cuvinte`].filter(Boolean).join(", ").replace(/^./, (c) => c.toUpperCase()) + " — împarte-le ca să se citească ușor pe telefon." });
  } else {
    add({ id: "readability", group: "content", label: "Lizibilitate", status: "good", detail: `Fraze de ${avgSentence} cuvinte în medie.` });
  }

  // ─── Images & links ─────────────────────────────────────────────────────

  add(
    input.imageUrl
      ? { id: "cover", group: "media", label: "Imagine principală", status: "good", detail: "Apare în Google, Facebook și pe card." }
      : { id: "cover", group: "media", label: "Imagine principală", status: "bad", detail: "Lipsește — fără ea, linkul arată gol pe rețelele sociale." }
  );

  const images = [...content.matchAll(/!\[([^\]]*)\]\(([^)\s]+)/g)];
  if (images.length > 0) {
    const missingAlt = images.filter(([, alt]) => !alt.trim() || norm(alt.trim()) === PLACEHOLDER_ALT).length;
    add(
      missingAlt === 0
        ? { id: "alt", group: "media", label: "Descrierea imaginilor", status: "good", detail: `Toate cele ${images.length} imagini au descriere.` }
        : { id: "alt", group: "media", label: "Descrierea imaginilor", status: "warn", detail: `${missingAlt} din ${images.length} imagini nu au descriere (legendă) — Google o folosește la căutarea de imagini.` }
    );
  }

  const links = [...content.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)/g)].map(([, href]) => href);
  const internal = links.filter((h) => h.startsWith("/") || h.includes("trenduridigitale.ro")).length;
  const external = links.length - internal;
  add(
    internal > 0
      ? { id: "internal", group: "media", label: "Linkuri către alte articole", status: "good", detail: `${internal} ${internal === 1 ? "link intern" : "linkuri interne"}.` }
      : { id: "internal", group: "media", label: "Linkuri către alte articole", status: "warn", detail: "Adaugă cel puțin un link către alt articol de pe blog — ajută Google să descopere paginile." }
  );
  add(
    external > 0
      ? { id: "external", group: "media", label: "Linkuri către surse", status: "good", detail: `${external} ${external === 1 ? "link extern" : "linkuri externe"}.` }
      : { id: "external", group: "media", label: "Linkuri către surse", status: "warn", detail: "Un link către o sursă de încredere (producător, studiu) crește credibilitatea." }
  );

  const points = checks.reduce((sum, c) => sum + (c.status === "good" ? 1 : c.status === "warn" ? 0.5 : 0), 0);
  return { checks, score: Math.round((points / checks.length) * 100) };
}
