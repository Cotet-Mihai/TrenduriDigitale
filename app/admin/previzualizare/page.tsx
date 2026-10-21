import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase-server";
import ArticlePreview from "@/components/admin/article-preview";

export const metadata = { title: "Previzualizare" };

// Outside the (panel) group on purpose: it renders with the public site's navbar
// and footer so the article looks exactly as it will once published.
export default async function PreviewPage({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  if (!(await getAdminUser())) redirect("/admin/login");
  const { k } = await searchParams;

  return <ArticlePreview previewKey={k ?? "new"} />;
}
