export interface Author {
  name: string;
  avatar: string;
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
  date: string;
  readTime: number;
  image: string;
  views: number;
  featured: boolean;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  icon: string;
  description: string;
}
