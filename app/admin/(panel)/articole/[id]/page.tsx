import { notFound } from "next/navigation";
import { getAdminPost, getEditorOptions } from "@/lib/admin-queries";
import PostEditor from "@/components/admin/post-editor";

export const metadata = { title: "Editează articolul" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const [post, { categories, authors }] = await Promise.all([getAdminPost(id), getEditorOptions()]);
  if (!post) notFound();

  return <PostEditor key={post.id} initial={post} categories={categories} authors={authors} />;
}
