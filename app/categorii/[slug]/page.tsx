import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cpu, TrendingUp, Share2, ShoppingCart, User, Briefcase, Monitor } from "lucide-react";
import ArticleCard from "@/components/article-card";
import { categories, getCategoryBySlug, getPostsByCategory } from "@/lib/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const iconMap: Record<string, React.ReactNode> = {
  cpu: <Cpu className="w-6 h-6" />,
  "trending-up": <TrendingUp className="w-6 h-6" />,
  "share-2": <Share2 className="w-6 h-6" />,
  "shopping-cart": <ShoppingCart className="w-6 h-6" />,
  user: <User className="w-6 h-6" />,
  briefcase: <Briefcase className="w-6 h-6" />,
  monitor: <Monitor className="w-6 h-6" />,
};

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: `${cat.name} – DigitalTrendz`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const posts = getPostsByCategory(slug);
  const allPosts = posts.length > 0 ? posts : [];

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <Link
          href="/categorii"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Toate categoriile
        </Link>

        {/* Header */}
        <div className="flex items-start gap-5 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            {iconMap[category.icon]}
          </div>
          <div>
            <h1 className="font-heading text-4xl mb-1">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {allPosts.length} articol{allPosts.length !== 1 ? "e" : ""} disponibile
            </p>
          </div>
        </div>

        {allPosts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="font-heading text-xl text-muted-foreground mb-2">
              Articole în curs de publicare
            </p>
            <p className="text-sm text-muted-foreground">
              Revino curând pentru conținut nou în această categorie.
            </p>
            <Link
              href="/articole"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline mt-4"
            >
              Vezi toate articolele
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
