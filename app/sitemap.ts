import type { MetadataRoute } from "next";
import { getPosts, getCategories } from "@/lib/queries";

const BASE_URL = "https://trenduridigitale.ro";

const staticRoutes = [
  { url: BASE_URL, priority: 1.0, changeFrequency: "daily" as const },
  { url: `${BASE_URL}/articole`, priority: 0.9, changeFrequency: "daily" as const },
  { url: `${BASE_URL}/articole/populare`, priority: 0.8, changeFrequency: "weekly" as const },
  { url: `${BASE_URL}/articole/recente`, priority: 0.8, changeFrequency: "daily" as const },
  { url: `${BASE_URL}/categorii`, priority: 0.8, changeFrequency: "weekly" as const },
  { url: `${BASE_URL}/despre`, priority: 0.6, changeFrequency: "monthly" as const },
  { url: `${BASE_URL}/contact`, priority: 0.5, changeFrequency: "monthly" as const },
  { url: `${BASE_URL}/politica-confidentialitate`, priority: 0.3, changeFrequency: "yearly" as const },
  { url: `${BASE_URL}/termeni`, priority: 0.3, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/categorii/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryEntries, ...postEntries];
}
