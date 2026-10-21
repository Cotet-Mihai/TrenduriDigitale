import { notFound } from "next/navigation";
import ArticleView from "@/components/article-view";
import NewsletterSection from "@/components/newsletter-section";
import ViewTracker from "@/components/view-tracker";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

const BASE_URL = "https://trenduridigitale.ro";

// Escapes "<" so text like "</script>" in a title cannot close the script tag.
function toJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const ogImage = post.image || "/og-default.png";
  const canonicalUrl = `${BASE_URL}/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: post.title,
      description: post.excerpt,
      siteName: "TrenduriDigitale",
      locale: "ro_RO",
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: [post.category, ...post.tags],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, post.categorySlug);
  const canonicalUrl = `${BASE_URL}/blog/${slug}`;
  const absolute = (src: string) => (src.startsWith("http") ? src : `${BASE_URL}${src}`);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: absolute(post.image || "/og-default.png"),
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    inLanguage: "ro-RO",
    articleSection: post.category,
    keywords: [post.category, ...post.tags].join(", "),
    wordCount: post.content.split(/\s+/).filter(Boolean).length,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    // Points at the author section on /despre, which carries the matching Person schema.
    author: {
      "@type": "Person",
      "@id": `${BASE_URL}/despre#autor`,
      name: post.author.name,
      url: `${BASE_URL}/despre#autor`,
      ...(post.author.avatar && { image: absolute(post.author.avatar) }),
      ...(post.author.bio && { description: post.author.bio }),
    },
    publisher: {
      "@type": "Organization",
      name: "TrenduriDigitale",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo-text.png` },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Acasă", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Articole", item: `${BASE_URL}/articole` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
    ],
  };

  return (
    <main className="flex-1">
      <ViewTracker slug={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <ArticleView post={post} related={related} canonicalUrl={canonicalUrl} />

      <NewsletterSection />
    </main>
  );
}
