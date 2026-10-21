import { getEditorOptions } from "@/lib/admin-queries";
import PostEditor from "@/components/admin/post-editor";
import type { PostInput } from "@/lib/admin";

export const metadata = { title: "Articol nou" };

export default async function NewPostPage() {
  const { categories, authors } = await getEditorOptions();

  const initial: PostInput = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    // Single-author blog: preselect when there is only one.
    authorId: authors.length === 1 ? authors[0].id : "",
    imageUrl: "",
    featured: false,
    focusKeyword: "",
    tags: [],
    readTime: 1,
    status: "draft",
    publishedAt: null,
  };

  return <PostEditor initial={initial} categories={categories} authors={authors} />;
}
