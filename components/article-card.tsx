import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { BlogPost } from "@/lib/types";

interface ArticleCardProps {
  post: BlogPost;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-border hover:border-border/80 bg-card transition-all duration-200 hover:shadow-md h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-white/95 text-foreground text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-heading text-[17px] leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <Avatar className="w-6 h-6">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="text-[10px]">
                {post.author.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground font-medium">{post.author.name}</span>
            <span className="text-xs text-muted-foreground/50">·</span>
            <span className="text-xs text-muted-foreground">{post.date}</span>
            <span className="text-xs text-muted-foreground/50">·</span>
            <span className="text-xs text-muted-foreground">{post.readTime} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
