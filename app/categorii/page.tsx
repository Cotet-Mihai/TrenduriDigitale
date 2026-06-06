import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories, getPosts } from "@/lib/queries";
import { getCategoryIcon, categoryIconHoverMap } from "@/lib/category-icons";

export const metadata = {
  title: "Categorii – TrenduriDigitale",
  description: "Explorează articolele organizate pe categorii: AI, Marketing Digital, Social Media și multe altele.",
};

export default async function CategoriiPage() {
  const [categories, posts] = await Promise.all([getCategories(), getPosts()]);

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-heading text-4xl mb-2">Categorii</h1>
          <p className="text-muted-foreground">
            Găsește rapid conținutul care te interesează, organizat pe teme principale.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const latestPost = posts.find((p) => p.category === cat.name);
            return (
              <Link
                key={cat.slug}
                href={`/categorii/${cat.slug}`}
                className="group block p-6 rounded-2xl border border-border hover:border-foreground/20 hover:shadow-md transition-all bg-card"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                  {getCategoryIcon(cat.icon, `w-6 h-6 transition-[color,filter] duration-300 ease-out [filter:drop-shadow(0_0_0px_transparent)] ${categoryIconHoverMap[cat.icon] ?? ""} group-hover:[filter:drop-shadow(0_0_5px_currentColor)]`)}
                </div>
                <h2 className="font-heading text-xl mb-1 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    {cat.count} articole
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorează <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                {latestPost && (
                  <div className="mt-4 pt-4 border-t border-border/60">
                    <p className="text-xs text-muted-foreground mb-0.5">Ultimul articol</p>
                    <p className="text-xs font-medium line-clamp-1">{latestPost.title}</p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
