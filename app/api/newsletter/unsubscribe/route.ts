import type { NextRequest } from "next/server";
import { unsubscribeNewsletter } from "@/lib/actions";

// RFC 8058 one-click unsubscribe: mail clients (Gmail, Outlook) POST here from their own
// "Unsubscribe" button, using the List-Unsubscribe header set in lib/newsletter.ts.
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  await unsubscribeNewsletter(token);
  // Always 200: the result is the same for the client, and it reveals nothing about the list.
  return new Response(null, { status: 200 });
}
