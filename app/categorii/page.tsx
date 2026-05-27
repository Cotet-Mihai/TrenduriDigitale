import Link from "next/link";
import { ArrowRight, Cpu, TrendingUp, Share2, ShoppingCart, User, Briefcase, Monitor } from "lucide-react";
import { categories, blogPosts } from "@/lib/data";

export const metadata = {
  title: "Categorii – DigitalTrendz",
  description: "Explorează articolele organizate pe categorii: AI, Marketing Digital, Social Media și multe altele.",
};

const iconMap: Record<string, React.ReactNode> = {
  cpu: <Cpu className="w-6 h-6" />,
  "trending-up": <TrendingUp className="w-6 h-6" />,
  "share-2": <Share2 className="w-6 h-6" />,
  "shopping-cart": <ShoppingCart className="w-6 h-6" />,
  user: <User className="w-6 h-6" />,
  briefcase: <Briefcase className="w-6 h-6" />,
  monitor: <Monitor className="w-6 h-6" />,
};

const categoryColors: Record<string, string> = {
  "cpu": "bg-blue-50 text-blue-600",
  "trending-up": "bg-green-50 text-green-600",
  "share-2": "bg-pink-50 text-pink-600",
  "shopping-cart": "bg-orange-50 text-orange-600",
  "user": "bg-purple-50 text-purple-600",
  "briefcase": "bg-yellow-50 text-yellow-600",
  "monitor": "bg-cyan-50 text-cyan-600",
};

export default function CategoriiPage() {
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
            const latestPost = blogPosts.find((p) => p.category === cat.name);
            return (
              <Link
                key={cat.slug}
                href={`/categorii/${cat.slug}`}
                className="group block p-6 rounded-2xl border border-border hover:border-foreground/20 hover:shadow-md transition-all bg-card"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${categoryColors[cat.icon] ?? "bg-muted text-muted-foreground"}`}>
                  {iconMap[cat.icon]}
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
