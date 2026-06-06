import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await supabase.rpc("increment_post_views", { post_slug: slug });
  return NextResponse.json({ ok: true });
}
