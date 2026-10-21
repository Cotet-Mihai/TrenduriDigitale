export interface Author {
  name: string;
  avatar: string;
  bio: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  author: Author;
  date: string; // formatted for display ("15 august 2024")
  publishedAt: string; // ISO — for metadata/structured data
  updatedAt: string; // ISO
  readTime: number;
  image: string;
  views: number;
  featured: boolean;
  tags: string[];
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  icon: string;
  description: string;
}
