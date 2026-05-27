import ArticlesGrid from "@/components/articles-grid";
import { blogPosts, categories } from "@/lib/data";

export const metadata = {
  title: "Articole recente – DigitalTrendz",
};

export default function ArticoleRecentePage() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Articole recente</h1>
          <p className="text-muted-foreground">Ultimele articole publicate, proaspete din redacție.</p>
        </div>
        <ArticlesGrid posts={blogPosts} categories={categories} defaultSort="recent" />
      </div>
    </main>
  );
}
