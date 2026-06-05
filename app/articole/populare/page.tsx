import ArticlesGrid from "@/components/articles-grid";
import { getPopularPosts, getCategories } from "@/lib/queries";

export const metadata = {
  title: "Cele mai citite – DigitalTrendz",
};

export default async function ArticolePopularePage() {
  const [posts, categories] = await Promise.all([getPopularPosts(50), getCategories()]);

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Cele mai citite</h1>
          <p className="text-muted-foreground">Articolele care au generat cel mai mult interes în comunitate.</p>
        </div>
        <ArticlesGrid posts={posts} categories={categories} defaultSort="popular" />
      </div>
    </main>
  );
}
