import Link from "next/link";
import { Plus } from "lucide-react";
import { getAdminPosts } from "@/lib/admin-queries";
import { buttonVariants } from "@/components/ui/button";
import PostsTable from "@/components/admin/posts-table";

export const metadata = { title: "Articole" };

export default async function AdminPostsPage() {
  const posts = await getAdminPosts();
  const published = posts.filter((p) => p.publishedAt).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-3xl">Articole</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {published} publicate · {posts.length - published} ciorne
          </p>
        </div>
        <Link href="/admin/articole/nou" className={buttonVariants({ size: "lg" }) + " px-4"}>
          <Plus />
          Articol nou
        </Link>
      </div>
      <PostsTable posts={posts} />
    </main>
  );
}
