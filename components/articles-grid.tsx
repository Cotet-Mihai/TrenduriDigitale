"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/article-card";
import type { BlogPost, Category } from "@/lib/data";

interface ArticlesGridProps {
  posts: BlogPost[];
  categories: Category[];
  defaultCategory?: string;
  defaultSort?: "recent" | "popular";
}

export default function ArticlesGrid({
  posts,
  categories,
  defaultCategory = "toate",
  defaultSort = "recent",
}: ArticlesGridProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [sort, setSort] = useState<"recent" | "popular">(defaultSort);

  const filtered = useMemo(() => {
    let result = posts;

    if (activeCategory !== "toate") {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) result = result.filter((p) => p.category === cat.name);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sort === "popular") {
      result = [...result].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }

    return result;
  }, [posts, categories, activeCategory, search, sort]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Caută articole..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
          <button
            onClick={() => setSort("recent")}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              sort === "recent"
                ? "bg-foreground text-background"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            Recente
          </button>
          <button
            onClick={() => setSort("popular")}
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              sort === "popular"
                ? "bg-foreground text-background"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            Populare
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => setActiveCategory("toate")}
          className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
            activeCategory === "toate"
              ? "border-foreground bg-foreground text-background"
              : "border-border hover:border-foreground/40 text-muted-foreground"
          }`}
        >
          Toate
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              activeCategory === cat.slug
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground/40 text-muted-foreground"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-heading">Niciun articol găsit</p>
          <p className="text-sm mt-1">Încearcă alte filtre sau termeni de căutare.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setActiveCategory("toate"); }}>
            Resetează filtrele
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-5">
            {filtered.length} articol{filtered.length !== 1 ? "e" : ""} găsite
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
