import ArticlesGrid from "@/components/articles-grid";
import { blogPosts, categories } from "@/lib/data";

export const metadata = {
  title: "Articole – DigitalTrendz",
  description: "Toate articolele despre tehnologie, marketing digital, social media și inovație.",
};

export default function ArticolePage() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Toate articolele</h1>
          <p className="text-muted-foreground">
            Explorează întreaga colecție de articole despre lumea digitală.
          </p>
        </div>
        <ArticlesGrid posts={blogPosts} categories={categories} />
      </div>
    </main>
  );
}
