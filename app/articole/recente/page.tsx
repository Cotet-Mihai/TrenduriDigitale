import ArticlesGrid from "@/components/articles-grid";
import { getRecentPosts, getCategories } from "@/lib/queries";

export const metadata = {
  title: "Articole recente – DigitalTrendz",
};

export default async function ArticoleRecentePage() {
  const [posts, categories] = await Promise.all([getRecentPosts(50), getCategories()]);

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Articole recente</h1>
          <p className="text-muted-foreground">Ultimele articole publicate, proaspete din redacție.</p>
        </div>
        <ArticlesGrid posts={posts} categories={categories} defaultSort="recent" />
      </div>
    </main>
  );
}
